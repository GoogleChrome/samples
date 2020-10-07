#!/usr/bin/env python3

# Copyright 2020 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""
An example QuicTransport server based on the aioquic library.

Processes incoming streams and datagrams, and
replies with the ASCII-encoded length of the data sent in bytes.

Example use:
  python3 quic_transport_server.py certificate.pem certificate.key

Example use from JavaScript:
  let transport = new QuicTransport("quic-transport://localhost:4433/counter");
  await transport.ready;
  let stream = await transport.createBidirectionalStream();
  let encoder = new TextEncoder();
  let writer = stream.writable.getWriter();
  await writer.write(encoder.encode("Hello, world!"))
  writer.close();
  console.log(await new Response(stream.readable).text());

This will output "13" (the length of "Hello, world!") into the console.
"""

# ---- Dependencies ----
#
# This server only depends on Python standard library and aioquic.  See
# https://github.com/aiortc/aioquic for instructions on how to install
# aioquic.
#
# ---- Certificates ----
#
# QUIC always operates using TLS, meaning that running a QuicTransport server
# requires a valid TLS certificate.  The easiest way to do this is to get a
# certificate from a real publicly trusted CA like <https://letsencrypt.org/>.
# https://developers.google.com/web/fundamentals/security/encrypt-in-transit/enable-https
# contains a detailed explanation of how to achieve that.
#
# As an alternative, Chromium can be instructed to trust a self-signed
# certificate using command-line flags.  Here are step-by-step instructions on
# how to do that:
#
#   1. Generate a certificate and a private key:
#         openssl req -newkey rsa:2048 -nodes -keyout certificate.key \
#                   -x509 -out certificate.pem -subj '/CN=Test Certificate' \
#                   -addext "subjectAltName = DNS:localhost"
#
#   2. Compute the fingerprint of the certificate:
#         openssl x509 -pubkey -noout -in certificate.pem |
#                   openssl rsa -pubin -outform der |
#                   openssl dgst -sha256 -binary | base64
#      The result should be a base64-encoded blob that looks like this:
#          "Gi/HIwdiMcPZo2KBjnstF5kQdLI5bPrYJ8i3Vi6Ybck="
#
#   3. Pass a flag to Chromium indicating what host and port should be allowed
#      to use the self-signed certificate.  For instance, if the host is
#      localhost, and the port is 4433, the flag would be:
#         --origin-to-force-quic-on=localhost:4433
#
#   4. Pass a flag to Chromium indicating which certificate needs to be trusted.
#      For the example above, that flag would be:
#         --ignore-certificate-errors-spki-list=Gi/HIwdiMcPZo2KBjnstF5kQdLI5bPrYJ8i3Vi6Ybck=
#
# See https://www.chromium.org/developers/how-tos/run-chromium-with-flags for
# details on how to run Chromium with flags.

import argparse
import asyncio
import io
import os
import struct
import urllib.parse
from collections import defaultdict
from typing import Dict, Optional

from aioquic.asyncio import QuicConnectionProtocol, serve
from aioquic.quic.configuration import QuicConfiguration
from aioquic.quic.connection import QuicConnection, END_STATES
from aioquic.quic.events import StreamDataReceived, StreamReset, DatagramFrameReceived, QuicEvent
from aioquic.tls import SessionTicket

BIND_ADDRESS = '::1'
BIND_PORT = 4433
ALLOWED_ORIGINS = {'localhost', 'googlechrome.github.io'}


# QUIC uses two lowest bits of the stream ID to indicate whether the stream is:
#   (a) unidirectional or bidirectional,
#   (b) initiated by the client or by the server.
# See https://tools.ietf.org/html/draft-ietf-quic-transport-27#section-2.1 for
# more details.
def is_client_bidi_stream(stream_id):
    return stream_id % 4 == 0


# CounterHandler implements a really simple protocol:
#   - For every incoming bidirectional stream, it counts bytes it receives on
#     that stream until the stream is closed, and then replies with that byte
#     count on the same stream.
#   - For every incoming unidirectional stream, it counts bytes it receives on
#     that stream until the stream is closed, and then replies with that byte
#     count on a new unidirectional stream.
#   - For every incoming datagram, it sends a datagram with the length of
#     datagram that was just received.
class CounterHandler:

    def __init__(self, connection) -> None:
        self.connection = connection
        self.counters = defaultdict(int)

    def quic_event_received(self, event: QuicEvent) -> None:
        if isinstance(event, DatagramFrameReceived):
            payload = str(len(event.data)).encode('ascii')
            self.connection.send_datagram_frame(payload)

        if isinstance(event, StreamDataReceived):
            self.counters[event.stream_id] += len(event.data)
            if event.end_stream:
                if is_client_bidi_stream(event.stream_id):
                    response_id = event.stream_id
                else:
                    response_id = self.connection.get_next_available_stream_id(
                        is_unidirectional=True)
                payload = str(self.counters[event.stream_id]).encode('ascii')
                self.connection.send_stream_data(response_id, payload, True)
                del self.counters[event.stream_id]

        # Streams in QUIC can be closed in two ways: normal (FIN) and abnormal
        # (resets).  FIN is handled by event.end_stream logic above; the code
        # below handles the resets.
        if isinstance(event, StreamReset):
            try:
                del self.counters[event.stream_id]
            except KeyError:
                pass


# QuicTransportProtocol handles the beginning of a QuicTransport connection: it
# parses the incoming URL, and routes the transport events to a relevant
# handler (in this example, CounterHandler).  It does that by waiting for a
# client indication (a special stream with protocol headers), and buffering all
# unrelated events until the client indication can be fully processed.
class QuicTransportProtocol(QuicConnectionProtocol):

    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)
        self.pending_events = []
        self.handler = None
        self.client_indication_data = b''

    def quic_event_received(self, event: QuicEvent) -> None:
        try:
            if self.is_closing_or_closed():
                return

            # If the handler is available, that means the connection has been
            # established and the client indication has been processed.
            if self.handler is not None:
                self.handler.quic_event_received(event)
                return

            if isinstance(event, StreamDataReceived) and event.stream_id == 2:
                self.client_indication_data += event.data
                if event.end_stream:
                    self.process_client_indication()
                    if self.is_closing_or_closed():
                        return
                    # Pass all buffered events into the handler now that it's
                    # available.
                    for e in self.pending_events:
                        self.handler.quic_event_received(e)
                    self.pending_events.clear()
            else:
                # We have received some application data before we have the
                # request URL available, which is possible since there is no
                # ordering guarantee on data between different QUIC streams.
                # Buffer the data for now.
                self.pending_events.append(event)

        except Exception as e:
            self.handler = None
            self.close()

    # Client indication follows a "key-length-value" format, where key and
    # length are 16-bit integers.  See
    # https://tools.ietf.org/html/draft-vvv-webtransport-quic-01#section-3.2
    def parse_client_indication(self, bs):
        while True:
            prefix = bs.read(4)
            if len(prefix) == 0:
                return  # End-of-stream reached.
            if len(prefix) != 4:
                raise Exception('Truncated key-length tag')
            key, length = struct.unpack('!HH', prefix)
            value = bs.read(length)
            if len(value) != length:
                raise Exception('Truncated value')
            yield (key, value)

    def process_client_indication(self) -> None:
        KEY_ORIGIN = 0
        KEY_PATH = 1
        indication = dict(
            self.parse_client_indication(io.BytesIO(
                self.client_indication_data)))

        origin = urllib.parse.urlparse(indication[KEY_ORIGIN].decode())
        path = urllib.parse.urlparse(indication[KEY_PATH]).decode()

        # Verify that the origin host is allowed to talk to this server.  This
        # is similar to the CORS (Cross-Origin Resource Sharing) mechanism in
        # HTTP.  See <https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS>.
        if origin.hostname not in ALLOWED_ORIGINS:
            raise Exception('Wrong origin specified')

        # Dispatch the incoming connection based on the path specified in the
        # URL.
        if path.path == '/counter':
            self.handler = CounterHandler(self._quic)
        else:
            raise Exception('Unknown path')

    def is_closing_or_closed(self) -> bool:
        return self._quic._close_pending or self._quic._state in END_STATES


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('certificate')
    parser.add_argument('key')
    args = parser.parse_args()

    configuration = QuicConfiguration(
        # Identifies the protocol used.  The origin trial uses the protocol
        # described in draft-vvv-webtransport-quic-01, hence the ALPN value.
        # See https://tools.ietf.org/html/draft-vvv-webtransport-quic-01#section-3.1
        alpn_protocols=['wq-vvv-01'],
        is_client=False,

        # Note that this is just an upper limit; the real maximum datagram size
        # available depends on the MTU of the path.  See
        # <https://en.wikipedia.org/wiki/Maximum_transmission_unit>.
        max_datagram_frame_size=1500,
    )
    configuration.load_cert_chain(args.certificate, args.key)

    loop = asyncio.get_event_loop()
    loop.run_until_complete(
        serve(
            BIND_ADDRESS,
            BIND_PORT,
            configuration=configuration,
            create_protocol=QuicTransportProtocol,
        ))
    loop.run_forever()

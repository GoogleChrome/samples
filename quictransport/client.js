// Copyright 2020 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Adds an entry to the event log on the page, optionally applying a specified
// CSS class.
function addToEventLog(text, severity = 'info') {
  let log = document.getElementById('event-log');
  let mostRecentEntry = log.lastElementChild;
  let entry = document.createElement('li');
  entry.innerText = text;
  entry.className = 'log-' + severity;
  log.appendChild(entry);

  // If the most recent entry in the log was visible, scroll the log to the
  // newly added element.
  if (mostRecentEntry != null &&
      mostRecentEntry.getBoundingClientRect().top <
          log.getBoundingClientRect().bottom) {
    entry.scrollIntoView();
  }
}

// "Connect" button handler.
async function connect() {
  let url = document.getElementById('url').value;
  try {
    var transport = new QuicTransport(url);
    addToEventLog('Initiating connection...');
  } catch (err) {
    addToEventLog('Failed to create connection object. ' + err, 'error');
    return;
  }

  try {
    await transport.ready;
    addToEventLog('Connection ready.');
  } catch (err) {
    addToEventLog('Connection failed. ' + err, 'error');
    return;
  }

  transport.closed
      .then(() => {
        addToEventLog('Connection closed normally.');
      })
      .catch(() => {
        addToEventLog('Connection closed abruptly.', 'error');
      });
  globalThis.currentTransport = transport;
  globalThis.currentTransportDatagramWriter =
      transport.sendDatagrams().getWriter();
  globalThis.streamNumber = 1;

  readDatagrams(transport);
  acceptUnidirectionalStreams(transport);

  document.forms.sending.elements.send.disabled = false;
  document.getElementById('connect').disabled = true;
}

// "Send data" button handler.
async function sendData() {
  let form = document.forms.sending.elements;
  let encoder = new TextEncoder('utf-8');
  let rawData = sending.data.value;
  let data = encoder.encode(rawData);
  let transport = globalThis.currentTransport;
  try {
    switch (form.sendtype.value) {
      case 'datagram':
        await globalThis.currentTransportDatagramWriter.write(data);
        addToEventLog('Sent datagram: ' + rawData);
        break;
      case 'unidi': {
        let stream = await transport.createSendStream();
        let writer = stream.writable.getWriter();
        await writer.write(data);
        await writer.close();
        addToEventLog('Sent a unidirectional stream with data: ' + rawData);
        break;
      }
      case 'bidi': {
        let stream = await transport.createBidirectionalStream();
        let number = globalThis.streamNumber++;
        readFromIncomingStream(stream, number);

        let writer = stream.writable.getWriter();
        await writer.write(data);
        await writer.close();
        addToEventLog(
            'Opened bidirectional stream #' + number +
            ' with data: ' + rawData);
        break;
      }
    }
  } catch (err) {
    addToEventLog('Error while sending data: ' + err, 'error');
  }
}

// Reads datagrams from |transport| into the event log until EOF is reached.
async function readDatagrams(transport) {
  let reader = transport.receiveDatagrams().getReader();
  let decoder = new TextDecoder('utf-8');
  try {
    while (true) {
      let result = await reader.read();
      if (result.done) {
        addToEventLog('Done reading datagrams!');
        return;
      }
      let data = decoder.decode(result.value);
      addToEventLog('Datagram received: ' + data);
    }
  } catch (err) {
    addToEventLog('Error while reading datagrams: ' + err, 'error');
  }
}

async function acceptUnidirectionalStreams(transport) {
  let reader = transport.receiveStreams().getReader();
  try {
    while (true) {
      let result = await reader.read();
      if (result.done) {
        addToEventLog('Done accepting unidirectional streams!');
        return;
      }
      let stream = result.value;
      let number = globalThis.streamNumber++;
      addToEventLog('New incoming unidirectional stream #' + number);
      readFromIncomingStream(stream, number);
    }
  } catch (err) {
    addToEventLog('Error while accepting streams: ' + err, 'error');
  }
}

async function readFromIncomingStream(stream, number) {
  let decoder = new TextDecoderStream('utf-8');
  let reader = stream.readable.pipeThrough(decoder).getReader();
  try {
    while (true) {
      let result = await reader.read();
      if (result.done) {
        addToEventLog('Stream #' + number + ' closed');
        return;
      }
      let data = result.value;
      addToEventLog('Received data on stream #' + number + ': ' + data);
    }
  } catch (err) {
    addToEventLog(
        'Error while reading from stream #' + number + ': ' + err, 'error');
  }
}

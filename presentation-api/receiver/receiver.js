(() => {
  let connectionIdx = 0;
  let messageIdx = 0;
  const fruitEmoji = {
    'grapes':      '\u{1F347}',
    'watermelon':  '\u{1F349}',
    'melon':       '\u{1F348}',
    'tangerine':   '\u{1F34A}',
    'lemon':       '\u{1F34B}',
    'banana':      '\u{1F34C}',
    'pineapple':   '\u{1F34D}',
    'green apple': '\u{1F35F}',
    'apple':       '\u{1F34E}',
    'pear':        '\u{1F350}',
    'peach':       '\u{1F351}',
    'cherries':    '\u{1F352}',
    'strawberry':  '\u{1F353}'
  };

  function addConnection(connection) {
    connection.connectionId = ++connectionIdx;

    addMessage('New connection #' + connectionIdx);

    connection.onmessage = (message) => {
      messageIdx++;
      const messageObj = JSON.parse(message.data);
      const logString = 'Message ' + messageIdx + ' from connection #' +
          connection.connectionId + ': ' + messageObj.message;
      addMessage(logString, messageObj.lang);
      maybeSetFruit(messageObj.message.toLowerCase());
      connection.send('Received message ' + messageIdx);
    };

    connection.onclose = (closeEvent) => {
      addMessage('Connection #' + connection.connectionId + ' closed, reason = ' +
                 closeEvent.reason + ', message = ' + closeEvent.message);
    };
  };

  function addMessage(content, language) {
    const listElt = document.querySelector("#message-list");
    const listItem = document.createElement("LI");
    if (language) listItem.lang = language;
    listItem.textContent = content;
    listElt.appendChild(listItem);
  };

  function maybeSetFruit(message) {
    if (message in fruitEmoji) {
      document.querySelector('#main').textContent = fruitEmoji[message.toLowerCase()];
    }
  };

  if (navigator.presentation.receiver) {
    navigator.presentation.receiver.connectionList.then(list => {
      list.connections.map(connection => {
        addConnection(connection);
      });
      list.onconnectionavailable = (evt) => {
        addConnection(evt.connection);
      };
    });
  }
})();

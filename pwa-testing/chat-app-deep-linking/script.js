import * as db from "./db.js";
import * as helpers from "./helpers.js";

const links = document.querySelectorAll(".left-column a.dynamic-link");
const contentItems = document.querySelectorAll(".content-item");
const channel = new BroadcastChannel("chat-channel");
const clientId = ((Math.random() * 16777215) | 0)
  .toString(16)
  .padStart(6, "0")
  .slice(0, 6);

window.addEventListener("load", async () => {
  const registration = await navigator.serviceWorker.register("sw.js");
  console.log("Service worker registered for scope", registration.scope);
});

// ----- INSTALLATION -----

let installPromptEvent = null;
window.addEventListener("beforeinstallprompt", (event) => {
  installPromptEvent = event;
  log("Got beforeinstallprompt event, showing install button.");
  document.querySelector(".install-instruction").style.display = "list-item";
});
window.addEventListener("appinstalled", (event) => {
  installPromptEvent = null;
  log("Got appinstalled event, hiding install button.");
  document.querySelector(".install-instruction").style.display = "none";
});
window.install = () => {
  if (installPromptEvent) {
    installPromptEvent.prompt();
  }
};

// ----- HTML HOOKUPS -----

const clientIdElement = document.getElementById("client-name");
clientIdElement.textContent = "Client " + clientId;
clientIdElement.style.color = helpers.getCssColorFromHex(clientId);

function createMessageElement(chat) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("chat-message");
  messageElement.classList.add("author-" + chat.author);
  const timestampElement = document.createElement("div");
  timestampElement.classList.add("chat-timestamp");
  timestampElement.textContent = new Date(chat.timestamp).toLocaleString();
  const messageTextElement = document.createElement("div");
  messageTextElement.classList.add("chat-message-text");
  messageTextElement.classList.add("chat-message-text-author-" + chat.author);

  if (chat.author === "me") {
    messageTextElement.textContent = "You: " + chat.message;
  } else {
    messageTextElement.textContent = chat.message;
  }
  messageElement.appendChild(timestampElement);
  messageElement.appendChild(messageTextElement);
  return messageElement;
}

function createLogElement(log) {
  const logElement = document.createElement("div");
  logElement.classList.add("log-entry");
  const clientText = `Client ${log.source}`;
  logElement.textContent = `${new Date(
    log.timestamp
  ).toLocaleString()}, [${clientText}]: ${log.message}`;
  logElement.style.color = helpers.getCssColorFromHex(log.source);
  return logElement;
}

// Add event listeners for Enter key press
document
  .getElementById("alice-chat-input")
  .addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      sendChatMessage("alice-chat", "alice-chat-input");
    }
  });

document
  .getElementById("bob-chat-input")
  .addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      sendChatMessage("bob-chat", "bob-chat-input");
    }
  });

// ----- API HOOKS -----

window.sendChatMessage = (containerId, inputId) => {
  const messageText = document.getElementById(inputId).value;
  if (messageText.trim() === "") {
    return;
  }
  log(`Sending message '${messageText}' from me.`);
  db.addChat(containerId, messageText, "me");
  setTimeout(() => {
    maybeCreateFakeAutoReply(containerId, messageText);
  }, Math.random() * 1000 + 50);
};

window.clearChats = () => {
  db.clearChats();
};

window.clearLogs = () => {
  db.clearLogs();
};

function log(message) {
  console.log(message);
  db.addLog(message, clientId);
}

// ----- HANDLING SAME-PAGE NAVIGATION -----

links.forEach((item) => {
  item.addEventListener("click", (event) => {
    const href = item.getAttribute("href");
    if (
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.metaKey ||
      event.button != 0
    ) {
      log(`User modified click for url '${href}', allowing default behavior.`);
      return;
    }
    event.preventDefault(); // Prevent default link behavior
    const targetId = item.dataset.target;
    log(
      `Click event on link '${href}', event.preventDefault() and showing div '${targetId}'.`
    );
    showContentDiv(targetId);
    window.history.pushState({ target: targetId }, "", href);
  });
});

// Handle back/forward button clicks
window.addEventListener("popstate", (event) => {
  if (event.state && event.state.target) {
    log(`Showing div '${event.state.target}' from popstate event.`);
    showContentDiv(event.state.target);
  } else {
    // Determine content based on path
    log("Got popstate event without a state.");
    if (
      !showContentDivForUrl(
        window.location,
        /*pushHistoryState=*/ false,
        /*forceNavigationIfNotFound=*/ false
      )
    ) {
      console.log("Could not navigate element, aborting");
    }
  }
});

// Handle showing content for a url
function showContentDiv(targetId) {
  contentItems.forEach((content) => {
    if (content.id === targetId) {
      content.classList.remove("content-item-hidden");
    } else {
      content.classList.add("content-item-hidden");
    }
  });
  // Highlight the active link
  links.forEach((link) => {
    if (link.dataset.target === targetId) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

function showContentDivForUrl(
  url,
  pushHistoryState,
  forceNavigationIfNotFound
) {
  // Handle protocol handling launches first, tranforming them into the intended
  // url.
  if (url.searchParams.has("open-from-protocol")) {
    const protocol = url.searchParams.get("open-from-protocol");
    const dataAfterProtocol = protocol.substring(protocol.indexOf(":") + 1);
    log(`Recieved protocol handling launch, to open '${dataAfterProtocol}'`);
    pushHistoryState = true;
    forceNavigationIfNotFound = true;
    url = new URL("/" + dataAfterProtocol, window.location);
  }
  const getNavElementFromUrl = (url) => {
    for (let link of links) {
      const href = link.getAttribute("href");
      const linkUrl = new URL(href, window.location);
      if (linkUrl.href === url.href) {
        return link;
      }
    }
    return null;
  };
  const navElement = getNavElementFromUrl(url);
  if (navElement === null) {
    if (forceNavigationIfNotFound) {
      log(
        `Unable to find nav element for content for url '${helpers.removeOrigin(
          url
        )}', forcing a navigation instead using window.location.`
      );
      window.location = url;
      return true;
    }
    log(
      `Unable to find nav element for content for url '${helpers.removeOrigin(
        url
      )}', aborting.`
    );
    return false;
  }
  log(
    `Showing content for url '${helpers.removeOrigin(
      url
    )}', pushHistoryState '${pushHistoryState}'`
  );
  const targetId = navElement.dataset.target;
  const path = navElement.getAttribute("href");
  showContentDiv(targetId);
  if (pushHistoryState) {
    window.history.pushState({ target: targetId }, "", path);
  }
  return true;
}

// ----- LAUNCH QUEUE -----
// Launch queue! This is the main entry point for launches, from files, protocol
// handling, or normal url launches or link captures.

if ("launchQueue" in window && "targetURL" in window.LaunchParams.prototype) {
  window.launchQueue.setConsumer(async (launchParams) => {
    // Handle file launches, which send a chat.
    if (launchParams.files && launchParams.files.length) {
      log(
        `Recieved launch params with ${
          launchParams.files.length
        } files ${JSON.stringify(launchParams.files.map((file) => file.name))}`
      );
      for (let file of launchParams.files) {
        const blob = await file.getFile();
        const str = await blob.text();
        log(`File '${file.name}' has data: ${str}`);
        const json = JSON.parse(str);
        if (
          !showContentDivForUrl(
            new URL(`?chat=${json.name}`, window.location),
            /*pushHistoryState=*/ true,
            /*forceNavigationIfNotFound=*/ false
          )
        ) {
          continue;
        }
        const chatInput = document.getElementById(json.name + "-chat-input");
        chatInput.value = json.message;
        sendChatMessage(json.name + "-chat", json.name + "-chat-input");
      }
      return;
    }
    // Handle normal url launches.
    if (launchParams.targetURL) {
      const url = new URL(launchParams.targetURL);
      log(
        `Recieved launch params with targetURL: ${helpers.removeOrigin(url)}`
      );
      if (
        showContentDivForUrl(
          url,
          /*pushHistoryState=*/ true,
          /*forceNavigationIfNotFound=*/ true
        )
      ) {
        return;
      }
      log(
        `Could not find navigation link / content on this page for '${helpers.removeOrigin(
          url
        )}', navigating instead by setting window.location.`
      );
      window.location = launchParams.targetURL;
    }
  });
} else {
  document.querySelector(".not-supported").hidden = false;
}

// ----- CHAT AND LOG FUNCTIONALITY -----

function addInitialChatMessages(chatId, num) {
  const author = chatId === "alice-chat" ? "Alice" : "Bob";
  const randomMessages = [
    `Hello`,
    `Hi I'm ${author}`,
    `Hello, I'm ${author} and I'm definitely not a robot.`,
    `I'm ${author}, and I'm a robot.`,
  ];
  for (let i = 0; i < num; i++) {
    const message =
      randomMessages[Math.floor(Math.random() * randomMessages.length)];
    log(`Adding initial chat message '${message}' from ${author}.`);
    db.addChat(chatId, message, author);
  }
}

function maybeCreateFakeAutoReply(chatId, messageYouSent) {
  const randomReplies = [
    `Wow how interesting!`,
    `I'm glad you thought so!`,
    `When you said "${messageYouSent}" I realized how smart you are.`,
    `You're joking!`,
    `No, I don't think so.`,
    `We're in 2025, should this be hooked up to ChatGPT or something?`,
  ];
  let autoReplyCheckbox = document.getElementById(chatId + "-auto-reply");
  if (Math.random() < 0.2 || !autoReplyCheckbox || !autoReplyCheckbox.checked) {
    return;
  }
  const author = chatId === "alice-chat" ? "Alice" : "Bob";
  const randomReply =
    randomReplies[Math.floor(Math.random() * randomReplies.length)];
  log(`Sending reply message '${randomReply}' from ${author}.`);
  db.addChat(chatId, randomReply, author);
}

function updateLogDisplay(logs) {
  const logContainer = document.getElementById("log-container");
  logContainer.innerHTML = ""; // Clear previous logs
  logs.reverse().forEach((log) => {
    const logElement = createLogElement(log);
    // logElement.classList.add('log-entry');
    // const clientText = `Client ${log.source.substring(0, 2)}`;
    // logElement.textContent = `${new Date(log.timestamp).toLocaleString()}, [${
    //     clientText}]: ${log.message}`;
    // logElement.style.color = helpers.getCssColorFromHex(log.source);
    logContainer.appendChild(logElement);
  });
}

function updateChatDisplay(chatId, chats) {
  log(`Updating chat display for '${chatId}' with ${chats.length} chats`);
  const chatContainer = document.getElementById(chatId);
  chatContainer.innerHTML = ""; // Clear previous chats
  chats.forEach((chat) => {
    const messageElement = createMessageElement(chat);
    chatContainer.appendChild(messageElement);
  });
}

async function refreshAllChats() {
  const aliceChats = await db.getChats("alice-chat");
  if (aliceChats.length === 0) {
    addInitialChatMessages("alice-chat", /*num=*/ 1);
  } else {
    updateChatDisplay("alice-chat", aliceChats);
  }
  const bobChats = await db.getChats("bob-chat");
  if (bobChats.length === 0) {
    addInitialChatMessages("bob-chat", /*num=*/ 1);
  } else {
    updateChatDisplay("bob-chat", bobChats);
  }
}

// Listen for refresh events on the Broadcast Channel
channel.addEventListener("message", async (event) => {
  if (event.data.type === "onChatAdded") {
    const chats = await db.getChats(event.data.chatId);
    updateChatDisplay(event.data.chatId, chats);
    return;
  }
  if (event.data.type === "onLogsChanged") {
    const logs = await db.getLogs();
    updateLogDisplay(logs);
    return;
  }
  if (event.data.type === "onAllChatsCleared") {
    refreshAllChats();
    return;
  }
});

// Initial content display based on path
const initialUrl = new URL(window.location.href);
log(`Loading page with path: ${helpers.removeOrigin(initialUrl)}`);
showContentDivForUrl(
  initialUrl,
  /*pushHistoryState=*/ false,
  /*forceNavigationIfNotFound=*/ false
);
refreshAllChats();

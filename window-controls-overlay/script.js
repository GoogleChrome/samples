const ul = document.querySelector("ul");
const input = document.querySelector("input");
const div = document.querySelector("div");
const span = document.querySelector("span");

if ("windowControlsOverlay" in navigator) {
  const { x, width } =
    "getTitlebarAreaRect" in navigator.windowControlsOverlay
      ? navigator.windowControlsOverlay.getTitlebarAreaRect()
      : navigator.windowControlsOverlay.getBoundingClientRect();
  // Window controls are on the right.
  if (x === 0) {
    div.classList.add("search-controls-right");
  }
  // Window controls are on the left.
  else {
    div.classList.add("search-controls-left");
  }
  span.hidden = width < 800;
} else {
  div.classList.add("search-controls-right");
}

const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

if ("windowControlsOverlay" in navigator) {
  navigator.windowControlsOverlay.ongeometrychange = debounce(e => {
    span.hidden =
      "titlebarAreaRect" in e
        ? e.titlebarAreaRect.width < 800
        : e.boundingRect.width < 800;
  }, 250);
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    await navigator.serviceWorker.register("sw.js");
  });
}

const removeNonCharacters = text => {
  return text
    ? text
        .replace(/\W/g, "-")
        .replace(/-+/g, "-")
        .toLowerCase()
    : text;
};

(async () => {
  const content = await fetch(
    `https://api.wikimedia.org/feed/v1/wikipedia/en/featured/${new Date().getFullYear()}/${(
      new Date().getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${new Date()
      .getDate()
      .toString()
      .padStart(2, "0")}`
  ).then(response => response.json());

  let html = "";
  content.mostread.articles.forEach(article => {
    html += `<li><a data-search="${removeNonCharacters(
      article.displaytitle
    )}" href="${article.content_urls.desktop.page}">${
      article.displaytitle
    }</a> (${article.views} views) <p data-search="${removeNonCharacters(
      article.description
    )}" >${article.description}</p></li>`;
  });
  ul.innerHTML = html;
})();

input.addEventListener("input", e => {
  ul.querySelectorAll("li").forEach(li => li.classList.remove("highlight"));
  if (!input.value || !ul.innerHTML) {
    return;
  }
  const value = removeNonCharacters(input.value);
  if (value.length < 2) {
    return;
  }
  ul.querySelectorAll(`[data-search*="${value}"]`).forEach(li => {
    li.classList.add("highlight");
  });
});

/* Add to Home Screen */
// let deferredPrompt;
// const btnAdd = document.getElementById("butInstall");
// btnAdd.addEventListener("click", (e) => {
//   // hide our user interface that shows our A2HS button
//   btnAdd.setAttribute("disabled", true);
//   // Show the prompt
//   deferredPrompt.prompt();
//   // Wait for the user to respond to the prompt
//   deferredPrompt.userChoice.then((resp) => {
//     console.log(JSON.stringify(resp));
//   });
// });

/* Service Worker */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").then(() => {
    console.log("Service Worker Registered");
  });
}

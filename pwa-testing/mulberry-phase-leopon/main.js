function print(text) {
  output.textContent += text + '\n';
}

function main() {
  navigator.serviceWorker.register('serviceworker.js');

  if (!globalThis.launchQueue) {
    print('globalThis.launchQueue missing.');
    return;
  }
  
  launchQueue.setConsumer(launch => {
    print('Launch!');
    print(launch);
    console.log(launch);
    // for (const property of launch) {
    //   print(`${property}: ${launch[property]}`);
    // }
  });
  print('launchQueue consumer set.');
}

main();
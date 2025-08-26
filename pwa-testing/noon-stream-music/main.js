window.launchQueue.setConsumer(launchParams => {
  console.log(launchParams);
  launchParamsOutput.textContent += `${Date()} {\n`;
  for (const key in launchParams) {
    launchParamsOutput.textContent += `  ${key}: ${launchParams[key]}\n`;
  }
  launchParamsOutput.textContent += '}\n';
});
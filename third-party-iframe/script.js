document.querySelector('button').addEventListener('click', async () => {
  try {
    await navigator.share({
      title: 'Title',
      text: 'Text',
      url: location.href,
    });
  } catch (err) {
    document.querySelector(
      'pre'
    ).textContent += `${err.name}: ${err.message}\n`;
  }
});

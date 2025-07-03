function draw90sPattern(ctx, startColor) {
  const bluegreen = "rgb(2, 202, 226)";
  const pink = "rgb(240, 102, 214)";
  const yellow = "rgb(244, 244, 139)";
  const purple = "rgb(137, 86, 179)";
  const colorScheme = [bluegreen, pink, yellow, purple];
  if (!startColor) startColor = 2;
  let cp = startColor;

  function getColor() {
    cp = (cp + 1) % colorScheme.length;
    return colorScheme[cp];
  }

  function drawTriangle(x, y, s) {
    ctx.beginPath();
    ctx.rotate(Math.PI / 12);
    ctx.moveTo(x, y);
    ctx.lineTo(x + 7 * s, y + 2 * s);
    ctx.lineTo(x + 2 * s, y + 7 * s);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    ctx.rotate(-Math.PI / 12);
  }

  function drawRow() {
    cp = startColor + 1;
    ctx.translate(ctx.canvas.width / 5, -ctx.canvas.height);

    for (var i = 0; i < 5; i++) {
      ctx.fillStyle = getColor();
      ctx.strokeStyle = getColor();
      ctx.rotate(Math.PI / 8);
      ctx.fillRect(0, 0, 60, 60);
      ctx.strokeRect(0, 0, 60, 60);
      ctx.rotate(-Math.PI / 8);
      ctx.fillStyle = getColor();
      drawTriangle(20, 20, 10);
      ctx.translate(0, ctx.canvas.height / 5);
    }
  }

  ctx.fillStyle = getColor();
  ctx.lineWidth = 3;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.translate(-ctx.canvas.width / 5, ctx.canvas.height);
  for (let i = 0; i < 6; i++) drawRow();

  ctx.beginPath();
  ctx.moveTo(-200, -200);
  ctx.lineTo(10, 10);
}

const table = document.querySelector("table");

for (let y = 1; y <= 44; y++) {
  const row = document.createElement("tr");
  for (let x = 1; x <= 44; x++) {
    const cell = document.createElement("td");
    cell.setAttribute('id', `cell-${x}-${y}`);
    row.appendChild(cell);
  }
  table.appendChild(row);
}

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });

const svgOuter = `
<svg xmlns="http://www.w3.org/2000/svg">
  <foreignObject width="100%" height="100%">
    <body xmlns="http://www.w3.org/1999/xhtml">
      <style>
        input {   
          display: block;
          width: 30px;
          height: 30px;
          margin: 0px;
        }
        a:visited {
          color: red;
        }
        a {
          color: green;
        }
      </style>
      <input type="radio" checked="true"></input>
    </body>
  </foreignObject>
</svg>`;

const svg = document.querySelector('svg');
svg.innerHTML = svgOuter;

const src_svg = `data:image/svg+xml;charset=utf-8,${svgOuter}`;

await new Promise(resolve => {
  // Create an image element
  let img = new Image();
  img.onload = () => {
    ctx.drawImage(img, 0, 0);
    resolve();
  }
  img.src = src_svg;
});

for (let y = 1; y <= 44; y++) {
  for (let x = 1; x <= 44; x++) {
    const cell = document.querySelector(`#cell-${x}-${y}`);
    const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;
    cell.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
  }
}

const CENTER = 30/2 + 7;
const centerCell = document.querySelector(`#cell-${CENTER}-${CENTER}`);

const result = document.querySelector("h1");
result.textContent = `System Accent Color is: ${centerCell.style.backgroundColor}`;
result.style.color = centerCell.style.backgroundColor;
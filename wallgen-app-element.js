// PRNG
// https://github.com/bryc/code/blob/master/jshash/PRNGs.md
function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(0xdeadbeef);

class WallgenAppElement extends HTMLElement {
  connectedCallback() {
    this.innerHTML = "";
    this.appendChild(
      document
        .querySelector("template#wallgen-app-element")
        .content.cloneNode(true)
    );
    this._ctx = this.querySelector("canvas").getContext("2d");
    this._ctx.canvas.width = screen.width * devicePixelRatio;
    this._ctx.canvas.height = screen.height * devicePixelRatio;
    this._download = this.querySelector("a");
    this._draw();
  }

  _draw() {
    const ctx = this._ctx;
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    const r = (w / 600) * devicePixelRatio;
    const step = 2 * r * 1.5;
    const turn = Math.PI * 2;
    ctx.fillStyle = "hsl(0, 0%, 10%)";
    ctx.fillRect(0, 0, w, h);
    for (let x = 0; x < w; x += step) {
      for (let y = 0; y < h; y += step) {
        ctx.beginPath();
        const a = 0.05 + 0.0125 * Math.floor(rand() * 8);
        ctx.fillStyle = `hsla(0, 0%, 100%, ${a})`;
        ctx.arc(x, y, r, 0, turn, false);
        ctx.fill();
      }
    }
    this._download.download = `wallgen-${getDate()}.png`;
    this._download.href = ctx.canvas.toDataURL();
  }
}

function getDate() {
  return new Date().toJSON().split("T")[0];
}

customElements.define("wallgen-app", WallgenAppElement);

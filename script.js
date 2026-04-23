// ===============================
// ⚙️ CONFIG — ITEMS PER ROUND
// ===============================

const roundItems = {
  1: [
    "Compass","Clock","Map","Book","Lantern","Lead","Fishing Rod","Arrow",
    "Flint & Steel","Glass Bottle","Brick","Campfire","Mushroom Stew",
    "Ink Sac","String","Leather","Feather","Charcoal","Paper","Cooked Beef"
  ],
  2: [
    "Diamond","Diamond Block","Iron Armor","Gold Armor",
    "Enchanted Sword","Blaze Powder","Ender Pearl","Observer"
  ],
  3: [
    "Beacon","Netherite Block","Dragon Egg","Heavy Core","Elytra"
  ]
};

// ===============================
// 🎨 COLOR GENERATOR
// ===============================
function getColor(i, total) {
  const hue = (i / total) * 360;
  return `hsl(${hue}, 80%, 55%)`;
}

// ===============================
// 🧱 CREATE TICKS
// ===============================
function createTicks(id) {
  const el = document.getElementById(id);
  for (let i = 0; i < 24; i++) {
    const t = document.createElement("div");
    t.className = "tick";
    t.style.transform = `rotate(${i * 15}deg)`;
    el.appendChild(t);
  }
}

// ===============================
// 🎡 SPINNER CLASS
// ===============================
class Spinner {
  constructor(round) {
    this.round = round;
    this.items = [...roundItems[round]];
    this.canvas = document.getElementById(`wheel${round}`);
    this.ctx = this.canvas.getContext("2d");
    this.resultEl = document.getElementById(`result${round}`);
    this.button = document.getElementById(`btn${round}`);

    this.angle = 0;
    this.spinning = false;
    this.lastWinnerIndex = null;

    this.cx = 170;
    this.cy = 170;
    this.radius = 165;

    this.draw();
    this.button.onclick = () => this.spin();
  }

  draw(highlightIndex = null) {
    const ctx = this.ctx;
    const total = this.items.length;
    const slice = (2 * Math.PI) / total;

    ctx.clearRect(0, 0, 340, 340);

    this.items.forEach((item, i) => {
      const start = this.angle + i * slice;
      const end = start + slice;

      ctx.beginPath();
      ctx.moveTo(this.cx, this.cy);
      ctx.arc(this.cx, this.cy, this.radius, start, end);
      ctx.closePath();

      let color = getColor(i, total);

      // 🌟 FLASH SELECTED
      if (i === highlightIndex) {
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "#fff";
        ctx.shadowBlur = 30;
      } else {
        ctx.fillStyle = color + "22";
        ctx.shadowBlur = 0;
      }

      ctx.fill();

      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();

      // TEXT
      ctx.save();
      ctx.translate(this.cx, this.cy);
      ctx.rotate(start + slice / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#fff";
      ctx.font = "bold 10px monospace";
      ctx.fillText(item, this.radius - 10, 4);
      ctx.restore();
    });

    // center
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, 30, 0, 2 * Math.PI);
    ctx.fillStyle = "#020d1a";
    ctx.fill();
  }

  spin() {
    if (this.spinning) return;

    this.spinning = true;
    this.button.disabled = true;
    this.resultEl.textContent = "";

    const spins = 5 + Math.random() * 5;
    const target = this.angle + spins * 2 * Math.PI + Math.random() * 2 * Math.PI;

    const duration = 4000;
    const start = performance.now();
    const startAngle = this.angle;

    const animate = (now) => {
      let t = (now - start) / duration;
      if (t > 1) t = 1;

      const ease = 1 - Math.pow(1 - t, 3);
      this.angle = startAngle + (target - startAngle) * ease;

      this.draw();

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        this.finishSpin();
      }
    };

    requestAnimationFrame(animate);
  }

  finishSpin() {
    const total = this.items.length;
    const slice = (2 * Math.PI) / total;

    const norm = ((-this.angle - Math.PI / 2) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
    const index = Math.floor(norm / slice) % total;

    this.lastWinnerIndex = index;
    const winner = this.items[index];

    // 🎉 FLASH EFFECT
    let flashes = 0;
    const flashInterval = setInterval(() => {
      this.draw(flashes % 2 === 0 ? index : null);
      flashes++;
      if (flashes > 6) {
        clearInterval(flashInterval);
        this.draw(index);
      }
    }, 120);

    this.resultEl.textContent = `▸ ${winner.toUpperCase()} ◂`;

    this.spinning = false;
    this.button.disabled = false;
  }
}

// ===============================
// 🚀 INIT EVERYTHING
// ===============================

createTicks("ticks1");
createTicks("ticks2");
createTicks("ticks3");

const spinner1 = new Spinner(1);
const spinner2 = new Spinner(2);
const spinner3 = new Spinner(3);

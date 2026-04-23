// ===== COMMON WHEEL CLASS =====
class Spinner {
  constructor(canvasId, resultId, buttonId, items) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.resultEl = document.getElementById(resultId);
    this.button = document.getElementById(buttonId);

    this.cx = 170;
    this.cy = 170;
    this.radius = 168;

    this.items = items;
    this.angle = 0;
    this.spinning = false;

    this.draw();
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, 340, 340);

    const slice = (2 * Math.PI) / this.items.length;

    this.items.forEach((item, i) => {
      const start = this.angle + i * slice;
      const end = start + slice;

      ctx.beginPath();
      ctx.moveTo(this.cx, this.cy);
      ctx.arc(this.cx, this.cy, this.radius, start, end);
      ctx.closePath();

      ctx.fillStyle = item.color + "18";
      ctx.fill();

      ctx.strokeStyle = item.color + "aa";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.save();
      ctx.translate(this.cx, this.cy);
      ctx.rotate(start + slice / 2);
      ctx.textAlign = "right";
      ctx.font = 'bold 8px "Share Tech Mono"';
      ctx.fillStyle = item.color;
      ctx.shadowColor = item.color;
      ctx.shadowBlur = 8;
      ctx.fillText(item.label, this.radius - 8, 3);
      ctx.restore();
    });
  }

  spin() {
    if (this.spinning) return;

    this.spinning = true;
    this.resultEl.textContent = "";
    this.button.disabled = true;

    const spins = 6 + Math.random() * 4;
    const target = this.angle + spins * 2 * Math.PI + Math.random() * 2 * Math.PI;

    const duration = 4200;
    const start = performance.now();
    const startAngle = this.angle;

    const ease = (t) => 1 - Math.pow(1 - t, 4); // smoother

    const animate = (now) => {
      const t = Math.min((now - start) / duration, 1);
      this.angle = startAngle + (target - startAngle) * ease(t);
      this.draw();

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        this.finish();
      }
    };

    requestAnimationFrame(animate);
  }

  finish() {
    this.spinning = false;
    this.button.disabled = false;

    const slice = (2 * Math.PI) / this.items.length;
    const norm =
      (((-this.angle - Math.PI / 2) % (2 * Math.PI)) + 2 * Math.PI) %
      (2 * Math.PI);

    const index = Math.floor(norm / slice);
    const chosen = this.items[index];

    // 💥 result animation
    this.resultEl.textContent = "▸ " + chosen.label.toUpperCase() + " ◂";
    this.resultEl.style.color = chosen.color;
    this.resultEl.style.textShadow = `0 0 20px ${chosen.color}, 0 0 40px ${chosen.color}`;

    this.resultEl.animate(
      [
        { transform: "scale(0.8)", opacity: 0 },
        { transform: "scale(1.2)", opacity: 1 },
        { transform: "scale(1)", opacity: 1 }
      ],
      { duration: 500, easing: "ease-out" }
    );
  }
}

// ===== ITEM POOLS =====

// Round 1
const itemsR1 = [
  { label: "Compass", color: "#00f5ff" },
  { label: "Clock", color: "#00ff88" },
  { label: "Map", color: "#00ccff" },
  { label: "Book", color: "#00ffaa" },
  { label: "Lantern", color: "#00ffcc" },
  { label: "Lead", color: "#00ffaa" },
  { label: "Arrow", color: "#00ccdd" },
  { label: "Flint+Steel", color: "#00ffaa" },
  { label: "Glass Bottle", color: "#00ffee" },
  { label: "Brick", color: "#00ccaa" },
  { label: "Campfire", color: "#00ffaa" },
  { label: "Stew", color: "#00ddaa" },
  { label: "Ink Sac", color: "#00aacc" },
  { label: "String", color: "#00bbff" },
  { label: "Leather", color: "#00ffaa" },
  { label: "Feather", color: "#00ddff" },
  { label: "Charcoal", color: "#009999" },
  { label: "Paper", color: "#00ccff" },
  { label: "Beef", color: "#00ffaa" }
];

// Round 2
const itemsR2 = [
  { label: "Diamond", color: "#ffd700" },
  { label: "Diamond Block", color: "#ffcc00" },
  { label: "Iron Armor", color: "#ffaa00" },
  { label: "Gold Armor", color: "#ffdd00" },
  { label: "Ench Sword", color: "#ffbb00" },
  { label: "Blaze Powder", color: "#ffaa00" },
  { label: "Ender Pearl", color: "#ffcc00" },
  { label: "Observer", color: "#ffee00" }
];

// Round 3
const itemsR3 = [
  { label: "Beacon", color: "#ff8800" },
  { label: "Netherite Block", color: "#ff5500" },
  { label: "Dragon Egg", color: "#ff3366" },
  { label: "Heavy Core", color: "#ff3300" },
  { label: "Elytra", color: "#ff6600" }
];

// ===== INIT =====
const spinner1 = new Spinner("wheel1", "result1", "btn1", itemsR1);
const spinner2 = new Spinner("wheel2", "result2", "btn2", itemsR2);
const spinner3 = new Spinner("wheel3", "result3", "btn3", itemsR3);

// Hook buttons
document.getElementById("btn1").onclick = () => spinner1.spin();
document.getElementById("btn2").onclick = () => spinner2.spin();
document.getElementById("btn3").onclick = () => spinner3.spin();
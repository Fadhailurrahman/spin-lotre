let lotreData = [];
let hadiahData = [];
let selectedLotre = "";
let selectedIndex = null;

const popup = document.getElementById("popup");
const popupContent = document.getElementById("popupContent");
const historyList = document.getElementById("historyList");

function drawWheel(canvasId, data) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");
  const total = data.length;
  const arc = (2 * Math.PI) / total;
  ctx.clearRect(0, 0, 300, 300);

  for (let i = 0; i < total; i++) {
    const angle = i * arc;
    ctx.beginPath();
    ctx.fillStyle = `hsl(${i * 360 / total}, 70%, 60%)`;
    ctx.moveTo(150, 150);
    ctx.arc(150, 150, 150, angle, angle + arc);
    ctx.fill();

    ctx.save();
    ctx.translate(150, 150);
    ctx.rotate(angle + arc / 2);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 14px Poppins";
    ctx.textAlign = "right";
    ctx.fillText(data[i], 130, 5);
    ctx.restore();
  }
}

function addLotre() {
  const input = document.getElementById("lotreInput").value.split("\n").map(x => x.trim()).filter(x => x && !lotreData.includes(x));
  lotreData.push(...input);
  document.getElementById("lotreInput").value = "";
  drawWheel("lotreWheel", lotreData);
}

function addHadiah() {
  const input = document.getElementById("hadiahInput").value.split("\n").map(x => x.trim()).filter(x => x && !hadiahData.includes(x));
  hadiahData.push(...input);
  document.getElementById("hadiahInput").value = "";
  drawWheel("hadiahWheel", hadiahData);
}

function spinWheel(canvasId, dataArray, callback) {
  const canvas = document.getElementById(canvasId);
  const total = dataArray.length;
  const arc = 360 / total;
  const index = Math.floor(Math.random() * total);
  const angleToTop = 90;
  const finalAngle = (5 * 360) + angleToTop - (index * arc) - arc / 2;
  canvas.style.transition = 'transform 3s ease-out';
  canvas.style.transform = `rotate(${finalAngle}deg)`;

  setTimeout(() => {
    const winner = dataArray[index];
    callback(winner, index);
  }, 3200);
}

function startLotreSpin() {
  if (lotreData.length === 0 || hadiahData.length === 0) {
    alert("Isi nomor lotre dan hadiah terlebih dahulu.");
    return;
  }

  spinWheel("lotreWheel", lotreData, (winner, index) => {
    selectedLotre = winner;
    selectedIndex = index;

    showPopup(
      `🎟️ Nomor lotre yang terpilih adalah: <strong>${winner}</strong>`,
      [
        { text: "🎁 Pilih Hadiah", action: "lanjut" },
        { text: "🔄 Ulangi Nomor", action: "ulang" }
      ]
    );
  });
}

function startHadiahSpin() {
  spinWheel("hadiahWheel", hadiahData, (winner, index) => {
    hadiahData.splice(index, 1);
    drawWheel("hadiahWheel", hadiahData);

    showPopup(`🎉 Selamat! Nomor <strong>${selectedLotre}</strong> mendapatkan hadiah: <strong>${winner}</strong>`, [
      { text: "Tutup", action: "tutup" }
    ]);

    const item = document.createElement("div");
    item.className = "history-item";
    item.textContent = `🎟️ No ${selectedLotre} memenangkan \"${winner}\"`;
    historyList.prepend(item);
  });
}

function showPopup(message, buttons) {
  const btnHtml = buttons.map(btn =>
    `<button class="close-btn" onclick="handlePopupAction('${btn.action}')">${btn.text}</button>`
  ).join("");
  popupContent.innerHTML = `<div>${message}</div><div style="margin-top: 20px;">${btnHtml}</div>`;
  popup.style.display = "flex";
}

function handlePopupAction(action) {
  popup.style.display = "none";

  if (action === "lanjut") {
    lotreData.splice(selectedIndex, 1);
    drawWheel("lotreWheel", lotreData);
    startHadiahSpin();
  }
}

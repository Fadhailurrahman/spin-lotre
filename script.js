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
  const input = document.getElementById("lotreInput").value
    .split("\n")
    .map(x => x.trim())
    .filter(x => /^\d+$/.test(x) && !lotreData.includes(x));

  lotreData.push(...input);
  document.getElementById("lotreInput").value = "";
  drawWheel("lotreWheel", lotreData);
}

function addHadiah() {
  const input = document.getElementById("hadiahInput").value
    .split("\n")
    .map(x => x.trim())
    .filter(x => /^[a-zA-Z\\s]+$/.test(x) && !hadiahData.includes(x));

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
        { text: "🎁 Pilih Hadiah", action: "lanjut", color: "bg-green-600" },
        { text: "🔄 Ulangi Nomor", action: "ulang", color: "bg-yellow-500" }
      ]
    );
  });
}

function startHadiahSpin() {
  spinWheel("hadiahWheel", hadiahData, (winner, index) => {
    hadiahData.splice(index, 1);
    drawWheel("hadiahWheel", hadiahData);

    showPopup(
      `🎉 Selamat! Nomor <strong>${selectedLotre}</strong> mendapatkan hadiah: <strong>${winner}</strong>`,
      [{ text: "Tutup", action: "tutup", color: "bg-blue-600" }]
    );

    const item = document.createElement("div");
    item.className = "bg-green-50 border-l-4 border-green-400 px-2 py-1 rounded text-sm";
    item.textContent = `🎟️ No ${selectedLotre} memenangkan "${winner}"`;
    historyList.prepend(item);
  });
}

function showPopup(message, buttons) {
  const btnHtml = buttons.map(btn =>
    `<button onclick="handlePopupAction('${btn.action}')" class="px-4 py-2 text-white ${btn.color} hover:opacity-90 rounded font-semibold mx-2">${btn.text}</button>`
  ).join("");
  popupContent.innerHTML = `<div>${message}</div><div class="mt-4 flex justify-center flex-wrap gap-2">${btnHtml}</div>`;
  popup.classList.remove("hidden");
}

function handlePopupAction(action) {
  popup.classList.add("hidden");

  if (action === "lanjut") {
    lotreData.splice(selectedIndex, 1);
    drawWheel("lotreWheel", lotreData);
    startHadiahSpin();
  }
}

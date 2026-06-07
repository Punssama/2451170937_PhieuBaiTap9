const images = [
  {
    src: "https://placehold.co/1200x600/0ea5e9/ffffff?text=Image+1",
    title: "Ảnh 1",
  },
  {
    src: "https://placehold.co/1200x600/8b5cf6/ffffff?text=Image+2",
    title: "Ảnh 2",
  },
  {
    src: "https://placehold.co/1200x600/22c55e/ffffff?text=Image+3",
    title: "Ảnh 3",
  },
  {
    src: "https://placehold.co/1200x600/f97316/ffffff?text=Image+4",
    title: "Ảnh 4",
  },
  {
    src: "https://placehold.co/1200x600/ef4444/ffffff?text=Image+5",
    title: "Ảnh 5",
  },
];

const commands = [
  { label: "Next image", action: () => goToImage(index + 1) },
  { label: "Previous image", action: () => goToImage(index - 1) },
  { label: "Toggle slideshow", action: toggleSlideshow },
  { label: "Open preview", action: openPreview },
  { label: "Close preview", action: closePreview },
];

const app = document.getElementById("app");
let index = 0;
let slideshowTimer = null;
let paletteOpen = false;
let paletteIndex = 0;
let filteredCommands = [...commands];

app.innerHTML = `
  <main class="shell">
    <section class="panel gallery" aria-label="Image gallery">
      <div class="toolbar">
        <button id="prevBtn" aria-label="Previous image">← Prev</button>
        <button id="nextBtn" aria-label="Next image">Next →</button>
        <button id="playBtn" class="secondary" aria-label="Play slideshow">Play</button>
        <button id="openPaletteBtn" class="secondary" aria-label="Open command palette">Ctrl+K</button>
      </div>
      <div class="hero" tabindex="0" id="hero" aria-label="Current image preview">
        <img id="heroImg" alt="" />
        <div class="caption" id="heroCaption"></div>
      </div>
      <div class="hint">Phím tắt: ← →, số 1-9, Space, Escape, Ctrl+K</div>
      <div class="thumb-row" id="thumbRow"></div>
    </section>
  </main>
  <div id="previewModal" class="modal hidden" aria-hidden="true">
    <div class="modal-content">
      <button id="closePreviewBtn" aria-label="Close preview">Đóng</button>
      <img id="previewImg" alt="Preview" />
    </div>
  </div>
  <div id="palette" class="palette hidden" aria-hidden="true">
    <div class="palette-content">
      <div class="palette-header">
        <input id="paletteInput" type="text" placeholder="Type a command..." aria-label="Command palette search" />
        <button id="paletteCloseBtn" class="secondary" aria-label="Close command palette">Esc</button>
      </div>
      <div id="commandList" class="command-list" role="listbox" aria-label="Commands"></div>
    </div>
  </div>
`;

const heroImg = document.getElementById("heroImg");
const heroCaption = document.getElementById("heroCaption");
const thumbRow = document.getElementById("thumbRow");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const playBtn = document.getElementById("playBtn");
const openPaletteBtn = document.getElementById("openPaletteBtn");
const previewModal = document.getElementById("previewModal");
const previewImg = document.getElementById("previewImg");
const closePreviewBtn = document.getElementById("closePreviewBtn");
const palette = document.getElementById("palette");
const paletteInput = document.getElementById("paletteInput");
const paletteCloseBtn = document.getElementById("paletteCloseBtn");
const commandList = document.getElementById("commandList");

function renderGallery() {
  const current = images[index];
  heroImg.src = current.src;
  heroImg.alt = current.title;
  heroCaption.textContent = `${index + 1}/${images.length} - ${current.title}`;

  thumbRow.replaceChildren();
  images.forEach((image, i) => {
    const btn = document.createElement("button");
    btn.className = `thumb${i === index ? " active" : ""}`;
    btn.type = "button";
    btn.setAttribute("aria-label", `Open ${image.title}`);

    const img = document.createElement("img");
    img.src = image.src;
    img.alt = image.title;
    btn.appendChild(img);
    btn.addEventListener("click", () => goToImage(i));
    thumbRow.appendChild(btn);
  });
}

function goToImage(nextIndex) {
  index = (nextIndex + images.length) % images.length;
  renderGallery();
}

function openPreview() {
  previewImg.src = images[index].src;
  previewModal.classList.remove("hidden");
  previewModal.setAttribute("aria-hidden", "false");
}

function closePreview() {
  previewModal.classList.add("hidden");
  previewModal.setAttribute("aria-hidden", "true");
}

function toggleSlideshow() {
  if (slideshowTimer) {
    clearInterval(slideshowTimer);
    slideshowTimer = null;
    playBtn.textContent = "Play";
    return;
  }
  slideshowTimer = setInterval(() => goToImage(index + 1), 2000);
  playBtn.textContent = "Pause";
}

function openPalette() {
  palette.classList.remove("hidden");
  palette.setAttribute("aria-hidden", "false");
  paletteOpen = true;
  paletteInput.value = "";
  filteredCommands = [...commands];
  paletteIndex = 0;
  renderCommands();
  paletteInput.focus();
}

function closePalette() {
  palette.classList.add("hidden");
  palette.setAttribute("aria-hidden", "true");
  paletteOpen = false;
}

function renderCommands() {
  commandList.replaceChildren();
  filteredCommands.forEach((command, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `command-item${i === paletteIndex ? " active" : ""}`;
    btn.textContent = command.label;
    btn.setAttribute("role", "option");
    btn.addEventListener("click", () => {
      command.action();
      closePalette();
    });
    commandList.appendChild(btn);
  });
}

function filterCommands(query) {
  filteredCommands = commands.filter((command) =>
    command.label.toLowerCase().includes(query.toLowerCase()),
  );
  paletteIndex = 0;
  renderCommands();
}

prevBtn.addEventListener("click", () => goToImage(index - 1));
nextBtn.addEventListener("click", () => goToImage(index + 1));
playBtn.addEventListener("click", toggleSlideshow);
openPaletteBtn.addEventListener("click", openPalette);
closePreviewBtn.addEventListener("click", closePreview);
previewModal.addEventListener("click", (e) => {
  if (e.target === previewModal) closePreview();
});
paletteCloseBtn.addEventListener("click", closePalette);
paletteInput.addEventListener("input", (e) => filterCommands(e.target.value));

paletteInput.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown") {
    e.preventDefault();
    paletteIndex = (paletteIndex + 1) % Math.max(1, filteredCommands.length);
    renderCommands();
  }
  if (e.key === "ArrowUp") {
    e.preventDefault();
    paletteIndex =
      (paletteIndex - 1 + Math.max(1, filteredCommands.length)) %
      Math.max(1, filteredCommands.length);
    renderCommands();
  }
  if (e.key === "Enter" && filteredCommands[paletteIndex]) {
    filteredCommands[paletteIndex].action();
    closePalette();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key.toLowerCase() === "k") {
    e.preventDefault();
    if (paletteOpen) closePalette();
    else openPalette();
    return;
  }

  if (paletteOpen) {
    if (e.key === "Escape") closePalette();
    return;
  }

  if (e.key === "ArrowLeft") goToImage(index - 1);
  if (e.key === "ArrowRight") goToImage(index + 1);
  if (/^[1-9]$/.test(e.key)) {
    const target = Number(e.key) - 1;
    if (target < images.length) goToImage(target);
  }
  if (e.key === " ") {
    e.preventDefault();
    toggleSlideshow();
  }
  if (e.key === "Escape") closePreview();
  if (e.key === "Enter" && document.activeElement === heroImg) {
    openPreview();
  }
});

renderGallery();
renderCommands();

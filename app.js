javascript
// ==========================
// CONFIG
// ==========================
let blocks = [];
let isPremium = false; // ← cambia a true si quieres activar premium

// ==========================
// RENDER
// ==========================
function render() {
  const canvas = document.getElementById("canvas");
  canvas.innerHTML = "";

  blocks.forEach((block, index) => {
    const div = document.createElement("div");
    div.className = "block";

    let content;

    // TEXT
    if (block.type === "text") {
      content = document.createElement("p");
      content.innerText = block.data;
    }

    // TITLE
    if (block.type === "title") {
      content = document.createElement("h2");
      content.innerText = block.data;
    }

    // IMAGE
    if (block.type === "image") {
      content = document.createElement("img");
      content.src = block.data;
      content.style.maxWidth = "100%";
    }

    // BUTTON
    if (block.type === "button") {
      content = document.createElement("button");
      content.innerText = block.data.text;

      content.onclick = () => {
        const action = block.data.action || "";

        if (!action) {
          alert("No action assigned");
          return;
        }

        if (action.startsWith("http")) {
          window.open(action, "_blank");
        } else {
          try {
            new Function(action)();
          } catch {
            alert("Error en script");
          }
        }
      };
    }

    // VIDEO
    if (block.type === "video") {
      content = document.createElement("iframe");
      content.src = block.data;
      content.width = "100%";
      content.height = "200";
    }

    // DIVIDER
    if (block.type === "divider") {
      content = document.createElement("hr");
    }

    // HTML
    if (block.type === "html") {
      content = document.createElement("div");
      content.innerHTML = block.data;
    }

    div.appendChild(content);

    // ==========================
    // CONTROLES
    // ==========================

    // EDIT
    const edit = document.createElement("button");
    edit.innerText = "✏️";
    edit.onclick = () => editBlock(index);
    div.appendChild(edit);

    // DELETE
    const del = document.createElement("button");
    del.innerText = "❌";
    del.onclick = () => {
      blocks.splice(index, 1);
      render();
    };
    div.appendChild(del);

    // MOVE
    const up = document.createElement("button");
    up.innerText = "⬆️";
    up.onclick = () => moveBlock(index, -1);
    div.appendChild(up);

    const down = document.createElement("button");
    down.innerText = "⬇️";
    down.onclick = () => moveBlock(index, 1);
    div.appendChild(down);

    canvas.appendChild(div);
  });
}

// ==========================
// ADD
// ==========================
function addText() {
  let text = prompt("Texto:");
  if (!text) return;
  blocks.push({ type: "text", data: text });
  render();
}

function addTitle() {
  let text = prompt("Título:");
  if (!text) return;
  blocks.push({ type: "title", data: text });
  render();
}

function addImage() {
  let url = prompt("URL imagen:");
  if (!url) return;
  blocks.push({ type: "image", data: url });
  render();
}

function addButton() {
  let text = prompt("Texto botón:");
  if (!text) return;

  let action = prompt("Link o JS:");
  if (!action) action = "";

  blocks.push({
    type: "button",
    data: { text, action }
  });

  render();
}

function addVideo() {
  let url = prompt("URL embed video:");
  if (!url) return;
  blocks.push({ type: "video", data: url });
  render();
}

function addDivider() {
  blocks.push({ type: "divider" });
  render();
}

function addHTML() {
  let html = prompt("HTML:");
  if (!html) return;
  blocks.push({ type: "html", data: html });
  render();
}

// ==========================
// EDIT + PREMIUM
// ==========================
function editBlock(index) {
  const block = blocks[index];

  let option = prompt(
`Editar:
1. Contenido normal
2. Color (Premium 🔒)
3. Tamaño (Premium 🔒)`
  );

  if (option === "2" || option === "3") {
    if (!isPremium) {
      alert("No eres premium 🚫");
      return;
    }
  }

  if (block.type === "text" || block.type === "title") {
    let newText = prompt("Editar texto:", block.data);
    if (newText !== null) block.data = newText;
  }

  if (block.type === "image") {
    let newUrl = prompt("Editar URL:", block.data);
    if (newUrl !== null) block.data = newUrl;
  }

  if (block.type === "button") {
    let newText = prompt("Texto:", block.data.text);
    let newAction = prompt("Acción:", block.data.action);

    if (newText !== null) block.data.text = newText;
    if (newAction !== null) block.data.action = newAction;
  }

  if (block.type === "html") {
    let newHtml = prompt("Editar HTML:", block.data);
    if (newHtml !== null) block.data = newHtml;
  }

  render();
}

// ==========================
// MOVE
// ==========================
function moveBlock(index, dir) {
  const newIndex = index + dir;
  if (newIndex < 0 || newIndex >= blocks.length) return;

  [blocks[index], blocks[newIndex]] = [blocks[newIndex], blocks[index]];
  render();
}

// ==========================
// GENERATE
// ==========================
function generateHTML() {
  let html = "";

  blocks.forEach(block => {
    if (block.type === "text") html += `<p>${block.data}</p>`;
    if (block.type === "title") html += `<h2>${block.data}</h2>`;
    if (block.type === "image") html += `<img src="${block.data}" style="max-width:100%">`;
    if (block.type === "divider") html += `<hr>`;
    if (block.type === "video") html += `<iframe src="${block.data}" width="100%" height="200"></iframe>`;
    if (block.type === "html") html += block.data;

    if (block.type === "button") {
      html += `<button onclick="window.open('${block.data.action}')">${block.data.text}</button>`;
    }
  });

  return html;
}

// ==========================
// SAVE
// ==========================
function save() {
  let name = prompt("Nombre del sitio:");
  if (!name) return;

  let content = generateHTML();
  let sites = JSON.parse(localStorage.getItem("sites")) || [];

  sites.push({ name, content });

  localStorage.setItem("sites", JSON.stringify(sites));
  alert("Guardado ✅");
}

// ==========================
// CLEAR
// ==========================
function clearCanvas() {
  if (confirm("Borrar todo?")) {
    blocks = [];
    render();
  }
}


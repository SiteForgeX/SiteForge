 id="hyper-app"
// ==========================
// CONFIG
// ==========================
let blocks = [];
let isPremium = false;

// ==========================
// INIT
// ==========================
window.onload = () => {
  console.log("Editor listo ✅");
  render();
};

// ==========================
// RENDER
// ==========================
function render() {
  const canvas = document.getElementById("canvas");
  if (!canvas) {
    console.error("Canvas no encontrado");
    return;
  }

  canvas.innerHTML = "";

  blocks.forEach((block, index) => {
    const div = document.createElement("div");
    div.className = "block";

    let content;

    // ===== TEXT =====
    if (block.type === "text") {
      content = document.createElement("p");
      content.innerText = block.data;
    }

    // ===== TITLE =====
    if (block.type === "title") {
      content = document.createElement("h2");
      content.innerText = block.data;
    }

    // ===== IMAGE =====
    if (block.type === "image") {
      content = document.createElement("img");
      content.src = block.data;
      content.style.maxWidth = "100%";
    }

    // ===== BUTTON =====
    if (block.type === "button") {
      content = document.createElement("button");
      content.innerText = block.data.text;

      content.onclick = () => {
        let action = block.data.action;

        if (!action) {
          alert("Sin acción");
          return;
        }

        if (action.startsWith("http")) {
          window.open(action);
        } else {
          try {
            new Function(action)();
          } catch {
            alert("Error en script");
          }
        }
      };
    }

    // ===== VIDEO =====
    if (block.type === "video") {
      content = document.createElement("iframe");
      content.src = block.data;
      content.width = "100%";
      content.height = "200";
    }

    // ===== DIVIDER =====
    if (block.type === "divider") {
      content = document.createElement("hr");
    }

    // ===== HTML =====
    if (block.type === "html") {
      content = document.createElement("div");
      content.innerHTML = block.data;
    }

    // ===== STYLES =====
    if (block.style) {
      if (block.style.color) content.style.color = block.style.color;
      if (block.style.size) content.style.fontSize = block.style.size + "px";
    }

    div.appendChild(content);

    // ==========================
    // CONTROLS
    // ==========================

    // EDIT
    let edit = document.createElement("button");
    edit.innerText = "✏️";
    edit.onclick = () => editBlock(index);
    div.appendChild(edit);

    // DELETE
    let del = document.createElement("button");
    del.innerText = "❌";
    del.onclick = () => {
      blocks.splice(index, 1);
      render();
    };
    div.appendChild(del);

    // MOVE
    let up = document.createElement("button");
    up.innerText = "⬆️";
    up.onclick = () => moveBlock(index, -1);
    div.appendChild(up);

    let down = document.createElement("button");
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
  let url = prompt("URL embed:");
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
  let block = blocks[index];

  let option = prompt(
`Editar:
1. Contenido
2. Color 🔒 Premium
3. Tamaño 🔒 Premium`
  );

  if (option === "2" || option === "3") {
    if (!isPremium) {
      alert("No eres premium 🚫");
      return;
    }
  }

  if (option === "1") {
    if (block.type === "text" || block.type === "title") {
      let t = prompt("Editar:", block.data);
      if (t !== null) block.data = t;
    }

    if (block.type === "image") {
      let u = prompt("URL:", block.data);
      if (u !== null) block.data = u;
    }

    if (block.type === "button") {
      let t = prompt("Texto:", block.data.text);
      let a = prompt("Acción:", block.data.action);

      if (t !== null) block.data.text = t;
      if (a !== null) block.data.action = a;
    }

    if (block.type === "html") {
      let h = prompt("HTML:", block.data);
      if (h !== null) block.data = h;
    }
  }

  if (option === "2") {
    let color = prompt("Color (red, blue...):");
    if (!block.style) block.style = {};
    block.style.color = color;
  }

  if (option === "3") {
    let size = prompt("Tamaño (px):");
    if (!block.style) block.style = {};
    block.style.size = size;
  }

  render();
}

// ==========================
// MOVE
// ==========================
function moveBlock(index, dir) {
  let newIndex = index + dir;
  if (newIndex < 0 || newIndex >= blocks.length) return;

  [blocks[index], blocks[newIndex]] = [blocks[newIndex], blocks[index]];
  render();
}

// ==========================
// SAVE
// ==========================
function save() {
  let name = prompt("Nombre del sitio:");
  if (!name) return;

  let html = generateHTML();

  let sites = JSON.parse(localStorage.getItem("sites")) || [];
  sites.push({ name, content: html });

  localStorage.setItem("sites", JSON.stringify(sites));

  alert("Guardado ✅");
}

// ==========================
// GENERATE HTML
// ==========================
function generateHTML() {
  let html = "";

  blocks.forEach(b => {
    if (b.type === "text") html += `<p>${b.data}</p>`;
    if (b.type === "title") html += `<h2>${b.data}</h2>`;
    if (b.type === "image") html += `<img src="${b.data}">`;
    if (b.type === "divider") html += `<hr>`;
    if (b.type === "video") html += `<iframe src="${b.data}"></iframe>`;
    if (b.type === "html") html += b.data;

    if (b.type === "button") {
      html += `<button onclick="window.open('${b.data.action}')">${b.data.text}</button>`;
    }
  });

  return html;
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


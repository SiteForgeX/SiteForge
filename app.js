```javascript
// ===============================
// SiteForge - App.js PRO
// ===============================

// Estado global
let state = {
  title: "",
  blocks: []
};

// ===============================
// UTILIDADES
// ===============================
function generateId() {
  return "id-" + Math.random().toString(36).substr(2, 9);
}

function saveToLocal() {
  localStorage.setItem("siteforge-data", JSON.stringify(state));
}

function loadFromLocal() {
  let data = localStorage.getItem("siteforge-data");
  if (data) {
    state = JSON.parse(data);
    render();
  }
}

// ===============================
// BLOQUES
// ===============================

function addBlock(type, content = {}) {
  let block = {
    id: generateId(),
    type: type,
    content: content
  };

  state.blocks.push(block);
  render();
  saveToLocal();
}

function deleteBlock(id) {
  state.blocks = state.blocks.filter(b => b.id !== id);
  render();
  saveToLocal();
}

// ===============================
// RENDER
// ===============================

function render() {
  let canvas = document.getElementById("canvas");
  canvas.innerHTML = "";

  state.blocks.forEach(block => {
    let el = createElement(block);
    canvas.appendChild(el);
  });
}

function createElement(block) {
  let div = document.createElement("div");
  div.className = "block";
  div.dataset.id = block.id;

  let content;

  switch (block.type) {
    case "text":
      content = document.createElement("div");
      content.contentEditable = true;
      content.innerText = block.content.text || "Texto...";
      content.oninput = () => {
        block.content.text = content.innerText;
        saveToLocal();
      };
      break;

    case "image":
      content = document.createElement("img");
      content.src = block.content.url;
      content.style.maxWidth = "100%";
      break;

    case "button":
      content = document.createElement("button");
      content.innerText = block.content.text || "Botón";
      break;

    case "whatsapp":
      content = document.createElement("a");
      content.href = "https://wa.me/" + block.content.number;
      content.innerText = "Contactar por WhatsApp";
      content.style.background = "green";
      content.style.color = "white";
      content.style.padding = "10px";
      content.style.display = "inline-block";
      break;

    default:
      content = document.createElement("div");
      content.innerText = "Bloque desconocido";
  }

  // Botón eliminar
  let del = document.createElement("button");
  del.innerText = "❌";
  del.style.float = "right";
  del.onclick = () => deleteBlock(block.id);

  div.appendChild(del);
  div.appendChild(content);

  return div;
}

// ===============================
// FUNCIONES DE UI
// ===============================

function addText() {
  addBlock("text", { text: "Nuevo texto..." });
}

function addImage() {
  let url = prompt("URL de imagen:");
  if (!url) return;
  addBlock("image", { url });
}

function addButton() {
  let text = prompt("Texto del botón:");
  if (!text) return;
  addBlock("button", { text });
}

function addWhatsapp() {
  let number = prompt("Número:");
  if (!number) return;
  addBlock("whatsapp", { number });
}

// ===============================
// PREVIEW
// ===============================

function generateHTML() {
  let html = "";

  state.blocks.forEach(block => {
    switch (block.type) {
      case "text":
        html += `<p>${block.content.text}</p>`;
        break;
      case "image":
        html += `<img src="${block.content.url}" style="max-width:100%">`;
        break;
      case "button":
        html += `<button>${block.content.text}</button>`;
        break;
      case "whatsapp":
        html += `<a href="https://wa.me/${block.content.number}">WhatsApp</a>`;
        break;
    }
  });

  return html;
}

function preview() {
  let win = window.open();
  win.document.write(`
    <html>
    <head><title>Preview</title></head>
    <body>${generateHTML()}</body>
    </html>
  `);
}

// ===============================
// PUBLICAR (EXPORTAR)
// ===============================

function publish() {
  let name = document.getElementById("title").value || "mi-pagina";

  let page = `
    <html>
    <head><title>${name}</title></head>
    <body>${generateHTML()}</body>
    </html>
  `;

  let blob = new Blob([page], { type: "text/html" });
  let link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = name + ".html";
  link.click();
}

// ===============================
// AUTO GUARDADO
// ===============================

setInterval(() => {
  saveToLocal();
}, 3000);

// ===============================
// INIT
// ===============================

window.onload = () => {
  loadFromLocal();

  let titleInput = document.getElementById("title");
  titleInput.oninput = () => {
    state.title = titleInput.value;
    saveToLocal();
  };
};
```

```javascript
let blocks = [];

/* RENDER */
function render() {
  let canvas = document.getElementById("canvas");
  canvas.innerHTML = "";

  blocks.forEach((block, index) => {
    let div = document.createElement("div");
    div.className = "block";

    let content;

    if (block.type === "text") {
      content = document.createElement("p");
      content.innerText = block.data;
    }

    if (block.type === "image") {
      content = document.createElement("img");
      content.src = block.data;
      content.style.maxWidth = "100%";
    }

    if (block.type === "button") {
      content = document.createElement("button");
      content.innerText = block.data.text;

      content.onclick = () => {
        try {
          eval(block.data.action);
        } catch {
          window.location.href = block.data.action;
        }
      };
    }

    if (block.type === "html") {
      content = document.createElement("div");
      content.innerHTML = block.data;
    }

    div.appendChild(content);

    // eliminar bloque
    let del = document.createElement("button");
    del.innerText = "❌";
    del.onclick = () => {
      blocks.splice(index, 1);
      render();
    };

    div.appendChild(del);

    canvas.appendChild(div);
  });
}

/* FUNCIONES */

function addText() {
  let text = prompt("Write text:");
  if (!text) return;

  blocks.push({ type: "text", data: text });
  render();
}

function addImage() {
  let url = prompt("Image URL:");
  if (!url) return;

  blocks.push({ type: "image", data: url });
  render();
}

function addButton() {
  let text = prompt("Button text:");
  let action = prompt("Link or JS:");

  if (!text) return;

  blocks.push({
    type: "button",
    data: { text, action }
  });

  render();
}

function addHTML() {
  let html = prompt("Paste HTML:");
  if (!html) return;

  blocks.push({ type: "html", data: html });
  render();
}

/* SAVE */

function generateHTML() {
  let html = "";

  blocks.forEach(block => {
    if (block.type === "text") {
      html += `<p>${block.data}</p>`;
    }

    if (block.type === "image") {
      html += `<img src="${block.data}" style="max-width:100%">`;
    }

    if (block.type === "button") {
      html += `
      <button onclick="
        try{eval('${block.data.action}')}
        catch{window.location='${block.data.action}'}
      ">${block.data.text}</button>`;
    }

    if (block.type === "html") {
      html += block.data;
    }
  });

  return html;
}

function save() {
  let name = prompt("Site name:");
  if (!name) return;

  let content = generateHTML();

  let sites = JSON.parse(localStorage.getItem("sites")) || [];

  let existing = sites.find(s => s.name === name);

  if (existing) {
    existing.content = content;
  } else {
    sites.push({ name, content });
  }

  localStorage.setItem("sites", JSON.stringify(sites));

  alert("Saved ✅");
}

/* CLEAR */

function clearCanvas() {
  if (confirm("Clear everything?")) {
    blocks = [];
    render();
  }
}



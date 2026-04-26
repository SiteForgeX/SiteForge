javascript id="improved-appjs"
// ==========================
// STATE
// ==========================
let blocks = [];

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

    // -------- TEXT --------
    if (block.type === "text") {
      content = document.createElement("p");
      content.innerText = block.data;
    }

    // -------- IMAGE --------
    if (block.type === "image") {
      content = document.createElement("img");
      content.src = block.data;
      content.style.maxWidth = "100%";
    }

    // -------- BUTTON --------
    if (block.type === "button") {
      content = document.createElement("button");
      content.innerText = block.data.text;

      content.onclick = () => {
        const action = block.data.action || "";

        if (!action) {
          alert("No action assigned");
          return;
        }

        // LINK
        if (action.startsWith("http")) {
          window.open(action, "_blank");
          return;
        }

        // JS
        try {
          new Function(action)();
        } catch (e) {
          console.error(e);
          alert("Invalid script");
        }
      };
    }

    // -------- HTML --------
    if (block.type === "html") {
      content = document.createElement("div");
      content.innerHTML = block.data;
    }

    div.appendChild(content);

    // ==========================
    // CONTROLS
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

    // MOVE UP
    const up = document.createElement("button");
    up.innerText = "⬆️";
    up.onclick = () => moveBlock(index, -1);
    div.appendChild(up);

    // MOVE DOWN
    const down = document.createElement("button");
    down.innerText = "⬇️";
    down.onclick = () => moveBlock(index, 1);
    div.appendChild(down);

    canvas.appendChild(div);
  });
}

// ==========================
// ADD FUNCTIONS
// ==========================
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
  if (!text) return;

  let action = prompt("Action (link or JS):");
  if (!action) action = "";

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

// ==========================
// EDIT BLOCK
// ==========================
function editBlock(index) {
  const block = blocks[index];

  if (block.type === "text") {
    let newText = prompt("Edit text:", block.data);
    if (newText !== null) block.data = newText;
  }

  if (block.type === "image") {
    let newUrl = prompt("Edit image URL:", block.data);
    if (newUrl !== null) block.data = newUrl;
  }

  if (block.type === "button") {
    let newText = prompt("Edit button text:", block.data.text);
    let newAction = prompt("Edit action:", block.data.action);

    if (newText !== null) block.data.text = newText;
    if (newAction !== null) block.data.action = newAction;
  }

  if (block.type === "html") {
    let newHtml = prompt("Edit HTML:", block.data);
    if (newHtml !== null) block.data = newHtml;
  }

  render();
}

// ==========================
// MOVE BLOCKS
// ==========================
function moveBlock(index, direction) {
  const newIndex = index + direction;
  if (newIndex < 0 || newIndex >= blocks.length) return;

  [blocks[index], blocks[newIndex]] = [blocks[newIndex], blocks[index]];
  render();
}

// ==========================
// GENERATE HTML
// ==========================
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
if('${block.data.action}'.startsWith('http')){
  window.open('${block.data.action}')
}else{
  try{new Function('${block.data.action}')()}
  catch{alert('Error')}
}
">${block.data.text}</button>`;
    }

    if (block.type === "html") {
      html += block.data;
    }
  });

  return html;
}

// ==========================
// SAVE
// ==========================
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

  alert("Saved successfully ✅");
}

// ==========================
// CLEAR
// ==========================
function clearCanvas() {
  if (confirm("Clear everything?")) {
    blocks = [];
    render();
  }
}


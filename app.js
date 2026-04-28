javascript id="final-fix"
// ==========================
// STATE
// ==========================
let blocks = [];

// ==========================
// INIT
// ==========================
window.onload = () => {
  render();
};

// ==========================
// RENDER
// ==========================
function render() {
  const canvas = document.getElementById("canvas");
  canvas.innerHTML = "";

  blocks.forEach((block, index) => {
    const div = document.createElement("div");
    div.className = "block";

    let el;

    if (block.type === "text") {
      el = document.createElement("p");
      el.innerText = block.data;
    }

    if (block.type === "image") {
      el = document.createElement("img");
      el.src = block.data;
      el.style.maxWidth = "100%";
    }

    if (block.type === "button") {
      el = document.createElement("button");
      el.innerText = block.data.text;

      el.onclick = () => {
        let a = block.data.action;
        if (!a) return alert("Sin acción");

        if (a.startsWith("http")) {
          window.open(a);
        } else {
          try { new Function(a)(); }
          catch { alert("Error en script"); }
        }
      };
    }

    if (block.type === "html") {
      el = document.createElement("div");
      el.innerHTML = block.data;
    }

    if (block.type === "title") {
      el = document.createElement("h2");
      el.innerText = block.data;
    }

    if (block.type === "divider") {
      el = document.createElement("hr");
    }

    if (block.type === "video") {
      el = document.createElement("iframe");
      el.src = block.data;
      el.width = "100%";
      el.height = "200";
    }

    div.appendChild(el);

    // CONTROLES
    let del = document.createElement("button");
    del.innerText = "❌";
    del.onclick = () => {
      blocks.splice(index,1);
      render();
    };

    div.appendChild(del);
    canvas.appendChild(div);
  });
}

// ==========================
// ADD
// ==========================
function addText(){
  let t = prompt("Texto:");
  if(!t) return;
  blocks.push({type:"text", data:t});
  render();
}

function addImage(){
  let u = prompt("URL:");
  if(!u) return;
  blocks.push({type:"image", data:u});
  render();
}

function addButton(){
  let t = prompt("Texto botón:");
  if(!t) return;
  let a = prompt("Link o JS:");
  blocks.push({type:"button", data:{text:t, action:a||""}});
  render();
}

function addHTML(){
  let h = prompt("HTML:");
  if(!h) return;
  blocks.push({type:"html", data:h});
  render();
}

function addTitle(){
  let t = prompt("Título:");
  if(!t) return;
  blocks.push({type:"title", data:t});
  render();
}

function addDivider(){
  blocks.push({type:"divider"});
  render();
}

function addVideo(){
  let v = prompt("URL video embed:");
  if(!v) return;
  blocks.push({type:"video", data:v});
  render();
}

// ==========================
// SAVE
// ==========================
function save(){
  let name = prompt("Nombre:");
  if(!name) return;

  let html = "";
  blocks.forEach(b=>{
    if(b.type==="text") html+=`<p>${b.data}</p>`;
    if(b.type==="title") html+=`<h2>${b.data}</h2>`;
    if(b.type==="image") html+=`<img src="${b.data}">`;
    if(b.type==="divider") html+=`<hr>`;
    if(b.type==="video") html+=`<iframe src="${b.data}"></iframe>`;
    if(b.type==="html") html+=b.data;
    if(b.type==="button"){
      html+=`<button onclick="window.open('${b.data.action}')">${b.data.text}</button>`;
    }
  });

  let sites = JSON.parse(localStorage.getItem("sites"))||[];
  sites.push({name,content:html});
  localStorage.setItem("sites",JSON.stringify(sites));

  alert("Guardado ✅");
}

// ==========================
// CLEAR
// ==========================
function clearCanvas(){
  if(confirm("Borrar todo?")){
    blocks=[];
    render();
  }
}



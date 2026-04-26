```javascript
let blocks=[];

// agregar texto
function addText(){
  let text=prompt("Texto:");
  if(!text)return;
  blocks.push(`<p>${text}</p>`);
  render();
}

// imagen
function addImage(){
  let url=prompt("URL:");
  if(!url)return;
  blocks.push(`<img src="${url}" style="max-width:100%">`);
  render();
}

// botón avanzado
function addButton(){
  let text=prompt("Texto botón:");
  let action=prompt("Link o JS:");

  if(!text)return;

  let btn = `
  <button onclick="
    try{eval('${action}')}
    catch{window.location='${action}'}
  ">${text}</button>
  `;

  blocks.push(btn);
  render();
}

// HTML libre (esto lo hace poderoso)
function addHTML(){
  let html=prompt("Pega código HTML:");
  if(!html)return;
  blocks.push(html);
  render();
}

function render(){
  document.getElementById("canvas").innerHTML=blocks.join("");
}

// guardar
function save(){
  let name=prompt("Nombre del sitio:");
  if(!name)return;

  let sites=JSON.parse(localStorage.getItem("sites"))||[];

  let content=blocks.join("");

  let existing=sites.find(s=>s.name===name);

  if(existing){
    existing.content=content;
  } else {
    sites.push({name,content});
  }

  localStorage.setItem("sites",JSON.stringify(sites));

  alert("Guardado ✅");
}
```

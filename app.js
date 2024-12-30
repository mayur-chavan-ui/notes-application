let form = document.querySelector("form");
let btnForm = document.getElementById("btnForm")

let addNoteBtn = document.getElementById("addNoteBtn");
let cardContainer = document.getElementById("cardContainer");
let cardData = document.getElementById("cardData");
let addBtn = document.getElementById("add");
let update = document.getElementById("update");

let title = document.getElementById("title");
let desc = document.getElementById("desc");
let date = document.getElementById("date");

update.style.display = "none";

let noteArray = [];


function handleForm() {
  if (form.style.display === "none") {
    form.style.display = "block"; 
  } else {
    form.style.display = "none"; 
  }
}

btnForm.addEventListener("click", handleForm);

let initialnoteData = getnoteData();

if (initialnoteData.length > 0) {
  noteArray = initialnoteData;
  noteArray.sort((a, b) => new Date(a.date) - new Date(b.date));
  showTableData(initialnoteData);
}

function uuid() {
  var dt = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  return uuid;
}



function getnoteData() {
  if (localStorage.getItem("note")) {
    return JSON.parse(localStorage.getItem("note"));
  }
  return [];
}


function handleCreate(e) {
  e.preventDefault();

  let noteObj = {
    title: title.value,
    desc: desc.value,
    date: date.value,
    id: uuid(),
  };

  noteArray.push(noteObj);
  noteArray.sort((a, b) => new Date(a.date) - new Date(b.date));
  localStorage.setItem("note", JSON.stringify(noteArray));
  showTableData(noteArray);
  form.reset();
  // alert("clicked");
}

form.addEventListener("submit", handleCreate);



function handleEdit(e) {
  let getId = e.getAttribute("data-id");

  localStorage.setItem("id", getId);

  let getLocalData = getnoteData();

  let getLocalObj = getLocalData.find((note) => note.id === getId);

  title.value = getLocalObj.title;
  desc.value = getLocalObj.desc;
  date.value = getLocalObj.date;

  getLocalData.sort((a, b) => new Date(a.date) - new Date(b.date));

  addBtn.style.display = "none";
  update.style.display = "block";
}

function handleUpdate() {
  let getId = localStorage.getItem("id");

  let getLocalData = getnoteData();

  let getLocalObj = getLocalData.find((note) => note.id === getId);

  if (getLocalObj) {
    getLocalObj.title = title.value;
    getLocalObj.desc = desc.value;
    getLocalObj.date = date.value;
  }

  getLocalData.sort((a, b) => new Date(a.date) - new Date(b.date));

  localStorage.setItem("user", JSON.stringify(getLocalData));

  showTableData(getLocalData);
  form.reset();
  addBtn.style.display = "block";
  update.style.display = "none";
}

update.addEventListener("click", handleUpdate);

function handleDelete(e) {
  let getId = e.getAttribute("data-id");

  let getLocalData = getnoteData();


  let modifiedData = getLocalData.filter((note) => note.id !== getId);

  modifiedData.sort((a, b) => new Date(a.date) - new Date(b.date));

  localStorage.setItem("note", JSON.stringify(modifiedData));

  showTableData(modifiedData);
}

function showTableData(data) {
  let result = "";

  data.map((note, i) => {
    result += `
      <div class="card bg-light">
        <div class="fw-bold">
           <small class="float-start bg-warning bg-gradient date">${note.date}</small>
        </div>
         <h5 class="text-uppercase mt-2">${note.title}</h5>
        <p class='text-capitalize'>${note.desc}</p>
        <div class="card-actions">
          <button onclick="handleEdit(this)" data-id="${note.id}" class="btn btn-success btn-md m-2"><i class="fa-regular fa-pen-to-square"></i></button>
          <button onclick="handleDelete(this)" data-id="${note.id}" class="btn btn-danger btn-md"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>
    `;
  });


  document.getElementById("cardData").innerHTML = result;
}




const clear = document.querySelector(".clear");
const dateElement = document.getElementById("date");
const list = document.getElementById("list");
const input = document.getElementById("input");
const noIncomplete = document.getElementById("noIncompleteToDo");

const lineThrough = "lineThrough";
const check = "fa-check-circle";
const uncheck = "fa-circle-o";

let LIST = [];
let id = 0;

let data = localStorage.getItem("TODO");
if(data){
  LIST = JSON.parse(data);
  id = LIST.length;
  loadList(LIST);
  updateCompleted(LIST);
} else{
  LIST = [];
  id = 0;
}

function loadList(array){
  array.forEach(function(item){
    createToDo(item.name, item.id, item.done, item.trash);
  });
}

function updateCompleted(toDoList){
  const incompleteArray = toDoList.filter((item)=>{
    return item.done == false && item.trash == false;
  });
  noIncomplete.innerHTML = incompleteArray.length;
}

clear.addEventListener("click", function(){
  localStorage.clear();
  location.reload();
})


const today = new Date();
const options = {
  weekday: "long",
  month: "short",
  day: "numeric"
};
dateElement.innerHTML = today.toLocaleDateString("en-US", options);

function createToDo(toDo, id, done, trash){

  if(trash){ return; }

  const DONE = done ? check : uncheck;
  const LINE = done ? lineThrough : "";

  const item = `<li class="item">
    <i class="fa ${DONE} complete" aria-hidden="true" job="complete" id="${id}"></i>
    <p class="text ${LINE}">${toDo}</p>
    <i class="fa fa-trash delete" aria-hidden="true" job="delete" id="${id}"></i>
  </li>`;
  const position = "beforeend";
  list.insertAdjacentHTML(position, item);
}

document.addEventListener("keyup", function(event){
  if (event.key== "Enter") {
    const to_do = input.value;
    if (to_do) {
      createToDo(to_do, id, false, false);

      LIST.push({
        name : to_do,
        id : id,
        done : false,
        trash : false
      });
      localStorage.setItem("TODO", JSON.stringify(LIST));
      updateCompleted(LIST);
      id++;
    }
    input.value = "";
  }
});

function completeToDo(element){
  element.classList.toggle(check);
  element.classList.toggle(uncheck);
  element.parentNode.querySelector(".text").classList.toggle(lineThrough);

  LIST[element.id].done = LIST[element.id].done ? false : true;
}

function removeToDo(element){
  element.parentNode.parentNode.removeChild(element.parentNode);

  LIST[element.id].trash = true;
}

list.addEventListener("click", function(event){
  const element = event.target;
  const elementJob = element.attributes.job.value;

  if(elementJob == "complete"){
    completeToDo(element);
  } else if(elementJob == "delete"){
    removeToDo(element);
  }
  localStorage.setItem("TODO", JSON.stringify(LIST));
  updateCompleted(LIST);
})

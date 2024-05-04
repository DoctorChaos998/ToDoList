const addToDoForm = document.getElementById('form');
const addToDoInput = document.getElementById('input');
const toDoList = document.getElementById('toDoList');
let toDoListData = [];
function crateToDoNode(toDoTitle) {
    const newToDoContainer = document.createElement('li');
    newToDoContainer.className = 'toDoContainer';
    const newToDoCompleteButton = document.createElement('button');
    newToDoCompleteButton.innerHTML = '<span class="material-symbols-outlined">radio_button_unchecked</span>';
    newToDoCompleteButton.className = 'toDoCompleteButton';
    const newToDoDeleteButton = document.createElement('button');
    newToDoDeleteButton.innerHTML = '<span class="material-symbols-outlined">clear</span>';
    newToDoDeleteButton.className = 'toDoDeleteButton';
    const newToDo = document.createElement('span');
    newToDo.innerText = toDoTitle;
    newToDo.className = 'toDo';
    newToDoContainer.appendChild(newToDoCompleteButton);
    newToDoContainer.appendChild(newToDo);
    newToDoContainer.appendChild(newToDoDeleteButton);
    return {newToDoContainer, newToDoDeleteButton, newToDoCompleteButton, newToDo};
}

function toggleToDo(event, id) {
    console.log(id)
    if(toDoListData[id].isComplete){
        toDoListData[id].isComplete = false;
        event.target.innerHTML = '<span class="material-symbols-outlined">radio_button_unchecked</span>'
    }
    else {
        toDoListData[id].isComplete = true;
        event.target.innerHTML = '<span class="material-symbols-outlined">radio_button_checked</span>'
    }
}

function removeToDo(event, id, toDoContainer) {
    toDoListData = toDoListData.filter((toDo) => toDo.id !== id);
    toDoContainer.remove();
}
function addToDo(event) {
    event.preventDefault();
    if(!addToDoInput.value.trim()) return;
    const toDoTitle = addToDoInput.value;
    const {newToDoContainer, newToDoDeleteButton, newToDoCompleteButton, newToDo} = crateToDoNode(toDoTitle);
    const newToDoId = toDoListData.length;
    toDoListData.push({id: newToDoId, title: toDoTitle, isComplete: false});
    newToDoCompleteButton.addEventListener('click', (event) => toggleToDo(event, newToDoId));
    newToDoDeleteButton.addEventListener('click', (event) => removeToDo(event, newToDoId, newToDoContainer));
    toDoList.appendChild(newToDoContainer);
}

addToDoForm.addEventListener('submit', addToDo);
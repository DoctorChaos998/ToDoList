const addToDoForm = document.getElementById('form');
const addToDoInput = document.getElementById('input');
const toDoList = document.getElementById('toDoList');
const toggleAllToDoButton = document.getElementById('toggleAllToDo');
const helperContainer = document.getElementById('helper');
const toDoCount = document.getElementById('count');
const clearCompletedToDo = document.getElementById('clearCompleted');

let toDoListData = [];
let currentNewId = 0;
function getNewId() {
    return currentNewId++;
}
function createToDoNode(toDoTitle, toDoId) {
    const newToDoContainer = document.createElement('li');
    newToDoContainer.className = 'toDoContainer';
    newToDoContainer.id = toDoId

    const newToDoCompleteButton = document.createElement('button');
    newToDoCompleteButton.innerHTML = '<span class="material-symbols-outlined">radio_button_unchecked</span>';
    newToDoCompleteButton.className = 'toDoCompleteButton';

    const newToDoDeleteButton = document.createElement('button');
    newToDoDeleteButton.innerHTML = '<span class="material-symbols-outlined">clear</span>';
    newToDoDeleteButton.className = 'toDoDeleteButton';

    const newToDo = document.createElement('span');
    newToDo.innerText = toDoTitle;
    newToDo.className = 'toDo';

    newToDoCompleteButton.addEventListener('click', (event) => toggleToDo(event, toDoId, newToDo));
    newToDoDeleteButton.addEventListener('click', (event) => removeToDo(event, toDoId, newToDoContainer));

    newToDoContainer.appendChild(newToDoCompleteButton);
    newToDoContainer.appendChild(newToDo);
    newToDoContainer.appendChild(newToDoDeleteButton);
    toDoList.appendChild(newToDoContainer);
}

function toggleToDo(event, id, toDo) {
    const toDoData = toDoListData.find(toDo => toDo.id === id);
    if(toDoData.isComplete){
        toDoData.isComplete = false;
        event.target.innerHTML = '<span class="material-symbols-outlined">radio_button_unchecked</span>';
        toDo.classList.remove('completeToDo');
    }
    else {
        toDoData.isComplete = true;
        event.target.innerHTML = '<span class="material-symbols-outlined">radio_button_checked</span>';
        toDo.classList.add('completeToDo');
    }
    changeActiveToDoCount();
    checkDisplayClearButton();
}

function toggleAllToDo() {
    const activeToDoIdList = toDoListData.filter((toDo) => !toDo.isComplete);
    if(activeToDoIdList.length){
        activeToDoIdList.forEach(toDo => {
            const toDoContainer = document.getElementById(toDo.id);
            const allChildren = toDoContainer.children;
            allChildren[0].innerHTML = '<span class="material-symbols-outlined">radio_button_checked</span>';
            allChildren[1].classList.add('completeToDo');
            toDo.isComplete = true;
        });
    }
    else {
        toDoListData.forEach(toDo => {
            const toDoContainer = document.getElementById(toDo.id);
            const allChildren = toDoContainer.children;
            allChildren[0].innerHTML = '<span class="material-symbols-outlined">radio_button_unchecked</span>';
            allChildren[1].classList.remove('completeToDo');
            toDo.isComplete = false;
        })
    }
    changeActiveToDoCount();
    checkDisplayClearButton();
}

function removeToDo(event, id, toDoContainer) {
    toDoListData = toDoListData.filter((toDo) => toDo.id !== id);
    toDoContainer.remove();
    checkDisplayHelper();
    changeActiveToDoCount();
    checkDisplayClearButton();
}
function addToDo(event) {
    event.preventDefault();
    if(!addToDoInput.value.trim()) return;

    const toDoTitle = addToDoInput.value.trim();
    const newToDoId = getNewId();
    toDoListData.push({id: newToDoId, title: toDoTitle, isComplete: false});

    createToDoNode(toDoTitle, newToDoId);
    checkDisplayHelper();
    changeActiveToDoCount();
    addToDoInput.value = '';
}
function clearAllCompleteToDo() {
    toDoListData.forEach(toDo => {
        if(toDo.isComplete === true){
            const toDoContainer = document.getElementById(toDo.id);
            toDoContainer.remove();
        }
    });
    toDoListData = toDoListData.filter(toDo => !toDo.isComplete);
    checkDisplayClearButton();
    checkDisplayHelper();
}
function checkDisplayClearButton() {
    clearCompletedToDo.className = toDoListData.find(toDo => toDo.isComplete === true)?'helperClearButton helperClearButtonActive':'helperClearButton';
}
function checkDisplayHelper(){
    helperContainer.className = toDoListData.length > 0?'toDoHelperContainer toDoHelperContainerActive':'toDoHelperContainer';
}

function changeActiveToDoCount() {
    const activeToDoCount = toDoListData.reduce((acc, toDo) => !toDo.isComplete?++acc:acc, 0);
    toDoCount.innerText = String(activeToDoCount);
}

clearCompletedToDo.addEventListener('click', clearAllCompleteToDo);
addToDoForm.addEventListener('submit', addToDo);
toggleAllToDoButton.addEventListener('click', toggleAllToDo);
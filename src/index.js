const addToDoForm = document.getElementById('form');
const addToDoInput = document.getElementById('input');
const toDoListContainer = document.getElementById('toDoList');
const toggleAllToDoButton = document.getElementById('toggleAllToDo');
const helperContainer = document.getElementById('helper');
const toDoCount = document.getElementById('count');
const clearCompletedToDo = document.getElementById('clearCompleted');
const selectAllFilterButton = document.getElementById('selectAll');
const selectCompletedFilterButton = document.getElementById('selectComplete');
const selectActiveFilterButton = document.getElementById('selectActive')

let toDoList = [];
let currentUniqueToDoId = 0;
function getNewId() {
    return currentUniqueToDoId++;
}
let currentFilter = 'all' // 'all', 'completed', 'active'
function createToDoNode({id, title, isComplete}) {
    const newToDoContainer = document.createElement('li');
    newToDoContainer.className = 'toDoContainer';
    newToDoContainer.id = id

    const newToDoCompleteButton = document.createElement('button');
    newToDoCompleteButton.innerHTML = `<span class="material-symbols-outlined">${isComplete?'radio_button_checked':'radio_button_unchecked'}</span>`;
    newToDoCompleteButton.className = 'toDoCompleteButton';

    const newToDoDeleteButton = document.createElement('button');
    newToDoDeleteButton.innerHTML = '<span class="material-symbols-outlined">clear</span>';
    newToDoDeleteButton.className = 'toDoDeleteButton';

    const newToDo = document.createElement('span');
    newToDo.innerText = title;
    newToDo.className = 'toDo';
    if(isComplete) newToDo.classList.add('completeToDo');

    newToDoCompleteButton.addEventListener('click', () => toggleToDo(id));
    newToDoDeleteButton.addEventListener('click', () => removeToDo(id));
    newToDo.addEventListener('dblclick', () => createRenameInput(id));

    newToDoContainer.appendChild(newToDoCompleteButton);
    newToDoContainer.appendChild(newToDo);
    newToDoContainer.appendChild(newToDoDeleteButton);
    toDoListContainer.appendChild(newToDoContainer);
}

function createRenameInput(toDoId) {
    const input = document.createElement('input');
    input.classList.add('renameToDoInput');
    input.value = toDoList.find(toDo => toDo.id === toDoId).title;
    const toDoContainer = document.getElementById(toDoId);
    input.addEventListener('click', (event) => event.stopPropagation());
    const clickHandler = (event) => {
        if(event.target === input){
            return;
        }
        event.stopPropagation();
        removeInput();
    }
    const removeInput = () => {
        if(!input.value.trim()) removeToDo(toDoId);
        else {
            toDoContainer.children[2].innerText = input.value;
            toDoList.find(toDo => toDo.id === toDoId).title = input.value;
        }
        input.remove();
        toDoContainer.children[1].classList.remove('noneToDo');
        document.removeEventListener('click',  clickHandler, true);
    }
    input.addEventListener('keydown', (event) => {
        if(event.key === 'Enter' || event.key === 'Escape'){
            if(!input.value.trim()) removeToDo(toDoId);
            else{
                toDoContainer.children[2].innerText = input.value;
                toDoList.find(toDo => toDo.id === toDoId).title = input.value;
                removeInput();
            }
        }
    });
    toDoContainer.children[1].classList.add('noneToDo');
    toDoContainer.children[1].insertAdjacentElement('beforebegin', input);
    document.addEventListener('click', clickHandler, true);
    input.focus();
}

function toggleToDo(toDoId) {
    const toDoData = toDoList.find(toDo => toDo.id === toDoId);
    const toDoContainer = document.getElementById(toDoId);
    if(toDoContainer){
        if(currentFilter !== 'all') toDoContainer.remove();
        else {
            if(toDoData.isComplete){
                toDoContainer.children[0].innerHTML = '<span class="material-symbols-outlined">radio_button_unchecked</span>';
                toDoContainer.children[1].classList.remove('completeToDo');
            }
            else {
                toDoContainer.children[0].innerHTML = '<span class="material-symbols-outlined">radio_button_checked</span>';
                toDoContainer.children[1].classList.add('completeToDo');
            }
        }
    }
    toDoData.isComplete = !toDoData.isComplete;
    changeActiveToDoCount();
    checkDisplayClearButton();
}

function toggleAllToDo() {
    const activeToDoIdList = toDoList.filter((toDo) => !toDo.isComplete);
    if(activeToDoIdList.length){
        switch (currentFilter) {
            case 'all': {
                activeToDoIdList.forEach(toDo => {
                    toggleToDo(toDo.id);
                });
                break;
            }
            case 'completed': {
                activeToDoIdList.forEach(toDo => {
                    toDo.isComplete = true;
                });
                renderToDoList(toDoList);
                break;
            }
            case 'active': {
                activeToDoIdList.forEach(toDo => {
                    toDo.isComplete = true;
                });
                toDoListContainer.innerHTML = '';
                break;
            }
        }
    }
    else {
        switch (currentFilter) {
            case 'all': {
                toDoList.forEach(toDo => {
                    toggleToDo(toDo.id);
                });
                break;
            }
            case 'completed': {
                toDoList.forEach(toDo => {
                    toDo.isComplete = false;
                });
                toDoListContainer.innerHTML = '';
                break;
            }
            case 'active': {
                toDoList.forEach(toDo => {
                    toDo.isComplete = false;
                });
                renderToDoList(toDoList);
                break;
            }
        }
    }
    changeActiveToDoCount();
    checkDisplayClearButton();
}

function setFilter(filter){
    if(currentFilter === filter) return;
    switch (filter){
        case 'all':{
            if(currentFilter === 'active') selectActiveFilterButton.classList.remove('helperButtonActive')
            else selectCompletedFilterButton.classList.remove('helperButtonActive');
            selectAllFilterButton.classList.add('helperButtonActive');
            renderToDoList(toDoList)
            break;
        }
        case 'completed':{
            if(currentFilter === 'active') selectActiveFilterButton.classList.remove('helperButtonActive')
            else selectAllFilterButton.classList.remove('helperButtonActive');
            selectCompletedFilterButton.classList.add('helperButtonActive');
            renderToDoList(toDoList.filter(toDo => toDo.isComplete === true));
            break;
        }
        case 'active':{
            if(currentFilter === 'all') selectAllFilterButton.classList.remove('helperButtonActive')
            else selectCompletedFilterButton.classList.remove('helperButtonActive');
            selectActiveFilterButton.classList.add('helperButtonActive');
            renderToDoList(toDoList.filter(toDo => toDo.isComplete === false))
            break;
        }
    }
    currentFilter = filter;
}

function renderToDoList(toDoList){
    toDoListContainer.innerHTML = '';
    toDoList.forEach(toDo => createToDoNode(toDo));
}

function removeToDo(toDoId) {
    toDoList = toDoList.filter((toDo) => toDo.id !== toDoId);
    const toDoContainer = document.getElementById(toDoId);
    if(toDoContainer) toDoContainer.remove();
    checkDisplayHelper();
    changeActiveToDoCount();
    checkDisplayClearButton();
}

function addToDo(event) {
    event.preventDefault();
    if(!addToDoInput.value.trim()) return;
    const toDoTitle = addToDoInput.value.trim();
    const newToDoId = getNewId();
    toDoList.push({id: newToDoId, title: toDoTitle, isComplete: false});
    addToDoInput.value = '';
    if(currentFilter !== 'completed') createToDoNode({id: newToDoId, title: toDoTitle, isComplete: false});
    checkDisplayHelper();
    changeActiveToDoCount();
}
function clearAllCompleteToDo() {
    toDoList.forEach(toDo => {
        if(toDo.isComplete === true){
            removeToDo(toDo.id);
        }
    });
    checkDisplayClearButton();
    checkDisplayHelper();
}
function checkDisplayClearButton() {
    clearCompletedToDo.className = toDoList.find(toDo => toDo.isComplete === true)?'helperClearButton helperClearButtonActive':'helperClearButton';
}
function checkDisplayHelper(){
    helperContainer.className = toDoList.length > 0?'toDoHelperContainer toDoHelperContainerActive':'toDoHelperContainer';
}

function changeActiveToDoCount() {
    toDoCount.innerText = String(toDoList.reduce((acc, toDo) => !toDo.isComplete?++acc:acc, 0));
}

clearCompletedToDo.addEventListener('click', clearAllCompleteToDo);
addToDoForm.addEventListener('submit', addToDo);
toggleAllToDoButton.addEventListener('click', toggleAllToDo);
selectAllFilterButton.addEventListener('click', () => setFilter('all'));
selectActiveFilterButton.addEventListener('click', () => setFilter('active'));
selectCompletedFilterButton.addEventListener('click', () => setFilter('completed'));
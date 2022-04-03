const supabaseUrl = 'https://xzfzgfbderrziniammxq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6ZnpnZmJkZXJyemluaWFtbXhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDc0MDg3ODIsImV4cCI6MTk2Mjk4NDc4Mn0.wW5Vy4Vr6XMvIfBkBEb4PwvxdtzlXfPvKJXWLySoh0s';
supabase = supabase.createClient(supabaseUrl, supabaseKey);

const buttonState = { state: 'all' };
var allTaskCount = 0, completeTaskCount = 0, incompleteTaskCount = 0;
let timer;

async function countingAllTheTask() {
  await countTask();
  await allTask();
}

// window.addEventListener('click', (e)=>{
//   if(e.target.className == 'container-div') {
//       document.getElementById('search-text-area').style.visibility = 'hidden';
//   }
//   });

function addedTaskCart() {

  const container = document.querySelector('.tasks');
  const emptyScreen = document.querySelector('.empty-task');
  const createButton = document.getElementById('create-btn');
  var lastChild;

  loadMoreButtonShow(container);
  createButton.disabled = true;
  disableAllCompleteIncompleteButton();


  if (emptyScreen.style.display == 'flex') {
    emptyScreen.style.display = 'none';
  }

  if (container.childElementCount == 12) {
    lastChild = container.lastChild;
    container.removeChild(lastChild);
  }

  const divCartElement = document.createElement('div');
  divCartElement.className = 'add-task-cart';

  const divCartElementSpinner = document.createElement('div');
  const spinnerImg = document.createElement('img');
  spinnerImg.src = './icons/Vector (8).png';
  spinnerImg.className = 'spinner-img';

  divCartElementSpinner.appendChild(divCartElement);
  divCartElementSpinner.className = 'cart-spinner';
  divCartElementSpinner.appendChild(spinnerImg);

  const divTextArea = document.createElement('div');
  divTextArea.className = 'add-text-area';

  const textArea = document.createElement('textarea');
  textArea.className = 'add-task-item';
  textArea.focus();
  textArea.placeholder = "Enter your Task...";
  textArea.maxLength = "50";
  textArea.cols = "30";
  textArea.rows = "2";

  divTextArea.appendChild(textArea);

  const divButtonContainer = document.createElement('div');
  divButtonContainer.className = 'button-container';

  const btn = document.createElement('button');
  btn.className = 'add-task-btn';
  btn.innerText = "Add Task";

  btn.addEventListener('click', async (e) => {
    if (textArea.value.length > 0) {
      btn.disabled = true;
      createButton.disabled = false;
      let pro = await myFunc(textArea.value, divCartElement, spinnerImg);
      container.removeChild(container.firstChild);
      allTaskCount++;
      incompleteTaskCount++;
      inCompletedTask(pro[0], 0);
      document.getElementById('create-btn').disabled = false;
      loadMoreButtonShow();
    }
  });

  textArea.addEventListener("keypress", function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.target.value.length > 0)
        btn.click();
    }
  });

  const delIcon = document.createElement('img');
  delIcon.className = 'delete-task-btn';
  delIcon.src = "./icons/Vector(5).png";
  delIcon.alt = "Logo";
  const delButton = document.createElement('button');
  delButton.dataset.title = 'Delete this Task';
  delButton.className = 'delete-btn';
  delButton.appendChild(delIcon);

  delButton.addEventListener('click', () => {
    container.removeChild(container.firstChild);
    document.getElementById('create-btn').disabled = false;
    if (container.childElementCount === 0) {
      emptyDisplay();
    }
    else if (lastChild) {
      container.append(lastChild);
    }
    loadMoreButtonShow();
    emptyDisplay();
  });


  divButtonContainer.appendChild(btn);
  divButtonContainer.appendChild(delButton);
  divCartElement.appendChild(divTextArea);
  divCartElement.appendChild(divButtonContainer);

  container.prepend(divCartElementSpinner);
}

async function myFunc(txt, div, img) {
  spinnerOpen(div, img);
  console.log(div, img);
  const { data, error } = await supabase
    .from('todo')
    .insert([
      { task_name: txt }
    ])

  spinnerClose(div, img);
  toast(error);

  return data;
}

// Completed Task

function completedTask(Data, oldDiv) {

  const container = document.querySelector('.tasks');

  const divCartElementSpinner = document.createElement('div');
  const spinnerImg = document.createElement('img');
  spinnerImg.src = './icons/Vector (8).png';
  spinnerImg.className = 'spinner-img';


  const divCartElement = document.createElement('div');
  divCartElement.className = 'add-task-cart';
  divCartElement.setAttribute('data-id', Data.id.toString());

  divCartElementSpinner.appendChild(divCartElement);
  divCartElementSpinner.className = 'cart-spinner';

  divCartElementSpinner.appendChild(spinnerImg);

  const divTodoTitle = document.createElement('div');
  divTodoTitle.className = 'add-todo-title';

  const cartTitle = document.createElement('p');
  cartTitle.innerText = Data.task_name;
  cartTitle.className = 'cmp-todo-title';
  divTodoTitle.appendChild(cartTitle);

  const divCreationDate = document.createElement('div');
  divCreationDate.className = 'created-at-div';

  const createAt = document.createElement('p');
  createAt.innerHTML = "Created At: " + getDate(Data.created_at);
  createAt.className = 'created-at-p';
  divCreationDate.appendChild(createAt);

  const divButtonContainer = document.createElement('div');
  divButtonContainer.className = 'button-container-cmp';

  const delBtnLogo = document.createElement('img');
  delBtnLogo.src = './icons/Vector(5).png';
  const delBtn = document.createElement('button');
  delBtn.dataset.title = 'Delete this Task';
  delBtn.className = 'delete-btn';
  delBtn.appendChild(delBtnLogo);

  divButtonContainer.appendChild(delBtn);

  const cmpTimeContainer = document.createElement('div');
  cmpTimeContainer.className = 'cmp-time-container';
  const cmpTime = document.createElement('p');

  var st;

  if (Data.completed_time < 1) {
    st = "Completed in less than a day";
  }
  else if (Data.completed_time == 1) {
    st = "Completed in a day";
  }
  else {
    st = "Completed in " + Data.completed_time + " days";
  }

  cmpTime.innerText = st;
  cmpTime.className = 'cmpTime';
  cmpTimeContainer.appendChild(cmpTime);
  divButtonContainer.appendChild(cmpTimeContainer);

  divCartElement.appendChild(divTodoTitle);
  divCartElement.appendChild(divCreationDate);
  divCartElement.appendChild(divButtonContainer);

  if (typeof oldDiv == 'undefined') {
    container.appendChild(divCartElementSpinner);
  }
  else {
    console.log(oldDiv);
    console.log(container);
    console.log(divCartElementSpinner);
    container.replaceChild(divCartElementSpinner, oldDiv);
  }

  delBtn.addEventListener('click', async (e) => {
    
    loadMoreButtonShow();
    allTaskCount--;
    completeTaskCount--;
    spinnerOpen(divCartElement, spinnerImg);
    const { data, error } = await supabase
      .from('todo')
      .delete()
      .match({ id: Data.id })

    await replaceAfterDelete(container, divCartElementSpinner);

    spinnerClose(divCartElement, spinnerImg);

    toast(error);

    if (error == null) {
      container.removeChild(divCartElementSpinner);
    }
    loadMoreButtonShow();
    showLessButtonShow();
    emptyDisplay();
  });
}


// Edited Task Cart

function editedTask(oldDiv, Data) {
  const container = document.querySelector('.tasks');

  const divCartElement = document.createElement('div');
  divCartElement.className = 'add-task-cart';

  const divCartElementSpinner = document.createElement('div');
  const spinnerImg = document.createElement('img');
  spinnerImg.src = './icons/Vector (8).png';
  spinnerImg.className = 'spinner-img';
  divCartElementSpinner.appendChild(divCartElement);
  divCartElementSpinner.className = 'cart-spinner';
  divCartElementSpinner.appendChild(spinnerImg);


  const divTextArea = document.createElement('div');
  divTextArea.className = 'add-text-area';

  const textArea = document.createElement('textarea');
  textArea.className = 'add-task-item';
  textArea.placeholder = "Enter your Task...";
  textArea.maxLength = "50";
  textArea.cols = "30";
  textArea.rows = "2";
  textArea.innerText = oldDiv.firstChild.firstChild.firstChild.innerText;
  const end = textArea.value.length;
  textArea.autofocus = true;
  textArea.setSelectionRange(end, end);
  textArea.focus();

  divTextArea.appendChild(textArea);

  textArea.addEventListener("keypress", function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.target.value.length > 0)
        saveBtn.click();
    }
  });


  divCartElement.appendChild(divTextArea);

  const divButtonContainer = document.createElement('div');
  divButtonContainer.className = 'edit-div-button';

  const saveBtn = document.createElement('button');
  saveBtn.innerText = 'Save';
  saveBtn.className = 'save-btn';
  const cmpBtnLogo = document.createElement('img');
  cmpBtnLogo.src = './icons/Vector (7).png';
  cmpBtnLogo.className = 'cmp-btn-edit'
  const cmpBtn = document.createElement('button');
  cmpBtn.className = 'complete-btn';
  cmpBtn.dataset.title = 'Complete this Task';
  cmpBtn.appendChild(cmpBtnLogo);
  const delBtnLogo = document.createElement('img');
  delBtnLogo.src = './icons/Vector(5).png';
  delBtnLogo.className = 'del-btn-edit';
  const delBtn = document.createElement('button');
  delBtn.dataset.title = "Delete this Task";
  delBtn.className = 'delete-btn';
  delBtn.appendChild(delBtnLogo);

  divButtonContainer.appendChild(saveBtn);
  divButtonContainer.appendChild(cmpBtn);
  divButtonContainer.appendChild(delBtn);

  divCartElement.appendChild(divButtonContainer);

  saveBtn.addEventListener('click', async (e) => {
    if (oldDiv.firstChild.firstChild.firstChild.innerText != textArea.value && textArea.value.length > 0) {
      spinnerOpen(divCartElement, spinnerImg);
      const { data, error } = await supabase
        .from('todo')
        .update({ task_name: textArea.value })
        .match({ id: parseInt(oldDiv.firstChild.dataset.id) })
      spinnerClose(divCartElement, spinnerImg);
      toast(error);
      oldDiv.firstChild.firstChild.firstChild.innerText = textArea.value;
    }
    container.replaceChild(oldDiv, divCartElementSpinner);
  });

  cmpBtn.addEventListener('click', async (e) => {
    completeTaskCount++;
    incompleteTaskCount--;
    var completedTime = getDifference(new Date(Data.created_at), new Date());
    console.log(typeof completedTime)

    if (oldDiv.firstChild.firstChild.firstChild.innerText != textArea.value) {
      spinnerOpen(divCartElement, spinnerImg);
      const { data, error } = await supabase
        .from('todo')
        .update({ task_name: textArea.value, completed_time: completedTime, is_completed: true })
        .match({ id: parseInt(Data.id) })
      spinnerClose(divCartElement, spinnerImg);
      toast(error);
      Data = data[0];
    }
    else {
      spinnerOpen(divCartElement, spinnerImg);
      const { data, error } = await supabase
        .from('todo')
        .update({ is_completed: true })
        .match({ id: parseInt(Data.id) })
      spinnerClose(divCartElement, spinnerImg);
      toast(error);
    }
    if (buttonState.state != 'incmp') {
      completedTask(Data, divCartElementSpinner);
    } else {
      divCartElementSpinner.remove();
    }
    loadMoreButtonShow(container);
    emptyDisplay();
  });

  delBtn.addEventListener('click', async (e) => {
    loadMoreButtonShow();
    allTaskCount--;
    incompleteTaskCount--;
    spinnerOpen(divCartElement, spinnerImg);
    const { data, error } = await supabase
      .from('todo')
      .delete()
      .match({ id: Data.id })
    spinnerClose(divCartElement, spinnerImg);
    toast(error);
    divCartElementSpinner.remove();

    loadMoreButtonShow();
    emptyDisplay();
  });

  return divCartElementSpinner;
}


// Incompleted Task Cart

function inCompletedTask(Data, flag) {
  const container = document.querySelector('.tasks');


  const divCartElement = document.createElement('div');
  divCartElement.className = 'add-task-cart';
  divCartElement.setAttribute('data-id', Data.id.toString());

  const divCartElementSpinner = document.createElement('div');
  const spinnerImg = document.createElement('img');
  spinnerImg.src = './icons/Vector (8).png';
  spinnerImg.className = 'spinner-img';
  divCartElementSpinner.appendChild(divCartElement);
  divCartElementSpinner.className = 'cart-spinner';

  divCartElementSpinner.appendChild(spinnerImg);

  const divTodoTitle = document.createElement('div');
  divTodoTitle.className = 'add-todo-title';

  const cartTitle = document.createElement('p');
  cartTitle.innerText = Data.task_name;
  cartTitle.className = 'todo-title';
  divTodoTitle.appendChild(cartTitle);

  const divCreationDate = document.createElement('div');
  divCreationDate.className = 'created-at-div';

  const createAt = document.createElement('p');
  createAt.innerHTML = "Created At: " + getDate(Data.created_at);
  createAt.className = 'created-at-p';
  divCreationDate.appendChild(createAt);

  const divButtonContainer = document.createElement('div');
  divButtonContainer.className = 'button-container-incmp';

  const cmpBtnLogo = document.createElement('img');
  cmpBtnLogo.className = 'cmp-btn-edit';
  cmpBtnLogo.src = './icons/Vector (7).png';
  const cmpBtn = document.createElement('button');
  cmpBtn.className = 'complete-btn';
  cmpBtn.dataset.title = "Complete this Task";
  cmpBtn.appendChild(cmpBtnLogo);

  const editBtnLogo = document.createElement('img');
  editBtnLogo.className = 'edit-btn';
  editBtnLogo.src = './icons/Vector (6).png';
  const editBtn = document.createElement('button');
  editBtn.className = 'edit-btn';
  editBtn.dataset.title = "Edit this Task";
  editBtn.appendChild(editBtnLogo);

  const delBtnlogo = document.createElement('img');
  delBtnlogo.className = 'del-btn-edit';
  delBtnlogo.src = './icons/Vector(5).png';
  const delBtn = document.createElement('button');
  delBtn.className = 'delete-btn';
  delBtn.dataset.title = 'Delete this Task';
  delBtn.appendChild(delBtnlogo);

  divButtonContainer.appendChild(cmpBtn);
  divButtonContainer.appendChild(editBtn);
  divButtonContainer.appendChild(delBtn);

  divCartElement.appendChild(divTodoTitle);
  divCartElement.appendChild(divCreationDate);
  divCartElement.appendChild(divButtonContainer);

  if (buttonState.state != 'cmp') {
    if (allTaskCount > 12 && !document.querySelector('.load-more-button')) {

    }
    if (!flag) container.prepend(divCartElementSpinner);
    else container.appendChild(divCartElementSpinner);
  }
  else {
    divCartElementSpinner.remove();
  }

  delBtn.addEventListener('click', async (e) => {
    loadMoreButtonShow();
    allTaskCount--;
    incompleteTaskCount--;
    spinnerOpen(divCartElement, spinnerImg);
    const { data, error } = await supabase
      .from('todo')
      .delete()
      .match({ id: parseInt(Data.id) })

    await replaceAfterDelete(container, divCartElementSpinner);

    spinnerClose(divCartElement, spinnerImg);
    toast(error);
    if (error == null) {
      container.removeChild(divCartElementSpinner);
    }
    loadMoreButtonShow();
    emptyDisplay();
  });

  editBtn.addEventListener('click', async (e) => {
    console.log("hello");
    container.replaceChild(editedTask(divCartElementSpinner, Data), divCartElementSpinner);
  });

  cmpBtn.addEventListener('click', async (e) => {
    completeTaskCount++;
    incompleteTaskCount--;
    var completedTime = getDifference(new Date(Data.created_at), new Date());
    console.log(typeof completedTime)
    spinnerOpen(divCartElement, spinnerImg);
    const { data, error } = await supabase
      .from('todo')
      .update({ is_completed: true, completed_time: completedTime })
      .match({ id: parseInt(divCartElement.dataset.id) })

    toast(error);
    Data = data[0];

    if (buttonState.state === 'all') {
      completedTask(Data, divCartElementSpinner);
    } else {
      await replaceAfterDelete(container, divCartElementSpinner);
      container.removeChild(divCartElementSpinner);

    }

    spinnerClose(divCartElement, spinnerImg);

    emptyDisplay();
    loadMoreButtonShow();
  });
}


async function replaceAfterDelete(container, divCartElementSpinner) {

  var findVal = 15000;
  if (container.hasChildNodes()) {
    findVal = parseInt(container.lastChild.firstChild.dataset.id);
  }

  if (buttonState.state == 'all' && allTaskCount >= 12) {
    const { data: addedData, error: addedError } = await supabase
      .from('todo')
      .select()
      .lt('id', findVal)
      .limit(1)
      .order('id', { ascending: false })
    console.log(findVal)
    if (addedData.length > 0 && addedData[0].is_completed == false) {
      inCompletedTask(addedData[0], 1);
    }
    else if (addedData.length > 0 && addedData[0].is_completed == true) {
      completedTask(addedData[0]);
    }
  }
  else if (buttonState.state == 'cmp' && completeTaskCount >= 12) {
    const { data, error } = await supabase
      .from('todo')
      .select()
      .lt('id', findVal)
      .match({ is_completed: true })
      .limit(1)
      .order('id', { ascending: false })

    completedTask(data[0]);
  }
  else if (buttonState.state == 'incmp' && incompleteTaskCount >= 12) {
    const { data, error } = await supabase
      .from('todo')
      .select()
      .lt('id', findVal)
      .match({ is_completed: false })
      .limit(1)
      .order('id', { ascending: false })

    inCompletedTask(data[0], 1);
  }
}


// Empty Display Showing

async function emptyDisplay(searchedWord) {
  const container = document.querySelector('.tasks');
  const emptyScreen = document.querySelector('.empty-task');
  const emptyTitle = document.querySelector('.empty-head');
console.log(searchedWord)
  if (searchedWord && !container.hasChildNodes()) {
    emptyTitle.innerText = "The task  " + searchedWord + " doesn't found.";
    emptyScreen.style.display = 'flex';
  }
  else if (buttonState.state == 'all' && allTaskCount == 0 && container.childElementCount == 0) {
    emptyTitle.innerText = "You didn't add any task. Please, add one.";
    emptyScreen.style.display = 'flex';
  }
  else if (buttonState.state == 'cmp' && completeTaskCount == 0 && container.childElementCount == 0) {
    emptyTitle.innerText = "You didn't add any completed task. Please, complete one.";
    emptyScreen.style.display = 'flex';
  }
  else if (buttonState.state == 'incmp' && incompleteTaskCount == 0 && container.childElementCount == 0) {
    emptyTitle.innerText = "You didn't add any incompleted task. Please, add one.";
    emptyScreen.style.display = 'flex';
  }
  else if (emptyScreen) {
    emptyScreen.style.display = 'none';
  }
}

async function countTask() {
  mainSpinnerOpen();
  const { data, error } = await supabase
    .from('todo')
    .select()
    .order('id', { ascending: false })
  mainSpinnerClose();

  allTaskCount = data.length;
  for (var result of data) {
    if (result.is_completed == true) {
      completeTaskCount++;
    }
  }
  incompleteTaskCount = allTaskCount - completeTaskCount;
}

async function addAllTask() {

  const container = document.querySelector('.tasks');
  const searchTask = document.querySelector('#search-text-area');

  while (container.hasChildNodes()) {
    container.removeChild(container.firstChild);
  }
  if(document.querySelector('.load-more-div').style.display == 'flex') {
    document.querySelector('.load-more-div').style.display = 'none';
  }

  if (searchTask.value.length > 0) {
      const searchWord = searchTask.value;
      mainSpinnerOpen();
      const { data, error } = await supabase
        .from('todo')
        .select()
        .ilike('task_name', '%' + searchWord + '%')
        .order('id', { ascending: false })
      mainSpinnerClose();

      for (var i = 0; i < data.length; i++) {
        if (i == 12) break;
        if (data[i].is_completed) completedTask(data[i]);
        else inCompletedTask(data[i], 1);
      }
      loadMoreButtonShow(data.length);
      emptyDisplay(searchWord);
  }

  else {
    mainSpinnerOpen();
    const { data, error } = await supabase
      .from('todo')
      .select()
      .order('id', { ascending: false })
      .limit(12)
    mainSpinnerClose();
    for (let x of data) {
      if (x.is_completed === true) {
        completedTask(x);
      }
      else {
        inCompletedTask(x, 1);
      }
    }
    loadMoreButtonShow();
    emptyDisplay();
  }
}


// incomplete filter button


async function inCmpTask() {

  document.getElementById('all-btn').style.background = '#FFFFFF';
  document.getElementById('com-btn').style.background = '#FFFFFF';
  document.getElementById('incom-btn').style.background = '#DDE2FF';
  const container = document.querySelector('.tasks');
  loadMoreButtonShow();
  showLessButtonShow();


  buttonState.state = 'incmp';

  while (container.hasChildNodes()) {
    container.removeChild(container.firstChild);
  }
  if(document.querySelector('.load-more-div').style.display == 'flex') {
    document.querySelector('.load-more-div').style.display = 'none';
  }

  const searchTask = document.querySelector('#search-text-area');

  if (searchTask.value.length > 0) {
    const searchWord = searchTask.value;

    mainSpinnerOpen();
    const { data, error } = await supabase
      .from('todo')
      .select()
      .ilike('task_name', '%' + searchWord + '%')
      .match({ is_completed: false })
      .order('id', { ascending: false })
    mainSpinnerClose();

    for (var i = 0; i < data.length; i++) {
      if (i == 12) break;
      inCompletedTask(data[i]);
    }
    loadMoreButtonShow(data.length);
    emptyDisplay(searchWord);
  }
  else {

    mainSpinnerOpen();

  const { data, error } = await supabase
    .from('todo')
    .select()
    .match({ is_completed: false })
    .order('id', { ascending: false })
    .limit(12)

  mainSpinnerClose();

    for (let x of data) {
      inCompletedTask(x, 1);
    }
    console.log(incompleteTaskCount, completeTaskCount, allTaskCount);
    loadMoreButtonShow();
    emptyDisplay();
  }
}


// all filter button


async function allTask() {
  buttonState.state = 'all';
  await addAllTask();
  document.getElementById('all-btn').style.background = '#DDE2FF';
  document.getElementById('com-btn').style.background = '#FFFFFF';
  document.getElementById('incom-btn').style.background = '#FFFFFF';
}

async function cmpTask() {
  document.getElementById('all-btn').style.background = '#FFFFFF';
  document.getElementById('com-btn').style.background = '#DDE2FF';
  document.getElementById('incom-btn').style.background = '#FFFFFF';
  buttonState.state = 'cmp';
  const container = document.querySelector('.tasks');
  const searchTask = document.querySelector('#search-text-area');
  loadMoreButtonShow();
  showLessButtonShow();

  while (container.hasChildNodes()) {
    container.removeChild(container.firstChild);
  }
  if(document.querySelector('.load-more-div').style.display == 'flex') {
    document.querySelector('.load-more-div').style.display = 'none';
  }

  if (searchTask.value.length > 0) {
    const searchWord = searchTask.value;

    mainSpinnerOpen();

    const { data, error } = await supabase
      .from('todo')
      .select()
      .ilike('task_name', '%' + searchWord + '%')
      .match({ is_completed: true })
      .order('id', { ascending: false })
    mainSpinnerClose();

    for (var i = 0; i < data.length; i++) {
      if (i == 12) break;
      completedTask(data[i]);
    }
    loadMoreButtonShow(data.length);
    emptyDisplay(searchWord);
  }
  else {
    mainSpinnerOpen();

  const { data, error } = await supabase
    .from('todo')
    .select()
    .match({ is_completed: true })
    .order('id', { ascending: false })
    .limit(12)

  mainSpinnerClose();

    for (let x of data) {
      completedTask(x);
    }

    loadMoreButtonShow();
    emptyDisplay();
  }

  
}

async function searchImg() {
  const searchTextArea = document.querySelector('#search-text-area');

  if (searchTextArea.style.visibility === 'hidden') {
    searchTextArea.style.visibility = 'visible';
    searchTextArea.focus();
  }
  else {
    searchTextArea.value = "";
    searchTextArea.style.visibility = 'hidden';

    if (buttonState.state == 'all') allTask();
    else if (buttonState.state == 'incmp') inCmpTask();
    else cmpTask();
  }

  searchTextArea.addEventListener('keyup', function (e) {
    console.log(e);
    clearTimeout(timer);

    timer = setTimeout(() => { searchTask(e) }, 1000);
  });
}


async function searchTask(e) {
  const loadMoreDiv = document.querySelector('.load-more-div');
  if(loadMoreDiv) loadMoreDiv.style.display = 'none';
  var searchWord = e.target.value;
  const container = document.querySelector('.tasks');

  while (container.hasChildNodes()) {
    container.removeChild(container.firstChild);
  }

  if (buttonState.state == 'all') {
    
    mainSpinnerOpen();
    const { data, error } = await supabase
      .from('todo')
      .select()
      .ilike('task_name', '%' + searchWord + '%')
      .order('id', { ascending: false })

    mainSpinnerClose();

    for (var i = 0; i < data.length; i++) {
      if (i == 12) break;
      if (data[i].is_completed) completedTask(data[i]);
      else inCompletedTask(data[i], 1);
    }
    loadMoreButtonShow(data.length);
  }
  else if (buttonState.state == 'incmp') {
    mainSpinnerOpen();
    const { data, error } = await supabase
      .from('todo')
      .select()
      .ilike('task_name', '%' + searchWord + '%')
      .match({ is_completed: false })
      .order('id', { ascending: false })
    mainSpinnerClose();
    for (var i = 0; i < data.length; i++) {
      if (i == 12) break;
      inCompletedTask(data[i], 1);
    }
    loadMoreButtonShow(data.length);
  }
  else {
    mainSpinnerOpen();
    const { data, error } = await supabase
      .from('todo')
      .select()
      .ilike('task_name', '%' + searchWord + '%')
      .match({ is_completed: true })
      .order('id', { ascending: false })
    mainSpinnerClose();
    for (var i = 0; i < data.length; i++) {
      if (i == 12) break;
      completedTask(data[i]);
    }
    loadMoreButtonShow(data.length);
  }
  emptyDisplay(searchWord);
}

async function loadMore() {

  var findVal = 500;
  const container = document.querySelector('.tasks');
  if (container.hasChildNodes()) {
    findVal = parseInt(container.lastChild.firstChild.dataset.id);
  }

  if (buttonState.state == 'all') {
    mainSpinnerOpen();
    const { data, error } = await supabase
      .from('todo')
      .select()
      .lt('id', findVal)
      .limit(12)
      .order('id', { ascending: false })
    mainSpinnerClose()

    for (let x of data) {
      if (x.is_completed === true) {
        completedTask(x);
      }
      else {
        inCompletedTask(x, 1);
      }
    }
  }
  else if (buttonState.state == 'cmp') {
    mainSpinnerOpen();
    const { data, error } = await supabase
      .from('todo')
      .select()
      .lt('id', findVal)
      .match({ is_completed: true })
      .limit(12)
      .order('id', { ascending: false })
    mainSpinnerClose()

    for (let x of data) {
      completedTask(x);
    }
  }
  else {
    mainSpinnerOpen();
    const { data, error } = await supabase
      .from('todo')
      .select()
      .lt('id', findVal)
      .match({ is_completed: false })
      .limit(12)
      .order('id', { ascending: false })
    mainSpinnerClose()

    for (let x of data) {
      inCompletedTask(x, 1);
    }
  }
  loadMoreButtonShow(container);
}

function getDate(date) {
  var d = new Date(date);
  var st = d.getDate() + '-' + ((d.getMonth() + 1) < 10 ? ('0' + (d.getMonth() + 1)) : (d.getMonth() + 1)) + '-' + d.getFullYear();
  return st;
}

function getDifference(date1, date2) {
  var date = (date2 - date1) / (1000 * 60 * 60 * 24);
  return parseInt(date);
}

function spinnerOpen(div, img) {
  div.style.opacity = .5;
  img.style.display = 'block';
}

function spinnerClose(div, img) {
  div.style.opacity = 0;
  img.style.display = 'none';
}

function mainSpinnerOpen() {
  document.querySelector(".container-div").style.opacity = .5;
  document.getElementById("main-spinner").style.display = 'block';

}

function mainSpinnerClose() {
  document.querySelector(".container-div").style.opacity = 1;
  document.getElementById("main-spinner").style.display = 'none';
}

function toast(err) {
  console.log(err);
  if (err) {
    document.getElementById('toast-unsuccess').style.display = 'flex';
    setTimeout(function () {
      document.getElementById('toast-unsuccess').style.display = 'none';
    }, 1000);
  } else {
    document.getElementById('toast').style.display = 'flex';
    setTimeout(function () {
      document.getElementById('toast').style.display = 'none';
    }, 500);
  }
}

function disableAllCompleteIncompleteButton() {
  document.getElementById('all-btn').disabled = false;
  document.getElementById('com-btn').disabled = false;
  document.getElementById('incom-btn').disabled = false;
}

function enableAllCompleteIncompleteButton() {
  document.getElementById('all-btn').disabled = true;
  document.getElementById('com-btn').disabled = true;
  document.getElementById('incom-btn').disabled = true;
}

function loadMoreButtonShow(container) {
  const loadMoreDiv = document.querySelector('.load-more-div');
  const showLessDiv = document.querySelector('.show-less-div');

  console.log(typeof container)
  if(typeof container == 'number') {
      if(container > 12)  loadMoreDiv.style.display = 'flex'; 
      else loadMoreDiv.style.display = 'none';
  }
  else if (container && container.childElementCount === 0 && loadMoreDiv.style.display == 'flex') {
    loadMoreDiv.style.display = 'none';
  }
  else if (showLessDiv && showLessDiv.style.display == 'flex') {
    return;
  }
  else if (container && container.childElementCount == 12) {
    loadMoreDiv.style.display = 'flex';
  }
  else if ((container && buttonState.state == 'all' && allTaskCount == container.childElementCount) ||
    (container && buttonState.state == 'cmp' && completeTaskCount == container.childElementCount) ||
    (container && buttonState.state == 'incmp' && incompleteTaskCount == container.childElementCount)) {
    loadMoreDiv.style.display = 'none';
  }
  else if (buttonState.state == 'all' && allTaskCount > 12) {
    loadMoreDiv.style.display = 'flex';
  }
  else if (buttonState.state == 'cmp' && completeTaskCount > 12) {
    loadMoreDiv.style.display = 'flex';
  }
  else if (buttonState.state == 'incmp' && incompleteTaskCount > 12) {
    loadMoreDiv.style.display = 'flex';
  }
  else if (loadMoreDiv.style.display === 'flex') {
    loadMoreDiv.style.display = 'none';
  }
  showLessButtonShow(container);
}

function showLessButtonShow(container) {
  const showLessDiv = document.querySelector('.show-less-div');
  if (container && ((buttonState.state == 'all' && allTaskCount > 12 && allTaskCount == container.childElementCount) ||
    (buttonState.state == 'cmp' && completeTaskCount > 12 && completeTaskCount == container.childElementCount) ||
    (buttonState.state == 'incmp' && incompleteTaskCount > 12 & incompleteTaskCount == container.childElementCount))) {
    showLessDiv.style.display = 'flex';
  }
  else if (showLessDiv.style.display == 'flex') {
    showLessDiv.style.display = 'none';
  }
}

function showLess() {
  document.querySelector('.show-less-div').style.display = 'none';
  if (buttonState.state == 'all') {
    allTask();
  }
  else if (buttonState.state == 'cmp') {
    cmpTask();
  }
  else {
    inCmpTask();
  }
}
const supabaseUrl = 'https://xzfzgfbderrziniammxq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6ZnpnZmJkZXJyemluaWFtbXhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDc0MDg3ODIsImV4cCI6MTk2Mjk4NDc4Mn0.wW5Vy4Vr6XMvIfBkBEb4PwvxdtzlXfPvKJXWLySoh0s';
supabase = supabase.createClient(supabaseUrl, supabaseKey);

const buttonState = { state: 'all' };
var allTaskCount = 0, completeTaskCount = 0, incompleteTaskCount = 0;


addAllTask();

function addedTaskCart() {

  const container = document.querySelector('.tasks');
  document.getElementById('create-btn').disabled = true;

  disableAllCompleteIncompleteButton();

  
  if (container.hasChildNodes() && container.firstChild.className === 'empty-task') {
    container.removeChild(container.firstChild);
  }
  else if (container.childElementCount === 0) {
    emptyDisplay();
  }
  
  if (container.childElementCount == 12) {
    container.removeChild(container.lastChild);
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
  textArea.autofocus = true;
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
      let pro = await myFunc(textArea.value, divCartElement, spinnerImg);
      container.removeChild(container.firstChild);
      allTaskCount++;
      incompleteTaskCount++;
      inCompletedTask(pro[0], 0);
      document.getElementById('create-btn').disabled = false;
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
    allTaskCount--;
    completeTaskCount--;
    spinnerOpen(divCartElement, spinnerImg);
    const { data, error } = await supabase
      .from('todo')
      .delete()
      .match({ id: Data.id })

    spinnerClose(divCartElement, spinnerImg);

    toast(error);

    if (error == null) {
      container.removeChild(divCartElementSpinner);
    }

    if (container.childElementCount === 0) {
      emptyDisplay();
    }
    console.log(container.childElementCount);
    if (allTaskCount <= 12 && document.querySelector('.load-more-div')) {
      document.querySelector('.load-more-div').remove();
    }
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
    if (oldDiv.firstChild.firstChild.firstChild.innerText != textArea.value) {
      spinnerOpen(divCartElement, spinnerImg);
      const { data, error } = await supabase
        .from('todo')
        .update({ task_name: textArea.value })
        .match({ id: parseInt(oldDiv.firstChild.dataset.id) })
      spinnerClose(divCartElement, spinnerImg);
      toast(error);
    }
    oldDiv.firstChild.firstChild.firstChild.innerText = textArea.value;
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
  });

  delBtn.addEventListener('click', async (e) => {
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
      loadMore();
    }
    if (!flag) container.prepend(divCartElementSpinner);
    else container.appendChild(divCartElementSpinner);
  }
  else {
    divCartElementSpinner.remove();
  }

  delBtn.addEventListener('click', async (e) => {
    allTaskCount--;
    incompleteTaskCount--;
    spinnerOpen(divCartElement, spinnerImg);
    const { data, error } = await supabase
      .from('todo')
      .delete()
      .match({ id: parseInt(Data.id) })

    spinnerClose(divCartElement, spinnerImg);
    toast(error);
    if (error == null) {
      container.removeChild(divCartElementSpinner);
    }
    if (allTaskCount === 0) {
      emptyDisplay();
    }

    if (allTaskCount <= 12 && document.querySelector('.load-more-div')) {
      document.querySelector('.load-more-div').remove();
    }
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
    spinnerClose(divCartElement, spinnerImg);
    toast(error);
    Data = data[0];

    if (buttonState.state === 'all') {
      completedTask(Data, divCartElementSpinner);
    } else {
      container.removeChild(divCartElementSpinner);
    }
  });
}


// Empty Display Showing

async function emptyDisplay() {
  const mainContainer = document.querySelector('.tasks');

  mainSpinnerOpen();
  const { data, count, error } = await supabase
    .from('todo')
    .select('id', { count: 'exact' })
  mainSpinnerClose();
  // toast(error);
  if (count == 0) {
    document.getElementById('all-btn').disabled = true;
    document.getElementById('com-btn').disabled = true;
    document.getElementById('incom-btn').disabled = true;
  }

  const container = document.createElement('div');
  container.className = 'empty-task';

  const emptyImage = document.createElement('img');
  emptyImage.className = 'empty-image'
  emptyImage.src = './icons/empty.png';

  const emptyHead = document.createElement('p');
  emptyHead.innerText = "You didn't add any task. Please, add one.";
  emptyHead.className = 'empty-head';

  container.appendChild(emptyImage);
  container.appendChild(emptyHead);

  mainContainer.appendChild(container);
}


// Empty Display Remove

function emptyDisplayRemove() {
  const container = document.querySelector(".empty-task");
  container.remove();
}

async function hell(data) {
  for(var result of data) {
      if(result.is_completed == true) {
        completeTaskCount++;
      }
  }
}


async function addAllTask() {

  mainSpinnerOpen();
  const { data, error } = await supabase
    .from('todo')
    .select()
    .order('id', { ascending: false })
  mainSpinnerClose();

  allTaskCount = data.length;
  for(var result of data) {
      if(result.is_completed == true) {
        completeTaskCount++;
      }
  }
  incompleteTaskCount = allTaskCount - completeTaskCount;
  data.length = Math.min(12, data.length);

  const container = document.querySelector('.tasks');

  while (container.hasChildNodes()) {
    container.removeChild(container.firstChild);
  }

  const LoadMore = document.querySelector('.load-more-div');
  const searchTask = document.querySelector('#search-text-area');

  // if (searchTask.value.length > 0) {
  //   var i = 0;
  //   for (let x of data) {
  //     if (i == 12) break;
  //     if (x.task_name.search(searchTask.value) > -1) {
  //       if (x.is_completed) completedTask(x);
  //       else inCompletedTask(x, 1);
  //       i++;
  //     }
  //   }

    // if (i === 0) {
    //   emptyDisplay();
    // }



    // if (allTaskCount <= 12 && LoadMore) {
    //   LoadMore.remove();
    // }
    // else if (allTaskCount > 12 && !LoadMore) {
    //   loadMore();
    // }
  // }
  //else {
    for (let x of data) {
      if (x.is_completed === true) {
        completedTask(x);
      }
      else {
        inCompletedTask(x, 1);
      }
    }

    console.log(allTaskCount);

    if (allTaskCount == 0) {
      emptyDisplay();
    }
    if (allTaskCount > 12 && !document.querySelector('.load-more-div')) {
      loadMore();
    }
  //}
}


// incomplete filter button


async function inCmpTask() {

  buttonState.state = 'incmp';

  mainSpinnerOpen();

  const { data, error } = await supabase
    .from('todo')
    .select()
    .match({ is_completed: false })
    .order('id', { ascending: false })
    .limit(12)

  mainSpinnerClose();

  const container = document.querySelector('.tasks');

  while (container.hasChildNodes()) {
    container.removeChild(container.firstChild);
  }

  // while(container.hasChildNodes) {
  //     container.removeChild();
  // }
  const LoadMore = document.querySelector('.load-more-button');
  const searchTask = document.querySelector('#search-text-area');

  console.log(searchTask.value.length);
  // if (searchTask.value.length > 0) {
  //   var i = 0;
  //   for (let x of data) {
  //     if (i == 12) break;
  //     if (x.task_name.search(searchTask.value) > -1) {
  //       i++;
  //       inCompletedTask(x, 1);
  //     }
  //   }

  //   if (i === 0) {
  //     emptyDisplay();
  //   }

  //   if (i < 12 && document.querySelector('.load-more-button')) {
  //     LoadMore.remove();
  //   }
  //   if (i == 12 && !LoadMore) {
  //     loadMore();
  //   }
  // }

  // else {
    for (let x of data) {
      inCompletedTask(x, 1);
    }

    if (incompleteTaskCount === 0) {
      emptyDisplay();
    }
    console.log(incompleteTaskCount, LoadMore);
    if (incompleteTaskCount <= 12 && LoadMore) {
      console.log("hello")
      LoadMore.remove();
    }
  //}
}


// all filter button


function allTask() {
  buttonState.state = 'all';
  addAllTask();
}

async function cmpTask() {
  buttonState.state = 'cmp';

  mainSpinnerOpen();

  const { data, error } = await supabase
    .from('todo')
    .select()
    .match({ is_completed: true })
    .order('id', { ascending: false })
    .limit(12)

  mainSpinnerClose();

  const container = document.querySelector('.tasks');

  while (container.hasChildNodes()) {
    container.removeChild(container.firstChild);
  }

  const LoadMore = document.querySelector('.load-more-button');
  const searchTask = document.querySelector('#search-text-area');

  // if (searchTask.value.length > 0) {
  //   var i = 0;
  //   for (let x of data) {
  //     if (i == 12) break;
  //     if (x.task_name.search(searchTask.value) > -1) {
  //       completedTask(x);
  //       i++;
  //     }
  //   }

  //   if (i === 0) {
  //     emptyDisplay();
  //   }

  //   if (i < 12 && document.querySelector('.load-more-button')) {
  //     LoadMore.remove();
  //   }
  //   if (i == 12 && !LoadMore) {
  //     loadMore();
  //   }
  // }

  // else {
    for (let x of data) {
      completedTask(x);
    }

    if (completeTaskCount === 0) {
      emptyDisplay();
    }

    if (completeTaskCount <= 12 && document.querySelector('.load-more-button')) {
      LoadMore.remove();
    }
    if (completeTaskCount > 12 && !LoadMore) {
      loadMore();
    }
  //}
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

  // mainSpinnerOpen();

  const { data, error } = await supabase
    .from('todo')
    .select()
    .order('id', { ascending: true })

  // mainSpinnerClose();

  searchTextArea.addEventListener('keyup', (e) => { searchTask(e, data) });
}

function searchTask(e, data) {
  var searchWord = e.target.value;


  const container = document.querySelector('.tasks');

  while (container.hasChildNodes()) {
    container.removeChild(container.firstChild);
  }

  if (document.querySelector('.load-more-div')) {
    document.querySelector('.load-more-div').remove();
  }

  let x = 0;
  if (buttonState.state == 'all') {
    for (var i = 0; i < data.length; i++) {
      if (x == 12) break;
      if (data[i].task_name.search(searchWord) > -1) {
        if (data[i].is_completed) completedTask(data[i]);
        else inCompletedTask(data[i]);
        x++;
      }
    }
  }
  else if (buttonState.state == 'incmp') {
    for (var i = 0; i < data.length; i++) {
      if (x == 12) break;
      if (data[i].task_name.search(searchWord) > -1 && data[i].is_completed == false) {
        inCompletedTask(data[i]);
        x++;
      }
    }
  }
  else {
    for (var i = 0; i < data.length; i++) {
      if (x == 12) break;
      if (data[i].task_name.search(searchWord) > -1 && data[i].is_completed == true) {
        completedTask(data[i]);
        x++;
      }
    }
  }
  if (x == 12 && !document.querySelector('.load-more-button')) {
    loadMore();
  }
  if (x == 0) {
    emptyDisplay();
  }
}

function loadMore() {
  const loadMoreDiv = document.createElement('div');
  loadMoreButton = document.createElement('button');
  loadMoreButton.innerText = 'Load More';
  loadMoreDiv.className = 'load-more-div';
  loadMoreButton.className = 'load-more-button';
  loadMoreDiv.appendChild(loadMoreButton);
  document.querySelector('.par-div').appendChild(loadMoreDiv);

  loadMoreButton.addEventListener('click', async (e) => {
    if (buttonState.state == 'all') {
      var findVal = 500;
      const container = document.querySelector('.tasks');
      if (container.hasChildNodes()) {
        findVal = parseInt(container.lastChild.firstChild.dataset.id);
      }


      mainSpinnerOpen();
      const { data, error } = await supabase
        .from('todo')
        .select()
        .lt('id', findVal)
        .limit(12)
        .order('id', { ascending: false })
      mainSpinnerClose()

      var i = 0;
      for (let x of data) {
        if (i == 12) {
          break;
        }
        if (x.is_completed === true) {
          completedTask(x);
        }
        else {
          inCompletedTask(x, 1);
        }
        i++;
      }
      if (allTaskCount === 0) {
        emptyDisplay();
      }
      if (allTaskCount > 24 && !document.querySelector('.load-more-div')) {
        loadMore();
      }
      else if (allTaskCount <= 24 && document.querySelector('.load-more-div')) {
        document.querySelector('.load-more-div').remove();
      }
    }
    else if (buttonState.state == 'cmp') {

    }
    else {

    }
  });
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
    }, 1000);
  }
}

function disableAllCompleteIncompleteButton() {
  document.getElementById('all-btn').disabled = false;
  document.getElementById('com-btn').disabled = false;
  document.getElementById('incom-btn').disabled = false;
}


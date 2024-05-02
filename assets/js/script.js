// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

if (!taskList) {
    taskList = [];
}
if (!nextId) {
    nextId = 1;
}

// Todo: create a function to generate a unique task id
function generateTaskId() {
    return nextId++;

}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const taskCard = $('<div>')
    .addClass('card task-card draggable')
    .attr('id', task.id);
const cardBody = $('<div>').addClass('card-body');
const cardTitle = $('<h5>').addClass('card-title').text(task.title);
const cardDueDate = $('<p>').addClass('card-text').text(task.dueDate);
const cardDescription = $('<p>').addClass('card-text').text(task.description);
const cardDeleteBtn = $('<button>')
    .addClass('btn btn-danger delete')
    .text('Delete')
    .attr('data-task-id', task.id);
cardDeleteBtn.on('click', handleDeleteTask);


if (task.dueDate && task.status !== 'done') {
    const now = dayjs();
    const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');

    
    if (now.isSame(taskDueDate, 'day')) {
        taskCard.addClass('bg-warning text-white');
    } else if (now.isAfter(taskDueDate)) {
        taskCard.addClass('bg-danger text-white');
        cardDeleteBtn.addClass('border-light');
    }
}


cardBody.append(cardTitle, cardDueDate, cardDescription, cardDeleteBtn);
taskCard.append(cardBody);

return taskCard;

      
    }

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    
    $('#todo-cards').empty();
    $('#in-progress-cards').empty();
    $('#done-cards').empty();

    for (const task of taskList) {
        
        const taskCard = createTaskCard(task);

       
        if (task.status === 'to-do') {
            $('#todo-cards').append(taskCard);
        } else if (task.status === 'in-progress') {
            $('#in-progress-cards').append(taskCard);
        } else if (task.status === 'done') {
            $('#done-cards').append(taskCard);
        } else {
            console.error('Invalid task status:', task.status);
        }
    }

    
    $('.task-card').draggable({
        revert: 'invalid',
        zIndex: 1000,
        scroll: false,
        containment: 'document',
        
        helper: function (e) {

        const original = $(e.target).hasClass('ui-draggable')
          ? $(e.target)
          : $(e.target).closest('.ui-draggable');
        
        return original.clone().css({
          width: original.outerWidth(),
        });
      },
    });
    
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault(); 

    const title = $('#taskTitle').val();
    const description = $('#taskDescription').val();
    const dueDate = $('#dueDate').val();

    const newTask = {
        id: generateTaskId(), 
        title: title,
        description: description,
        dueDate: dueDate,
        status: 'to-do' 
    };

    taskList.push(newTask);

    localStorage.setItem('tasks', JSON.stringify(taskList));

    nextId++;

    renderTaskList();

    $('#formModal').modal('hide');

    $('#taskTitle').val('');
    $('#taskDescription').val('');
    $('#dueDate').val('')
   
   
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    const taskId = $(this).attr('data-task-id');
    
    taskList = taskList.filter(task => task.id.toString() !== taskId);
    
    localStorage.setItem('tasks', JSON.stringify(taskList));
    
    renderTaskList();
}
   

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskId = ui.draggable.attr('id');
    const status = $(event.target).attr('id');
    
    const taskIndex = taskList.findIndex(task => task.id.toString() === taskId);
    if (taskIndex !== -1) {
        taskList[taskIndex].status = status;
        
        localStorage.setItem('tasks', JSON.stringify(taskList));
        
        renderTaskList();
    }
        
   
  }
  

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
     renderTaskList(); 

$('#addTaskForm').submit(handleAddTask); 
$('.delete').click(handleDeleteTask); 

$('.lane').droppable({
    accept: '.task-card',
    drop: handleDrop
});

$('#dueDate').datepicker({
    changeMonth: true,
    changeYear: true,
});
});
  


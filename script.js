const taskInput = document.getElementById('taskInput');
const addButton = document.getElementById('addButton');
const taskList = document.getElementById('taskList');

// API URL
const API_URL = "https://jsonplaceholder.typicode.com/todos";

// Function to fetch and display tasks
async function fetchTasks() {
    const response = await fetch(API_URL);
    const tasks = await response.json();
    
    taskList.innerHTML = ''; // Clear the task list before displaying updated tasks

    tasks.slice(0, 5).forEach(task => { // Limit to 5 tasks for now
        const taskItem = document.createElement('li');
        taskItem.innerHTML = `
            <span class="task-text">${task.title}</span>
            <button class="deleteBtn">Delete</button>
        `;
        
        taskList.appendChild(taskItem);
        
        // Add event listeners for completion and delete actions
        taskItem.querySelector('.task-text').addEventListener('click', toggleCompletion);
        taskItem.querySelector('.deleteBtn').addEventListener('click', () => deleteTask(task.id, taskItem));
    });
}

// Function to add a new task
async function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === '') {
        return;
    }

    const newTask = {
        title: taskText,
        completed: false,
        userId: 1 // Using a dummy userId, you can modify as per real API
    };

    // Make POST request to API to create a task
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTask)
    });

    const addedTask = await response.json();
    displayTask(addedTask);
    taskInput.value = ''; // Clear the input after adding the task
}

// Function to display the newly added task
function displayTask(task) {
    const taskItem = document.createElement('li');
    taskItem.innerHTML = `
        <span class="task-text">${task.title}</span>
        <button class="deleteBtn">Delete</button>
    `;
    
    taskList.appendChild(taskItem);
    
    // Add event listeners for completion and delete actions
    taskItem.querySelector('.task-text').addEventListener('click', toggleCompletion);
    taskItem.querySelector('.deleteBtn').addEventListener('click', () => deleteTask(task.id, taskItem));
}

// Function to toggle completion of a task
function toggleCompletion(event) {
    const taskItem = event.target.closest('li');
    taskItem.classList.toggle('completed');
}

// Function to delete a task
async function deleteTask(taskId, taskItem) {
    // Make DELETE request to API
    await fetch(`${API_URL}/${taskId}`, {
        method: 'DELETE'
    });

    taskItem.remove(); // Remove the task from the list
}

// Event listener for Add Task button
addButton.addEventListener('click', addTask);

// Event listener for pressing "Enter" key to add task
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Fetch tasks when the page loads
fetchTasks();

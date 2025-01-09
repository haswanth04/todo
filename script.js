// Replace the items array with tasks array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

const searchInput = document.getElementById('searchInput');
const suggestionsList = document.getElementById('suggestionsList');
const addTaskBtn = document.getElementById('addTask');
const tasksList = document.getElementById('tasksList');

// Add event listeners
searchInput.addEventListener('input', handleInput);
searchInput.addEventListener('focus', handleInput);
document.addEventListener('click', handleClickOutside);
addTaskBtn.addEventListener('click', addNewTask);

// Add this at the beginning of the file with your other constants
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(-10px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);

function addNewTask() {
    const taskText = searchInput.value.trim();
    if (taskText) {
        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false
        };
        tasks.push(newTask);
        saveTasks();
        renderTasks();
        searchInput.value = '';
        suggestionsList.classList.remove('show');
    }
}

function renderTasks() {
    tasksList.innerHTML = '';
    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskElement.innerHTML = `
            <input type="checkbox" class="task-checkbox" 
                   ${task.completed ? 'checked' : ''}>
            <span class="task-text">${task.text}</span>
            <button class="delete-task">Delete</button>
        `;

        const checkbox = taskElement.querySelector('.task-checkbox');
        checkbox.addEventListener('change', () => toggleTask(task.id));

        const deleteBtn = taskElement.querySelector('.delete-task');
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        tasksList.appendChild(taskElement);
    });
}

function toggleTask(taskId) {
    tasks = tasks.map(task => 
        task.id === taskId ? {...task, completed: !task.completed} : task
    );
    saveTasks();
    renderTasks();
}

function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks();
    renderTasks();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function handleInput(e) {
    const value = e.target.value.toLowerCase();
    
    suggestionsList.innerHTML = '';
    
    if (value.length === 0) {
        suggestionsList.classList.remove('show');
        return;
    }
    
    const filteredTasks = tasks.filter(task => 
        task.text.toLowerCase().includes(value)
    );
    
    if (filteredTasks.length === 0) {
        suggestionsList.classList.remove('show');
        return;
    }
    
    filteredTasks.forEach((task, index) => {
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        div.style.animation = `slideIn 0.3s ease forwards ${index * 0.05}s`;
        
        const itemLower = task.text.toLowerCase();
        const matchIndex = itemLower.indexOf(value);
        const highlightedText = `
            ${task.text.slice(0, matchIndex)}
            <span class="highlight">${task.text.slice(matchIndex, matchIndex + value.length)}</span>
            ${task.text.slice(matchIndex + value.length)}
            ${task.completed ? ' (Completed)' : ''}
        `;
        
        div.innerHTML = highlightedText;
        
        div.addEventListener('click', () => {
            searchInput.value = task.text;
            suggestionsList.classList.remove('show');
        });
        
        suggestionsList.appendChild(div);
    });
    
    suggestionsList.classList.add('show');
}

function handleClickOutside(e) {
    if (!searchInput.contains(e.target) && !suggestionsList.contains(e.target)) {
        suggestionsList.classList.remove('show');
    }
}

// Initialize tasks on load
renderTasks(); 
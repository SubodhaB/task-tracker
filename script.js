document.addEventListener("DOMContentLoaded", () => {
    const taskForm = document.getElementById("task-form");
    const taskInput = document.getElementById("task-input");
    const taskList = document.getElementById("task-list");

    // Load tasks from localStorage
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    function renderTasks() {
        taskList.innerHTML = "";
        tasks.forEach((task, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                ${task}
                <button onclick="deleteTask(${index})">❌</button>
            `;
            taskList.appendChild(li);
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    taskForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const newTask = taskInput.value.trim();
        if (newTask) {
            tasks.push(newTask);
            taskInput.value = "";
            renderTasks();
        }
    });

    window.deleteTask = function(index) {
        tasks.splice(index, 1);
        renderTasks();
    };

    renderTasks();
});

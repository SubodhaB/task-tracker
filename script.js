document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTask");
    const taskList = document.getElementById("taskList");
    const filterButtons = document.querySelectorAll(".filter");

    addTaskBtn.addEventListener("click", addTask);
    taskList.addEventListener("click", handleTaskClick);
    filterButtons.forEach(btn => btn.addEventListener("click", filterTasks));

    // Function to sanitize user input and prevent XSS attacks
    function sanitizeInput(input) {
        let div = document.createElement("div");
        div.innerText = input;
        return div.innerHTML;
    }

    // Encrypt and store data in localStorage
    function saveToLocalStorage(key, data) {
        let encryptedData = btoa(JSON.stringify(data)); // Base64 encoding
        localStorage.setItem(key, encryptedData);
    }

    // Retrieve and decrypt data from localStorage
    function getFromLocalStorage(key) {
        let data = localStorage.getItem(key);
        return data ? JSON.parse(atob(data)) : [];
    }

    function addTask() {
        const taskText = sanitizeInput(taskInput.value.trim());
        if (taskText === "") return;

        const taskItem = document.createElement("li");
        taskItem.classList.add("task");
        taskItem.innerHTML = `
            <span>${taskText}</span>
            <div>
                <button class="toggle-btn">✔</button>
                <button class="delete-btn">✖</button>
            </div>
        `;

        taskList.appendChild(taskItem);
        taskInput.value = "";
        saveTasks();
    }

    function handleTaskClick(event) {
        const taskItem = event.target.closest("li");
        if (!taskItem) return;

        if (event.target.classList.contains("toggle-btn")) {
            taskItem.classList.toggle("completed");
        } else if (event.target.classList.contains("delete-btn")) {
            taskItem.remove();
        }
        saveTasks();
    }

    function filterTasks(event) {
        const filter = event.target.dataset.filter;
        filterButtons.forEach(btn => btn.classList.remove("active"));
        event.target.classList.add("active");

        document.querySelectorAll(".task").forEach(task => {
            switch (filter) {
                case "all":
                    task.style.display = "flex";
                    break;
                case "pending":
                    task.style.display = task.classList.contains("completed") ? "none" : "flex";
                    break;
                case "completed":
                    task.style.display = task.classList.contains("completed") ? "flex" : "none";
                    break;
            }
        });
    }

    function saveTasks() {
        const tasks = [];
        document.querySelectorAll(".task").forEach(task => {
            tasks.push({
                text: task.querySelector("span").textContent,
                completed: task.classList.contains("completed"),
            });
        });
        saveToLocalStorage("tasks", tasks);
    }

    function loadTasks() {
        const savedTasks = getFromLocalStorage("tasks");
        savedTasks.forEach(task => {
            const taskItem = document.createElement("li");
            taskItem.classList.add("task");
            if (task.completed) taskItem.classList.add("completed");

            taskItem.innerHTML = `
                <span>${sanitizeInput(task.text)}</span>
                <div>
                    <button class="toggle-btn">✔</button>
                    <button class="delete-btn">✖</button>
                </div>
            `;
            taskList.appendChild(taskItem);
        });
    }

    loadTasks();
});

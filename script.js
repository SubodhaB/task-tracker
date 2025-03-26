console.log("🚀 Task Tracker Loaded");

document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTask");
    const taskList = document.getElementById("taskList");
    const filterButtons = document.querySelectorAll(".filter");
    const backupBtn = document.getElementById("backupTasks");
    const restoreBtn = document.getElementById("restoreTasks");

    addTaskBtn.addEventListener("click", () => {
        console.log("✅ Add Task Button Clicked");
        addTask();
    });

    taskList.addEventListener("click", (event) => {
        console.log("📝 Task Clicked:", event.target);
        handleTaskClick(event);
    });

    filterButtons.forEach(btn => 
        btn.addEventListener("click", (event) => {
            console.log("🔍 Filter Applied:", event.target.dataset.filter);
            filterTasks(event);
        })
    );

    backupBtn.addEventListener("click", backupTasks);
    restoreBtn.addEventListener("click", restoreTasks);

    function sanitizeInput(input) {
        let div = document.createElement("div");
        div.innerText = input;
        return div.innerHTML;
    }

    function saveToLocalStorage(key, data) {
        try {
            let encryptedData = btoa(JSON.stringify(data)); // Base64 encoding
            localStorage.setItem(key, encryptedData);
        } catch (error) {
            console.error("⚠️ Error Saving to LocalStorage:", error);
        }
    }

    function getFromLocalStorage(key) {
        try {
            let data = localStorage.getItem(key);
            return data ? JSON.parse(atob(data)) : [];
        } catch (error) {
            console.error("⚠️ Error Reading LocalStorage:", error);
            return [];
        }
    }

    function addTask() {
        const taskText = sanitizeInput(taskInput.value.trim());
        if (taskText === "") return;

        console.log(`✅ Task Added: "${taskText}"`);

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
        updateTaskStats();
    }

    function handleTaskClick(event) {
        const taskItem = event.target.closest("li");
        if (!taskItem) return;

        if (event.target.classList.contains("toggle-btn")) {
            taskItem.classList.toggle("completed");
            console.log(`🔄 Task Toggled: "${taskItem.innerText}"`);
        } else if (event.target.classList.contains("delete-btn")) {
            console.log(`🗑 Task Deleted: "${taskItem.innerText}"`);
            taskItem.remove();
        }
        saveTasks();
        updateTaskStats();
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
        updateTaskStats();
    }

    function updateTaskStats() {
        const totalTasks = document.querySelectorAll(".task").length;
        const completedTasks = document.querySelectorAll(".task.completed").length;
        const pendingTasks = totalTasks - completedTasks;

        console.log(`📊 Task Stats - Total: ${totalTasks}, Completed: ${completedTasks}, Pending: ${pendingTasks}`);
    }

    function backupTasks() {
        const tasks = getFromLocalStorage("tasks");
        const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "task-backup.json";
        a.click();
        console.log("💾 Backup Created");
    }

    function restoreTasks() {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "application/json";
        input.addEventListener("change", function () {
            const file = input.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function (event) {
                try {
                    const tasks = JSON.parse(event.target.result);
                    saveToLocalStorage("tasks", tasks);
                    taskList.innerHTML = "";
                    loadTasks();
                    console.log("🔄 Backup Restored Successfully");
                } catch (error) {
                    console.error("⚠️ Error Restoring Backup:", error);
                }
            };
            reader.readAsText(file);
        });
        input.click();
    }

    window.onerror = function (message, source, lineno, colno, error) {
        console.error("🚨 JavaScript Error:", { message, source, lineno, colno, error });
        alert("Oops! Something went wrong. Check the console.");
    };

    window.addEventListener("load", function () {
        const loadTime = performance.now();
        console.log(`🚀 Page Loaded in ${loadTime.toFixed(2)}ms`);
    });

    loadTasks();
});

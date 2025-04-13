document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("taskInput");
    const priorityInput = document.getElementById("priorityInput");
    const dueDateInput = document.getElementById("dueDateInput");
    const addTaskBtn = document.getElementById("addTask");
    const taskList = document.getElementById("taskList");
    const filters = document.querySelectorAll(".filter");
    const backupBtn = document.getElementById("backupTasks");
    const restoreBtn = document.getElementById("restoreTasks");
  
    let tasks = [];
  
    function saveTasks() {
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks();
    }
  
    function loadTasks() {
      const saved = localStorage.getItem("tasks");
      if (saved) tasks = JSON.parse(saved);
      renderTasks();
    }
  
    function renderTasks(filter = "all") {
      taskList.innerHTML = "";
      tasks.forEach((task, index) => {
        if (filter === "pending" && task.completed) return;
        if (filter === "completed" && !task.completed) return;
  
        const li = document.createElement("li");
        li.className = "task-item " + (task.completed ? "completed" : "pending");
  
        li.innerHTML = `
          <span>${task.text}</span>
          <div class="task-buttons">
            <button class="done" title="Mark Done"><i class="fas fa-check"></i></button>
            <button class="delete" title="Delete Task"><i class="fas fa-times"></i></button>
          </div>
        `;
  
        li.querySelector(".done").addEventListener("click", () => {
          task.completed = !task.completed;
          saveTasks();
        });
  
        li.querySelector(".delete").addEventListener("click", () => {
          tasks.splice(index, 1);
          saveTasks();
        });
  
        taskList.appendChild(li);
      });
    }
  
    addTaskBtn.addEventListener("click", () => {
      const text = taskInput.value.trim();
      const priority = priorityInput.value;
      const dueDate = dueDateInput.value;
  
      if (text === "") {
        alert("Please enter a task.");
        return;
      }
  
      tasks.push({
        text,
        priority,
        dueDate,
        completed: false
      });
  
      taskInput.value = "";
      dueDateInput.value = "";
  
      saveTasks();
    });
  
    filters.forEach((btn) => {
      btn.addEventListener("click", () => {
        filters.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        renderTasks(btn.dataset.filter);
      });
    });
  
    backupBtn.addEventListener("click", () => {
      const blob = new Blob([JSON.stringify(tasks)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "tasks_backup.json";
      a.click();
      URL.revokeObjectURL(url);
    });
  
    restoreBtn.addEventListener("click", () => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "application/json";
  
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
  
        const reader = new FileReader();
        reader.onload = () => {
          try {
            tasks = JSON.parse(reader.result);
            saveTasks();
          } catch (err) {
            alert("Invalid file format.");
          }
        };
        reader.readAsText(file);
      };
  
      input.click();
    });
  
    // Load saved tasks on start
    loadTasks();
  });
  
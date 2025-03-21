// script.js
document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("taskInput");
    const addTaskButton = document.getElementById("addTask");
    const taskList = document.getElementById("taskList");
    const filterButtons = document.querySelectorAll(".filter");
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    
    function saveTasks() {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
    
    function renderTasks(filter = "all") {
      taskList.innerHTML = "";
      
      tasks.forEach((task, index) => {
        if (filter === "completed" && !task.completed) return;
        if (filter === "pending" && task.completed) return;
        
        const li = document.createElement("li");
        
        const taskText = document.createElement("span");
        taskText.textContent = task.text;
        taskText.classList.add("task-text");
        
        li.classList.toggle("completed", task.completed);
        
        const actionsDiv = document.createElement("div");
        actionsDiv.classList.add("task-actions");
        
        const toggleBtn = document.createElement("button");
        toggleBtn.innerHTML = task.completed ? '<i class="fas fa-undo"></i>' : '<i class="fas fa-check"></i>';
        toggleBtn.classList.add("toggle-btn");
        toggleBtn.onclick = (e) => {
          e.stopPropagation();
          task.completed = !task.completed;
          saveTasks();
          renderTasks(filter);
        };
        
        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.classList.add("delete-btn");
        deleteBtn.onclick = (e) => {
          e.stopPropagation();
          tasks.splice(index, 1);
          saveTasks();
          renderTasks(filter);
        };
        
        actionsDiv.appendChild(toggleBtn);
        actionsDiv.appendChild(deleteBtn);
        
        li.appendChild(taskText);
        li.appendChild(actionsDiv);
        taskList.appendChild(li);
      });
    }
    
    addTaskButton.addEventListener("click", () => {
      const text = taskInput.value.trim();
      if (text) {
        tasks.push({ text, completed: false });
        saveTasks();
        renderTasks();
        taskInput.value = "";
      }
    });
    
    taskInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        const text = taskInput.value.trim();
        if (text) {
          tasks.push({ text, completed: false });
          saveTasks();
          renderTasks();
          taskInput.value = "";
        }
      }
    });
    
    filterButtons.forEach(button => {
      button.addEventListener("click", () => {
        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        renderTasks(button.dataset.filter);
      });
    });
    
    renderTasks();
  });
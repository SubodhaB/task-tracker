document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("taskInput");
  const priorityInput = document.getElementById("priorityInput");
  const dueDateInput = document.getElementById("dueDateInput");
  const addTaskBtn = document.getElementById("addTask");
  const taskList = document.getElementById("taskList");
  const filters = document.querySelectorAll(".filter");
  const backupBtn = document.getElementById("backupTasks");
  const restoreBtn = document.getElementById("restoreTasks");
  const notificationsToggle = document.getElementById("notificationsToggle");
  const pdfBtn = document.getElementById("generatePDF");

  let tasks = [];
  window.tasks = tasks;
  window.renderTasks = renderTasks;


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

      const priorityLabel = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
      const dueDateLabel = task.dueDate ? new Date(task.dueDate).toLocaleString() : "No due date";

      li.innerHTML = `
        <div class="task-info">
          <span>${task.text}</span>
          <small>🗓️ ${dueDateLabel} | 🚦 Priority: ${priorityLabel}</small>
        </div>
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
    
    const newTask = { text, priority, dueDate, completed: false };
    tasks.push(newTask);
    taskInput.value = "";
    dueDateInput.value = "";
    saveTasks();

    if (notificationsToggle.checked) {
      scheduleNotifications(newTask);
    }
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

  pdfBtn?.addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const date = new Date().toLocaleString();
  
    doc.setFont("helvetica");
    doc.setFontSize(16);
    doc.text("📋 Task Tracker Report", 15, 20);
    doc.setFontSize(10);
    doc.text(`Generated on: ${date}`, 15, 27);
  
    let y = 35;
  
    tasks.forEach((task, i) => {
      const title = `${i + 1}. ${task.text}`;
      const priority = `Priority: ${task.priority}`;
      const due = `Due: ${task.dueDate ? new Date(task.dueDate).toLocaleString() : "No due date"}`;
      const status = `Status: ${task.completed ? "✅ Completed" : "⏳ Pending"}`;
  
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
  
      const wrappedText = doc.splitTextToSize(title, 180);
      doc.text(wrappedText, 15, y);
      y += wrappedText.length * 6;
  
      doc.setFontSize(10);
      doc.text(`${priority}   |   ${due}   |   ${status}`, 15, y);
      y += 12;
  
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });
  
    doc.save("Task_Tracker_Report.pdf");
  });
  

  const storedToggle = localStorage.getItem("notificationsEnabled");
  if (storedToggle === "true") notificationsToggle.checked = true;

  notificationsToggle.addEventListener("change", () => {
    localStorage.setItem("notificationsEnabled", notificationsToggle.checked);
  });

  loadTasks();
  scheduleAllNotifications();
});

// === Notifications ===
if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission();
}

function scheduleNotifications(task) {
  if (!task.dueDate) return;
  const dueTime = new Date(task.dueDate).getTime();
  const currentTime = new Date().getTime();
  const notifyTime = dueTime - 5 * 60 * 1000;

  if (notifyTime > currentTime) {
    const delay = notifyTime - currentTime;
    setTimeout(() => {
      if (Notification.permission === "granted") {
        new Notification("⏰ Task Reminder", {
          body: `Your task "${task.text}" is due soon!`,
          icon: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
        });
      }
    }, delay);
  }
}

function scheduleAllNotifications() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const notificationsToggle = document.getElementById("notificationsToggle");
  if (!notificationsToggle?.checked) return;
  tasks.forEach(task => {
    if (!task.completed) scheduleNotifications(task);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const taskInput = document.getElementById("taskInput");
  const addTaskButton = document.getElementById("addTask");
  const taskList = document.getElementById("taskList");
  const filterButtons = document.querySelectorAll(".filter");

  function addTask() {
      const taskText = taskInput.value.trim();
      if (taskText === "") return;

      const listItem = document.createElement("li");
      listItem.setAttribute("data-status", "pending");

      const taskSpan = document.createElement("span");
      taskSpan.textContent = taskText;

      const toggleButton = document.createElement("button");
      toggleButton.innerHTML = '<i class="fas fa-check"></i>';
      toggleButton.classList.add("toggle-btn");
      toggleButton.addEventListener("click", function () {
          listItem.classList.toggle("completed");
          listItem.setAttribute("data-status", listItem.classList.contains("completed") ? "completed" : "pending");
          applyFilter();
      });

      const deleteButton = document.createElement("button");
      deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
      deleteButton.classList.add("delete-btn");
      deleteButton.addEventListener("click", function () {
          listItem.remove();
      });

      listItem.appendChild(taskSpan);
      listItem.appendChild(toggleButton);
      listItem.appendChild(deleteButton);

      taskList.appendChild(listItem);
      taskInput.value = "";
  }

  addTaskButton.addEventListener("click", addTask);
  taskInput.addEventListener("keypress", function (event) {
      if (event.key === "Enter") addTask();
  });

  filterButtons.forEach(button => {
      button.addEventListener("click", function () {
          document.querySelector(".filter.active").classList.remove("active");
          button.classList.add("active");
          applyFilter();
      });
  });

  function applyFilter() {
      const activeFilter = document.querySelector(".filter.active").dataset.filter;
      document.querySelectorAll("#taskList li").forEach(task => {
          if (activeFilter === "all" || task.getAttribute("data-status") === activeFilter) {
              task.style.display = "flex";
          } else {
              task.style.display = "none";
          }
      });
  }
});

// test.js - Simple Unit Test for Task Tracker

// Function to test (example)
function addTask(taskList, task) {
    if (!task) return taskList;
    taskList.push(task);
    return taskList;
}

// Unit Test for addTask function
function testAddTask() {
    let tasks = [];
    tasks = addTask(tasks, "Test Task");

    if (tasks.length === 1 && tasks[0] === "Test Task") {
        console.log("✅ testAddTask PASSED");
    } else {
        console.log("❌ testAddTask FAILED");
    }
}

// Run the test
testAddTask();

document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementById("taskList");
    const allTasksBtn = document.getElementById("allTasks");
    const activeTasksBtn = document.getElementById("activeTasks");
    const completedTasksBtn = document.getElementById("completedTasks");

    // Load tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // Function to save tasks to localStorage
    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Function to render tasks
    function renderTasks(filter = "all") {
        taskList.innerHTML = "";
        tasks
            .filter(task => {
                if (filter === "active") return !task.completed;
                if (filter === "completed") return task.completed;
                return true;
            })
            .forEach(task => {
                const li = document.createElement("li");
                li.className = task.completed ? "completed" : "";

                if (!task.isEditing) {
                    const checkbox = document.createElement("input");
                    checkbox.type = "checkbox";
                    checkbox.checked = task.completed;
                    checkbox.className = "checkbox";
                    checkbox.addEventListener("click", () => toggleComplete(task));
                    li.appendChild(checkbox);

                    const span = document.createElement("span");
                    span.textContent = `${task.text} (${task.date})`;
                    span.addEventListener("dblclick", () => editTask(task));
                    li.appendChild(span);
                } else {
                    const input = document.createElement("input");
                    input.type = "text";
                    input.value = task.text;
                    input.addEventListener("keypress", (e) => {
                        if (e.key === "Enter") {
                            finishEditing(task, input.value);
                        }
                    });
                    li.appendChild(input);
                }

                const deleteBtn = document.createElement("button");
                deleteBtn.textContent = "×";
                deleteBtn.className = "delete-btn";
                deleteBtn.addEventListener("click", () => deleteTask(task));
                li.appendChild(deleteBtn);

                taskList.appendChild(li);
            });
    }

    // Add task
    taskInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && taskInput.value.trim()) {
            tasks.push({
                text: taskInput.value.trim(),
                date: new Date().toLocaleString(),
                completed: false,
                isEditing: false
            });
            taskInput.value = "";
            saveTasks();
            renderTasks();
        }
    });

    // Toggle task completion
    function toggleComplete(task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }

    // Edit task
    function editTask(task) {
        task.isEditing = true;
        saveTasks();
        renderTasks();
    }

    // Finish editing task
    function finishEditing(task, newText) {
        task.text = newText.trim();
        task.isEditing = false;
        saveTasks();
        renderTasks();
    }

    // Delete task
    function deleteTask(task) {
        tasks = tasks.filter(t => t !== task);
        saveTasks();
        renderTasks();
    }

    // Filter tasks
    allTasksBtn.addEventListener("click", () => renderTasks("all"));
    activeTasksBtn.addEventListener("click", () => renderTasks("active"));
    completedTasksBtn.addEventListener("click", () => renderTasks("completed"));

    // Initial render
    renderTasks();
});

document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "http://localhost:5000/api/todos";
    const todoList = document.getElementById("todoList");
    const todoForm = document.getElementById("todoForm");
    const taskInput = document.getElementById("task");

    function fetchTodos() {
        fetch(API_URL)
            .then(response => response.json())
            .then(todos => {
                todoList.innerHTML = "";
                todos.forEach(todo => {
                    const listItem = document.createElement("li");
                    listItem.className = "list-group-item d-flex justify-content-between align-items-center";
                    listItem.style.textDecoration = todo.completed ? "line-through" : "none";

                    const taskSpan = document.createElement("span");
                    taskSpan.textContent = todo.task;
                    taskSpan.style.cursor = "pointer";
                    taskSpan.addEventListener("click", () => toggleStatus(todo.id, todo.task, todo.completed));

                    const buttonDiv = document.createElement("div");

                    const editButton = document.createElement("button");
                    editButton.className = "btn btn-warning btn-sm mr-2";
                    editButton.textContent = "Edit";
                    editButton.addEventListener("click", () => editTask(todo.id, todo.task));

                    const deleteButton = document.createElement("button");
                    deleteButton.className = "btn btn-danger btn-sm";
                    deleteButton.textContent = "Delete";
                    deleteButton.addEventListener("click", () => deleteTask(todo.id));

                    buttonDiv.appendChild(editButton);
                    buttonDiv.appendChild(deleteButton);

                    listItem.appendChild(taskSpan);
                    listItem.appendChild(buttonDiv);
                    todoList.appendChild(listItem);
                });
            });
    }

    todoForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const task = taskInput.value;
        fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ task })
        }).then(() => {
            taskInput.value = "";
            fetchTodos();
        });
    });

    function toggleStatus(id, task, completed) {
        fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ task, completed: !completed })
        }).then(fetchTodos);
    }

    function deleteTask(id) {
        fetch(`${API_URL}/${id}`, { method: "DELETE" }).then(fetchTodos);
    }

    function editTask(id, task) {
        const newTask = prompt("Edit task:", task);
        if (newTask) {
            fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ task: newTask, completed: false })
            }).then(fetchTodos);
        }
    }

    fetchTodos();
});

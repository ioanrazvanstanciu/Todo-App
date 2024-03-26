let currentEditingId = null; // variable to keep track of the currently edited todo

function addOrUpdateTodo() {
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();

  if (!title) {
    alert("Title is required and cannot be empty.");
    return;
  }

  const method = currentEditingId ? "PUT" : "POST";
  const url = currentEditingId
    ? `http://localhost:3000/todos/${currentEditingId}`
    : "http://localhost:3000/todos";

  fetch(url, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description }),
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("title").value = "";
      document.getElementById("description").value = "";
      currentEditingId = null;
      loadTodos(); // reload the todo list
    })
    .catch((error) => console.error("Error:", error));
}

function deleteTodo(id) {
  fetch(`http://localhost:3000/todos/${id}`, {
    method: "DELETE",
  })
    .then(() => loadTodos())
    .catch((error) => console.error("Error:", error));
}

function editTodo(id, title, description) {
  document.getElementById("title").value = title;
  document.getElementById("description").value = description;
  currentEditingId = id;
}

function loadTodos() {
  fetch("http://localhost:3000/todos")
    .then((response) => response.json())
    .then((todos) => {
      const todosContainer = document.getElementById("todos");
      todosContainer.innerHTML = "";
      todos.forEach((todo) => {
        const todoDiv = document.createElement("div");
        todoDiv.innerHTML = `
        <span class="todo-title">${todo.title}</span> - ${
          todo.description || ""
        }
        <button onclick="deleteTodo(${todo.id})">Delete</button>
        <button onclick="editTodo(${todo.id}, '${todo.title}', '${
          todo.description
        }')">Edit</button>
      `;
        todosContainer.appendChild(todoDiv);
      });
    });
}

loadTodos(); // loads the todo list when the page is loaded

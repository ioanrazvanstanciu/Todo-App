const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const cors = require("cors"); // enable Cross-Origin Resource Sharing (CORS) for all routes
app.use(cors());

let todos = []; // this array will temporarily store the todos
let currentId = 0;

app.get("/", (req, res) => {
  res.send("Welcome to my Todo Management API!");
});

// endpoint for creating a new todo
app.post("/todos", (req, res) => {
  const { title, description } = req.body;
  // validation to ensure title is present
  if (!title || title.trim() === "") {
    return res
      .status(400)
      .send({ error: "Title is required and cannot be empty." });
  }
  const todo = { id: ++currentId, title, description: description || "" }; // allow the description to be optional
  todos.push(todo);
  res.status(201).send(todo);
});

// endpoint for retrieving the list of all todos
app.get("/todos", (req, res) => {
  res.status(200).send(todos);
});

// endpoint for retrieving a specific todo by ID
app.get("/todos/:id", (req, res) => {
  const todo = todos.find((t) => t.id == req.params.id);
  if (!todo) {
    return res.status(404).send({ error: "Todo not found." });
  }
  res.status(200).send(todo);
});

// endpoint for updating a todo
app.put("/todos/:id", (req, res) => {
  const { title, description } = req.body;
  const todo = todos.find((t) => t.id == req.params.id);
  if (!todo) {
    return res.status(404).send({ error: "Todo not found." });
  }
  // validation to ensure title is not empty if provided
  if (title && title.trim() === "") {
    return res.status(400).send({ error: "Title cannot be empty." });
  }
  // update todo
  todo.title = title || todo.title;
  todo.description = description !== undefined ? description : todo.description;
  res.status(200).send(todo);
});

// endpoint for deleting a todo
app.delete("/todos/:id", (req, res) => {
  const index = todos.findIndex((t) => t.id == req.params.id);
  if (index === -1) {
    return res.status(404).send({ error: "Todo not found." });
  }
  todos.splice(index, 1); // removes the todo from the array
  res.status(200).send({ message: "Todo deleted successfully." }); // display a message about the successful deletion of a todo
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log("Available endpoints:");
  console.log("POST /todos - Create a new todo");
  console.log("GET /todos - Retrieve a list of all todos");
  console.log("GET /todos/:id - Retrieve a specific todo by its ID");
  console.log("PUT /todos/:id - Update a todo");
  console.log("DELETE /todos/:id - Delete a todo");
  console.log(
    "Open the Postman application and test the desired endpoints here:"
  );
});

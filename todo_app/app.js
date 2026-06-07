const STORAGE_KEY = "pbt09_todos";
const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const todoCount = document.getElementById("todoCount");
const clearCompletedBtn = document.getElementById("clearCompleted");
const filterButtons = document.querySelectorAll(".filter-btn");

let todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
let currentFilter = "all";

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function getFilteredTodos() {
  if (currentFilter === "active")
    return todos.filter((todo) => !todo.completed);
  if (currentFilter === "completed")
    return todos.filter((todo) => todo.completed);
  return todos;
}

function updateCount() {
  const remaining = todos.filter((todo) => !todo.completed).length;
  todoCount.textContent = `${remaining} items left`;
}

function createTodoElement(todo) {
  const li = document.createElement("li");
  li.className = `todo-item${todo.completed ? " completed" : ""}`;
  li.dataset.id = todo.id;

  const span = document.createElement("span");
  span.className = "todo-text";
  span.textContent = todo.text;

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.className = "todo-delete";
  deleteBtn.textContent = "❌";
  deleteBtn.setAttribute("aria-label", "Delete todo");

  li.appendChild(span);
  li.appendChild(deleteBtn);
  return li;
}

function renderTodos() {
  todoList.replaceChildren();
  getFilteredTodos().forEach((todo) =>
    todoList.appendChild(createTodoElement(todo)),
  );
  updateCount();
  saveTodos();
}

function addTodo(text) {
  todos.unshift({
    id: Date.now() + Math.random(),
    text,
    completed: false,
  });
  renderTodos();
}

function removeTodo(id) {
  todos = todos.filter((todo) => String(todo.id) !== String(id));
  renderTodos();
}

function toggleTodo(id) {
  todos = todos.map((todo) =>
    String(todo.id) === String(id)
      ? { ...todo, completed: !todo.completed }
      : todo,
  );
  renderTodos();
}

function beginEdit(li, todo) {
  if (li.querySelector(".todo-edit")) return;
  const span = li.querySelector(".todo-text");
  const deleteBtn = li.querySelector(".todo-delete");
  span.classList.add("hidden");
  deleteBtn.classList.add("hidden");

  const input = document.createElement("input");
  input.className = "todo-edit";
  input.value = todo.text;

  const save = () => {
    const nextValue = input.value.trim();
    if (!nextValue) {
      renderTodos();
      return;
    }
    todos = todos.map((item) =>
      String(item.id) === String(todo.id) ? { ...item, text: nextValue } : item,
    );
    renderTodos();
  };

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") save();
    if (e.key === "Escape") renderTodos();
  });
  input.addEventListener("blur", save);

  li.insertBefore(input, span);
  input.focus();
  input.select();
}

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = todoInput.value.trim();
  if (!value) return;
  addTodo(value);
  todoInput.value = "";
  todoInput.focus();
});

todoList.addEventListener("click", (e) => {
  const li = e.target.closest(".todo-item");
  if (!li) return;
  const id = li.dataset.id;

  if (e.target.classList.contains("todo-delete")) {
    removeTodo(id);
    return;
  }

  if (e.target.classList.contains("todo-text") || e.target === li) {
    toggleTodo(id);
  }
});

todoList.addEventListener("dblclick", (e) => {
  const li = e.target.closest(".todo-item");
  if (!li || !e.target.classList.contains("todo-text")) return;
  const todo = todos.find((item) => String(item.id) === String(li.dataset.id));
  if (todo) beginEdit(li, todo);
});

clearCompletedBtn.addEventListener("click", () => {
  todos = todos.filter((todo) => !todo.completed);
  renderTodos();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach((btn) =>
      btn.classList.toggle("active", btn === button),
    );
    renderTodos();
  });
});

renderTodos();

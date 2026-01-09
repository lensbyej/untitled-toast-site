const form = document.getElementById("assignmentForm");
const list = document.getElementById("assignmentList");

let assignments = JSON.parse(localStorage.getItem("rememberAssignments")) || [];

function save() {
  localStorage.setItem("rememberAssignments", JSON.stringify(assignments));
}

function render() {
  list.innerHTML = "";

  if (assignments.length === 0) {
    list.innerHTML = "<li class='empty'>No assignments yet.</li>";
    return;
  }

  assignments.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "list-item";

    li.innerHTML = `
      <div>
        <strong>${item.title}</strong>
        <div class="meta">${item.className} · Due ${item.dueDate}</div>
      </div>
      <button class="delete">✕</button>
    `;

    li.querySelector(".delete").onclick = () => {
      assignments.splice(index, 1);
      save();
      render();
    };

    list.appendChild(li);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  assignments.push({
    className: className.value.trim(),
    title: title.value.trim(),
    dueDate: dueDate.value
  });

  save();
  render();
  form.reset();
});

render();

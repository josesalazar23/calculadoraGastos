let expenseList = document.querySelector("#gastos ul");
const mainContent = document.querySelector(".contenido-principal");
const totalBudget = document.querySelector("#total");
const remainingBudget = document.querySelector("#restante");
const form = document.querySelector("#agregar-gasto");
let expenses = [];
let budget = 0;
let remaining = 0;
let currentBudget = false; // Variable para verificar si el presupuesto ya se establecio

eventListeners();

function eventListeners() {
  document.addEventListener('submit', askBudget);
  document.addEventListener("submit", expenseForm);
  document.addEventListener("click", resetApp);
  document.addEventListener("click", deleteExpense);
}deleteExpense

function askBudget(e) {
  e.preventDefault();

  if (currentBudget) {
    return; // Saldra de la funcion si el presupuesto ya se establecio
  }

  const userBudgetField = document.querySelector("#presupuestoInicial").value;

  if (userBudgetField.length > 0) {
    const userBudget = parseInt(userBudgetField);
    if (userBudget === "" || userBudget === null || isNaN(userBudget) || userBudget <= 0) {
      location.reload();
    }
    showInitialBudget(userBudget);
  }
}

function showInitialBudget(userBudget) {
  budget = userBudget;
  document.querySelector("#presupuestoInicial").disabled = true;
  totalBudget.textContent = budget;
  currentBudget = true;
  remaining = budget;
  remainingBudget.textContent = remaining;
}

function deleteExpense(e) {
  if (e.target.classList.contains('delete-expense')) {
    const expenseId = e.target.getAttribute('data-id');
    const expenseToDelete = expenses.find(expense => expense.id === parseInt(expenseId));

    if (expenseToDelete) {
      const amountToDelete = expenseToDelete.expenseAmount.textContent;

      expenses = expenses.filter(expense => expense.id !== parseInt(expenseId));
      remaining += parseInt(amountToDelete);
      remainingBudget.textContent = remaining;

      showExpenses();
    }
  }
}

function expenseForm(e) {
  e.preventDefault();
  const expenseName = document.querySelector("#gasto").value;
  const amount = document.querySelector("#cantidad").value;

  if (expenseName === "" || amount === "") {
    errorMessage("Los campos no pueden quedar vacíos");
    return;
  } else if (isNaN(amount)) {
    errorMessage("Datos introducidos incorrectos");
    return;
  }

  const expenseDescription = document.createElement('p');
  expenseDescription.textContent = expenseName;

  const expenseAmount = document.createElement('p');
  expenseAmount.textContent = Math.floor(amount);

  subtractBudget(amount, expenseDescription, expenseAmount);
}

function subtractBudget(amount, expenseDescription, expenseAmount) {
  if (remaining >= amount) {
    expenses.push({ expenseDescription, expenseAmount, id: Date.now() });
    remaining -= parseInt(amount);
    remainingBudget.textContent = remaining;
    showExpenses();
    form.reset();
    if (remaining === 0) {
      errorMessage("El presupuesto se ha agotado");
      return;
    }
  } else {
    errorMessage("Los gastos exceden el presupuesto");
    return;
  }
}

function showExpenses() {
  clearHTML();
  expenses.forEach((expense) => {
    const { expenseDescription, expenseAmount, id } = expense;

    const newExpense = document.createElement("li");
    newExpense.className = 'list-group-item d-flex justify-content-between align-items-center presupuesto';
    newExpense.classList.add("presupuesto");
    newExpense.setAttribute('data-id', id);
    newExpense.innerHTML = `${expenseDescription.textContent} <span class="badge badge-primary badge-pill">${expenseAmount.textContent}</span>`;

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add("btn", "btn-danger", "delete-expense");
    deleteBtn.setAttribute('data-id', id);
    deleteBtn.innerHTML = "Eliminar &times;"
    newExpense.appendChild(deleteBtn);
    expenseList.appendChild(newExpense);
  });
}

function resetApp(e) {
  if(e.target.classList.contains("btnReset")) {
    location.reload();
  }
}

function errorMessage(error) {
  const alert = document.querySelector(".error");
  if (!alert) {
    const errorMessage = document.createElement("p");
    errorMessage.textContent = error;
    errorMessage.classList.add("error");

    mainContent.appendChild(errorMessage);

    setTimeout(() => {
      errorMessage.remove();
    }, 3000);
  }
}

function clearHTML() {
  while (expenseList.firstChild) {
    expenseList.removeChild(expenseList.firstChild);
  }
}
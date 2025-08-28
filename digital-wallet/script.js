let transactions = [];

// Load data dari LocalStorage saat pertama kali
window.onload = () => {
  const saved = localStorage.getItem("transactions");
  if (saved) {
    transactions = JSON.parse(saved);
    renderTransactions();
    updateSummary();
  }
};

// Simpan ke LocalStorage
function saveTransactions() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Tambah transaksi
document.getElementById("transaction-form").addEventListener("submit", function(e) {
  e.preventDefault();

  const date = document.getElementById("date").value || new Date().toISOString().split("T")[0];
  const description = document.getElementById("description").value;
  const amount = parseInt(document.getElementById("amount").value);
  const type = document.getElementById("type").value;

  const transaction = {
    id: Date.now(),
    date,
    description,
    amount,
    type
  };

  transactions.push(transaction);
  saveTransactions();
  renderTransactions();
  updateSummary();

  document.getElementById("transaction-form").reset();
});

// Render daftar transaksi
function renderTransactions() {
  const list = document.getElementById("transaction-list");
  list.innerHTML = "";

  transactions.forEach((transaction) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${transaction.date} - ${transaction.description} 
      <span class="${transaction.type === 'income' ? 'income' : 'expense'}">
        Rp ${transaction.amount.toLocaleString()}
      </span>
      <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">X</button>
    `;
    list.appendChild(li);
  });
}

// Hapus transaksi
function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  saveTransactions();
  renderTransactions();
  updateSummary();
}

// Update ringkasan
function updateSummary() {
  const income = transactions.filter(t => t.type === "income").reduce((acc, t) => acc + t.amount, 0);
  const expense = transactions.filter(t => t.type === "expense").reduce((acc, t) => acc + t.amount, 0);
  const balance = income - expense;

  document.getElementById("total-income").textContent = "Rp " + income.toLocaleString();
  document.getElementById("total-expense").textContent = "Rp " + expense.toLocaleString();
  document.getElementById("balance").textContent = "Rp " + balance.toLocaleString();
}

// Export JSON
document.getElementById("export-json").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(transactions, null, 2)], {type: "application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "transactions.json";
  a.click();
});

// Import JSON
document.getElementById("import-json").addEventListener("click", () => {
  const fileInput = document.getElementById("file-input");
  const file = fileInput.files[0];
  if (!file) return alert("Pilih file JSON dulu!");

  const reader = new FileReader();
  reader.onload = (e) => {
    transactions = JSON.parse(e.target.result);
    saveTransactions();
    renderTransactions();
    updateSummary();
  };
  reader.readAsText(file);
});

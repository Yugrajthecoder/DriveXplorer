const container = document.getElementById("data-container");
const loader = document.getElementById("loader");

const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");
const filterBtn = document.getElementById("filterBtn");
const themeToggle = document.getElementById("themeToggle");

let allData = [];
let currentData = [];


async function fetchData() {
  loader.style.display = "block";

  try {
    const res = await fetch("https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json");
    const data = await res.json();

    allData = data.Results;
    currentData = [...allData];

    displayData(currentData);
  } catch (err) {
    container.innerHTML = "<p>Error loading data</p>";
  } finally {
    loader.style.display = "none";
  }
}


function displayData(data) {
  container.innerHTML = "";

  data.slice(0, 20).map(item => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <h3>${item.Make_Name}</h3>
      <p>ID: ${item.Make_ID}</p>
      <button onclick="likeItem('${item.Make_Name}')">❤️ Like</button>
    `;

    container.appendChild(div);
  });
}


searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();

  currentData = allData.filter(item =>
    item.Make_Name.toLowerCase().includes(value)
  );

  applySort();
});


sortSelect.addEventListener("change", applySort);

function applySort() {
  let sorted = [...currentData];

  if (sortSelect.value === "az") {
    sorted.sort((a, b) => a.Make_Name.localeCompare(b.Make_Name));
  } else if (sortSelect.value === "za") {
    sorted.sort((a, b) => b.Make_Name.localeCompare(a.Make_Name));
  }

  displayData(sorted);
}


filterBtn.addEventListener("click", () => {
  currentData = allData.filter(item => item.Make_ID > 1000);
  applySort();
});


function likeItem(name) {
  alert(name + " liked ❤️");
}


themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});


fetchData();
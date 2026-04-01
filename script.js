const container = document.getElementById("data-container");
const loader = document.getElementById("loader");

async function fetchData() {
  loader.style.display = "block";

  try {
    const response = await fetch("https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json");
    const data = await response.json();

    displayData(data.Results);
  } catch (error) {
    container.innerHTML = "<p>Error fetching data</p>";
  } finally {
    loader.style.display = "none";
  }
}

function displayData(makes) {
  container.innerHTML = "";

  makes.slice(0, 20).forEach(make => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <h3>${make.Make_Name}</h3>
      <p>ID: ${make.Make_ID}</p>
    `;

    container.appendChild(div);
  });
}

fetchData();
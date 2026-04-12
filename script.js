const container = document.getElementById("data-container");
const loader = document.getElementById("loader");

const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");
const filterBtn = document.getElementById("filterBtn");
const themeToggle = document.getElementById("themeToggle");

const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');

let allData = [];
let currentData = [];

let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

const showFavBtn = document.getElementById('showFavBtn');


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
  container.innerHTML = '';

  data.slice(0, 20).forEach(item => {

    const name = item.Make_Name || item.MakeName || item.Mfr_CommonName || item.ManufacturerName || item.Mfr_Name || item.Make || item.Manufacturer || 'Unknown';
    const id = item.Make_ID || item.MakeId || item.Mfr_ID || item.ManufacturerId || 0;

    const div = document.createElement('div');
    div.className = 'card';


    const img = document.createElement('img');
    img.className = 'make-image';
    img.alt = name;
    img.src = `https://picsum.photos/seed/${encodeURIComponent(name)}/300/200`;
    img.onerror = () => {
      img.onerror = null;
      img.src = `https://via.placeholder.com/300x200?text=${encodeURIComponent(name)}`;
    };

    const h3 = document.createElement('h3');
    h3.textContent = name;

    const p = document.createElement('p');
    p.textContent = `ID: ${id}`;

    const desc = document.createElement('p');
    desc.className = 'description';
    desc.textContent = 'Loading description...';

    const btn = document.createElement('button');
    btn.textContent = '❤️ Like';
    btn.onclick = () => likeItem(name);

    div.appendChild(img);
    div.appendChild(h3);
    div.appendChild(p);
    div.appendChild(desc);
    div.appendChild(btn);

    container.appendChild(div);
    (async () => {
      try {
        const wikiRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`);
        if (wikiRes.ok) {
          const wiki = await wikiRes.json();
          if (wiki.extract) desc.textContent = wiki.extract;
          if (wiki.thumbnail && wiki.thumbnail.source) {
            img.src = wiki.thumbnail.source;
          }
        } else {
          desc.textContent = 'No description found.';
        }
      } catch (e) {
        desc.textContent = 'Description unavailable.';
      }
    })();
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


function updateFavBadge() {
  if (showFavBtn) showFavBtn.textContent = `Favorites (${favorites.length})`;
}

function saveFavorites() {
  localStorage.setItem('favorites', JSON.stringify(favorites));
  updateFavBadge();
}

function toggleFavorite(item) {
  const name = item.Make_Name || item.MakeName || item.Mfr_CommonName || item.ManufacturerName || item.Mfr_Name || item.Make || item.Manufacturer || 'Unknown';
  const id = item.Make_ID || item.MakeId || item.Mfr_ID || item.ManufacturerId || 0;
  const exists = favorites.find(f => f.id === id || f.name === name);
  if (exists) {
    favorites = favorites.filter(f => !(f.id === id && f.name === name));
  } else {
    favorites.push({ id, name });
  }
  saveFavorites();
}

showFavBtn.addEventListener('click', () => {
  if (favorites.length === 0) {
    alert('No favorites yet');
    return;
  }
  const favNames = new Set(favorites.map(f => f.name));
  const favItems = allData.filter(item => favNames.has(item.Make_Name || item.MakeName || item.Mfr_CommonName || item.ManufacturerName || item.Mfr_Name || item.Make || item.Manufacturer));
  displayData(favItems);
});

function likeItem(name) {
  const item = allData.find(i => (i.Make_Name || i.MakeName || i.Mfr_CommonName || i.ManufacturerName || i.Mfr_Name || i.Make || i.Manufacturer) === name);
  if (item) {
    toggleFavorite(item);
    alert(name + (favorites.find(f => f.name === name) ? ' added to favorites ❤️' : ' removed from favorites'));
  } else {
    alert(name + ' liked ❤️');
  }
}

updateFavBadge();


themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});


if (menuBtn) {
  menuBtn.addEventListener('click', () => {
    if (menu.classList.contains('hidden')) {
      menu.classList.remove('hidden');
      menu.setAttribute('aria-hidden', 'false');
    } else {
      menu.classList.add('hidden');
      menu.setAttribute('aria-hidden', 'true');
    }
  });
}


fetchData();
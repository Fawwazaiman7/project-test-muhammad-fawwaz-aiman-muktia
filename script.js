const cardContainer = document.getElementById("cardContainer");
const pagination = document.getElementById("pagination");
const paginationInfo = document.getElementById("pagination-info");

const perPageSelect = document.getElementById("showPerPage");
const sortSelect = document.getElementById("sortBy");

let currentPage = 1;
let perPage = 10;
let sort = "-published_at";
let totalItems = 0;

// 🔧 GUNAKAN DUMMY?
const isDummyMode = true; // ubah ke false jika ingin pakai API asli

function fetchIdeas(useDummy = false) {
  if (useDummy) {
    useDummyData();
    return;
  }

  const url = `https://suitmedia-backend.suitdev.com/api/ideas?page[number]=${currentPage}&page[size]=${perPage}&append[]=small_image&append[]=medium_image&sort=${sort}`;

  fetch(url)
    .then(res => res.json())
    .then(res => {
      renderCards(res.data);
      totalItems = res.meta.total;
      renderPagination();
      updateInfo(res.data.length);
    })
    .catch(err => {
      console.error("Fallback ke dummy karena error:", err);
      useDummyData();
    });
}

function useDummyData() {
  const sorted = dummyIdeas.data.sort((a, b) =>
    sort === "-published_at"
      ? new Date(b.published_at) - new Date(a.published_at)
      : new Date(a.published_at) - new Date(b.published_at)
  );
  const start = (currentPage - 1) * perPage;
  const pagedData = sorted.slice(start, start + perPage);

  renderCards(pagedData);
  totalItems = dummyIdeas.meta.total;
  renderPagination();
  updateInfo(pagedData.length);
}

function renderCards(data) {
  cardContainer.innerHTML = "";
  data.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${item.small_image}" loading="lazy" alt="Post Thumbnail" />
      <div class="card-content">
        <div class="card-date">${formatDate(item.published_at)}</div>
        <div class="card-title">${item.title}</div>
      </div>
    `;
    cardContainer.appendChild(card);
  });
}

function renderPagination() {
  const totalPages = Math.ceil(totalItems / perPage);
  pagination.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) btn.disabled = true;
    btn.onclick = () => {
      currentPage = i;
      fetchIdeas(isDummyMode);
    };
    pagination.appendChild(btn);
  }
}

function updateInfo(showing) {
  paginationInfo.textContent = `Showing ${(currentPage - 1) * perPage + 1} - ${(currentPage - 1) * perPage + showing} of ${totalItems}`;
}

function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

perPageSelect.addEventListener("change", e => {
  perPage = +e.target.value;
  currentPage = 1;
  fetchIdeas(isDummyMode);
});

sortSelect.addEventListener("change", e => {
  sort = e.target.value;
  fetchIdeas(isDummyMode);
});

// Scroll Hide/Show Header
let lastScrollTop = 0;
const header = document.getElementById("header");

window.addEventListener("scroll", function () {
  const st = window.pageYOffset || document.documentElement.scrollTop;
  header.style.top = st > lastScrollTop ? "-80px" : "0";
  lastScrollTop = st <= 0 ? 0 : st;
});

// START
fetchIdeas(isDummyMode);

const products = [
  {
    id: 1,
    name: "iPhone 16",
    price: 25990000,
    category: "phone",
    image: "https://placehold.co/400x400?text=iPhone+16",
    rating: 4.5,
    inStock: true,
  },
  {
    id: 2,
    name: "Samsung S24",
    price: 22990000,
    category: "phone",
    image: "https://placehold.co/400x400?text=Samsung+S24",
    rating: 4.4,
    inStock: true,
  },
  {
    id: 3,
    name: "Pixel 9",
    price: 19990000,
    category: "phone",
    image: "https://placehold.co/400x400?text=Pixel+9",
    rating: 4.6,
    inStock: true,
  },
  {
    id: 4,
    name: "MacBook Pro",
    price: 45990000,
    category: "laptop",
    image: "https://placehold.co/400x400?text=MacBook+Pro",
    rating: 4.8,
    inStock: true,
  },
  {
    id: 5,
    name: "Dell XPS 15",
    price: 35990000,
    category: "laptop",
    image: "https://placehold.co/400x400?text=Dell+XPS+15",
    rating: 4.7,
    inStock: true,
  },
  {
    id: 6,
    name: "ThinkPad X1",
    price: 32990000,
    category: "laptop",
    image: "https://placehold.co/400x400?text=ThinkPad+X1",
    rating: 4.5,
    inStock: false,
  },
  {
    id: 7,
    name: "iPad Air",
    price: 16990000,
    category: "tablet",
    image: "https://placehold.co/400x400?text=iPad+Air",
    rating: 4.6,
    inStock: true,
  },
  {
    id: 8,
    name: "Xiaomi Pad 6",
    price: 7990000,
    category: "tablet",
    image: "https://placehold.co/400x400?text=Xiaomi+Pad+6",
    rating: 4.2,
    inStock: true,
  },
  {
    id: 9,
    name: "Galaxy Tab S9",
    price: 18990000,
    category: "tablet",
    image: "https://placehold.co/400x400?text=Galaxy+Tab+S9",
    rating: 4.4,
    inStock: true,
  },
  {
    id: 10,
    name: "AirPods Pro",
    price: 6990000,
    category: "accessory",
    image: "https://placehold.co/400x400?text=AirPods+Pro",
    rating: 4.3,
    inStock: true,
  },
  {
    id: 11,
    name: "Galaxy Buds",
    price: 3490000,
    category: "accessory",
    image: "https://placehold.co/400x400?text=Galaxy+Buds",
    rating: 4.1,
    inStock: true,
  },
  {
    id: 12,
    name: "MagSafe Charger",
    price: 1290000,
    category: "accessory",
    image: "https://placehold.co/400x400?text=MagSafe+Charger",
    rating: 4.0,
    inStock: true,
  },
];

const state = {
  search: "",
  category: "all",
  sort: "price-asc",
  cartCount: 0,
};

const app = document.getElementById("app");

app.innerHTML = "";

const topbar = document.createElement("header");
topbar.className = "topbar";

topbar.innerHTML = `
  <div>
    <h1 style="margin:0">Product Catalog</h1>
    <p style="margin:6px 0 0; opacity:.72">Render hoàn toàn bằng JavaScript</p>
  </div>
  <div class="toolbar">
    <div>🛒 <span class="badge" id="cartBadge">0</span></div>
    <button class="toggle-btn" id="darkModeBtn" aria-label="Toggle dark mode">Dark mode</button>
  </div>
`;

const panel = document.createElement("section");
panel.className = "panel";
panel.innerHTML = `
  <div class="controls">
    <input id="searchInput" type="search" placeholder="Tìm sản phẩm..." aria-label="Search products" />
    <select id="sortSelect" aria-label="Sort products">
      <option value="price-asc">Giá tăng</option>
      <option value="price-desc">Giá giảm</option>
      <option value="name-asc">Tên A-Z</option>
      <option value="rating-desc">Đánh giá cao nhất</option>
    </select>
  </div>
  <div class="category-group" id="categoryGroup" aria-label="Filter by category"></div>
`;

const grid = document.createElement("section");
grid.className = "grid";
grid.id = "productGrid";

const modalRoot = document.createElement("div");
modalRoot.id = "modalRoot";

document.body.classList.add("catalog-page");
app.append(topbar, panel, grid, modalRoot);

const categories = [
  "all",
  ...new Set(products.map((product) => product.category)),
];
const categoryGroup = document.getElementById("categoryGroup");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const cartBadge = document.getElementById("cartBadge");
const darkModeBtn = document.getElementById("darkModeBtn");

function formatMoney(value) {
  return value.toLocaleString("vi-VN") + "đ";
}

function getVisibleProducts() {
  let result = products.filter((product) =>
    product.name.toLowerCase().includes(state.search.toLowerCase()),
  );

  if (state.category !== "all") {
    result = result.filter((product) => product.category === state.category);
  }

  result = [...result].sort((a, b) => {
    if (state.sort === "price-asc") return a.price - b.price;
    if (state.sort === "price-desc") return b.price - a.price;
    if (state.sort === "name-asc") return a.name.localeCompare(b.name);
    return b.rating - a.rating;
  });

  return result;
}

function createCard(product) {
  const card = document.createElement("article");
  card.className = "card";
  card.tabIndex = 0;
  card.dataset.id = product.id;

  const img = document.createElement("img");
  img.src = product.image;
  img.alt = product.name;

  const body = document.createElement("div");
  body.className = "card-body";

  const title = document.createElement("h3");
  title.textContent = product.name;

  const meta = document.createElement("div");
  meta.className = "card-row";
  const rating = document.createElement("span");
  rating.textContent = `⭐ ${product.rating}`;
  const stock = document.createElement("span");
  stock.textContent = product.inStock ? "Còn hàng" : "Hết hàng";
  meta.append(rating, stock);

  const footer = document.createElement("div");
  footer.className = "card-row";

  const price = document.createElement("strong");
  price.className = "price";
  price.textContent = formatMoney(product.price);

  const btn = document.createElement("button");
  btn.className = "add-btn";
  btn.textContent = "Thêm giỏ";
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    state.cartCount += 1;
    cartBadge.textContent = state.cartCount;
  });

  footer.append(price, btn);
  body.append(title, meta, footer);
  card.append(img, body);

  card.addEventListener("click", () => openModal(product));
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openModal(product);
    }
  });

  return card;
}

function renderCategories() {
  categoryGroup.replaceChildren();
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `chip${state.category === category ? " active" : ""}`;
    button.textContent = category === "all" ? "All" : category;
    button.addEventListener("click", () => {
      state.category = category;
      renderCategories();
      renderProducts();
    });
    categoryGroup.appendChild(button);
  });
}

function renderProducts() {
  grid.replaceChildren();
  getVisibleProducts().forEach((product) =>
    grid.appendChild(createCard(product)),
  );
}

function openModal(product) {
  modalRoot.replaceChildren();
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop";

  const modal = document.createElement("div");
  modal.className = "modal-content";

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "primary-btn";
  closeBtn.textContent = "Đóng";

  const title = document.createElement("h2");
  title.textContent = product.name;

  const img = document.createElement("img");
  img.src = product.image;
  img.alt = product.name;

  const info = document.createElement("p");
  info.textContent = `Danh mục: ${product.category} | Đánh giá: ${product.rating} | ${product.inStock ? "Còn hàng" : "Hết hàng"}`;

  const price = document.createElement("p");
  const priceStrong = document.createElement("strong");
  priceStrong.textContent = `Giá: ${formatMoney(product.price)}`;
  price.appendChild(priceStrong);

  modal.append(title, img, info, price, closeBtn);
  backdrop.appendChild(modal);
  modalRoot.appendChild(backdrop);

  closeBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) closeModal();
  });
}

function closeModal() {
  modalRoot.replaceChildren();
}

searchInput.addEventListener("input", (e) => {
  state.search = e.target.value;
  renderProducts();
});

sortSelect.addEventListener("change", (e) => {
  state.sort = e.target.value;
  renderProducts();
});

darkModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

renderCategories();
renderProducts();

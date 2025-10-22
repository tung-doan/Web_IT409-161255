// Lấy các phần tử DOM
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const categoryFilter = document.getElementById("categoryFilter");
const priceFilter = document.getElementById("priceFilter");
const resetFilterBtn = document.getElementById("resetFilterBtn");
const addProductBtn = document.getElementById("addProductBtn");
const addProductForm = document.getElementById("addProductForm");
const cancelAddBtn = document.getElementById("cancelAddBtn");

// === LocalStorage Functions ===

function getProductsFromStorage() {
  const productsJSON = localStorage.getItem("products");
  if (productsJSON) {
    return JSON.parse(productsJSON);
  }
  return null;
}

function saveProductsToStorage(products) {
  localStorage.setItem("products", JSON.stringify(products));
}

function initializeDefaultProducts() {
  const defaultProducts = [
    {
      id: "prod-1",
      name: "Sách: Hành trình tìm chính mình",
      category: "Tự lực",
      image:
        "https://png.pngtree.com/png-vector/20241102/ourmid/pngtree-a-open-book-with-blank-pages-on-isolated-png-image_14236021.png",
      description:
        "Cuốn sách tự lực giúp bạn khám phá bản thân và phát triển thói quen tích cực.",
      price: 120000,
    },
    {
      id: "prod-2",
      name: "Sách: Lịch sử thế giới ngắn gọn",
      category: "Lịch sử",
      image:
        "https://png.pngtree.com/png-vector/20241102/ourmid/pngtree-a-open-book-with-blank-pages-on-isolated-png-image_14236021.png",
      description:
        "Tóm tắt các mốc quan trọng trong lịch sử nhân loại, phù hợp cho mọi độc giả.",
      price: 150000,
    },
    {
      id: "prod-3",
      name: "Sách: Hướng dẫn lập trình cơ bản",
      category: "Lập trình",
      image:
        "https://png.pngtree.com/png-vector/20241102/ourmid/pngtree-a-open-book-with-blank-pages-on-isolated-png-image_14236021.png",
      description:
        "Giáo trình dễ hiểu dành cho người mới bắt đầu học lập trình.",
      price: 200000,
    },
  ];

  saveProductsToStorage(defaultProducts);
  return defaultProducts;
}

function createProductHTML(product) {
  const article = document.createElement("article");
  article.className = "product-item";
  article.setAttribute("aria-labelledby", product.id);
  article.setAttribute("data-category", product.category || "Khác");
  article.setAttribute("data-price", product.price);

  article.innerHTML = `
    <h3 id="${product.id}" class="product-name">${escapeHtml(product.name)}</h3>
    <span class="product-category" style="display: inline-block; background: #667eea; color: white; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.8rem; margin-bottom: 0.5rem;">${escapeHtml(
      product.category || "Khác"
    )}</span>
    <img src="${escapeHtml(product.image)}" alt="Bìa ${escapeHtml(
    product.name
  )}" />
    <p>${escapeHtml(product.description)}</p>
    <p>Giá: ${parseInt(product.price).toLocaleString("vi-VN")}₫</p>
  `;

  return article;
}

function renderProducts() {
  const productList = document.getElementById("product-list");
  const existingProducts = productList.querySelectorAll(".product-item");
  existingProducts.forEach((product) => product.remove());

  let products = getProductsFromStorage();

  if (!products || products.length === 0) {
    products = initializeDefaultProducts();
  }

  products.forEach((product) => {
    const productElement = createProductHTML(product);
    productList.appendChild(productElement);
  });
}

// === XỬ LÝ TÌM KIẾM VÀ LỌC NÂNG CAO ===

function filterProducts() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const selectedCategory = categoryFilter.value;
  const selectedPriceRange = priceFilter.value;

  const products = document.querySelectorAll(".product-item");
  let foundCount = 0;

  products.forEach((product) => {
    const productName = product.querySelector(".product-name");
    const productCategory = product.getAttribute("data-category");
    const productPrice = parseInt(product.getAttribute("data-price"));

    let matchesSearch = true;
    let matchesCategory = true;
    let matchesPrice = true;

    // Kiểm tra tìm kiếm theo tên
    if (searchTerm !== "") {
      const name = productName.textContent.toLowerCase();
      matchesSearch = name.includes(searchTerm);
    }

    // Kiểm tra lọc theo danh mục
    if (selectedCategory !== "") {
      matchesCategory = productCategory === selectedCategory;
    }

    // Kiểm tra lọc theo giá
    if (selectedPriceRange !== "") {
      const [minPrice, maxPrice] = selectedPriceRange.split("-").map(Number);
      matchesPrice = productPrice >= minPrice && productPrice <= maxPrice;
    }

    // Hiển thị nếu tất cả điều kiện đều đúng
    if (matchesSearch && matchesCategory && matchesPrice) {
      product.style.display = "";
      foundCount++;
    } else {
      product.style.display = "none";
    }
  });
  // Hiển thị thông báo nếu không tìm thấy sản phẩm
  showNoResultsMessage(foundCount);
}

// Hiển thị thông báo khi không tìm thấy sản phẩm
function showNoResultsMessage(count) {
  const productList = document.getElementById("product-list");
  let noResultsMsg = document.getElementById("noResultsMsg");

  if (count === 0) {
    if (!noResultsMsg) {
      noResultsMsg = document.createElement("p");
      noResultsMsg.id = "noResultsMsg";
      noResultsMsg.style.cssText =
        "text-align: center; padding: 2rem; color: #999; font-size: 1.1rem; width: 100%;";
      noResultsMsg.textContent =
        "❌ Không tìm thấy sản phẩm nào phù hợp với bộ lọc.";
      productList.appendChild(noResultsMsg);
    }
  } else {
    if (noResultsMsg) {
      noResultsMsg.remove();
    }
  }
}

// Reset tất cả bộ lọc
function resetFilters() {
  searchInput.value = "";
  categoryFilter.value = "";
  priceFilter.value = "";
  filterProducts();
}

// Gắn sự kiện
searchBtn.addEventListener("click", filterProducts);
searchInput.addEventListener("keyup", filterProducts);
categoryFilter.addEventListener("change", filterProducts);
priceFilter.addEventListener("change", filterProducts);
resetFilterBtn.addEventListener("click", resetFilters);

// === XỬ LÝ FORM THÊM SẢN PHẨM ===

function toggleAddProductForm() {
  addProductForm.classList.toggle("hidden");

  const errorMsg = document.getElementById("errorMsg");
  if (errorMsg) {
    errorMsg.textContent = "";
    errorMsg.style.display = "none";
  }

  if (!addProductForm.classList.contains("hidden")) {
    document.getElementById("productName").focus();
  }
}

addProductBtn.addEventListener("click", toggleAddProductForm);

cancelAddBtn.addEventListener("click", function () {
  addProductForm.classList.add("hidden");
  addProductForm.reset();

  const errorMsg = document.getElementById("errorMsg");
  if (errorMsg) {
    errorMsg.textContent = "";
    errorMsg.style.display = "none";
  }
});

addProductForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const productName = document.getElementById("productName").value.trim();
  const productCategory = document.getElementById("productCategory").value;
  const productImage = document.getElementById("productImage").value.trim();
  const productDesc = document.getElementById("productDesc").value.trim();
  const productPrice = document.getElementById("productPrice").value.trim();

  let errorMsg = document.getElementById("errorMsg");
  if (!errorMsg) {
    errorMsg = document.createElement("p");
    errorMsg.id = "errorMsg";
    errorMsg.style.color = "red";
    errorMsg.style.marginTop = "10px";
    errorMsg.style.padding = "10px";
    errorMsg.style.backgroundColor = "#fee";
    errorMsg.style.border = "1px solid #fcc";
    errorMsg.style.borderRadius = "4px";
    addProductForm.appendChild(errorMsg);
  }

  // VALIDATION
  if (productName === "") {
    errorMsg.textContent = "❌ Vui lòng nhập tên sản phẩm!";
    errorMsg.style.display = "block";
    document.getElementById("productName").focus();
    return;
  }

  if (productName.length < 3) {
    errorMsg.textContent = "❌ Tên sản phẩm phải có ít nhất 3 ký tự!";
    errorMsg.style.display = "block";
    document.getElementById("productName").focus();
    return;
  }

  if (productDesc === "") {
    errorMsg.textContent = "❌ Vui lòng nhập mô tả sản phẩm!";
    errorMsg.style.display = "block";
    document.getElementById("productDesc").focus();
    return;
  }

  if (productDesc.length < 10) {
    errorMsg.textContent = "❌ Mô tả sản phẩm phải có ít nhất 10 ký tự!";
    errorMsg.style.display = "block";
    document.getElementById("productDesc").focus();
    return;
  }

  const price = Number(productPrice);
  if (productPrice === "" || isNaN(price)) {
    errorMsg.textContent = "❌ Vui lòng nhập giá hợp lệ!";
    errorMsg.style.display = "block";
    document.getElementById("productPrice").focus();
    return;
  }

  if (price <= 0) {
    errorMsg.textContent = "❌ Giá sản phẩm phải lớn hơn 0!";
    errorMsg.style.display = "block";
    document.getElementById("productPrice").focus();
    return;
  }

  if (productImage !== "" && !isValidURL(productImage)) {
    errorMsg.textContent = "❌ URL hình ảnh không hợp lệ!";
    errorMsg.style.display = "block";
    document.getElementById("productImage").focus();
    return;
  }

  errorMsg.style.display = "none";

  const newProduct = {
    id: "prod-" + Date.now(),
    name: productName,
    category: productCategory,
    image:
      productImage ||
      "https://png.pngtree.com/png-vector/20241102/ourmid/pngtree-a-open-book-with-blank-pages-on-isolated-png-image_14236021.png",
    description: productDesc,
    price: price,
  };

  let products = getProductsFromStorage() || [];
  products.unshift(newProduct);
  saveProductsToStorage(products);

  renderProducts();

  addProductForm.reset();
  addProductForm.classList.add("hidden");

  alert("✅ Đã thêm sản phẩm thành công!");

  const firstProduct = document.querySelector(".product-item");
  if (firstProduct) {
    firstProduct.scrollIntoView({ behavior: "smooth", block: "center" });

    firstProduct.style.border = "2px solid #667eea";
    setTimeout(() => {
      firstProduct.style.border = "1px solid #ccc";
    }, 2000);
  }

  // Áp dụng lại bộ lọc sau khi thêm sản phẩm
  filterProducts();
});

// === HELPER FUNCTIONS ===

function isValidURL(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// === KHỞI TẠO KHI TRANG LOAD ===
document.addEventListener("DOMContentLoaded", function () {
  renderProducts();
});

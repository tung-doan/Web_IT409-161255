// Lấy các phần tử DOM
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const addProductBtn = document.getElementById("addProductBtn");
const addProductForm = document.getElementById("addProductForm");
const cancelAddBtn = document.getElementById("cancelAddBtn");

// === LocalStorage Functions ===

// Hàm lấy danh sách sản phẩm từ localStorage
function getProductsFromStorage() {
  const productsJSON = localStorage.getItem("products");
  if (productsJSON) {
    return JSON.parse(productsJSON);
  }
  return null;
}

// Hàm lưu danh sách sản phẩm vào localStorage
function saveProductsToStorage(products) {
  localStorage.setItem("products", JSON.stringify(products));
}

// Hàm khởi tạo sản phẩm mặc định
function initializeDefaultProducts() {
  const defaultProducts = [
    {
      id: "prod-1",
      name: "Sách: Hành trình tìm chính mình",
      image:
        "https://png.pngtree.com/png-vector/20241102/ourmid/pngtree-a-open-book-with-blank-pages-on-isolated-png-image_14236021.png",
      description:
        "Cuốn sách tự lực giúp bạn khám phá bản thân và phát triển thói quen tích cực.",
      price: 120000,
    },
    {
      id: "prod-2",
      name: "Sách: Lịch sử thế giới ngắn gọn",
      image:
        "https://png.pngtree.com/png-vector/20241102/ourmid/pngtree-a-open-book-with-blank-pages-on-isolated-png-image_14236021.png",
      description:
        "Tóm tắt các mốc quan trọng trong lịch sử nhân loại, phù hợp cho mọi độc giả.",
      price: 150000,
    },
    {
      id: "prod-3",
      name: "Sách: Hướng dẫn lập trình cơ bản",
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

// Hàm tạo HTML cho một sản phẩm
function createProductHTML(product) {
  const article = document.createElement("article");
  article.className = "product-item";
  article.setAttribute("aria-labelledby", product.id);

  article.innerHTML = `
    <h3 id="${product.id}" class="product-name">${escapeHtml(product.name)}</h3>
    <img src="${escapeHtml(product.image)}" alt="Bìa ${escapeHtml(
    product.name
  )}" />
    <p>${escapeHtml(product.description)}</p>
    <p>Giá: ${parseInt(product.price).toLocaleString("vi-VN")}₫</p>
  `;

  return article;
}

// Hàm render toàn bộ danh sách sản phẩm
function renderProducts() {
  const productList = document.getElementById("product-list");

  // Xóa tất cả sản phẩm hiện có (giữ lại h2, controls và form)
  const existingProducts = productList.querySelectorAll(".product-item");
  existingProducts.forEach((product) => product.remove());

  // Lấy sản phẩm từ localStorage
  let products = getProductsFromStorage();

  // Nếu chưa có, khởi tạo sản phẩm mặc định
  if (!products || products.length === 0) {
    products = initializeDefaultProducts();
  }

  // Render từng sản phẩm
  products.forEach((product) => {
    const productElement = createProductHTML(product);
    productList.appendChild(productElement);
  });
}

// Xử lý tìm kiếm sản phẩm
function searchProducts() {
  // Lấy giá trị tìm kiếm và chuyển về chữ thường
  const searchTerm = searchInput.value.toLowerCase().trim();

  // Lấy tất cả các sản phẩm (bao gồm cả sản phẩm mới thêm)
  const products = document.querySelectorAll(".product-item");

  let foundCount = 0;

  // Duyệt qua từng sản phẩm
  products.forEach((product) => {
    // Lấy tên sản phẩm
    const productName = product.querySelector(".product-name");

    if (productName) {
      const name = productName.textContent.toLowerCase();

      // Kiểm tra tên có chứa từ khóa không
      if (name.includes(searchTerm) || searchTerm === "") {
        // Hiển thị sản phẩm
        product.style.display = "";
        foundCount++;
      } else {
        // Ẩn sản phẩm
        product.style.display = "none";
      }
    }
  });
}

// Gắn sự kiện click cho nút tìm kiếm
searchBtn.addEventListener("click", searchProducts);

// Gắn sự kiện keyup cho ô input
searchInput.addEventListener("keyup", function (event) {
  // Tìm kiếm tự động khi gõ
  searchProducts();
});

// Xử lý hiển thị/ẩn form thêm sản phẩm
function toggleAddProductForm() {
  // Toggle class hidden
  addProductForm.classList.toggle("hidden");

  // Xóa thông báo lỗi khi mở form
  const errorMsg = document.getElementById("errorMsg");
  if (errorMsg) {
    errorMsg.textContent = "";
    errorMsg.style.display = "none";
  }

  // Nếu form đang hiển thị, focus vào ô đầu tiên
  if (!addProductForm.classList.contains("hidden")) {
    document.getElementById("productName").focus();
  }
}

// Gắn sự kiện click cho nút "Thêm sản phẩm"
addProductBtn.addEventListener("click", toggleAddProductForm);

// Gắn sự kiện click cho nút "Hủy"
cancelAddBtn.addEventListener("click", function () {
  addProductForm.classList.add("hidden");
  addProductForm.reset(); // Reset form khi hủy

  // Xóa thông báo lỗi
  const errorMsg = document.getElementById("errorMsg");
  if (errorMsg) {
    errorMsg.textContent = "";
    errorMsg.style.display = "none";
  }
});

// Xử lý submit form với validation và LocalStorage
addProductForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Ngăn form submit mặc định

  // Lấy dữ liệu từ form
  const productName = document.getElementById("productName").value.trim();
  const productImage = document.getElementById("productImage").value.trim();
  const productDesc = document.getElementById("productDesc").value.trim();
  const productPrice = document.getElementById("productPrice").value.trim();

  // Tạo hoặc lấy phần tử hiển thị lỗi
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

  // === VALIDATION ===
  // Kiểm tra tên sản phẩm
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

  // Kiểm tra mô tả
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

  // Kiểm tra giá
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

  // Kiểm tra URL hình ảnh (optional)
  if (productImage !== "" && !isValidURL(productImage)) {
    errorMsg.textContent = "❌ URL hình ảnh không hợp lệ!";
    errorMsg.style.display = "block";
    document.getElementById("productImage").focus();
    return;
  }

  // === Nếu validation thành công, xóa thông báo lỗi ===
  errorMsg.style.display = "none";

  // === Tạo đối tượng sản phẩm mới ===
  const newProduct = {
    id: "prod-" + Date.now(),
    name: productName,
    image:
      productImage ||
      "https://png.pngtree.com/png-vector/20241102/ourmid/pngtree-a-open-book-with-blank-pages-on-isolated-png-image_14236021.png",
    description: productDesc,
    price: price,
  };

  // === Lưu vào localStorage ===
  let products = getProductsFromStorage() || [];
  products.unshift(newProduct); // Thêm vào đầu mảng
  saveProductsToStorage(products);

  // === Render lại danh sách sản phẩm ===
  renderProducts();

  // Reset form và ẩn đi
  addProductForm.reset();
  addProductForm.classList.add("hidden");

  // Thông báo thành công
  alert("Đã thêm sản phẩm thành công");

  // Scroll đến sản phẩm mới (sản phẩm đầu tiên)
  const firstProduct = document.querySelector(".product-item");
  if (firstProduct) {
    firstProduct.scrollIntoView({ behavior: "smooth", block: "center" });

    // Highlight sản phẩm mới trong 2 giây
    firstProduct.style.border = "2px solid #667eea";
    setTimeout(() => {
      firstProduct.style.border = "1px solid #ccc";
    }, 2000);
  }
});

// === HELPER FUNCTIONS ===

// Hàm kiểm tra URL hợp lệ
function isValidURL(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Hàm escape HTML để tránh XSS
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
  // Render sản phẩm từ localStorage
  renderProducts();
});

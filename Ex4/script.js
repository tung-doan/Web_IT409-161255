// Lấy các phần tử DOM
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const addProductBtn = document.getElementById("addProductBtn");
const addProductForm = document.getElementById("addProductForm");
const cancelAddBtn = document.getElementById("cancelAddBtn");

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

  // Thông báo nếu không tìm thấy sản phẩm
  console.log(`Tìm thấy ${foundCount} sản phẩm`);
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
  }
});

// Xử lý submit form thêm sản phẩm với validation
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
    addProductForm.appendChild(errorMsg);
  }

  // === VALIDATION ===
  // Kiểm tra tên sản phẩm
  if (productName === "") {
    errorMsg.textContent = "❌ Vui lòng nhập tên sản phẩm!";
    document.getElementById("productName").focus();
    return;
  }

  if (productName.length < 3) {
    errorMsg.textContent = "❌ Tên sản phẩm phải có ít nhất 3 ký tự!";
    document.getElementById("productName").focus();
    return;
  }

  // Kiểm tra giá
  const price = Number(productPrice);
  if (productPrice === "" || isNaN(price)) {
    errorMsg.textContent = "❌ Vui lòng nhập giá hợp lệ!";
    document.getElementById("productPrice").focus();
    return;
  }

  if (price <= 0) {
    errorMsg.textContent = "❌ Giá sản phẩm phải lớn hơn 0!";
    document.getElementById("productPrice").focus();
    return;
  }

  // Kiểm tra mô tả
  if (productDesc === "") {
    errorMsg.textContent = "❌ Vui lòng nhập mô tả sản phẩm!";
    document.getElementById("productDesc").focus();
    return;
  }

  if (productDesc.length < 10) {
    errorMsg.textContent = "❌ Mô tả sản phẩm phải có ít nhất 10 ký tự!";
    document.getElementById("productDesc").focus();
    return;
  }

  // Kiểm tra URL hình ảnh (optional)
  if (productImage !== "" && !isValidURL(productImage)) {
    errorMsg.textContent = "❌ URL hình ảnh không hợp lệ!";
    document.getElementById("productImage").focus();
    return;
  }

  // === Nếu validation thành công, xóa thông báo lỗi ===
  errorMsg.textContent = "";

  // Tạo ID duy nhất cho sản phẩm mới
  const newId = "prod-" + Date.now();

  // Tạo phần tử article mới
  const newProduct = document.createElement("article");
  newProduct.className = "product-item";
  newProduct.setAttribute("aria-labelledby", newId);

  // Sử dụng ảnh mặc định nếu không có URL
  const imageUrl = productImage || 
    "https://png.pngtree.com/png-vector/20241102/ourmid/pngtree-a-open-book-with-blank-pages-on-isolated-png-image_14236021.png";

  // Thêm nội dung cho sản phẩm mới
  newProduct.innerHTML = `
    <h3 id="${newId}" class="product-name">${escapeHtml(productName)}</h3>
    <img src="${escapeHtml(imageUrl)}" alt="Bìa ${escapeHtml(productName)}" />
    <p>${escapeHtml(productDesc)}</p>
    <p>Giá: ${parseInt(price).toLocaleString("vi-VN")}₫</p>
  `;

  // Thêm sản phẩm vào đầu danh sách
  const productList = document.getElementById("product-list");
  
  // Tìm vị trí sau form để chèn sản phẩm
  const firstProduct = productList.querySelector(".product-item");
  if (firstProduct) {
    productList.insertBefore(newProduct, firstProduct);
  } else {
    productList.appendChild(newProduct);
  }

  // Reset form và ẩn đi
  addProductForm.reset();
  addProductForm.classList.add("hidden");

  // Thông báo thành công
  alert("✅ Đã thêm sản phẩm thành công!");

  // Scroll đến sản phẩm mới
  newProduct.scrollIntoView({ behavior: "smooth", block: "center" });

  // Highlight sản phẩm mới trong 2 giây
  newProduct.style.border = "2px solid #667eea";
  setTimeout(() => {
    newProduct.style.border = "1px solid #ccc";
  }, 2000);
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
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

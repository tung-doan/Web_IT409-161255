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

  // Lấy tất cả các sản phẩm
  const products = document.querySelectorAll(".product-item");

  // Duyệt qua từng sản phẩm
  products.forEach((product) => {
    // Lấy tên sản phẩm
    const productName = product.querySelector(".product-name");

    if (productName) {
      const name = productName.textContent.toLowerCase();

      // Kiểm tra tên có chứa từ khóa không
      if (name.includes(searchTerm)) {
        // Hiển thị sản phẩm
        product.style.display = "";
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
  // Nếu nhấn Enter, thực hiện tìm kiếm
  if (event.key === "Enter") {
    searchProducts();
  } else {
    // Tìm kiếm tự động khi gõ
    searchProducts();
  }
});

// Xử lý hiển thị/ẩn form thêm sản phẩm
function toggleAddProductForm() {
  // Toggle class hidden
  addProductForm.classList.toggle("hidden");

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
});

// Xử lý submit form thêm sản phẩm
addProductForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Ngăn form submit mặc định

  // Lấy dữ liệu từ form
  const productName = document.getElementById("productName").value;
  const productImage =
    document.getElementById("productImage").value ||
    "https://png.pngtree.com/png-vector/20241102/ourmid/pngtree-a-open-book-with-blank-pages-on-isolated-png-image_14236021.png";
  const productDesc = document.getElementById("productDesc").value;
  const productPrice = document.getElementById("productPrice").value;

  // Tạo ID duy nhất cho sản phẩm mới
  const newId = "prod-" + Date.now();

  // Tạo phần tử article mới
  const newProduct = document.createElement("article");
  newProduct.className = "product-item";
  newProduct.setAttribute("aria-labelledby", newId);

  // Thêm nội dung cho sản phẩm mới
  newProduct.innerHTML = `
    <h3 id="${newId}" class="product-name">${productName}</h3>
    <img src="${productImage}" alt="Bìa ${productName}" />
    <p>${productDesc}</p>
    <p>Giá: ${parseInt(productPrice).toLocaleString("vi-VN")}₫</p>
  `;

  // Thêm sản phẩm vào danh sách (trước phần tử cuối cùng trong section)
  const productList = document.getElementById("product-list");
  productList.appendChild(newProduct);

  // Reset form và ẩn đi
  addProductForm.reset();
  addProductForm.classList.add("hidden");

  // Thông báo thành công
  alert("Đã thêm sản phẩm thành công!");
});


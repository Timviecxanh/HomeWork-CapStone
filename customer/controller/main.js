let cart = [];
let productData = [];

const renderProducts = (data) => {
  let contentHTML = data
    .map(
      (p) => `
      <div class="product-card">
        <img src="${p.img}">
        <h3>${p.name}</h3>
        <p class="brand">${p.type}</p>
        <p class="desc">${p.desc}</p>
        <ul class="specs">
          <li><strong>Màn hình:</strong> ${p.screen}</li>
          <li><strong>Camera trước:</strong> ${p.frontCamera}</li>
          <li><strong>Camera sau:</strong> ${p.backCamera}</li>
        </ul>
        <div class="price">${p.price}</div>
        <button class="buy-btn" onclick="addToCart(${p.id})">Buy now</button>
      </div>`
    )
    .join("");
  document.getElementById("product-list").innerHTML = contentHTML;
};

const addToCart = (id) => {
  const product = productData.find((p) => p.id == id);
  if (!product) return;
  const found = cart.find((item) => item.id == id);
  if (found) found.quantity++;
  else cart.push({ ...product, quantity: 1 });

  saveCartToLocal();
  renderCart();
  updateTotal();
};

const renderCart = () => {
  let html = cart
    .map(
      (item) => `
      <div class="cart-item">
        <img src="${item.img}" alt="${item.name}" width="50">
        <span>${item.name}</span>
        <span>${item.price} VND</span>
        <div class="qty-controls">
          <button onclick="changeQty(${item.id}, -1)">-</button>
          <span>${item.quantity}</span>
          <button onclick="changeQty(${item.id}, 1)">+</button>
        </div>
        <span>${Number(item.price) * item.quantity} $</span>
      </div>`
    )
    .join("");
  document.getElementById("cartList").innerHTML = html;
};

const changeQty = (id, delta) => {
  const item = cart.find((i) => i.id == id);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) cart = cart.filter((i) => i.id != id);
  saveCartToLocal();
  renderCart();
  updateTotal();
};

const updateTotal = () => {
  const total = cart.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);
  document.getElementById("totalPrice").innerText =
    "Tổng tiền: " + total.toLocaleString() + " VND";
};

const saveCartToLocal = () =>
  localStorage.setItem("cart", JSON.stringify(cart));

const loadCartFromLocal = () => {
  const data = localStorage.getItem("cart");
  if (data) {
    cart = JSON.parse(data);
    renderCart();
    updateTotal();
  }
};

const setupFilter = () => {
  const filterSelect = document.getElementById("filter");
  filterSelect.addEventListener("change", (e) => {
    const value = e.target.value.trim();
    if (value === "Tat ca") renderProducts(productData);
    else {
      const filtered = productData.filter(
        (p) => p.type.trim().toLowerCase() === value.toLowerCase()
      );
      renderProducts(filtered);
    }
  });
};

const getListProducts = () => {
  axios({
    url: "https://68f8d29fdeff18f212b7a803.mockapi.io/Products/Products",
    method: "GET",
  })
    .then((result) => {
      productData = result.data;
      renderProducts(productData);
      setupFilter();
    })
    .catch((error) => console.log(error));
};

window.onload = () => {
  loadCartFromLocal();
  getListProducts();
};
const checkout = () => {
  if (cart.length === 0) {
    alert("Giỏ hàng trống, không thể thanh toán!");
    return;
  }

  const confirmCheckout = confirm("Bạn có chắc muốn thanh toán không?");
  if (!confirmCheckout) return;
  alert("Giỏ Hàng Đã Được Thanh Toán");
  // Reset giỏ hàng
  cart = [];
  saveCartToLocal();
  renderCart();
  updateTotal();
};

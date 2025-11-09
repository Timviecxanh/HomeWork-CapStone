import Product from "./product.js";
import Validate from "./validata.js";

const classvalidate = new Validate();

const getlistproduct = () => {
  const promise = axios({
    url: "https://68f8d29fdeff18f212b7a803.mockapi.io/Products/Products",
    method: "GET",
  });

  promise
    .then((result) => {
      // console.log(result.data)
      renderproduct(result.data);
      search(result.data);
      document.getElementById("sortSelect").addEventListener("change", () => {
        sortSelect(result.data);
      });
    })
    .catch(() => {
      console.log();
    });
};
getlistproduct();

const validation = (
  name,
  price,
  img,
  screen,
  backCamera,
  frontCamera,
  desc,
  type
) => {
  let isvalid = true;

  //Tên sản phẩm: không để trống.
  isvalid &=
    classvalidate.khongtrong(
      name,
      "tbname",
      "(*) Vui lòng nhập tên sản phẩm"
    ) &&
    classvalidate.checkLength(
      name,
      "tbname",
      "(*) Tên sản phẩm tối đa 20 ký tự",
      0,
      20
    );

  isvalid &=
    classvalidate.khongtrong(
      price,
      "tbprice",
      "(*) Vui lòng nhập giá sản phẩm"
    ) &&
    classvalidate.checknumber(price, "tbprice", "(*) Vui lòng nhập số") &&
    classvalidate.checksoduong(price, "tbprice", "(*) Vui lòng nhập số > 0");

  isvalid &= classvalidate.khongtrong(
    img,
    "tbimg",
    "(*) Vui lòng nhập hình ảnh"
  );

  isvalid &=
    classvalidate.khongtrong(
      screen,
      "tbscreen",
      "(*) Vui lòng nhập màn hình"
    ) &&
    classvalidate.checkLength(
      screen,
      "tbscreen",
      "(*) Màn hình tối đa 15 ký tự",
      0,
      15
    );

  isvalid &=
    classvalidate.khongtrong(
      backCamera,
      "tbbackCamera",
      "(*) Vui lòng nhập camera sau"
    ) &&
    classvalidate.checkLength(
      backCamera,
      "tbbackCamera",
      "(*) Camera sau tối đa 15 ký tự",
      0,
      15
    );

  isvalid &=
    classvalidate.khongtrong(
      frontCamera,
      "tbfrontCamera",
      "(*) Vui lòng nhập camera trước"
    ) &&
    classvalidate.checkLength(
      frontCamera,
      "tbfrontCamera",
      "(*) Camera trước tối đa 15 ký tự",
      0,
      15
    );

  isvalid &=
    classvalidate.khongtrong(desc, "tbdesc", "(*) Vui lòng nhập mô tả") &&
    classvalidate.checkLength(
      desc,
      "tbdesc",
      "(*) Mô tả sp tối đa 50 ký tự",
      0,
      50
    );

  isvalid &= classvalidate.checkOption(
    type,
    "tbtype",
    "(*) Vui lòng nhập loại"
  );

  return isvalid;
};

const getproductid = (id) => {
  const promise = axios({
    url: `https://68f8d29fdeff18f212b7a803.mockapi.io/Products/Products/${id}`,
    method: "GET",
  });

  promise
    .then((result) => {
      const product = result.data;
      document.getElementById("name").value = product.name;
      document.getElementById("price").value = product.price;
      document.getElementById("category").value = product.type;
      document.getElementById("img").value = product.img;
      document.getElementById("screen").value = product.screen;
      document.getElementById("backCamera").value = product.backCamera;
      document.getElementById("frontCamera").value = product.frontCamera;
      document.getElementById("desc").value = product.desc;
    })
    .catch((error) => {
      console.log(error);
    });
};

const updateproductid = (product) => {
  const promise = axios({
    url: `https://68f8d29fdeff18f212b7a803.mockapi.io/Products/Products/${product.id}`,
    method: "PUT",
    data: product,
  });

  promise
    .then((result) => {
      console.log(result);
      getlistproduct();
    })
    .catch((error) => {
      console.log(error);
    });
};

const renderproduct = (data) => {
  let product = "";

  for (let i = 0; i < data.length; i++) {
    const element = data[i];

    product += `

            <tr>
                <td>${i + 1}</td>
                <td>
                  <img src=${element.img} alt=${element.name}>
                </td>
                <td>${element.name}</td>
                <td>${Number(element.price).toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}</td>
                <td>${element.screen}</td>
                <td>${element.backCamera}</td>
                <td>${element.frontCamera}</td>
                <td>${element.desc}</td>
                <td>${element.type}</td>
                <td class="actions">
                  <button class="btn-edit" data-modal-target="crud-modal" data-modal-toggle="crud-modal" onclick="dandleeditProduct(${
                    element.id
                  })">
                    <i class="fa-solid fa-pencil"></i>
                  </button>
                  <button class="btn-delete" onclick="dandledeletetProduct(${
                    element.id
                  })">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
            </tr>
            `;
  }
  document.getElementById("product-list").innerHTML = product;

  //giúp Flowbite nhận diện các nút mới render
  initFlowbite();

  //fix lỗi
  // 🩵 Tự động loại bỏ focus khi modal bị ẩn để tránh cảnh báo "locked aria-hidden..."
  const observer = new MutationObserver(() => {
    const active = document.activeElement;
    if (active && active.closest("[aria-hidden='true']")) {
      active.blur(); // bỏ focus khỏi phần tử bị ẩn
    }
  });

  // Theo dõi toàn bộ body để phát hiện khi aria-hidden thay đổi (khi modal đóng)
  observer.observe(document.body, { attributes: true, subtree: true });
};

//lấy dữ liệu ra khi nhấn nút cập nhật
const dandleeditProduct = (id) => {
  // console.log(id)
  document.getElementById("themsp").innerHTML = "Cập nhật sản phẩm";

  document.getElementById("btn_footermodal").innerHTML = `
        <button 
                class="text-white inline-flex items-center gap-x-2 bg-blue-700 hover:bg-blue-800
                        focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg
                        text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700
                        dark:focus:ring-blue-800" onclick="dandleupdateProduct(${id})" id="updateproduct">
            <i class="fa-solid fa-pencil"></i>
            <span>Cập nhật sản phẩm</span>
        </button>
`;

  // Xóa toàn bộ thông báo lỗi (nếu có)
  const errorMessages = document.querySelectorAll(".sp-thongbao");
  errorMessages.forEach((el) => (el.innerText = "")); // hoặc el.textContent = ""

  getproductid(id);
};
window.dandleeditProduct = dandleeditProduct;

//cập nhật lại dữ liệu

const dandleupdateProduct = (id) => {
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const screen = document.getElementById("screen").value;
  const backCamera = document.getElementById("backCamera").value;
  const frontCamera = document.getElementById("frontCamera").value;
  const img = document.getElementById("img").value;
  const type = document.getElementById("category").value;
  const desc = document.getElementById("desc").value;

  const isValid = validation(
    name,
    price,
    img,
    screen,
    backCamera,
    frontCamera,
    desc,
    "category"
  );
  if (!isValid) return;

  const sp = new Product(
    id,
    name,
    price,
    screen,
    backCamera,
    frontCamera,
    img,
    type,
    desc
  );

  updateproductid(sp);

  document.getElementById("close_modal").click();
};

window.dandleupdateProduct = dandleupdateProduct;

//delete product

const dandledeletetProduct = (id) => {
  const promise = axios({
    url: `https://68f8d29fdeff18f212b7a803.mockapi.io/Products/Products/${id}`,
    method: "DELETE",
  });
  promise
    .then(() => {
      getlistproduct();
    })
    .catch((result) => {
      console.log(result);
    });
};
window.dandledeletetProduct = dandledeletetProduct;

//add product

document.getElementById("addproduct").onclick = () => {
  document.getElementById("themsp").innerHTML = "Thêm sản phẩm";

  document.getElementById("btn_footermodal").innerHTML = `
        <button 
                class="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800
                        focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg
                        text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700
                        dark:focus:ring-blue-800" onclick="dandleaddProduct()">
            <svg class="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clip-rule="evenodd"></path>
            </svg>
            <span>Thêm sản phẩm mới</span>
        </button>
`;
  document.getElementById("formmodal").reset();

  // Xóa toàn bộ thông báo lỗi (nếu có)
  const errorMessages = document.querySelectorAll(".sp-thongbao");
  errorMessages.forEach((el) => (el.innerText = "")); // hoặc el.textContent = ""
};

const dandleaddProduct = () => {
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const screen = document.getElementById("screen").value;
  const backCamera = document.getElementById("backCamera").value;
  const frontCamera = document.getElementById("frontCamera").value;
  const img = document.getElementById("img").value;
  const type = document.getElementById("category").value;
  const desc = document.getElementById("desc").value;

  // // Gọi và kiểm tra kết quả validation đúng cách
  const isValid = validation(
    name,
    price,
    img,
    screen,
    backCamera,
    frontCamera,
    desc,
    "category"
  );
  if (!isValid) return;

  const sp = new Product(
    "",
    name,
    price,
    screen,
    backCamera,
    frontCamera,
    img,
    type,
    desc
  );

  // if (!name || !price || !img || !type) {
  //     alert("Vui lòng nhập đầy đủ thông tin bắt buộc!");
  //     return;
  // }

  const promise = axios({
    url: `https://68f8d29fdeff18f212b7a803.mockapi.io/Products/Products`,
    method: "POST",
    data: sp,
  });
  promise
    .then(() => {
      getlistproduct();
    })
    .catch((result) => {
      console.log(result);
    });
  document.getElementById("close_modal").click();
};
window.dandleaddProduct = dandleaddProduct;

//search by name

//hàm bỏ dấu tiếng việt
const removeVietnameseTones = (str) => {
  return str
    .normalize("NFD") // tách dấu ra khỏi ký tự gốc
    .replace(/[\u0300-\u036f]/g, "") // xóa dấu
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase(); // chuyển về chữ thường
};

const search = (arr) => {
  document.getElementById("search-box").addEventListener("keyup", () => {
    const keyword = document.getElementById("search-box").value;

    let searchloai = [];

    const keywordNormalized = removeVietnameseTones(keyword);

    for (let i = 0; i < arr.length; i++) {
      const phone = arr[i];

      const loaiNormalized = removeVietnameseTones(phone.name);

      if (loaiNormalized.indexOf(keywordNormalized) !== -1) {
        searchloai.push(phone);
      }
    }

    renderproduct(searchloai);
  });
};

// Toggle sidebar on mobile
const toggle = document.querySelector(".menu-toggle");
const sidebar = document.querySelector(".sidebar");

// Khi click vào nút ☰ thì bật/tắt menu
toggle.addEventListener("click", (e) => {
  e.stopPropagation(); // Ngăn chặn click lan ra ngoài
  sidebar.classList.toggle("active");
});

// Khi click ra ngoài menu thì ẩn menu
document.addEventListener("click", (e) => {
  if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
    sidebar.classList.remove("active");
  }
});

document.addEventListener("submit", function (e) {
  e.preventDefault();
  console.log("Form submit bị chặn để không reload trang");
});

//Sắp xếp sản phẩm theo giá tiền (từ lớn đến bé, và ngược lại)

const sortSelect = (manggoc) => {
  const sort = document.getElementById("sortSelect").value;

  const data = [...manggoc];

  if (sort === "ascending") {
    //sắp xếp tăng
    for (let i = 0; i < data.length - 1; i++) {
      for (let j = i + 1; j < data.length; j++) {
        if (data[i].price > data[j].price) {
          let temp = data[i];
          data[i] = data[j];
          data[j] = temp;
        }
      }
    }
  } else if (sort === "descending") {
    //sắp xếp giảm
    for (let i = 0; i < data.length - 1; i++) {
      for (let j = i + 1; j < data.length; j++) {
        if (data[i].price < data[j].price) {
          let temp = data[i];
          data[i] = data[j];
          data[j] = temp;
        }
      }
    }
  } else if (sort === "none") {
    renderproduct(manggoc);
    return;
  }

  renderproduct(data);
};

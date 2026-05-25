// Toko Haur 🌿 - Sisi Pengguna Script
// Mengambil data secara dinamis dari db.js (localStorage)

document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const productContainer = document.getElementById("product-container");
  const searchInput = document.getElementById("search-input");
  const searchForm = document.getElementById("search-form");
  const categoryFilters = document.getElementById("category-filters");
  const shopStatusContent = document.getElementById("shop-status-content");
  const schedulesContent = document.getElementById("schedules-content");

  let activeCategory = "Semua";
  let searchQuery = "";

  // 1. Inisialisasi Tampilan Widget Toko & Jadwal
  renderShopStatus();
  renderSchedules();
  updateCartCount();

  // 2. Load & Display Products
  function getProductImageSrc(gambar) {
    if (!gambar) return "assets/img/image.png"; // Fallback logo
    if (gambar.startsWith("data:image") || gambar.startsWith("http://") || gambar.startsWith("https://")) {
      return gambar;
    }
    // Jika hanya nama file, cari di folder assets/img/ atau img/
    return `assets/img/${gambar}`;
  }

  function displayProducts() {
    productContainer.innerHTML = "";
    
    // Ambil data produk terbaru dari "database"
    const allProducts = typeof getProducts === "function" ? getProducts() : [];
    
    // Filter produk berdasarkan kategori dan pencarian
    const filteredProducts = allProducts.filter(product => {
      const matchCategory = activeCategory === "Semua" || product.kategori === activeCategory;
      const matchSearch = product.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (product.deskripsi && product.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchSearch;
    });

    if (filteredProducts.length === 0) {
      productContainer.innerHTML = `
        <div class="col-12 text-center py-5">
          <div class="glass-container py-5">
            <i class="fas fa-box-open fa-3x text-muted mb-3"></i>
            <h5 class="text-secondary">Produk Tidak Ditemukan</h5>
            <p class="text-muted">Cobalah kata kunci lain atau pilih kategori yang berbeda.</p>
          </div>
        </div>
      `;
      return;
    }

    filteredProducts.forEach((product) => {
      const cardCol = document.createElement("div");
      cardCol.classList.add("col-6", "col-md-6", "col-lg-4", "mb-4", "product-card-container");
      
      const priceFormatted = parseInt(product.harga).toLocaleString("id-ID");
      const imgUrl = getProductImageSrc(product.gambar);
      
      cardCol.innerHTML = `
        <div class="product-card">
          <div class="product-card-img-wrapper">
            <span class="product-category-tag">${product.kategori}</span>
            <img src="${imgUrl}" alt="${product.nama}" onerror="this.src='assets/img/image.png';" />
          </div>
          <div class="product-card-body">
            <h5 class="product-card-title">${product.nama}</h5>
            <p class="product-card-desc text-muted">${product.deskripsi || 'Produk kerajinan bambu premium berkualitas tinggi.'}</p>
            <div class="d-flex justify-content-between align-items-center mt-auto">
              <span class="product-card-price text-emerald">Rp ${priceFormatted}</span>
              <span class="badge bg-success-subtle text-success small border border-success-subtle">Stok: ${product.stok}</span>
            </div>
            <div class="product-card-actions mt-3">
              <a href="https://wa.me/6285220100211?text=Halo%20Haur%20Store,%20Saya%20tertarik%20untuk%20membeli%20${encodeURIComponent(product.nama)}" 
                 class="btn btn-premium btn-premium-primary" target="_blank">
                <i class="fab fa-whatsapp"></i> Beli
              </a>
              <button class="btn btn-premium btn-premium-secondary add-to-cart-btn" 
                      data-id="${product.id}" 
                      data-nama="${product.nama}" 
                      data-harga="${product.harga}"
                      data-gambar="${product.gambar}">
                <i class="fas fa-cart-plus"></i> +Keranjang
              </button>
            </div>
          </div>
        </div>
      `;
      productContainer.appendChild(cardCol);
    });

    // Tambah Event Listener ke Tombol Keranjang
    const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
    addToCartButtons.forEach(button => {
      button.addEventListener("click", handleAddToCart);
    });
  }

  // Jalankan display product pertama kali
  displayProducts();

  // 3. Handle Add to Cart
  function handleAddToCart(event) {
    const btn = event.currentTarget;
    const id = btn.getAttribute("data-id");
    const nama = btn.getAttribute("data-nama");
    const harga = btn.getAttribute("data-harga");
    const gambar = btn.getAttribute("data-gambar");

    let keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];
    
    // Cek apakah item sudah ada di keranjang
    const existingIndex = keranjang.findIndex(item => item.id === id || item.nama === nama);
    
    if (existingIndex !== -1) {
      // Jika ada, tambahkan kuantitasnya
      keranjang[existingIndex].qty = (keranjang[existingIndex].qty || 1) + 1;
    } else {
      // Jika belum ada, tambahkan item baru
      keranjang.push({
        id: id || Date.now().toString(),
        nama: nama,
        harga: harga,
        gambar: gambar || "",
        qty: 1
      });
    }

    localStorage.setItem("keranjang", JSON.stringify(keranjang));
    updateCartCount();

    // Trigger micro-animation pada floating cart
    const cartFloating = document.getElementById("cart-floating");
    if (cartFloating) {
      cartFloating.classList.add("btn-pulse");
      cartFloating.style.transform = "scale(1.2)";
      setTimeout(() => {
        cartFloating.style.transform = "";
        cartFloating.classList.remove("btn-pulse");
      }, 300);
    }

    // Tampilkan notifikasi toast/alert cantik (diimplementasikan menggunakan alert bawaan yang rapi)
    alert(`🌿 ${nama} berhasil ditambahkan ke keranjang belanja Anda!`);
  }

  // Helper Update Cart Count Badge
  function updateCartCount() {
    const cartCount = document.getElementById("cart-count");
    if (!cartCount) return;
    
    const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];
    const totalQty = keranjang.reduce((sum, item) => sum + (item.qty || 1), 0);
    cartCount.innerText = totalQty;
  }

  // 4. Handle Category Filter Click
  if (categoryFilters) {
    categoryFilters.addEventListener("click", (e) => {
      if (e.target.classList.contains("category-filter-btn")) {
        // Hapus kelas aktif dari tombol lain
        document.querySelectorAll(".category-filter-btn").forEach(btn => btn.classList.remove("active"));
        
        // Aktifkan tombol yang diklik
        e.target.classList.add("active");
        
        activeCategory = e.target.getAttribute("data-category");
        displayProducts();
      }
    });
  }

  // 5. Handle Search
  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      searchQuery = searchInput.value.trim();
      displayProducts();
    });
  }

  if (searchInput) {
    // Real-time search saat mengetik
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.trim();
      displayProducts();
    });
  }

  // 6. Render Shop Status Widget
  function renderShopStatus() {
    if (!shopStatusContent) return;
    
    const statusData = typeof getShopStatus === "function" ? getShopStatus() : null;
    if (!statusData) return;

    const isBuka = statusData.status === "Buka";
    const badgeColor = isBuka ? "bg-success" : "bg-danger";
    
    shopStatusContent.innerHTML = `
      <div class="d-flex align-items-center gap-2 mb-2">
        <span class="badge ${badgeColor} fs-6 px-3 py-2 rounded-pill"><i class="fas fa-clock"></i> Toko ${statusData.status}</span>
      </div>
      <p class="fw-bold mb-1 text-secondary">${statusData.jamOperasional}</p>
      <p class="small text-muted mb-0">${statusData.catatan}</p>
    `;
  }

  // 7. Render Schedules Widget
  function renderSchedules() {
    if (!schedulesContent) return;

    const schedules = typeof getSchedules === "function" ? getSchedules() : [];
    const activeSchedules = schedules.filter(s => s.status === "Aktif");

    if (activeSchedules.length === 0) {
      schedulesContent.innerHTML = `
        <p class="small text-muted text-center py-3">Tidak ada jadwal workshop terdekat.</p>
      `;
      return;
    }

    schedulesContent.innerHTML = "";
    activeSchedules.forEach(schedule => {
      const formattedDate = new Date(schedule.tanggal).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const schedEl = document.createElement("div");
      schedEl.classList.add("schedule-item");
      schedEl.innerHTML = `
        <div class="schedule-title">${schedule.judul}</div>
        <div class="schedule-meta mt-1">
          <span><i class="far fa-calendar-alt text-success me-1"></i> ${formattedDate}</span>
          <span><i class="far fa-clock text-success me-1"></i> ${schedule.waktu}</span>
          <span class="text-truncate"><i class="fas fa-map-marker-alt text-success me-1"></i> ${schedule.lokasi}</span>
          <span><i class="fas fa-users text-success me-1"></i> Kuota: <span class="fw-bold text-dark">${schedule.kuota}</span></span>
        </div>
      `;
      schedulesContent.appendChild(schedEl);
    });
  }
});

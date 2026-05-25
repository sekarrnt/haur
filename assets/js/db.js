// Database Lokal Toko Haur 🌿 - Menggunakan localStorage
// File ini mengelola inisialisasi data dan fungsi CRUD untuk Produk, Jadwal, Status Toko, dan Pesanan.

const DEFAULT_PRODUCTS = [
  {
    id: "1",
    nama: "Sepedah Dewasa",
    harga: "32000000",
    gambar: "Bambo.jpeg",
    kategori: "Sepeda",
    stok: 5,
    deskripsi: "Sepeda bambu dewasa premium dengan desain ergonomis, kuat, dan ramah lingkungan."
  },
  {
    id: "2",
    nama: "Sepedah Dewasa Wanita",
    harga: "11000000",
    gambar: "Sepeda Dewasa Wanita.jpeg",
    kategori: "Sepeda",
    stok: 4,
    deskripsi: "Sepeda bambu khusus wanita dengan rancangan rangka rendah untuk kenyamanan maksimal."
  },
  {
    id: "3",
    nama: "Sepedah Anak",
    harga: "1200000",
    gambar: "Sepdah Anak.jpeg",
    kategori: "Sepeda",
    stok: 8,
    deskripsi: "Sepeda bambu anak-anak yang ringan, aman, dan sangat cocok untuk melatih keseimbangan."
  },
  {
    id: "4",
    nama: "Tambler Bambo",
    harga: "150000",
    gambar: "Tambler Bambo.jpeg",
    kategori: "Aksesoris",
    stok: 25,
    deskripsi: "Tumbler minum elegan berlapis bambu alami dengan lapisan stainless steel penahan panas/dingin."
  },
  {
    id: "5",
    nama: "Cangkir Bambo",
    harga: "80000",
    gambar: "Cangkir Bambo.jpeg",
    kategori: "Aksesoris",
    stok: 30,
    deskripsi: "Cangkir minum artistik dari bambu pilihan untuk menikmati kopi atau teh dengan sensasi alami."
  },
  {
    id: "6",
    nama: "Helmet Sepedah",
    harga: "800000",
    gambar: "Helmet Bambo.jpeg",
    kategori: "Aksesoris",
    stok: 6,
    deskripsi: "Helm sepeda premium dengan lapisan luar serat bambu rajut yang kokoh dan berstandar keamanan tinggi."
  },
  {
    id: "7",
    nama: "Tas Bambo",
    harga: "150000",
    gambar: "Tas wanita Bambo.jpeg",
    kategori: "Fashion",
    stok: 12,
    deskripsi: "Tas wanita anyaman bambu handmade yang modis, sangat cocok untuk acara formal maupun santai."
  },
  {
    id: "8",
    nama: "Pot Bambo",
    harga: "30000",
    gambar: "Pot Bambo.jpeg",
    kategori: "Dekorasi",
    stok: 50,
    deskripsi: "Pot tanaman estetik dari potongan bambu alami untuk menghias meja kerja atau sudut ruangan."
  },
  {
    id: "9",
    nama: "Tanaman Bambo",
    harga: "35000",
    gambar: "Tanaman Bambo.jpeg",
    kategori: "Dekorasi",
    stok: 40,
    deskripsi: "Bibit tanaman bambu hias berkualitas yang segar dan siap dipindahkan ke taman Anda."
  },
  {
    id: "10",
    nama: "Media Tanam",
    harga: "22000",
    gambar: "Media Tnam Bambu.jpeg",
    kategori: "Dekorasi",
    stok: 100,
    deskripsi: "Media tanam khusus kaya unsur hara untuk menunjang pertumbuhan bambu hias secara optimal."
  },
  {
    id: "11",
    nama: "Bahan Baku / Batang",
    harga: "20000",
    gambar: "bambu.jpeg",
    kategori: "Bahan Baku",
    stok: 200,
    deskripsi: "Batang bambu utuh berkualitas tinggi, sudah melalui proses pengawetan terhadap rayap dan jamur."
  },
  {
    id: "12",
    nama: "Tusuk Sate / Pack",
    harga: "20000",
    gambar: "Tusuk Sate.jpeg",
    kategori: "Bahan Baku",
    stok: 150,
    deskripsi: "Tusuk sate bambu super halus, kokoh, higienis, dan tidak berbulu. Isi 500 pcs per pack."
  }
];

const DEFAULT_SCHEDULES = [
  {
    id: "s1",
    judul: "Workshop Pembuatan Kerajinan Bambu",
    tanggal: "2026-06-10",
    waktu: "09:00 - 15:00",
    lokasi: "Giri Harja Workshop, Bandung",
    kuota: "15 Orang",
    status: "Aktif",
    deskripsi: "Belajar langsung dasar-dasar menganyam dan merakit bambu menjadi cangkir dan pot estetik."
  },
  {
    id: "s2",
    judul: "Touring & Test Ride Sepeda Bambu Haur",
    tanggal: "2026-06-21",
    waktu: "06:30 - 10:00",
    lokasi: "Alun-Alun Bandung (Titik Kumpul)",
    kuota: "30 Orang",
    status: "Aktif",
    deskripsi: "Gowes santai bersama komunitas sambil mencoba ketangguhan dan kelenturan sepeda bambu Haur."
  }
];

const DEFAULT_SHOP_STATUS = {
  status: "Buka", // Buka / Tutup
  jamOperasional: "Senin - Sabtu: 08.00 - 17.00 WIB",
  catatan: "Hari Minggu/Libur Nasional kami tutup. Pemesanan via online tetap diterima dan akan diproses pada hari kerja berikutnya."
};

// Inisialisasi Database
function initDatabase() {
  if (!localStorage.getItem("haur_products")) {
    localStorage.setItem("haur_products", JSON.stringify(DEFAULT_PRODUCTS));
  }
  if (!localStorage.getItem("haur_schedules")) {
    localStorage.setItem("haur_schedules", JSON.stringify(DEFAULT_SCHEDULES));
  }
  if (!localStorage.getItem("haur_shop_status")) {
    localStorage.setItem("haur_shop_status", JSON.stringify(DEFAULT_SHOP_STATUS));
  }
  if (!localStorage.getItem("haur_orders")) {
    localStorage.setItem("haur_orders", JSON.stringify([]));
  }
}

// Jalankan inisialisasi langsung
initDatabase();

// --- API PRODUK ---
function getProducts() {
  return JSON.parse(localStorage.getItem("haur_products")) || [];
}

function saveProducts(products) {
  localStorage.setItem("haur_products", JSON.stringify(products));
}

function addProduct(product) {
  const products = getProducts();
  const newProduct = {
    id: Date.now().toString(),
    nama: product.nama,
    harga: product.harga.toString(),
    gambar: product.gambar || "placeholder.png",
    kategori: product.kategori || "Umum",
    stok: parseInt(product.stok) || 0,
    deskripsi: product.deskripsi || ""
  };
  products.push(newProduct);
  saveProducts(products);
  return newProduct;
}

function updateProduct(id, updatedData) {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = {
      ...products[index],
      nama: updatedData.nama,
      harga: updatedData.harga.toString(),
      gambar: updatedData.gambar || products[index].gambar,
      kategori: updatedData.kategori || "Umum",
      stok: parseInt(updatedData.stok) || 0,
      deskripsi: updatedData.deskripsi || ""
    };
    saveProducts(products);
    return true;
  }
  return false;
}

function deleteProduct(id) {
  let products = getProducts();
  products = products.filter(p => p.id !== id);
  saveProducts(products);
  return true;
}

// --- API JADWAL / WORKSHOP ---
function getSchedules() {
  return JSON.parse(localStorage.getItem("haur_schedules")) || [];
}

function saveSchedules(schedules) {
  localStorage.setItem("haur_schedules", JSON.stringify(schedules));
}

function addSchedule(schedule) {
  const schedules = getSchedules();
  const newSchedule = {
    id: Date.now().toString(),
    judul: schedule.judul,
    tanggal: schedule.tanggal,
    waktu: schedule.waktu,
    lokasi: schedule.lokasi,
    kuota: schedule.kuota || "Tidak Terbatas",
    status: schedule.status || "Aktif",
    deskripsi: schedule.deskripsi || ""
  };
  schedules.push(newSchedule);
  saveSchedules(schedules);
  return newSchedule;
}

function updateSchedule(id, updatedData) {
  const schedules = getSchedules();
  const index = schedules.findIndex(s => s.id === id);
  if (index !== -1) {
    schedules[index] = {
      ...schedules[index],
      judul: updatedData.judul,
      tanggal: updatedData.tanggal,
      waktu: updatedData.waktu,
      lokasi: updatedData.lokasi,
      kuota: updatedData.kuota,
      status: updatedData.status,
      deskripsi: updatedData.deskripsi
    };
    saveSchedules(schedules);
    return true;
  }
  return false;
}

// --- API JAM OPERASIONAL ---
function getShopStatus() {
  return JSON.parse(localStorage.getItem("haur_shop_status")) || DEFAULT_SHOP_STATUS;
}

function saveShopStatus(status) {
  localStorage.setItem("haur_shop_status", JSON.stringify(status));
}

// --- API ORDER / PESANAN ---
function getOrders() {
  return JSON.parse(localStorage.getItem("haur_orders")) || [];
}

function saveOrders(orders) {
  localStorage.setItem("haur_orders", JSON.stringify(orders));
}

function addOrder(orderData) {
  const orders = getOrders();
  const newOrder = {
    id: "ORD-" + Date.now().toString().slice(-6),
    tanggal: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    namaPelanggan: orderData.namaPelanggan,
    whatsapp: orderData.whatsapp,
    alamat: orderData.alamat,
    kurir: orderData.kurir,
    metodePembayaran: orderData.metodePembayaran,
    items: orderData.items, // Array dari { nama, harga, qty }
    total: orderData.total,
    status: "Pending" // Pending, Diproses, Dikirim, Selesai
  };
  orders.push(newOrder);
  saveOrders(orders);
  return newOrder;
}

function updateOrderStatus(id, newStatus) {
  const orders = getOrders();
  const index = orders.findIndex(o => o.id === id);
  if (index !== -1) {
    orders[index].status = newStatus;
    saveOrders(orders);
    return true;
  }
  return false;
}

function deleteOrder(id) {
  let orders = getOrders();
  orders = orders.filter(o => o.id !== id);
  saveOrders(orders);
  return true;
}

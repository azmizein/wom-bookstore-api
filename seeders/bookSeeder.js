const { Book } = require("../src/models");

const books = [
  // Teknologi
  {
    title: "Pemrograman JavaScript untuk Pemula",
    author: "Budi Raharjo",
    isbn: "978-6020001111",
    description:
      "Panduan lengkap belajar JavaScript dari dasar hingga mampu membuat aplikasi web interaktif.",
    price: 150000,
    stock: 20,
    publisher: "Informatika",
    publishedYear: 2020,
    category: "Teknologi",
  },
  {
    title: "Algoritma dan Struktur Data dengan Python",
    author: "Eko Kurniawan Khannedy",
    isbn: "978-6025238901",
    description:
      "Membahas konsep algoritma dan struktur data dengan pendekatan bahasa Python secara praktis.",
    price: 165000,
    stock: 15,
    publisher: "Gramedia",
    publishedYear: 2021,
    category: "Teknologi",
  },

  // Bisnis
  {
    title: "Bisnis Online dari Nol",
    author: "Rico Huang",
    isbn: "978-6020488011",
    description:
      "Langkah demi langkah membangun bisnis online dari awal tanpa modal besar.",
    price: 120000,
    stock: 30,
    publisher: "Kuncie Publishing",
    publishedYear: 2019,
    category: "Bisnis",
  },
  {
    title: "Rich Dad Poor Dad (Edisi Bahasa Indonesia)",
    author: "Robert T. Kiyosaki",
    isbn: "978-6020314471",
    description:
      "Pelajaran penting tentang cara berpikir dan bertindak agar mencapai kebebasan finansial.",
    price: 140000,
    stock: 25,
    publisher: "Gramedia Pustaka Utama",
    publishedYear: 2018,
    category: "Bisnis",
  },
  {
    title: "Seni untuk Bersikap Bodo Amat",
    author: "Mark Manson",
    isbn: "978-6024526986",
    description:
      "Cara sederhana agar hidup lebih tenang dengan tidak memusingkan hal-hal yang tidak penting.",
    price: 135000,
    stock: 40,
    publisher: "Gramedia Pustaka Utama",
    publishedYear: 2019,
    category: "Pengembangan Diri",
  },

  // Pengembangan Diri
  {
    title: "Filosofi Teras",
    author: "Henry Manampiring",
    isbn: "978-6024812348",
    description:
      "Belajar mengendalikan emosi dan mencapai ketenangan melalui filsafat Stoisisme.",
    price: 115000,
    stock: 35,
    publisher: "Kompas",
    publishedYear: 2018,
    category: "Pengembangan Diri",
  },
  {
    title: "Berani Tidak Disukai",
    author: "Ichiro Kishimi & Fumitake Koga",
    isbn: "978-6020633176",
    description:
      "Buku inspiratif yang mengajarkan kebebasan sejati dengan menerima diri apa adanya.",
    price: 130000,
    stock: 32,
    publisher: "Gramedia Pustaka Utama",
    publishedYear: 2020,
    category: "Pengembangan Diri",
  },

  // Fiksi
  {
    title: "Laskar Pelangi",
    author: "Andrea Hirata",
    isbn: "978-9793062792",
    description:
      "Kisah inspiratif tentang perjuangan anak-anak Belitung dalam mengejar pendidikan.",
    price: 95000,
    stock: 45,
    publisher: "Bentang Pustaka",
    publishedYear: 2005,
    category: "Fiksi",
  },
  {
    title: "Bumi Manusia",
    author: "Pramoedya Ananta Toer",
    isbn: "978-9799731234",
    description:
      "Novel klasik Indonesia tentang perjuangan manusia pribumi di masa penjajahan Belanda.",
    price: 110000,
    stock: 28,
    publisher: "Lentera Dipantara",
    publishedYear: 1980,
    category: "Fiksi",
  },
  {
    title: "Dilan 1990",
    author: "Pidi Baiq",
    isbn: "978-6027870413",
    description:
      "Cerita cinta remaja Bandung tahun 1990 antara Dilan dan Milea yang penuh kenangan.",
    price: 98000,
    stock: 38,
    publisher: "Pastel Books",
    publishedYear: 2014,
    category: "Fiksi",
  },
];

const bookSeeder = async () => {
  try {
    await Book.bulkCreate(books);

    const inStockCount = books.filter((b) => b.stock > 0).length;
    const outOfStockCount = books.filter((b) => b.stock === 0).length;
  } catch (error) {
    console.error("❌ Book seeder failed:", error);
    throw error;
  }
};

module.exports = bookSeeder;

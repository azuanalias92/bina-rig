import type { Dictionary } from "@/dictionaries/en";

export const dictMs: Dictionary = {
  title: "BinaRig",
  subtitle: "Pilih komponen dan lihat ringkasan binaan.",
  general: {
    notSelected: "Belum dipilih",
    chooseCategoryPrefix: "Pilih",
    dash: "—",
  },
  actions: {
    resetAll: "Tetapkan Semula",
    saveBuild: "Simpan Binaan",
    change: "Tukar",
    choose: "Pilih",
    remove: "Buang",
    exportList: "Eksport Senarai",
    checkout: "Bayar",
    select: "Pilih",
    close: "Tutup",
    buy: "Beli",
  },
  table: {
    title: "Ringkasan Binaan",
    category: "Kategori",
    part: "Komponen",
    price: "Harga",
    total: "Jumlah",
    brand: "Jenama",
    details: "Perincian",
    watt: "Watt Anggaran",
  },
  dialog: {
    chooseCategoryPrefix: "Pilih",
    choosePart: "Pilih Komponen",
  },
  categories: {
    cpu: "CPU",
    motherboard: "Papan Induk",
    gpu: "GPU",
    ram: "Memori (RAM)",
    storage: "Storan",
    psu: "Bekalan Kuasa",
    case: "Casing",
    cooler: "Penyejuk CPU",
  },
  themeToggle: {
    lightMode: "Mod Cerah",
    darkMode: "Mod Gelap",
    loading: "Memuat tema…",
  },
};
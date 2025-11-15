/* eslint-disable no-console */
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const baseCategories = [
  { key: "cpu", label: "CPU" },
  { key: "motherboard", label: "Motherboard" },
  { key: "gpu", label: "GPU" },
  { key: "ram", label: "Memory (RAM)" },
  { key: "storage", label: "Storage" },
  { key: "psu", label: "Power Supply" },
  { key: "case", label: "Case" },
  { key: "cooler", label: "CPU Cooler" },
];

const sampleParts = [
  { id: "cpu-1", name: "Ryzen 5 7600", brand: "AMD", price: 189, watt: 65, details: "6-Core, 12-Thread", categoryKey: "cpu" },
  { id: "cpu-2", name: "Core i5-13600K", brand: "Intel", price: 299, watt: 125, details: "14-Core hybrid", categoryKey: "cpu" },
  { id: "cpu-3", name: "Ryzen 7 7800X3D", brand: "AMD", price: 399, watt: 120, details: "Gaming focused", categoryKey: "cpu" },
  { id: "mb-1", name: "B650 Tomahawk", brand: "MSI", price: 179, watt: 35, details: "AM5, ATX", categoryKey: "motherboard" },
  { id: "mb-2", name: "Z790 AORUS Elite", brand: "Gigabyte", price: 249, watt: 40, details: "LGA1700, ATX", categoryKey: "motherboard" },
  { id: "mb-3", name: "B650M-A", brand: "ASUS", price: 129, watt: 30, details: "AM5, mATX", categoryKey: "motherboard" },
  { id: "gpu-1", name: "RTX 4070 Super", brand: "NVIDIA", price: 599, watt: 220, details: "12GB GDDR6X", categoryKey: "gpu" },
  { id: "gpu-2", name: "RX 7800 XT", brand: "AMD", price: 499, watt: 260, details: "16GB GDDR6", categoryKey: "gpu" },
  { id: "gpu-3", name: "RTX 4060", brand: "NVIDIA", price: 299, watt: 115, details: "8GB GDDR6", categoryKey: "gpu" },
  { id: "ram-1", name: "32GB DDR5 6000", brand: "Corsair", price: 119, watt: 10, details: "2x16GB", categoryKey: "ram" },
  { id: "ram-2", name: "16GB DDR5 5600", brand: "G.Skill", price: 69, watt: 8, details: "2x8GB", categoryKey: "ram" },
  { id: "ram-3", name: "64GB DDR5 6000", brand: "Kingston", price: 249, watt: 14, details: "2x32GB", categoryKey: "ram" },
  { id: "sto-1", name: "1TB NVMe SSD", brand: "Samsung 980", price: 79, watt: 5, details: "Gen3", categoryKey: "storage" },
  { id: "sto-2", name: "2TB NVMe SSD", brand: "WD Black SN850", price: 159, watt: 8, details: "Gen4", categoryKey: "storage" },
  { id: "sto-3", name: "4TB SATA SSD", brand: "Crucial MX500", price: 199, watt: 4, details: "SATA", categoryKey: "storage" },
  { id: "psu-1", name: "750W Gold", brand: "Seasonic", price: 129, watt: 0, details: "Fully Modular", categoryKey: "psu" },
  { id: "psu-2", name: "650W Bronze", brand: "Cooler Master", price: 69, watt: 0, details: "Semi Modular", categoryKey: "psu" },
  { id: "psu-3", name: "850W Gold", brand: "Corsair", price: 159, watt: 0, details: "Fully Modular", categoryKey: "psu" },
  { id: "case-1", name: "Meshify 2", brand: "Fractal", price: 169, watt: 0, details: "ATX, Airflow", categoryKey: "case" },
  { id: "case-2", name: "NZXT H5 Flow", brand: "NZXT", price: 99, watt: 0, details: "ATX, Airflow", categoryKey: "case" },
  { id: "case-3", name: "Lian Li O11 Dynamic", brand: "Lian Li", price: 149, watt: 0, details: "ATX, Showcase", categoryKey: "case" },
  { id: "cool-1", name: "Thermalright Peerless Assassin", brand: "Thermalright", price: 39, watt: 2, details: "Air, Dual Tower", categoryKey: "cooler" },
  { id: "cool-2", name: "Corsair H100i", brand: "Corsair", price: 139, watt: 10, details: "240mm AIO", categoryKey: "cooler" },
  { id: "cool-3", name: "Noctua NH-D15", brand: "Noctua", price: 99, watt: 2, details: "Air, Dual Tower", categoryKey: "cooler" },
];

async function main() {
  console.log("Seeding categories...");
  for (const c of baseCategories) {
    await prisma.category.upsert({
      where: { key: c.key },
      update: { label: c.label },
      create: { key: c.key, label: c.label },
    });
  }

  const cats = await prisma.category.findMany();
  const byKey = new Map(cats.map((c) => [c.key, c.id]));

  console.log("Seeding parts...");
  for (const p of sampleParts) {
    const catId = byKey.get(p.categoryKey);
    if (!catId) {
      console.warn(`Skipping part ${p.id} - missing category ${p.categoryKey}`);
      continue;
    }
    await prisma.part.upsert({
      where: { id: p.id },
      update: {
        name: p.name,
        brand: p.brand,
        price: p.price,
        watt: p.watt,
        details: p.details ?? null,
        categoryId: catId,
      },
      create: {
        id: p.id,
        name: p.name,
        brand: p.brand,
        price: p.price,
        watt: p.watt,
        details: p.details ?? null,
        categoryId: catId,
      },
    });
  }

  const counts = {
    categories: await prisma.category.count(),
    parts: await prisma.part.count(),
  };
  console.log("Seed complete:", counts);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
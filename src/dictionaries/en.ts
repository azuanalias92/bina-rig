export type Dictionary = {
  title: string;
  subtitle: string;
  general: {
    notSelected: string;
    chooseCategoryPrefix: string;
    dash: string;
  };
  actions: {
    resetAll: string;
    saveBuild: string;
    change: string;
    choose: string;
    remove: string;
    exportList: string;
    checkout: string;
    select: string;
    close: string;
    buy: string;
  };
  table: {
    title: string;
    category: string;
    part: string;
    price: string;
    total: string;
    brand: string;
    details: string;
    watt: string;
  };
  dialog: {
    chooseCategoryPrefix: string;
    choosePart: string;
  };
  categories: {
    cpu: string;
    motherboard: string;
    gpu: string;
    ram: string;
    storage: string;
    psu: string;
    case: string;
    cooler: string;
  };
  themeToggle: {
    lightMode: string;
    darkMode: string;
    loading: string;
  };
};

export const dictEn: Dictionary = {
  title: "BinaRig",
  subtitle: "Pick parts and see your build summary.",
  general: {
    notSelected: "Not selected",
    chooseCategoryPrefix: "Choose",
    dash: "—",
  },
  actions: {
    resetAll: "Reset All",
    saveBuild: "Save Build",
    change: "Change",
    choose: "Choose",
    remove: "Remove",
    exportList: "Export List",
    checkout: "Checkout",
    select: "Select",
    close: "Close",
    buy: "Buy",
  },
  table: {
    title: "Build Summary",
    category: "Category",
    part: "Part",
    price: "Price",
    total: "Total",
    brand: "Brand",
    details: "Details",
    watt: "Estimated Watt",
  },
  dialog: {
    chooseCategoryPrefix: "Choose",
    choosePart: "Choose Part",
  },
  categories: {
    cpu: "CPU",
    motherboard: "Motherboard",
    gpu: "GPU",
    ram: "Memory (RAM)",
    storage: "Storage",
    psu: "Power Supply",
    case: "Case",
    cooler: "CPU Cooler",
  },
  themeToggle: {
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    loading: "Loading theme…",
  },
};
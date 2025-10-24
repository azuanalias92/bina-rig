"use client";

import React, { useMemo, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { dictEn } from "@/dictionaries/en";
import { dictMs } from "@/dictionaries/ms";
import { formatMYR } from "@/lib/utils";
import { IoRefreshOutline, IoSaveOutline, IoOptionsOutline, IoTrashOutline, IoDownloadOutline, IoCartOutline, IoCheckmarkOutline, IoCloseOutline } from "react-icons/io5";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { ArrowUpDown } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const locales = ["ms", "en"] as const;
type Locale = (typeof locales)[number];

function useLocale(): Locale {
  const pathname = usePathname() ?? "/ms";
  const seg = pathname.split("/")[1];
  return locales.includes(seg as Locale) ? (seg as Locale) : "ms";
}

type Part = {
  id: string;
  name: string;
  brand: string;
  price: number;
  watt: number;
  details?: string;
};

type Catalog = {
  cpu: Part[];
  motherboard: Part[];
  gpu: Part[];
  ram: Part[];
  storage: Part[];
  psu: Part[];
  case: Part[];
  cooler: Part[];
};

const catalog: Catalog = {
  cpu: [
    { id: "cpu-1", name: "Ryzen 5 7600", brand: "AMD", price: 189, watt: 65, details: "6-Core, 12-Thread" },
    { id: "cpu-2", name: "Core i5-13600K", brand: "Intel", price: 299, watt: 125, details: "14-Core hybrid" },
    { id: "cpu-3", name: "Ryzen 7 7800X3D", brand: "AMD", price: 399, watt: 120, details: "Gaming focused" },
  ],
  motherboard: [
    { id: "mb-1", name: "B650 Tomahawk", brand: "MSI", price: 179, watt: 35, details: "AM5, ATX" },
    { id: "mb-2", name: "Z790 AORUS Elite", brand: "Gigabyte", price: 249, watt: 40, details: "LGA1700, ATX" },
    { id: "mb-3", name: "B650M-A", brand: "ASUS", price: 129, watt: 30, details: "AM5, mATX" },
  ],
  gpu: [
    { id: "gpu-1", name: "RTX 4070 Super", brand: "NVIDIA", price: 599, watt: 220, details: "12GB GDDR6X" },
    { id: "gpu-2", name: "RX 7800 XT", brand: "AMD", price: 499, watt: 260, details: "16GB GDDR6" },
    { id: "gpu-3", name: "RTX 4060", brand: "NVIDIA", price: 299, watt: 115, details: "8GB GDDR6" },
  ],
  ram: [
    { id: "ram-1", name: "32GB DDR5 6000", brand: "Corsair", price: 119, watt: 10, details: "2x16GB" },
    { id: "ram-2", name: "16GB DDR5 5600", brand: "G.Skill", price: 69, watt: 8, details: "2x8GB" },
    { id: "ram-3", name: "64GB DDR5 6000", brand: "Kingston", price: 249, watt: 14, details: "2x32GB" },
  ],
  storage: [
    { id: "sto-1", name: "1TB NVMe SSD", brand: "Samsung 980", price: 79, watt: 5, details: "Gen3" },
    { id: "sto-2", name: "2TB NVMe SSD", brand: "WD Black SN850", price: 159, watt: 8, details: "Gen4" },
    { id: "sto-3", name: "4TB SATA SSD", brand: "Crucial MX500", price: 199, watt: 4, details: "SATA" },
  ],
  psu: [
    { id: "psu-1", name: "750W Gold", brand: "Seasonic", price: 129, watt: 0, details: "Fully Modular" },
    { id: "psu-2", name: "650W Bronze", brand: "Cooler Master", price: 69, watt: 0, details: "Semi Modular" },
    { id: "psu-3", name: "850W Gold", brand: "Corsair", price: 159, watt: 0, details: "Fully Modular" },
  ],
  case: [
    { id: "case-1", name: "Meshify 2", brand: "Fractal", price: 169, watt: 0, details: "ATX, Airflow" },
    { id: "case-2", name: "NZXT H5 Flow", brand: "NZXT", price: 99, watt: 0, details: "ATX, Airflow" },
    { id: "case-3", name: "Lian Li O11 Dynamic", brand: "Lian Li", price: 149, watt: 0, details: "ATX, Showcase" },
  ],
  cooler: [
    { id: "cool-1", name: "Thermalright Peerless Assassin", brand: "Thermalright", price: 39, watt: 2, details: "Air, Dual Tower" },
    { id: "cool-2", name: "Corsair H100i", brand: "Corsair", price: 139, watt: 10, details: "240mm AIO" },
    { id: "cool-3", name: "Noctua NH-D15", brand: "Noctua", price: 99, watt: 2, details: "Air, Dual Tower" },
  ],
};

const baseCategories = [
  { key: "cpu", label: "CPU" },
  { key: "motherboard", label: "Motherboard" },
  { key: "gpu", label: "GPU" },
  { key: "ram", label: "Memory (RAM)" },
  { key: "storage", label: "Storage" },
  { key: "psu", label: "Power Supply" },
  { key: "case", label: "Case" },
  { key: "cooler", label: "CPU Cooler" },
] as const;

type CategoryKey = (typeof baseCategories)[number]["key"];

type Dict = typeof dictEn;

export default function Home() {
  const locale = useLocale();
  const dict: Dict = locale === "en" ? dictEn : dictMs;
  const localizedCategories = baseCategories.map((c) => ({ ...c, label: dict.categories[c.key] }));
  const [selected, setSelected] = useState<Record<CategoryKey, Part[]>>({
    cpu: [],
    motherboard: [],
    gpu: [],
    ram: [],
    storage: [],
    psu: [],
    case: [],
    cooler: [],
  });
  const multiKeys: CategoryKey[] = ["ram", "storage", "gpu"];
  const [openCategory, setOpenCategory] = useState<CategoryKey | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const STORAGE_KEY = "binarig:selected";

  const selectionToIds = (sel: Record<CategoryKey, Part[]>): Record<CategoryKey, string[]> => ({
    cpu: sel.cpu.map((p) => p.id),
    motherboard: sel.motherboard.map((p) => p.id),
    gpu: sel.gpu.map((p) => p.id),
    ram: sel.ram.map((p) => p.id),
    storage: sel.storage.map((p) => p.id),
    psu: sel.psu.map((p) => p.id),
    case: sel.case.map((p) => p.id),
    cooler: sel.cooler.map((p) => p.id),
  });

  const idsToSelection = (ids: Record<CategoryKey, string[]>): Record<CategoryKey, Part[]> => ({
    cpu: catalog.cpu.filter((p) => ids.cpu?.includes(p.id)),
    motherboard: catalog.motherboard.filter((p) => ids.motherboard?.includes(p.id)),
    gpu: catalog.gpu.filter((p) => ids.gpu?.includes(p.id)),
    ram: catalog.ram.filter((p) => ids.ram?.includes(p.id)),
    storage: catalog.storage.filter((p) => ids.storage?.includes(p.id)),
    psu: catalog.psu.filter((p) => ids.psu?.includes(p.id)),
    case: catalog.case.filter((p) => ids.case?.includes(p.id)),
    cooler: catalog.cooler.filter((p) => ids.cooler?.includes(p.id)),
  });

  // Load initial selection from localStorage
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<CategoryKey, string[]>;
        setSelected(idsToSelection(parsed));
      }
    } catch (err) {
      // ignore parse errors
    }
  }, []);

  // Persist selection to localStorage whenever it changes
  React.useEffect(() => {
    try {
      const ids = selectionToIds(selected);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch (err) {
      // ignore save errors
    }
  }, [selected]);

  const total = useMemo(() => Object.values(selected).reduce((sum, arr) => sum + arr.reduce((s, p) => s + p.price, 0), 0), [selected]);
  const totalWatt = useMemo(() => Object.values(selected).reduce((sum, arr) => sum + arr.reduce((s, p) => s + p.watt, 0), 0), [selected]);

  const resetAll = () => {
    const empty: Record<CategoryKey, Part[]> = {
      cpu: [],
      motherboard: [],
      gpu: [],
      ram: [],
      storage: [],
      psu: [],
      case: [],
      cooler: [],
    };
    setSelected(empty);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      // ignore
    }
  };

  const exportToPdf = () => {
    const doc = new jsPDF();

    // Set document properties and branding header
    doc.setProperties({
      title: `BinaRig ${dict.table.title}`,
      subject: "PC Build Summary",
      author: "BinaRig",
      creator: "BinaRig",
    });

    const marginLeft = 14;
    doc.setTextColor(2, 132, 199); // sky-600
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("BinaRig", marginLeft, 16);

    const head = [[dict.table.category, dict.table.part, dict.table.price, dict.table.watt, dict.actions.buy]];
    const flattened = localizedCategories.flatMap(({ key, label }) => {
      const parts = selected[key];
      if (parts.length === 0) {
        return [{ label, part: null as Part | null }];
      }
      return parts.map((p) => ({ label, part: p }));
    });
    const body = flattened.map((row) => [
      row.label,
      row.part ? `${row.part.name} (${row.part.brand})` : dict.general.dash,
      row.part ? formatMYR(row.part.price, locale) : dict.general.dash,
      row.part ? `${row.part.watt} W` : dict.general.dash,
      row.part ? dict.actions.buy : dict.general.dash,
    ]);

    const buyLinks = flattened.map((row) => {
      if (!row.part) return null;
      const q = encodeURIComponent(`${row.part.brand} ${row.part.name}`);
      return locale === "ms" ? `https://shopee.com.my/search?keyword=${q}` : `https://www.google.com/search?q=${q}`;
    });

    body.push(["", dict.table.total, formatMYR(total, locale), `${totalWatt} W`, ""]);

    autoTable(doc, {
      head,
      body,
      styles: { font: "helvetica" },
      theme: "striped",
      headStyles: { fillColor: [2, 132, 199], textColor: 255 }, // sky-600
      columnStyles: {
        2: { halign: "right" },
        3: { halign: "right" },
        4: { halign: "right" },
      },
      margin: { top: 28 }, // leave space for header
      didDrawPage: (data) => {
        // Re-draw branding on each page
        doc.setTextColor(2, 132, 199);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("BinaRig", marginLeft, 16);

        doc.setTextColor(60);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.text(`${dict.table.title} • ${new Date().toLocaleDateString()} • ${locale.toUpperCase()}`, marginLeft, 23);
      },
      didDrawCell: (data) => {
        if (data.section === "body" && data.column.index === 4) {
          const url = buyLinks[data.row.index];
          if (url) {
            doc.link(data.cell.x, data.cell.y, data.cell.width, data.cell.height, { url });
          }
        }
      },
    });

    doc.save(`binarig-build-summary-${locale}.pdf`);
  };

  const choosePart = (key: CategoryKey, part: Part) => {
    setSelected((s) => {
      const isMulti = multiKeys.includes(key);
      const existing = s[key];
      if (isMulti) {
        if (existing.some((p) => p.id === part.id)) return s;
        return { ...s, [key]: [...existing, part] };
      } else {
        return { ...s, [key]: [part] };
      }
    });
    setOpenCategory(null);
  };

  const removePart = (key: CategoryKey, part?: Part) => {
    setSelected((s) => {
      if (!part) {
        return { ...s, [key]: [] };
      }
      return { ...s, [key]: s[key].filter((p) => p.id !== part.id) };
    });
  };

  const buyPart = (part: Part) => {
    const q = encodeURIComponent(`${part.brand} ${part.name}`);
    const url = locale === "ms" ? `https://shopee.com.my/search?keyword=${q}` : `https://www.google.com/search?q=${q}`;
    window.open(url, "_blank", "noopener");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-6xl px-4 py-10">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{dict.title}</h1>
            <p className="text-muted-foreground">{dict.subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Button variant="secondary" onClick={resetAll} className="w-full sm:w-auto">
              <IoRefreshOutline className="mr-2 size-4" />
              {dict.actions.resetAll}
            </Button>
            <Button className="w-full sm:w-auto">
              <IoSaveOutline className="mr-2 size-4" />
              {dict.actions.saveBuild}
            </Button>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {localizedCategories.map(({ key, label }, idx) => {
            const parts = selected[key];
            const has = parts.length > 0;
            const isMulti = multiKeys.includes(key);
            return (
              <Card
                key={key}
                className={mounted ? "flex flex-col" : "flex flex-col opacity-0"}
                style={{ animationDuration: "600ms", animationDelay: `${idx * 120}ms` }}
              >
                <CardHeader className="flex-col sm:flex-row items-start sm:items-center justify-between space-y-0">
                  <div className="flex flex-row gap-2">
                    <CardTitle className="text-lg">{label}</CardTitle>
                    {has ? (
                      isMulti ? <Badge>{`${parts.length}x`}</Badge> : <Badge>{parts[0].brand}</Badge>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="flex flex-row gap-2">
                    <Button variant="secondary" onClick={() => setOpenCategory(key)} className={has ? "w-1/2 sm:w-auto" : "w-full sm:w-auto"}>
                      <IoOptionsOutline className="mr-2 size-4" />
                      {has ? dict.actions.change : dict.actions.choose}
                    </Button>
                    {has && (
                      <Button variant="destructive" onClick={() => removePart(key)} className="w-1/2 sm:w-auto">
                        <IoTrashOutline className="mr-2 size-4" />
                        {dict.actions.remove}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {has ? (
                    <div className="flex flex-col gap-2">
                      {parts.map((p) => (
                        <div key={p.id} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="font-medium">{p.name}</p>
                            <p className="text-sm text-muted-foreground font-mono tabular-nums">{p.details}</p>
                            <p className="text-xs text-muted-foreground font-mono tabular-nums">{`≈ ${p.watt} W`}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold font-mono tabular-nums">{formatMYR(p.price, locale)}</p>
                            {isMulti ? (
                              <Button variant="destructive" size="sm" onClick={() => removePart(key, p)} className="mt-1">
                                <IoTrashOutline className="mr-2 size-4" />
                                {dict.actions.remove}
                              </Button>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {dict.general.chooseCategoryPrefix} {label}.
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </section>

        <section className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>{dict.table.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table className="min-w-[640px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>{dict.table.category}</TableHead>
                      <TableHead>{dict.table.part}</TableHead>
                      <TableHead className="text-right">{dict.table.price}</TableHead>
                      <TableHead className="text-right">{dict.table.watt}</TableHead>
                      <TableHead className="text-right"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {localizedCategories.flatMap(({ key, label }) => {
                      const parts = selected[key];
                      const rows = parts.length > 0 ? parts.map((p) => ({ part: p })) : [{ part: null as Part | null }];
                      return rows.map((row, idx) => (
                        <TableRow key={`${key}-${row.part ? row.part.id : "empty"}-${idx}`}>
                          <TableCell className="font-medium">{label}</TableCell>
                          <TableCell>
                            {row.part ? (
                              <>
                                {row.part.name} <span className="text-muted-foreground text-sm">({row.part.brand})</span>
                              </>
                            ) : (
                              <span className="text-muted-foreground">{dict.general.dash}</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right font-mono tabular-nums whitespace-nowrap">{row.part ? formatMYR(row.part.price, locale) : dict.general.dash}</TableCell>
                          <TableCell className="text-right font-mono tabular-nums whitespace-nowrap">{row.part ? `≈ ${row.part.watt} W` : dict.general.dash}</TableCell>
                          <TableCell className="text-right">
                            {row.part ? (
                              <Button size="sm" onClick={() => buyPart(row.part!)}>
                                 <IoCartOutline className="mr-2 size-4" />
                                 {dict.actions.buy}
                               </Button>
                            ) : (
                              <span className="text-muted-foreground">{dict.general.dash}</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ));
                    })}
                    <TableRow>
                      <TableCell />
                      <TableCell className="font-semibold">{dict.table.total}</TableCell>
                      <TableCell className="text-right font-semibold font-mono tabular-nums whitespace-nowrap">{formatMYR(total, locale)}</TableCell>
                      <TableCell className="text-right font-semibold font-mono tabular-nums whitespace-nowrap">{`≈ ${totalWatt} W`}</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="secondary" onClick={exportToPdf}>
                <IoDownloadOutline className="mr-2 size-4" />
                {dict.actions.exportList}
              </Button>
              {/* <Button>
                <IoCartOutline className="mr-2 size-4" />
                {dict.actions.checkout}
              </Button> */}
            </CardFooter>
          </Card>
        </section>
      </main>

      <Dialog open={openCategory !== null} onOpenChange={(open) => !open && setOpenCategory(null)}>
        <DialogContent className="fixed inset-0 top-0 left-0 translate-x-0 translate-y-0 max-w-none w-screen h-screen sm:w-[95vw] sm:h-[85vh] p-4 sm:p-6 overflow-hidden rounded-none sm:rounded-xl grid grid-rows-[auto_1fr_auto]">
          <DialogHeader>
            <DialogTitle>
              {openCategory ? `${dict.dialog.chooseCategoryPrefix} ${localizedCategories.find((c) => c.key === openCategory)?.label}` : dict.dialog.choosePart}
            </DialogTitle>
          </DialogHeader>

          {openCategory && (
            <div className="flex-1 overflow-hidden">
              <DataTable<Part, unknown> columns={getPartColumns(dict, locale, (p) => choosePart(openCategory, p))} data={catalog[openCategory]} filterKey="name" />
            </div>
          )}

          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpenCategory(null)}>
              <IoCloseOutline className="mr-2 size-4" />
              {dict.actions.close}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function getPartColumns(dict: typeof dictEn, locale: Locale, onSelect: (p: Part) => void): ColumnDef<Part, unknown>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }: { column: any }) => (
        <button className="inline-flex items-center gap-1" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          {dict.table.part}
          <ArrowUpDown className="size-4 opacity-60" />
        </button>
      ),
    },
    {
      accessorKey: "brand",
      header: ({ column }: { column: any }) => (
        <button className="inline-flex items-center gap-1" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          {dict.table.brand}
          <ArrowUpDown className="size-4 opacity-60" />
        </button>
      ),
    },
    {
      accessorKey: "details",
      header: dict.table.details,
      cell: ({ row }: { row: any }) => <span className="text-muted-foreground font-mono tabular-nums">{row.original.details}</span>,
    },
    {
      accessorKey: "watt",
      header: ({ column }: { column: any }) => (
        <button className="inline-flex items-center gap-1 justify-end w-full" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          {dict.table.watt}
          <ArrowUpDown className="size-4 opacity-60" />
        </button>
      ),
      cell: ({ row }: { row: any }) => <div className="text-right font-mono tabular-nums whitespace-nowrap">{`≈ ${row.original.watt} W`}</div>,
    },
    {
      accessorKey: "price",
      header: ({ column }: { column: any }) => (
        <button className="inline-flex items-center gap-1 justify-end w-full" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          {dict.table.price}
          <ArrowUpDown className="size-4 opacity-60" />
        </button>
      ),
      cell: ({ row }: { row: any }) => <div className="text-right font-mono tabular-nums whitespace-nowrap">{formatMYR(row.original.price, locale)}</div>,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }: { row: any }) => (
        <div className="text-right">
          <Button size="sm" onClick={() => onSelect(row.original)}>
            <IoCheckmarkOutline className="mr-2 size-4" />
            {dict.actions.select}
          </Button>
        </div>
      ),
    },
  ];
}

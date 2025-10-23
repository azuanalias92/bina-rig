"use client";

import React, { useMemo, useState } from "react";
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

  const localizedCategories = baseCategories.map(({ key }) => ({
    key: key as CategoryKey,
    label: dict.categories[key as CategoryKey],
  }));

  const [selected, setSelected] = useState<Record<CategoryKey, Part | null>>({
    cpu: null,
    motherboard: null,
    gpu: null,
    ram: null,
    storage: null,
    psu: null,
    case: null,
    cooler: null,
  });
  const [openCategory, setOpenCategory] = useState<CategoryKey | null>(null);

  const total = useMemo(() => Object.values(selected).reduce((sum, part) => sum + (part?.price ?? 0), 0), [selected]);

  const totalWatt = useMemo(() => Object.values(selected).reduce((sum, part) => sum + (part?.watt ?? 0), 0), [selected]);

  const resetAll = () => {
    const empty: Record<CategoryKey, Part | null> = {
      cpu: null,
      motherboard: null,
      gpu: null,
      ram: null,
      storage: null,
      psu: null,
      case: null,
      cooler: null,
    };
    setSelected(empty);
  };

  const choosePart = (key: CategoryKey, part: Part) => {
    setSelected((s) => ({ ...s, [key]: part }));
    setOpenCategory(null);
  };

  const removePart = (key: CategoryKey) => {
    setSelected((s) => ({ ...s, [key]: null }));
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
          {localizedCategories.map(({ key, label }) => {
            const part = selected[key];
            return (
              <Card key={key} className="flex flex-col">
                <CardHeader className="flex-col sm:flex-row items-start sm:items-center justify-between space-y-0">
                  <div className="flex flex-row gap-2">
                    <CardTitle className="text-lg">{label}</CardTitle>
                    {part ? <Badge>{part.brand}</Badge> : <></>}
                  </div>
                  <div className="flex flex-row gap-2">
                    <Button variant="secondary" onClick={() => setOpenCategory(key)} className={part ? "w-1/2 sm:w-auto" : "w-full sm:w-auto"}>
                      <IoOptionsOutline className="mr-2 size-4" />
                      {part ? dict.actions.change : dict.actions.choose}
                    </Button>
                    {part && (
                      <Button variant="destructive" onClick={() => removePart(key)} className="w-1/2 sm:w-auto">
                        <IoTrashOutline className="mr-2 size-4" />
                        {dict.actions.remove}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {part ? (
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-medium">{part.name}</p>
                        <p className="text-sm text-muted-foreground font-mono tabular-nums">{part.details}</p>
                        <p className="text-xs text-muted-foreground font-mono tabular-nums">≈ {part.watt} W</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold font-mono tabular-nums">{formatMYR(part.price, locale)}</p>
                      </div>
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {localizedCategories.map(({ key, label }) => {
                      const part = selected[key];
                      return (
                        <TableRow key={key}>
                          <TableCell className="font-medium">{label}</TableCell>
                          <TableCell>
                            {part ? (
                              <>
                                {part.name} <span className="text-muted-foreground text-sm">({part.brand})</span>
                              </>
                            ) : (
                              <span className="text-muted-foreground">{dict.general.dash}</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right font-mono tabular-nums whitespace-nowrap">{part ? formatMYR(part.price, locale) : dict.general.dash}</TableCell>
                          <TableCell className="text-right font-mono tabular-nums whitespace-nowrap">{part ? `≈ ${part.watt} W` : dict.general.dash}</TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow>
                      <TableCell />
                      <TableCell className="font-semibold">{dict.table.total}</TableCell>
                      <TableCell className="text-right font-semibold font-mono tabular-nums whitespace-nowrap">{formatMYR(total, locale)}</TableCell>
                      <TableCell className="text-right font-semibold font-mono tabular-nums whitespace-nowrap">{`≈ ${totalWatt} W`}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="secondary">
                <IoDownloadOutline className="mr-2 size-4" />
                {dict.actions.exportList}
              </Button>
              <Button>
                <IoCartOutline className="mr-2 size-4" />
                {dict.actions.checkout}
              </Button>
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

import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Search, ShoppingCart, Truck } from "lucide-react";
import { products } from "@/data/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Produtos — Storm | Capacetes NORISK com Frete Grátis" },
      {
        name: "description",
        content:
          "Confira 73 capacetes NORISK com preços promocionais, frete expresso e entrega para todo o Brasil na Storm.",
      },
      { property: "og:title", content: "Produtos — Storm | Capacetes NORISK" },
      {
        property: "og:description",
        content:
          "Capacetes NORISK Soul II, Darth II, Razor e mais com desconto e frete grátis para todo o Brasil.",
      },
    ],
  }),
  component: ProdutosPage,
});

const toNumber = (v: string) => Number(v.replace(/\./g, "").replace(",", "."));

function ProdutosPage() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("relevancia");

  const list = useMemo(() => {
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(query.trim().toLowerCase()),
    );
    if (sort === "menor") return [...filtered].sort((a, b) => toNumber(a.price) - toNumber(b.price));
    if (sort === "maior") return [...filtered].sort((a, b) => toNumber(b.price) - toNumber(a.price));
    return filtered;
  }, [query, sort]);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <div className="bg-primary py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground">
        Frete grátis para todo o Brasil
      </div>

      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center gap-8 px-4 sm:px-6">
          <a href="/" className="font-display text-2xl font-black italic tracking-tight">
            STORM
          </a>
          <nav className="hidden items-center gap-7 text-sm font-medium lg:flex">
            {["Produtos", "Capacetes", "Jaquetas", "Acessórios"].map((item) => (
              <a
                key={item}
                href="/"
                className="text-foreground/80 transition-colors hover:text-foreground"
              >
                {item}
              </a>
            ))}
          </nav>
          <div className="relative ml-auto hidden max-w-md flex-1 md:block">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar produtos..."
              className="h-11 w-full rounded-full border border-border bg-background pl-11 pr-4 text-sm outline-none transition focus:border-foreground/40"
            />
          </div>
          <button
            aria-label="Carrinho"
            className="ml-auto flex size-10 items-center justify-center rounded-full transition-colors hover:bg-accent md:ml-4"
          >
            <ShoppingCart className="size-5" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        <div className="flex items-center gap-3 py-6 text-sm text-muted-foreground">
          <ArrowLeft className="size-4" />
          <span className="text-border">|</span>
          <a href="/" className="hover:text-foreground">
            Início
          </a>
          <span>/</span>
          <span className="text-foreground">Produtos</span>
        </div>

        <div className="flex flex-col gap-6 pb-10 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="font-display text-4xl font-black tracking-tight sm:text-5xl">PRODUTOS</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {list.length} produto(s) encontrado(s)
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar..."
                className="h-11 w-full rounded-lg border border-border bg-background pl-11 pr-4 text-sm outline-none transition focus:border-foreground/40 sm:w-64"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-11 rounded-lg border border-border bg-background px-4 text-sm outline-none transition focus:border-foreground/40"
            >
              <option value="relevancia">Relevância</option>
              <option value="menor">Menor preço</option>
              <option value="maior">Maior preço</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p, i) => (
            <article key={p.name + i} className="group flex flex-col">
              <div className="flex aspect-square items-center justify-center overflow-hidden">
                <img
                  src={p.img}
                  alt={p.name}
                  loading={i < 6 ? "eager" : "lazy"}
                  className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h2 className="mt-4 text-sm font-semibold leading-snug">{p.name}</h2>
              <p className="mt-4 text-xs text-muted-foreground line-through">R$ {p.old}</p>
              <p className="mt-0.5 font-display text-2xl font-black tracking-tight">
                <span className="align-middle text-xs font-semibold">R$ </span>
                {p.price}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">{p.sold} vendido(s)</p>
              <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-success">
                <Truck className="size-3.5" />
                Frete Expresso
              </p>
              <button className="mt-5 flex h-12 items-center justify-center gap-2 rounded-lg bg-primary text-xs font-bold uppercase tracking-[0.14em] text-primary-foreground transition-opacity hover:opacity-90">
                <ShoppingCart className="size-4" />
                Comprar
              </button>
            </article>
          ))}
        </div>
      </main>

      <footer className="border-t border-border py-10 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Storm. Todos os direitos reservados.
      </footer>
    </div>
  );
}

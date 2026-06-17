import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const nav = [
  { label: "Serviços", href: "#servicos" },
  { label: "Método", href: "#metodo" },
  { label: "Clientes", href: "#clientes" },
  { label: "Contato", href: "#contato" },
];

const WHATSAPP =
  "https://wa.me/5521981316123?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20Recuperadora%20Tecnologia.";

function useNow() {
  const [now, setNow] = useState<string>("");
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setNow(
        d.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "America/Sao_Paulo",
        }),
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const now = useNow();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className={`mx-auto grid max-w-[1480px] grid-cols-3 items-center px-6 transition-all duration-500 lg:px-10 ${
          scrolled ? "py-3" : "py-5"
        }`}
      >
        {/* mark */}
        <a href="#inicio" className="flex items-center gap-3" aria-label="Recuperadora Tecnologia">
          <span className="relative grid size-8 place-items-center overflow-hidden rounded-full border border-border">
            <span className="absolute inset-0 bg-foreground" />
            <span className="relative font-display text-base italic text-background">R</span>
          </span>
          <span className="hidden font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground sm:inline">
            Recuperadora <span className="text-foreground">/Tecnologia</span>
          </span>
        </a>

        {/* nav */}
        <nav className="hidden items-center justify-center gap-1 md:flex">
          <div
            className={`flex items-center gap-1 rounded-full border px-1.5 py-1 transition-all ${
              scrolled
                ? "border-border bg-card/70 backdrop-blur-xl"
                : "border-transparent bg-transparent"
            }`}
          >
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="rounded-full px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {n.label}
              </a>
            ))}
          </div>
        </nav>

        {/* right */}
        <div className="flex items-center justify-end gap-4">
          <span className="hidden font-mono text-[11px] tracking-[0.18em] text-muted-foreground lg:inline">
            <span className="text-foreground">RIO</span> · {now}
          </span>
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener"
            className="group hidden items-center gap-2 rounded-full bg-foreground px-4 py-2 text-[12px] font-medium text-background transition-transform hover:-translate-y-0.5 sm:inline-flex"
          >
            Falar agora
            <span className="inline-block size-1.5 rounded-full bg-[color:var(--signal)]" />
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            className="grid size-9 place-items-center rounded-full border border-border md:hidden"
            aria-label="Menu"
          >
            <span className="relative block h-2.5 w-4">
              <span
                className={`absolute left-0 top-0 h-px w-full bg-foreground transition-transform ${open ? "translate-y-1 rotate-45" : ""}`}
              />
              <span
                className={`absolute bottom-0 left-0 h-px w-full bg-foreground transition-transform ${open ? "-translate-y-[5px] -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* mobile sheet */}
      <div
        className={`mx-4 origin-top overflow-hidden rounded-2xl border border-border bg-card/90 backdrop-blur-xl transition-all md:hidden ${
          open ? "mt-1 max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col p-3">
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 font-display text-2xl text-foreground hover:bg-secondary"
            >
              {n.label}
            </a>
          ))}
        </div>
      </div>
    </motion.header>
  );
}
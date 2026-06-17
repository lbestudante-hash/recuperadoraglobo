import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { Globe, cityIdx, type GlobeAnchor } from "./Globe";

const ease = [0.22, 1, 0.36, 1] as const;
const WHATSAPP =
  "https://wa.me/5521981316123?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20Recuperadora%20Tecnologia.";

// 5 chapters of ~100vh each = 500vh stage
const STAGE_VH = 520;
const CHAPTERS_COUNT = 5;

export function GlobeStage() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });

  // Anchored services (chapter 5) — leader lines drawn in Globe canvas
  const anchorsActive = useTransform(progress, (p) => p > 0.7);
  const anchors: GlobeAnchor[] = [
    { cityIndex: cityIdx("Tokyo"), target: { x: 0.08, y: 0.18 }, active: false },
    { cityIndex: cityIdx("London"), target: { x: 0.08, y: 0.42 }, active: false },
    { cityIndex: cityIdx("São Paulo"), target: { x: 0.08, y: 0.66 }, active: false },
    { cityIndex: cityIdx("Sydney"), target: { x: 0.08, y: 0.88 }, active: false },
  ];
  // Make anchors react to progress — we read MotionValue inline via useTransform
  anchorsActive.on("change", (v) => {
    anchors.forEach((a) => (a.active = v));
  });

  return (
    <section
      ref={ref}
      id="inicio"
      className="relative"
      style={{ height: `${STAGE_VH}vh` }}
    >
      {/* Anchor markers — map nav hashes onto chapter scroll positions.
          Header is fixed (~72px), so we offset markers with scroll-mt. */}
      <span id="clientes" className="absolute left-0 w-px scroll-mt-24" style={{ top: "20%" }} aria-hidden />
      <span id="metodo"   className="absolute left-0 w-px scroll-mt-24" style={{ top: "52%" }} aria-hidden />
      <span id="servicos" className="absolute left-0 w-px scroll-mt-24" style={{ top: "72%" }} aria-hidden />

      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* vignette */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              "radial-gradient(120% 90% at 60% 50%, transparent 45%, var(--background) 90%)",
          }}
        />
        {/* Globe canvas */}
        <Globe progress={progress} anchors={anchors} />

        {/* Minimal scroll cue */}
        <ScrollCue progress={progress} />

        {/* Progressive chapter overlays */}
        <Chapter
          progress={progress}
          range={[0.0, 0.16]}
          align="left"
        >
          <Eyebrow>Capítulo 01 — Origem</Eyebrow>
          <h1 className="mt-6 max-w-[14ch] text-balance font-display text-[clamp(2.6rem,7.5vw,8rem)] leading-[0.92] tracking-[-0.03em] text-foreground">
            A tecnologia que mantém{" "}
            <em className="text-[color:var(--signal)]">o mundo</em> em operação.
          </h1>
          <p className="mt-8 max-w-md text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Cada nó é um sistema vivo — uma escola, um órgão público, uma
            empresa que não pode parar. Role para começar a jornada.
          </p>
          <div className="mt-10 flex items-center gap-3">
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener"
              className="group inline-flex items-center gap-3 rounded-full bg-foreground px-6 py-3.5 text-sm font-medium text-background transition-transform duration-300 hover:-translate-y-0.5"
            >
              Falar com especialista
              <span className="grid size-6 place-items-center overflow-hidden rounded-full bg-background/15">
                →
              </span>
            </a>
            <a
              href="#contato"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-medium text-foreground hover:bg-secondary"
            >
              Contato
            </a>
          </div>
        </Chapter>

        <Chapter
          progress={progress}
          range={[0.18, 0.34]}
          align="left"
        >
          <Eyebrow>Capítulo 02 — Rede</Eyebrow>
          <h2 className="mt-6 max-w-[16ch] text-balance font-display text-[clamp(2.2rem,6vw,6rem)] leading-[0.95] tracking-[-0.02em]">
            Nada acontece <em className="text-[color:var(--signal)]">sozinho</em>.
          </h2>
          <p className="mt-8 max-w-md text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Conectamos máquinas, pessoas e processos. Da rede interna ao
            datacenter remoto — cada ponto fala a mesma língua, com segurança
            e continuidade.
          </p>
          <ul className="mt-8 grid grid-cols-2 gap-x-8 gap-y-3 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            <li>● Empresas</li>
            <li>● Escolas</li>
            <li>● Órgãos públicos</li>
            <li>● Inteligência artificial</li>
          </ul>
        </Chapter>

        <Chapter
          progress={progress}
          range={[0.36, 0.5]}
          align="right"
        >
          <Eyebrow>Capítulo 03 — Fluxos</Eyebrow>
          <h2 className="mt-6 max-w-[18ch] text-balance font-display text-[clamp(2.2rem,6vw,6rem)] leading-[0.95] tracking-[-0.02em]">
            Dados em <em className="text-[color:var(--signal)]">movimento</em>,
            decisões em tempo real.
          </h2>
          <p className="mt-8 max-w-md text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Backups acontecendo. Suporte respondendo. Agentes de IA analisando.
            Cada pulso laranja é uma operação que deveria existir para o seu
            negócio.
          </p>
          <Stat label="Resposta" value="< 5min" hint="Help desk crítico" />
        </Chapter>

        <Chapter
          progress={progress}
          range={[0.52, 0.66]}
          align="left"
        >
          <Eyebrow>Capítulo 04 — Camadas</Eyebrow>
          <h2 className="mt-6 max-w-[16ch] text-balance font-display text-[clamp(2.2rem,6vw,6rem)] leading-[0.95] tracking-[-0.02em]">
            Da superfície ao{" "}
            <em className="text-[color:var(--signal)]">núcleo</em>.
          </h2>
          <p className="mt-8 max-w-md text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Aplicações, redes, servidores, dados e segurança. Operamos em todas
            as camadas — porque nenhuma sustenta o resto sozinha.
          </p>
          <Layers />
        </Chapter>

        <Chapter
          progress={progress}
          range={[0.7, 0.92]}
          align="left"
          full
        >
          <Eyebrow>Capítulo 05 — Capacidades</Eyebrow>
          <h2 className="mt-6 max-w-[20ch] text-balance font-display text-[clamp(1.8rem,4vw,3.5rem)] leading-[1] tracking-[-0.02em]">
            Quatro frentes que <em className="text-[color:var(--signal)]">emergem</em> da rede.
          </h2>
          <ServiceLeaders progress={progress} />
        </Chapter>

        {/* progress rail */}
        <ProgressRail progress={progress} />
      </div>
    </section>
  );
}

// ---------- Sub-pieces ----------

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
      <span className="inline-block h-px w-10 bg-[color:var(--signal)]" />
      <span className="text-foreground">{children}</span>
    </p>
  );
}

function Chapter({
  progress,
  range,
  align,
  full,
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  align: "left" | "right";
  full?: boolean;
  children: React.ReactNode;
}) {
  const [a, b] = range;
  const fade = 0.05;
  const opacity = useTransform(
    progress,
    [a - fade, a, b, b + fade],
    [0, 1, 1, 0],
  );
  const y = useTransform(progress, [a - fade, a, b, b + fade], [40, 0, 0, -30]);
  // Only the visible chapter should capture clicks; otherwise stacked
  // invisible chapters intercept events from the one below them.
  const pointerEvents = useTransform(opacity, (v) => (v > 0.5 ? "auto" : "none"));
  return (
    <motion.div
      style={{ opacity, y, pointerEvents }}
      className={`pointer-events-none absolute inset-0 z-20 flex items-center px-6 sm:px-10 lg:px-16 ${
        align === "right" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`${
          full ? "w-full max-w-[1480px]" : "max-w-xl lg:max-w-2xl"
        }`}
      >
        {children}
      </div>
    </motion.div>
  );
}

/* ============================================================
 * HUD — Digital operations center
 * ============================================================ */

function ScrollCue({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, 0.05, 0.1], [1, 1, 0]);
  return (
    <motion.div
      style={{ opacity }}
      className="pointer-events-none absolute inset-x-0 bottom-8 z-30 flex justify-center"
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
        Role para descobrir
      </span>
    </motion.div>
  );
}

function ProgressRail({ progress }: { progress: MotionValue<number> }) {
  const h = useTransform(progress, (v) => `${v * 100}%`);
  return (
    <div className="pointer-events-none absolute right-6 top-1/2 z-30 hidden h-56 -translate-y-1/2 lg:right-10 lg:block">
      <div className="relative h-full w-px bg-border">
        <motion.div
          style={{ height: h }}
          className="absolute left-0 top-0 w-px origin-top bg-[color:var(--signal)]"
        />
        {Array.from({ length: CHAPTERS_COUNT }).map((_, i) => (
          <span
            key={i}
            className="absolute -left-[3px] size-1.5 rounded-full bg-foreground/40"
            style={{ top: `${(i / (CHAPTERS_COUNT - 1)) * 100}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="mt-10 inline-flex items-end gap-6 rounded-2xl border border-border bg-card/40 px-6 py-5 backdrop-blur-sm">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          {label}
        </p>
        <p className="font-display text-4xl text-foreground">{value}</p>
      </div>
      <p className="pb-1 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {hint}
      </p>
    </div>
  );
}

function Layers() {
  const layers = [
    "Aplicações & Software",
    "Redes & Conectividade",
    "Servidores & Virtualização",
    "Dados & Backup",
    "Segurança & Governança",
  ];
  return (
    <ol className="mt-10 max-w-md space-y-px overflow-hidden rounded-xl border border-border bg-border">
      {layers.map((l, i) => (
        <motion.li
          key={l}
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.08, ease }}
          className="flex items-center justify-between bg-background/80 px-5 py-3 backdrop-blur-sm"
        >
          <span className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            <span className="text-foreground">0{i + 1}</span>
            <span className="h-px w-6 bg-border" />
            <span className="normal-case tracking-normal text-foreground">{l}</span>
          </span>
          <span className="size-1.5 rounded-full bg-[color:var(--signal)]" />
        </motion.li>
      ))}
    </ol>
  );
}

const SERVICES = [
  {
    n: "I",
    title: "Software empresarial",
    sub: "Sistemas que respiram com a operação",
    desc: "PDV, automação comercial, rotinas administrativas e ferramentas digitais sob medida.",
  },
  {
    n: "II",
    title: "Suporte & help desk",
    sub: "Atendimento que resolve antes do prejuízo",
    desc: "Remoto ou presencial — lentidão, falhas, acessos, software. Com registro e clareza.",
  },
  {
    n: "III",
    title: "Inteligência Artificial",
    sub: "Automação que devolve horas ao seu time",
    desc: "Agentes, RAG, classificação e fluxos de IA aplicados a processos reais.",
  },
  {
    n: "IV",
    title: "Infraestrutura & dados",
    sub: "A base invisível que tudo sustenta",
    desc: "Redes, servidores, backups, virtualização e recuperação. Pronta para o imprevisto.",
  },
];

function ServiceLeaders({ progress }: { progress: MotionValue<number> }) {
  return (
    <div className="pointer-events-auto mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:max-w-[34rem]">
      {SERVICES.map((s, i) => {
        const start = 0.72 + i * 0.04;
        const end = start + 0.06;
        const opacity = useTransform(progress, [start, end], [0, 1]);
        const x = useTransform(progress, [start, end], [-20, 0]);
        return (
          <motion.article
            key={s.title}
            style={{ opacity, x }}
            className="group relative overflow-hidden rounded-2xl border border-border bg-background/70 p-5 backdrop-blur-md transition-colors hover:border-[color:var(--signal)]/40"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                <span className="text-[color:var(--signal)]">●</span> {s.n}
              </span>
              <span className="size-1.5 rounded-full bg-[color:var(--signal)]" />
            </div>
            <h3 className="mt-4 font-display text-2xl leading-tight tracking-tight text-foreground">
              {s.title}
            </h3>
            <p className="mt-1 font-display text-sm italic text-[color:var(--signal)]">
              {s.sub}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
          </motion.article>
        );
      })}
    </div>
  );
}
import { motion } from "framer-motion";
import { MessageCircle, Mail, ArrowUpRight } from "lucide-react";

const WHATSAPP =
  "https://wa.me/5521981316123?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20Recuperadora%20Tecnologia%20e%20gostaria%20de%20solicitar%20atendimento.";
const EMAIL =
  "https://mail.google.com/mail/?view=cm&fs=1&to=comercial@recuperadorainformatica.com.br&su=Solicita%C3%A7%C3%A3o%20de%20atendimento";

export function Contact() {
  return (
    <section id="contato" className="relative px-6 py-32 lg:px-10 lg:py-44">
      <div className="mx-auto max-w-[1480px]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[2rem] border border-border bg-card"
        >
          {/* signal halo */}
          <div className="signal-glow pointer-events-none absolute inset-0" />
          {/* grid */}
          <div className="grain absolute inset-0" />

          <div className="relative grid gap-16 p-10 lg:grid-cols-[1.3fr_0.7fr] lg:p-20">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                <span className="text-[color:var(--signal)]">●</span> 06 / Contato — Última estação
              </p>
              <h2 className="mt-6 text-balance font-display text-[clamp(2.4rem,6vw,5.8rem)] leading-[0.95] tracking-[-0.02em]">
                Seu HD está cheio?
                <br />
                A rede caiu?
                <br />
                <em className="text-[color:var(--signal)]">
                  O sistema parou.
                </em>
              </h2>
              <p className="mt-8 max-w-lg text-pretty text-lg leading-relaxed text-muted-foreground">
                Fale com a Recuperadora para suporte, manutenção, recuperação,
                automação ou implantação de novas soluções em TI — antes que o
                imprevisto vire estatística.
              </p>

              <div className="mt-10 flex flex-wrap gap-x-10 gap-y-6 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                <span>
                  <span className="block text-[10px] opacity-60">WhatsApp</span>
                  <span className="text-foreground">+55 21 98131-6123</span>
                </span>
                <span>
                  <span className="block text-[10px] opacity-60">E-mail</span>
                  <span className="text-foreground">comercial@recuperadora.com.br</span>
                </span>
                <span>
                  <span className="block text-[10px] opacity-60">Base</span>
                  <span className="text-foreground">Rio de Janeiro · BR</span>
                </span>
              </div>
            </div>

            {/* action stack */}
            <div className="flex flex-col gap-4">
              <ActionLink
                href={WHATSAPP}
                icon={<MessageCircle className="size-4" strokeWidth={1.6} />}
                label="Chamar no WhatsApp"
                hint="Resposta em minutos"
                primary
              />
              <ActionLink
                href={EMAIL}
                icon={<Mail className="size-4" strokeWidth={1.6} />}
                label="Enviar um e-mail"
                hint="Para projetos e propostas"
              />
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Atendimento comercial — Seg. a Sex. 09h–18h
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ActionLink({
  href,
  icon,
  label,
  hint,
  primary,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  hint: string;
  primary?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className={`group flex items-center justify-between gap-6 rounded-2xl border px-6 py-5 transition-all duration-500 hover:-translate-y-0.5 ${
        primary
          ? "border-transparent bg-foreground text-background"
          : "border-border bg-background/40 text-foreground hover:bg-secondary"
      }`}
    >
      <span className="flex items-center gap-4">
        <span
          className={`grid size-9 place-items-center rounded-full ${
            primary ? "bg-background/15 text-background" : "border border-border text-foreground"
          }`}
        >
          {icon}
        </span>
        <span>
          <span className="block text-base font-medium">{label}</span>
          <span
            className={`block font-mono text-[10px] uppercase tracking-[0.22em] ${
              primary ? "text-background/60" : "text-muted-foreground"
            }`}
          >
            {hint}
          </span>
        </span>
      </span>
      <ArrowUpRight
        className="size-5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        strokeWidth={1.4}
      />
    </a>
  );
}
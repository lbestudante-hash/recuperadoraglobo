export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-border px-6 pb-12 pt-20 lg:px-10">
      <div className="mx-auto max-w-[1480px]">
        {/* huge wordmark */}
        <p className="select-none font-display text-[clamp(4rem,18vw,18rem)] leading-[0.85] tracking-[-0.04em] text-foreground">
          Recuperadora<span className="italic text-[color:var(--signal)]">.</span>
        </p>

        <div className="mt-12 grid gap-10 border-t border-border pt-10 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground md:grid-cols-4">
          <div>
            <p className="text-foreground">© {year} Recuperadora Tecnologia</p>
            <p className="mt-2 opacity-70">Rio de Janeiro — Brasil</p>
          </div>
          <div>
            <p className="text-foreground">Navegação</p>
            <ul className="mt-3 space-y-2 normal-case tracking-normal">
              <li><a className="link" href="#servicos">Serviços</a></li>
              <li><a className="link" href="#metodo">Método</a></li>
              <li><a className="link" href="#clientes">Clientes</a></li>
              <li><a className="link" href="#contato">Contato</a></li>
            </ul>
          </div>
          <div>
            <p className="text-foreground">Direto</p>
            <ul className="mt-3 space-y-2 normal-case tracking-normal">
              <li>+55 21 98131-6123</li>
              <li>comercial@recuperadora.com.br</li>
            </ul>
          </div>
          <div className="md:text-right">
            <p className="text-foreground">Colofão</p>
            <p className="mt-3 normal-case tracking-normal">
              Tipografia: Instrument Serif &amp; Geist.
              <br />
              Construído com obsessão por detalhe.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
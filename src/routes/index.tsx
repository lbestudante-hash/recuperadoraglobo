import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { GlobeStage } from "@/components/site/GlobeStage";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Recuperadora Tecnologia — TI que mantém empresas em operação" },
      {
        name: "description",
        content:
          "Suporte técnico, software empresarial, automação, infraestrutura e inteligência artificial. Tecnologia de alto nível para empresas, escolas e órgãos públicos.",
      },
      { property: "og:title", content: "Recuperadora Tecnologia" },
      {
        property: "og:description",
        content: "TI de alto nível: suporte, software, infraestrutura e IA.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <GlobeStage />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

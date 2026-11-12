import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Sistemas from "./components/Sistemas";
import ConceitoCRM from "./components/ConceitoCRM";
import Portfolio from "./components/Portfolio";
import Process from "./components/Process";
import Sobre from "./components/Sobre";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import GradeViva from "./components/GradeViva";
import ScrollFrames from "./components/ScrollFrames";
import SugestaoExperiencia from "./components/SugestaoExperiencia";
import AvisoPrivacidade from "./components/AvisoPrivacidade";
import { ExperienciaProvider } from "./experiencia/ExperienciaContext";
import "./App.css";

export default function App() {
  return (
    <ExperienciaProvider>
      <GradeViva />
      <ScrollFrames />
      <a href="#conteudo" className="ph-pular">Pular para o conteúdo</a>
      <Nav />
      <main className="ph-main" id="conteudo" tabIndex={-1}>
        <Hero />
        <Services />
        <Sistemas />
        <ConceitoCRM />
        <Portfolio />
        <Process />
        <Sobre />
        <Contact />
      </main>
      <Footer />
      <SugestaoExperiencia />
      <AvisoPrivacidade />
    </ExperienciaProvider>
  );
}

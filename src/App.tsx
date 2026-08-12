import { Nav } from './components/Nav';
import { Preloader } from './components/Preloader';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Experience } from './components/Experience';
import { Projects } from './components/Projects';
import { Education } from './components/Education';
import { Footer } from './components/Footer';

function App() {
  return (
    <>
      <Preloader />
      <Nav />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Education />
        <Footer />
      </main>
    </>
  );
}

export default App;

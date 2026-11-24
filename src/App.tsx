import Lenis from 'lenis';
import { useCallback, useEffect, useRef } from 'react';
import { AiWhipSection } from './components/AiWhipSection';
import { Contact } from './components/Contact';
import { CustomCursor } from './components/CustomCursor';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Navbar } from './components/Navbar';
import { TechStack } from './components/TechStack';
import { useTheme } from './hooks/useTheme';

export function App() {
  const { theme, toggleTheme } = useTheme();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    lenisRef.current = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const handleNavigate = useCallback((target: string) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset: -64 });
      return;
    }
    const el = document.querySelector(target);
    el?.scrollIntoView({ behavior: 'auto' });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <CustomCursor theme={theme} />
      <Navbar theme={theme} onToggleTheme={toggleTheme} onNavigate={handleNavigate} />

      <main className="flex-1">
        <Hero theme={theme} onNavigate={handleNavigate} />
        <TechStack />
        <AiWhipSection theme={theme} />
        <Contact />
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default App;

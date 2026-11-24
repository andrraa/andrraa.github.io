import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AiWhipSection } from './components/AiWhipSection';
import { Contact } from './components/Contact';
import { Hero } from './components/Hero';
import { HeroCharacters } from './components/HeroCharacters';
import { Navbar } from './components/Navbar';
import { portfolioData } from './data/portfolio';
import { useTheme } from './hooks/useTheme';

function ThemeHarness() {
  const { theme, toggleTheme } = useTheme();
  return <Navbar theme={theme} onToggleTheme={toggleTheme} onNavigate={vi.fn()} />;
}

describe('Portfolio interactions', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('toggles Light/Dark theme and persists to localStorage', () => {
    render(<ThemeHarness />);

    const toggle = screen.getByRole('button', { name: /switch to dark mode/i });
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    fireEvent.click(toggle);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('portfolio-theme')).toBe('dark');

    const toggleBack = screen.getByRole('button', { name: /switch to light mode/i });
    fireEvent.click(toggleBack);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('portfolio-theme')).toBe('light');
  });

  it('copies email to clipboard and displays Copied! feedback', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    render(<Contact />);
    const copyBtn = screen.getByRole('button', { name: /copy email address/i });

    await act(async () => {
      fireEvent.click(copyBtn);
    });

    expect(writeText).toHaveBeenCalledWith(portfolioData.contact.email);
    expect(screen.getByText('Copied!')).toBeInTheDocument();
  });

  it('shows speech bubble when hovering a walking hero character', () => {
    render(<HeroCharacters theme="light" />);
    const claudeChar = screen.getByRole('button', {
      name: /interactive ai character: claude/i,
    });

    fireEvent.mouseEnter(claudeChar);
    expect(screen.getByText(/Claude:/)).toBeInTheDocument();

    fireEvent.mouseLeave(claudeChar);
    expect(screen.queryByText(/Claude:/)).not.toBeInTheDocument();
  });

  it('increments whip count and displays a yelling bubble when whipping an AI model', () => {
    render(<AiWhipSection />);

    expect(screen.getByText('Whips: 0')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Whip DeepSeek' }));

    expect(screen.getByText('Whips: 1')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders static PixelAvatar fallback in Hero when WebGL is unavailable', () => {
    render(<Hero theme="light" onNavigate={vi.fn()} />);

    expect(screen.getByRole('img', { name: /pixel art developer avatar/i })).toBeInTheDocument();
    expect(screen.getByText('AVATAR.PX')).toBeInTheDocument();
  });

  it('whips all AI models cleanly in dark mode without WebGL', () => {
    render(<AiWhipSection theme="dark" />);

    fireEvent.click(screen.getByRole('button', { name: /whip all/i }));

    expect(screen.getByText('Whips: 5')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});

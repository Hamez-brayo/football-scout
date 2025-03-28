'use client';

import { useCallback, useState, useEffect } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function ParticlesBackground() {
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Only load particles after component is mounted on client
  useEffect(() => {
    setMounted(true);
    
    // Check if user prefers dark mode
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeQuery.matches);
    
    // Listen for changes in color scheme preference
    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    darkModeQuery.addEventListener('change', handleChange);
    
    // Also check for dark class on html element
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };

    // Run once on mount
    checkTheme();

    // Set up observer for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    
    return () => {
      darkModeQuery.removeEventListener('change', handleChange);
      observer.disconnect();
    };
  }, []);

  const particlesInit = useCallback(async (engine: any) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: any) => {
    // Optional: You can access container parameters here
  }, []);

  // Don't render particles until after client-side hydration
  if (!mounted) {
    return null;
  }

  return (
    <Particles
      className="absolute inset-0 -z-10"
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={{
        fpsLimit: 60,
        fullScreen: false,
        background: {
          color: {
            value: "transparent",
          },
        },
        particles: {
          number: {
            value: 40,
            density: {
              enable: true,
              area: 800,
            },
          },
          color: {
            value: isDarkMode 
              ? ["#6366f1", "#8b5cf6", "#d946ef"] 
              : ["#4f46e5", "#7c3aed", "#a855f7"],
          },
          opacity: {
            value: isDarkMode ? 0.5 : 0.4,
            random: false,
            anim: {
              enable: true,
              speed: 0.5,
              minimumValue: 0.1,
              sync: false,
            },
          },
          size: {
            value: {
              min: 1,
              max: 3,
            },
            random: true,
            anim: {
              enable: true,
              speed: 1,
              minimumValue: 0.1,
              sync: false,
            },
          },
          links: {
            enable: true,
            distance: 150,
            color: isDarkMode ? "#94a3b8" : "#64748b",
            opacity: isDarkMode ? 0.2 : 0.3,
            width: 1,
          },
          move: {
            enable: true,
            speed: 1,
            direction: "none",
            random: false,
            straight: false,
            outMode: "out",
            attract: {
              enable: false,
              rotateX: 600,
              rotateY: 1200,
            },
          },
        },
        interactivity: {
          detectsOn: "window",
          events: {
            onHover: {
              enable: true,
              mode: "grab",
            },
            resize: true,
          },
          modes: {
            grab: {
              distance: 140,
              links: {
                opacity: 0.5,
              },
            },
          },
        },
        detectRetina: true,
      }}
    />
  );
} 
'use client';

import { useCallback, useState, useEffect } from "react";
import { Particles } from "react-tsparticles";
import { loadFull } from "tsparticles";

interface ParticlesBackgroundProps {
  className?: string;
}

export default function ParticlesBackground({ className = "fixed inset-0" }: ParticlesBackgroundProps) {
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

    checkTheme();

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

  if (!mounted) return null;

  return (
    <div className={`${className} pointer-events-auto`}>
      <Particles
        id={`tsparticles-${Math.random()}`}
        className="absolute inset-0"
        init={particlesInit}
        options={{
          fullScreen: {
            enable: false,
            zIndex: 1
          },
          background: {
            color: {
              value: "transparent",
            },
          },
          fpsLimit: 120,
          interactivity: {
            detectsOn: "window",
            events: {
              onClick: {
                enable: true,
                mode: "push",
              },
              onHover: {
                enable: true,
                mode: "grab",
                parallax: {
                  enable: true,
                  force: 60,
                  smooth: 10
                }
              },
              resize: true,
            },
            modes: {
              grab: {
                distance: 150,
                links: {
                  opacity: 0.7,
                  color: isDarkMode ? "#a78bfa" : "#818cf8"
                }
              },
              push: {
                quantity: 3,
              },
              repulse: {
                distance: 150,
                duration: 0.4,
              }
            },
          },
          particles: {
            color: {
              value: isDarkMode ? "#a78bfa" : "#818cf8",
            },
            links: {
              color: isDarkMode ? "#a78bfa" : "#818cf8",
              distance: 150,
              enable: true,
              opacity: 0.6,
              width: 1.5,
              triangles: {
                enable: true,
                opacity: 0.05
              }
            },
            collisions: {
              enable: false,
            },
            move: {
              enable: true,
              speed: 2,
              direction: "none",
              random: true,
              straight: false,
              outModes: {
                default: "bounce",
                top: "bounce",
                left: "bounce",
                right: "bounce",
                bottom: "bounce"
              },
              attract: {
                enable: true,
                rotate: {
                  x: 600,
                  y: 1200
                }
              }
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 60,
              limit: 80
            },
            opacity: {
              value: 0.7,
              random: false,
              animation: {
                enable: true,
                speed: 0.5,
                minimumValue: 0.4,
                sync: false
              }
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 2, max: 4 },
              animation: {
                enable: true,
                speed: 1,
                minimumValue: 1,
                sync: false
              }
            },
            life: {
              duration: {
                sync: false,
                value: 20,
                random: {
                  enable: true,
                  minimumValue: 10
                }
              },
              count: 1,
              delay: {
                random: {
                  enable: true,
                  minimumValue: 0.5
                },
                value: 1
              }
            },
            zIndex: {
              random: {
                enable: false,
                minimumValue: 0
              },
              value: 0,
              opacityRate: 1,
              sizeRate: 1,
              velocityRate: 1
            }
          },
          detectRetina: true,
        }}
      />
    </div>
  );
} 
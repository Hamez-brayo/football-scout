'use client';

import { useCallback, useState, useEffect } from "react";
import { Particles } from "react-tsparticles";
import { loadFull } from "tsparticles";

type ParticlesComponentProps = {
  id: string;
  className?: string;
  init?: (engine: unknown) => Promise<void>;
  options?: Record<string, unknown>;
};

interface ParticlesBackgroundProps {
  className?: string;
}

export default function ParticlesBackground({ className = "fixed inset-0" }: ParticlesBackgroundProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const particlesInit = useCallback(async (engine: unknown) => {
    await loadFull(engine as never);
  }, []);

  const ParticlesComp = Particles as unknown as (props: ParticlesComponentProps) => JSX.Element;

  if (!mounted) return null;

  return (
    <div className={`${className} pointer-events-auto`}>
      <ParticlesComp
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
                  opacity: 0.3,
                  color: "#1f2937"
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
              value: "#1f2937",
            },
            links: {
              color: "#1f2937",
              distance: 150,
              enable: true,
              opacity: 0.2,
              width: 1,
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
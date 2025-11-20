import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  velocity: { x: number; y: number };
  life: number;
}

interface ParticlesProps {
  trigger: number;
  position?: { x: number; y: number };
  color?: string;
  count?: number;
}

export default function Particles({ trigger, position, color = '#667eea', count = 12 }: ParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (trigger === 0) return;

    const newParticles: Particle[] = [];
    const centerX = position?.x ?? window.innerWidth / 2;
    const centerY = position?.y ?? window.innerHeight / 2;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 2 + Math.random() * 3;
      
      newParticles.push({
        id: Date.now() + i,
        x: centerX,
        y: centerY,
        color,
        velocity: {
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed - 2,
        },
        life: 1,
      });
    }

    setParticles(prev => [...prev, ...newParticles]);

    const animationDuration = 1000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / animationDuration;

      if (progress < 1) {
        setParticles(prev =>
          prev.map(p => ({
            ...p,
            x: p.x + p.velocity.x,
            y: p.y + p.velocity.y,
            velocity: {
              x: p.velocity.x * 0.98,
              y: p.velocity.y + 0.2,
            },
            life: 1 - progress,
          }))
        );
        requestAnimationFrame(animate);
      } else {
        setParticles(prev => prev.filter(p => p.id < Date.now() - animationDuration));
      }
    };

    requestAnimationFrame(animate);
  }, [trigger, position, color, count]);

  return (
    <div className="particles-container">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            backgroundColor: particle.color,
            opacity: particle.life,
            transform: `scale(${particle.life})`,
          }}
        />
      ))}
    </div>
  );
}

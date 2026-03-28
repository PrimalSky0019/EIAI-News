"use client";

import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";

export default function GravityWrapper({ children }: { children: React.ReactNode }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const [isGravityActive, setIsGravityActive] = useState(false);

  useEffect(() => {
    if (!isGravityActive || !sceneRef.current) return;

    const engine = Matter.Engine.create();
    const world = engine.world;
    engineRef.current = engine;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const thickness = 60;
    const ground = Matter.Bodies.rectangle(width / 2, height + thickness / 2, width, thickness, { isStatic: true });
    const leftWall = Matter.Bodies.rectangle(0 - thickness / 2, height / 2, thickness, height * 2, { isStatic: true });
    const rightWall = Matter.Bodies.rectangle(width + thickness / 2, height / 2, thickness, height * 2, { isStatic: true });
    
    Matter.World.add(world, [ground, leftWall, rightWall]);

    const domElements = Array.from(sceneRef.current.querySelectorAll('.gravity-item')) as HTMLElement[];
    const bodiesMap = new Map<Matter.Body, HTMLElement>();

    domElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      el.style.position = 'fixed';
      el.style.zIndex = '9999';
      el.style.top = '0px';
      el.style.left = '0px';
      el.style.margin = '0px';
      el.style.transform = `translate(${rect.left}px, ${rect.top}px)`;
      el.style.width = `${rect.width}px`;

      const body = Matter.Bodies.rectangle(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        rect.width,
        rect.height,
        { restitution: 0.4, friction: 0.1, density: 0.001 }
      );

      bodiesMap.set(body, el);
      Matter.World.add(world, body);
    });

    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.inset = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '9998';
    canvas.style.pointerEvents = 'auto';
    canvas.style.background = 'transparent';
    canvas.width = width;
    canvas.height = height;
    document.body.appendChild(canvas);

    const render = Matter.Render.create({
      canvas: canvas,
      engine: engine,
      options: { width, height, wireframes: false, background: 'transparent' }
    });

    const mouse = Matter.Mouse.create(canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, render: { visible: false } }
    });
    Matter.World.add(world, mouseConstraint);

    Matter.Events.on(engine, 'afterUpdate', () => {
      bodiesMap.forEach((el, body) => {
        const x = body.position.x - el.offsetWidth / 2;
        const y = body.position.y - el.offsetHeight / 2;
        el.style.transform = `translate(${x}px, ${y}px) rotate(${body.angle}rad)`;
      });
    });

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    return () => {
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      canvas.remove();
    };
  }, [isGravityActive]);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsGravityActive(true)}
        className="fixed bottom-4 right-4 z-[10000] text-[10px] font-bold text-zinc-300 hover:text-[#ED1C24] uppercase tracking-widest transition-colors"
      >
        Don't Click This
      </button>
      <div ref={sceneRef}>
        {children}
      </div>
    </div>
  );
}

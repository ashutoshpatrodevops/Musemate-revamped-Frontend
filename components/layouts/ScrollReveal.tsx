"use client";

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: React.ReactNode;
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
  rotationEnd?: string;
  wordAnimationEnd?: string;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = "",
  textClassName = "",
  rotationEnd = "bottom bottom",
  wordAnimationEnd = "bottom bottom",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Split text into words if a string is provided
    const content = typeof children === 'string' ? children.split(" ") : [children];

    // GSAP context for easy cleanup
    let ctx = gsap.context(() => {
      const words = el.querySelectorAll('.reveal-word');
      
      gsap.fromTo(words, 
        { 
          opacity: baseOpacity, 
          filter: enableBlur ? `blur(${blurStrength}px)` : 'none' 
        },
        {
          opacity: 1,
          filter: 'blur(0px)',
          stagger: 0.1,
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            end: wordAnimationEnd,
            scrub: 3,
          }
        }
      );

      // Optional rotation effect for the whole container
      gsap.fromTo(el,
        { rotation: baseRotation },
        {
          rotation: 0,
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: rotationEnd,
            scrub: true,
          }
        }
      );
    }, el);

    return () => ctx.revert(); // Cleanup GSAP on unmount
  }, [children, baseOpacity, baseRotation, blurStrength, enableBlur, rotationEnd, wordAnimationEnd]);

  return (
    <div ref={containerRef} className={`my-20 ${containerClassName}`}>
      <p className={`text-4xl font-bold leading-tight ${textClassName}`}>
        {typeof children === 'string' ? (
          children.split(" ").map((word, i) => (
            <span key={i} className="reveal-word inline-block mr-2">
              {word}
            </span>
          ))
        ) : (
          <span className="reveal-word">{children}</span>
        )}
      </p>
    </div>
  );
};

export default ScrollReveal;
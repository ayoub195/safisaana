'use client';

import { useState, useEffect, useRef, ReactNode } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const useIntersectionObserver = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        if (elementRef.current) {
          observer.unobserve(elementRef.current);
        }
      }
    }, { threshold: 0.1, ...options });

    const element = elementRef.current;
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  return [elementRef, isVisible] as const;
};

export const AnimatedSection = ({ children, className = '', delay = 0 }: AnimatedSectionProps) => {
  const [ref, isVisible] = useIntersectionObserver();
  
  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-1000 transform ${
        isVisible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-10 opacity-0'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}; 
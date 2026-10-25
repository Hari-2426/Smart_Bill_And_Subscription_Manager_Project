import React, { useRef, useState, useEffect } from 'react';

export const RevealOnScroll = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  threshold = 0.15,
  className = '',
  style = {},
  once = true,
}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, once]);

  // Determine initial translation based on direction
  let initialTransform = 'translateY(28px)';
  if (direction === 'down') initialTransform = 'translateY(-28px)';
  if (direction === 'left') initialTransform = 'translateX(28px)';
  if (direction === 'right') initialTransform = 'translateX(-28px)';
  if (direction === 'none') initialTransform = 'scale(0.96)';

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate3d(0, 0, 0) scale(1)' : initialTransform,
        transition: `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
        willChange: 'opacity, transform',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default RevealOnScroll;

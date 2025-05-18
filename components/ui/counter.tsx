'use client';

import { useEffect, useState } from 'react';

export default function Counter({
  target = 1000,
  duration = 2000, // in ms
}: {
  target?: number;
  duration?: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // const start = 0;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentCount = Math.floor(progress * target);
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [target, duration]);

  return count.toLocaleString();
}

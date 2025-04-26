'use client';

import { AnimatePresence, HTMLMotionProps, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

interface WordRotateProps {
  words: React.ReactNode[];
  duration?: number;
  framerProps?: HTMLMotionProps<'h1'>;
  className?: string;
  direction?: 'horizontal' | 'vertical';
}

export function WordRotate({
  words,
  duration = 2500,
  framerProps: _framerProps,
  direction = 'vertical',
  className,
}: WordRotateProps) {
  const [index, setIndex] = useState(0);

  const framerProps = _framerProps
    ? _framerProps
    : direction === 'horizontal'
      ? {
          initial: { opacity: 0, x: -50 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: 50 },
          transition: { duration: 0.25, ease: 'easeOut' },
        }
      : {
          initial: { opacity: 0, y: -50 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 50 },
          transition: { duration: 0.25, ease: 'easeOut' },
        };

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, duration);

    return () => clearInterval(interval);
  }, [words, duration]);

  return (
    <div className="overflow-hidden py-2">
      <AnimatePresence mode="wait">
        <motion.div key={index} className={cn(className)} {...framerProps}>
          {words[index]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

WordRotate.displayName = 'WordRotate';

// src/components/bits/AnimatedNumber.tsx

import React from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  direction?: "up" | "down";
  className?: string;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, direction = "up", className }) => {
  const spring = useSpring(value, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) => Math.round(current).toLocaleString());

  React.useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span className={className}>{display}</motion.span>;
};

export default AnimatedNumber;
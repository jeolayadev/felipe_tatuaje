import { useInView } from 'framer-motion';
import { useRef } from 'react';

export const useScrollReveal = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true,
    margin: "-100px"
  });
  
  return { ref, isInView };
};

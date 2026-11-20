"use client";

import { useEffect } from "react";
import Lottie from "lottie-react";
import { motion } from "motion/react";
import orbit from "@/components/julia-orbit.json";

export default function IntroLoader({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timeout = window.setTimeout(onComplete, 1850);
    return () => window.clearTimeout(timeout);
  }, [onComplete]);

  return (
    <motion.div
      className="preloader"
      initial={{ opacity: 1 }}
      exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
      aria-label="Chargement de Julia"
      role="status"
    >
      <motion.div className="loader-animation" initial={{ scale: 0.82, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
        <Lottie animationData={orbit} loop autoplay />
      </motion.div>
      <motion.div className="loader-wordmark" initial={{ opacity: 0, letterSpacing: "0.5em" }} animate={{ opacity: 1, letterSpacing: "0.28em" }} transition={{ delay: 0.28, duration: 0.75 }}>JULIA</motion.div>
      <motion.div className="loader-caption" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55, duration: 0.7 }}>Une nouvelle signature se prépare</motion.div>
      <div className="loader-progress"><span /></div>
    </motion.div>
  );
}

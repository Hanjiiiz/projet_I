"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import IntroLoader from "@/components/intro-loader";
import PerfumeScene from "@/components/perfume-scene";

const releaseAt = new Date("2027-01-20T00:00:00+01:00").getTime();

function useCountdown() {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setRemaining(Math.max(0, releaseAt - Date.now()));
    update();
    const interval = window.setInterval(update, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  if (remaining === null) return null;

  const days = Math.floor(remaining / 86_400_000);
  const hours = Math.floor((remaining % 86_400_000) / 3_600_000);
  const minutes = Math.floor((remaining % 3_600_000) / 60_000);
  return { days, hours, minutes };
}

function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const countdown = useCountdown();
  const completeLoader = useCallback(() => setLoaded(true), []);

  return (
    <>
      <AnimatePresence>{!loaded && <IntroLoader onComplete={completeLoader} />}</AnimatePresence>

      <div className="site-shell">
        <PerfumeScene />

        <header className="site-header">
          <a className="wordmark" href="#top" aria-label="Julia, retour en haut">
            <span className="wordmark-mark">J</span>
            <span>JULIA</span>
          </a>
          <div className="header-right">
            <span className="header-note">Une nouvelle signature</span>
            <a className="header-link" href="#lancement">
              <span>Le rendez-vous</span><ArrowUpRight size={13} strokeWidth={1.3} />
            </a>
          </div>
        </header>

        <main className="relative z-[1]">
          <section id="top" className="page-section hero" aria-labelledby="hero-title">
            <div className="copy-block">
              <Reveal>
                <div className="eyebrow">Le parfum, bientôt</div>
                <h1 id="hero-title" className="hero-title">JULIA<span>arrive.</span></h1>
                <p className="hero-description">Une nouvelle signature. Le début d’une histoire à fleur de peau.</p>
                <a className="scroll-link" href="#essence">
                  <span className="scroll-line" /><span>Entrer dans l’univers</span><ArrowDown size={13} strokeWidth={1.2} />
                </a>
              </Reveal>
            </div>

            <div className="side-note">Eau de parfum&nbsp; · &nbsp;Édition 01</div>
            <div className="hero-bottom micro">
              <span>Un parfum signé Julia</span>
              <span>01 — 03</span>
            </div>
          </section>

          <section id="essence" className="page-section interlude" aria-labelledby="essence-title">
            <div className="interlude-copy">
              <Reveal>
                <div className="eyebrow">L’essence de Julia</div>
                <h2 id="essence-title" className="section-title">L’inattendu<br /><em>vous va si bien.</em></h2>
                <p className="body-copy">
                  Un parfum qui se découvre au plus près. Une présence délicate, un sillage qui reste — et cette part de vous qu’on ne confond avec personne.
                </p>
                <div className="note-list" aria-label="Trois facettes du parfum">
                  <div className="note-item"><span>01 / Le geste</span><strong>Intime</strong></div>
                  <div className="note-item"><span>02 / Le sillage</span><strong>Inoubliable</strong></div>
                  <div className="note-item"><span>03 / La signature</span><strong>La vôtre</strong></div>
                </div>
              </Reveal>
            </div>
            <div className="interlude-index micro">Une présence, trois façons d’être.</div>
          </section>

          <section id="lancement" className="page-section release" aria-labelledby="release-title">
            <div className="release-copy">
              <Reveal>
                <div className="release-kicker">Gardez cette date</div>
                <h2 id="release-title" className="release-title">Le début<br />d’<em>une histoire.</em></h2>
                <p className="body-copy">JULIA se révèle dans deux mois. Le premier chapitre commence ici.</p>

                <div className="release-date" aria-label="Sortie le 20 janvier 2027">
                  <span className="date-day">20</span>
                  <span className="date-month"><strong>JANVIER</strong><span>DEUX MILLE VINGT-SEPT</span></span>
                </div>

                <div className="countdown" aria-label={countdown ? `${countdown.days} jours avant la sortie` : "Compte à rebours"}>
                  <div className="count-unit"><strong>{countdown ? String(countdown.days).padStart(2, "0") : "—"}</strong><span>Jours</span></div>
                  <div className="count-unit"><strong>{countdown ? String(countdown.hours).padStart(2, "0") : "—"}</strong><span>Heures</span></div>
                  <div className="count-unit"><strong>{countdown ? String(countdown.minutes).padStart(2, "0") : "—"}</strong><span>Minutes</span></div>
                </div>

                <div className="release-footer">
                  <p>À très bientôt.<br /><em>JULIA</em></p>
                  <a className="round-link" href="#top" aria-label="Revenir au début"><ArrowUpRight size={18} strokeWidth={1.1} /></a>
                </div>
              </Reveal>
            </div>
            <footer className="site-footer"><span>JULIA — Édition 01</span><span>20.01.2027</span></footer>
          </section>
        </main>
      </div>
    </>
  );
}

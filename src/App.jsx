import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./App.module.css";
import MagicLoading from "./components/MagicLoading";
import MemoryCardLogo from "./components/MemoryCardLogo";
import bgVedio from "./assets/background.mp4";
import bgMusic from "./assets/bgMusic.mp3";
import musicOn from "./assets/musicOn.svg";
import musicOff from "./assets/musicOff.svg";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [reveal, setReveal] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [startBgMusic, setStartBgMusic] = useState(false);
  const [musicIconState, setMusicIconState] = useState(false);
  const [showMusicIcon, setShowMusicIcon] = useState(false);

  const vedioRef = useRef(null);
  const bgMusicRef = useRef(null);

  useEffect(() => {
    if (vedioRef.current) {
      vedioRef.current.play().catch((err) => {
        console.log("Failed to load background Vedio: ", err);
      });
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setReveal(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLogo(true);
      setShowMusicIcon(true);
    }, 9000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.play().catch((err) => {
        console.log("Failed to load BackGround Music: ", err);
      });
    }
  }, []);

  return (
    <div>
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.6 } }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 10,
              background: "black",
            }}
          >
            <MagicLoading />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {!loading && (
          <motion.div
            key="video"
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 0,
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "black",
            }}
          >
            <video
              autoPlay
              loop
              muted
              ref={vedioRef}
              playsInline
              style={{
                width: "100vw",
                height: "100vh",
                objectFit: "cover",
                borderRadius: 0,
              }}
            >
              <source src={bgVedio} type="video/mp4" />
              {/* Or: <source src={bgVideo} type="video/mp4" /> */}
            </video>
          </motion.div>
        )}
      </AnimatePresence>
      {showLogo && (
        <MemoryCardLogo
          setMusicSign={setStartBgMusic}
          setIcon={setMusicIconState}
        />
      )}
      {startBgMusic && (
        <audio ref={bgMusicRef} src={bgMusic} preload="auto" loop></audio>
      )}
      {showMusicIcon && (
        <img
          src={musicIconState ? musicOn : musicOff}
          alt="Music icon"
          className="musicIcon"
        />
      )}
    </div>
  );
}

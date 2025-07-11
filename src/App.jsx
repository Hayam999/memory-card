import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import MagicLoading from "./components/MagicLoading";
import MemoryCardLogo from "./components/MemoryCardLogo";
import Levels from "./components/Levels";
import bgVedio from "./assets/background.mp4";
import bgMusic from "./assets/bgMusic.mp3";
import musicOn from "./assets/musicOn.svg";
import musicOff from "./assets/musicOff.svg";
import clickSoundFile from "./assets/click.mp3";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [reveal, setReveal] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [startBgMusic, setStartBgMusic] = useState(false);
  const [musicIconState, setMusicIconState] = useState(false);
  const [showMusicIcon, setShowMusicIcon] = useState(false);
  const [showLevels, setShowLevels] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  const vedioRef = useRef(null);
  const bgMusicRef = useRef(null);
  const clickSoundRef = useRef(null);
  useEffect(() => {
    if (vedioRef.current) {
      bgMusicRef.current.volume = 0.1;
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
        bgMusicRef.current.volume = 0.1;
        console.log("Failed to load BackGround Music: ", err);
      });
    }
  });

  // Fixed click sound implementation
  useEffect(() => {
    // Initialize click sound
    const clickSound = new Audio(clickSoundFile);
    clickSound.preload = "auto";
    clickSoundRef.current = clickSound;

    const handleClick = (event) => {
      // Mark that user has interacted
      if (!userInteracted) {
        setUserInteracted(true);
      }

      // Play click sound for buttons and clickable elements
      if (
        event.target.tagName === "BUTTON" ||
        event.target.onclick ||
        event.target.classList.contains("clickable") ||
        event.target.closest("button")
      ) {
        if (clickSoundRef.current && userInteracted) {
          clickSoundRef.current.currentTime = 0;
          clickSoundRef.current.play().catch((e) => {
            console.log("Click sound play failed:", e);
          });
        }
      }
    };

    // Add event listener for any user interaction to enable audio
    const handleFirstInteraction = () => {
      setUserInteracted(true);
      // Preload the audio after first interaction
      if (clickSoundRef.current) {
        clickSoundRef.current.load();
      }
    };

    document.addEventListener("click", handleClick);
    document.addEventListener("touchstart", handleFirstInteraction, {
      once: true,
    });
    document.addEventListener("keydown", handleFirstInteraction, {
      once: true,
    });

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("touchstart", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
    };
  }, [userInteracted]);

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
          setShowLogo={setShowLogo}
          setShowLevels={setShowLevels}
        />
      )}
      {startBgMusic && (
        <audio
          ref={bgMusicRef}
          src={bgMusic}
          preload="auto"
          loop
          autoPlay
          playsInline
          className="bgMusic"
        ></audio>
      )}
      {showMusicIcon && (
        <motion.img
          initial={{ rotate: 0, scale: 0.95 }}
          animate={{ rotate: 360 * 10, scale: [1.5, 1] }}
          transition={{ duration: 1, ease: "easeOut" }}
          src={musicIconState ? musicOn : musicOff}
          alt="Music icon"
          className="musicIcon"
          onClick={() => {
            setStartBgMusic(!startBgMusic);
            setMusicIconState(!musicIconState);
          }}
        />
      )}
      {showLevels && (
        <Levels setShowLogo={setShowLogo} setShowLevels={setShowLevels} />
      )}
    </div>
  );
}

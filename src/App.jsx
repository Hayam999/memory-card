import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MagicLoading from "./components/MagicLoading";
import bgVedio from "./assets/background.mp4";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [reveal, setReveal] = useState(false);
  const audioRef = useRef(null);
  const vedioRef = useRef(null);

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
      // Play sound when reveal starts
      if (audioRef.current) {
        audioRef.current.play();
      }
    }, 5000);
    return () => clearTimeout(timer);
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
      {/* ...rest of your app content here... */}
    </div>
  );
}

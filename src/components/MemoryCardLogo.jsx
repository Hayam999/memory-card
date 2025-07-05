import { easeIn, motion } from "framer-motion";

import logo from "../assets/logo.svg";

function MemoryCardLogo({ setMusicSign, setIcon, setShowLogo, setShowLevels }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: easeIn }}
      exit={{ opacity: 0, scale: 0 }}
      className="memoryCardLogo"
    >
      <motion.img
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        id="memoLogo"
        src={logo}
        alt="Memory Card Logo"
        onClick={() => {
          setMusicSign(true);
          setIcon(true);
          setShowLogo(false);
          setShowLevels(true);
        }}
      />
    </motion.div>
  );
}

export default MemoryCardLogo;

import { easeOut, motion } from "framer-motion";
import styles from "../App.module.css";
import logo from "../assets/logo.svg";

function MemoryCardLogo() {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 2, ease: easeOut }}
      className={styles.memoryCardLogo}
    >
      <motion.img
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        id="memoLogo"
        src={logo}
        alt="Memory Card Logo"
      />
    </motion.div>
  );
}

export default MemoryCardLogo;

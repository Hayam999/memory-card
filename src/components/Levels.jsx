import { motion } from "framer-motion";

function Levels() {
  return (
    <div className="lvlsWrapper">
      <motion.div className="levels">
        <h1 id="memoHeader">Memory Card</h1>
        <div className="lvlsBtns">
          <button>Easy</button>
          <button>Medium</button>
          <button>Hard</button>
        </div>
      </motion.div>
    </div>
  );
}

export default Levels;

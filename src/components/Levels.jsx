import { motion } from "framer-motion";

function Levels() {
  return (
    <div className="lvlsWrapper">
      <motion.div className="levels">
        <h1 id="memoHeader">Memory Card</h1>
        <div className="lvlsBtns">
          <button className="button-73">Easy</button>
          <button className="button-73">Medium</button>
          <button className="button-73">Hard</button>
        </div>
      </motion.div>
    </div>
  );
}

export default Levels;

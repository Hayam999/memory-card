import { motion } from "framer-motion";
import backLogo from "../assets/back-logo.svg";
function Levels({ setShowLogo, setShowLevels }) {
  return (
    <div className="lvlsWrapper">
      <motion.div className="levels">
        <img
          src={backLogo}
          alt="Go Back"
          className="goBackLogo"
          onClick={() => {
            setShowLogo(true);
            setShowLevels(false);
          }}
        />
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

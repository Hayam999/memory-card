import { useState } from "react";
import { motion } from "framer-motion";
import backLogo from "../assets/back-logo.svg";
import { div } from "motion/react-client";
import Cards from "./cards";
import changeLvl from "../assets/change-level.svg";
import backHome from "../assets/backHome.svg";
function Levels({ setShowLogo, setShowLevels }) {
  const [imgsPerRender, setImgsPerRender] = useState(0);
  const [totalRenders, setTotalRenders] = useState(0);
  const [pointsPerRound, setPointsPerRound] = useState(0);
  const [totalImgsPerRound, setTotalImgsPerRound] = useState(0);

  const [play, setPlay] = useState(false);

  function roundSetter(
    imgsPerRender,
    totalRenders,
    pointsPerRound,
    totalImgsPerRound,
  ) {
    setImgsPerRender(imgsPerRender);
    setTotalRenders(totalRenders);
    setPointsPerRound(pointsPerRound);
    setTotalImgsPerRound(totalImgsPerRound);
    setPlay(true);
  }

  return (
    <>
      {!play && (
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
              <button
                className="button-73"
                onClick={() => roundSetter(3, 4, 5, 10)}
              >
                Easy
              </button>
              <button
                className="button-73"
                onClick={() => roundSetter(5, 7, 10, 35)}
              >
                Medium
              </button>
              <button
                className="button-73"
                onClick={() => roundSetter(7, 10, 20, 70)}
              >
                Hard
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {play && (
        <div className="playingArea">
          <Cards
            imgsPerRender={imgsPerRender}
            totalRenders={totalRenders}
            pointsPerRound={pointsPerRound}
            totalImgsPerRound={totalImgsPerRound}
          />
          <div className="navBtns">
            <button
              className="button-73"
              onClick={() => {
                setShowLevels(false);
                setShowLogo(true);
              }}
            >
              Home
            </button>
            <button
              className="button-73"
              onClick={() => {
                setPlay(false);
              }}
            >
              Back
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Levels;

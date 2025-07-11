import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import flippedImg from "../assets/backHome.svg";
import errorImg from "../assets/error.svg";
import winMusic from "../assets/winRound.mp3";
import winImg from "../assets/win.svg";
import loseMusic from "../assets/gameOver.mp3";
import loseImg from "../assets/loser.svg";

function Cards({
  imgsPerRender,
  totalRenders,
  pointsPerRound,
  totalImgsPerRound,
}) {
  const [imgs, setImgs] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_KEY = "51184474-32f1e0a0fae076cc4d45ae4d2";
  const BASE_URL = "https://pixabay.com/api/";

  const getImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const randomPage = Math.floor(Math.random() * 10) + 1;
      const orderOptions = ["popular", "latest", "ec", "editors_choice"];
      const randomOrder =
        orderOptions[Math.floor(Math.random() * orderOptions.length)];

      const url = `${BASE_URL}?key=${API_KEY}&image_type=illustration&order=${randomOrder}&per_page=${totalImgsPerRound}&min_width=800&max_width=800&min_height=800&max_height800&q=sketch&page=${randomPage}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const images = data.hits.map((image) => ({
        id: image.id,
        tags: image.tags,
        webformatURL: image.webformatURL,
        largeImageURL: image.largeImageURL,
        views: image.views,
        downloads: image.downloads,
        user: image.user,
        pageURL: image.pageURL,
      }));

      setImgs(images);
    } catch (err) {
      setError("Error fetching images. Please try again.");
      console.error("Error fetching Images:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getImages();
  }, []);

  return (
    <div className="playingArea">
      {loading ? (
        <h1 style={{ fontSize: "2rem", color: "#1d252f" }}>Loading ...</h1>
      ) : error ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "5vh",
            alignItems: "center",
            position: "absolute",
            top: "5vh",
          }}
        >
          <motion.img
            src={errorImg}
            alt={error}
            style={{ maxWidth: "60%" }}
          ></motion.img>
          <botton
            style={{ flexGrow: "0" }}
            className="button-73"
            onClick={() => getImages()}
          >
            Try Again
          </botton>
        </div>
      ) : (
        <Play
          newImgs={imgs}
          totalRenders={totalRenders}
          pointsPerRound={pointsPerRound}
          imgsPerRender={imgsPerRender}
        />
      )}
    </div>
  );
}

function Play({ newImgs, totalRenders, pointsPerRound, imgsPerRender }) {
  const [currentCards, setCurrentCards] = useState([]);
  const [flipCards, setFlipCards] = useState(false);
  const [renderNum, setRenderNum] = useState(0);
  const [score, setScore] = useState(0);
  const [heighstScore, setHeighstScore] = useState(0);
  const [clickedImgs, setClickedImgs] = useState([]);
  const gridSize = Math.ceil(Math.sqrt(imgsPerRender));

  const [gameOver, setGameOver] = useState(false);
  const [showCards, setShowCards] = useState(true);

  // Convert to array if it's not already
  const imgsArray = Array.isArray(newImgs) ? newImgs : Object.values(newImgs);
  function PlayAgain() {
    return (
      <button
        onClick={handlePlayAgain}
        className="button-73
    "
      >
        Play Again
      </button>
    );
  }

  const handlePlayAgain = () => {
    setClickedImgs([]);
    setGameOver(false);
    setFlipCards(false);
    setRenderNum(0);
    setHeighstScore((prev) => (prev > score ? prev : score));
    setScore(0);
    setShowCards(true);
  };

  const handleClick = (img) => {
    if (clickedImgs.some((clickedImg) => clickedImg.id === img.id)) {
      setGameOver(true);
      setShowCards(false);
      flipCards(false);

      return;
    }
    setClickedImgs((prev) => [...prev, img]);

    setScore((prev) => prev + 1);

    setFlipCards(true);
    setTimeout(() => {
      setRenderNum((prev) => prev + 1);
    }, 1000);
  };

  useEffect(() => {
    if (imgsArray && imgsArray.length > 0) {
      setCurrentCards(chooseCards(clickedImgs));
    }
  }, [imgsArray, imgsPerRender]);

  useEffect(() => {
    if (renderNum >= totalRenders) {
      setShowCards(false);
      setFlipCards(false);
      setScore((prev) => prev + pointsPerRound);
    } else {
      setCurrentCards(chooseCards(clickedImgs));
      setFlipCards(false);
    }
  }, [renderNum]);

  function chooseCards(currentClickedImgs) {
    // Check if we have enough images
    if (!imgsArray || imgsArray.length === 0) {
      return [];
    }

    if (imgsArray.length < imgsPerRender) {
      console.warn("Not enough images loaded for the requested render size");
      return [];
    }

    const cards = [];
    const ids = [];

    if (currentClickedImgs.length === 0) {
      // First render - just show the first few images
      for (let i = 0; i < imgsPerRender; i++) {
        const img = imgsArray[i];
        if (img && img.webformatURL) {
          cards.push(
            <div key={img.id}>
              <motion.img
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                src={img.webformatURL}
                alt="img"
                onClick={() => handleClick(img)}
              />
            </div>,
          );
        }
      }
    } else {
      // Ensure there will be at least 1 new Image every Render
      const availableNewImages = imgsArray.filter(
        (img) =>
          !currentClickedImgs.some((clickedImg) => clickedImg.id === img.id),
      );

      if (availableNewImages.length > 0) {
        const index = Math.floor(Math.random() * availableNewImages.length);
        const img = availableNewImages[index];
        ids.push(img.id);
        cards.push(
          <div key={img.id}>
            <motion.img
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              src={img.webformatURL}
              alt="img"
              onClick={() => handleClick(img)}
            />
          </div>,
        );
      }

      // Add random mix of old and new cards
      const remainingSlots = imgsPerRender - 1;
      const numOfOldCards = Math.min(
        Math.floor(Math.random() * currentClickedImgs.length),
        remainingSlots,
      );
      const numOfNewCards = remainingSlots - numOfOldCards;

      // Add old cards
      for (let i = 0; i < numOfOldCards; i++) {
        const availableOldCards = currentClickedImgs.filter(
          (img) => !ids.includes(img.id),
        );
        if (availableOldCards.length > 0) {
          const index = Math.floor(Math.random() * availableOldCards.length);
          const img = availableOldCards[index];
          ids.push(img.id);
          cards.push(
            <div key={img.id}>
              <motion.img
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                src={img.webformatURL}
                alt="img"
                onClick={() => handleClick(img)}
              />
            </div>,
          );
        }
      }

      // Add new cards
      for (let i = 0; i < numOfNewCards; i++) {
        const availableNewCards = imgsArray.filter(
          (img) => !ids.includes(img.id),
        );
        if (availableNewCards.length > 0) {
          const index = Math.floor(Math.random() * availableNewCards.length);
          const img = availableNewCards[index];
          ids.push(img.id);
          cards.push(
            <div key={img.id}>
              <motion.img
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                src={img.webformatURL}
                alt="img"
                onClick={() => handleClick(img)}
              />
            </div>,
          );
        }
      }
    }
    console.log(cards);
    return cards;
  }

  // Only set initial cards when images are loaded
  useEffect(() => {
    if (imgsArray && imgsArray.length > 0) {
      setCurrentCards(chooseCards(clickedImgs));
    }
  }, [imgsArray, imgsPerRender]);

  // Create flipped cards
  const flippedCards = Array.from({ length: imgsPerRender }, (_, i) => (
    <div key={`flipped-${i}`} className="flippedImg">
      <img src={flippedImg} alt="Flipped Image" />
    </div>
  ));

  // Fixed: Added return statement here
  return (
    <div className="cardsAndScore">
      <div className="score">
        <h1>Score: {score}</h1>
        <h1>Highest Score: {heighstScore}</h1>
      </div>
      <div>
        {flipCards ? (
          <motion.div
            className="cardsArea"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${gridSize}, .25fr)`,
              gridTemplateRows: `repeat(${gridSize}, .25fr)`,
              gap: "1.5rem",
              justifyContent: "center",
              alignItems: "center",
              justifySelf: "center",
              alignSelf: "center",
            }}
          >
            {flippedCards}
          </motion.div>
        ) : showCards ? (
          <motion.div
            className="cardsArea"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              className="cardsArea"
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${gridSize}, .25fr)`,
                gridTemplateRows: `repeat(${gridSize}, .25fr)`,
                gap: "1.5rem",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "3vw",
                marginTop: "5vw",
              }}
            >
              {" "}
              {currentCards}{" "}
            </div>
            <h2>
              {renderNum} / {totalRenders}
            </h2>
          </motion.div>
        ) : gameOver ? (
          <div className="gameEnds">
            <img src={loseImg} alt="Losing Ghost" />
            <audio src={loseMusic} autoPlay playsInline>
              {" "}
            </audio>
            <PlayAgain></PlayAgain>
          </div>
        ) : (
          <div className="gameEnds">
            <img src={winImg} alt="Winning ghost" />
            <audio src={winMusic} autoPlay playsInline></audio>

            <PlayAgain />
          </div>
        )}
      </div>
    </div>
  );
}

export default Cards;

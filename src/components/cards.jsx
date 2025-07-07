import { useEffect, useState } from "react";
import flippedImg from "../assets/backHome.svg";

/* [ ] replace flippedImg with an image of one of the ghost and write memory card under it  */

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
      const url = `${BASE_URL}?key=${API_KEY}&image_type=illustration&&order=popular&per_page=${totalImgsPerRound}&min_width=1024&max_width=1024&min_height=1024&max_height=1024&q=sketch`;

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

  /* [ ] fetch background music to display while playing */
  return (
    <div className="playingArea">
      {loading ? (
        /* [ ] style loading div */
        <div>Loading...</div>
      ) : error ? (
        /* [ ] make a sad character from the ghosts to display in the error div with a retry button */
        <div style={{ color: "red" }}>{error}</div>
      ) : (
        /* [ ] display fetched music */
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
  const [gameOver, setGameOver] = useState(false);
  const [flipCards, setFlipCards] = useState(false);
  const [renderNum, setRenderNum] = useState(0);
  const [score, setScore] = useState(0);
  const [wonRound, setWonRound] = useState(false);
  const [heighstScore, setHeighstScore] = useState(0);
  const [clickedImgs, setClickedImgs] = useState([]);
  const gridSize = Math.ceil(Math.sqrt(imgsPerRender));

  // Convert to array if it's not already
  const imgsArray = Array.isArray(newImgs) ? newImgs : Object.values(newImgs);

  const handlePlayAgain = () => {
    setClickedImgs([]);
    setGameOver(false);
    setFlipCards(false);
    setRenderNum(0);
    setHeighstScore(score > heighstScore ? score : heighstScore);
    setScore(0); // Reset score when playing again
    setWonRound(false);
  };

  const handleClick = (img) => {
    const newRenderNum = renderNum + 1;
    setRenderNum(newRenderNum);

    if (clickedImgs.some((clickedImg) => clickedImg.id === img.id)) {
      setGameOver(true);
    } else if (newRenderNum >= totalRenders) {
      setScore(score + pointsPerRound);
      setWonRound(true);
    } else {
      setScore(score + 1);
      setFlipCards(true);
      setClickedImgs((prev) => [...prev, img]); // Use state setter instead of mutation

      // Set new cards after a delay to show flip effect
      setTimeout(() => {
        setCurrentCards(chooseCards([...clickedImgs, img]));
        setFlipCards(false);
      }, 1000);
    }
  };

  function PlayAgain() {
    return <button onClick={handlePlayAgain}>Play Again</button>;
  }

  function chooseCards(currentClickedImgs = clickedImgs) {
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

    if (currentClickedImgs.length <= 1) {
      // First render - just show the first few images
      for (let i = 0; i < Math.min(imgsPerRender, imgsArray.length); i++) {
        const img = imgsArray[i];
        if (img && img.webformatURL) {
          cards.push(
            <div key={img.id}>
              <img
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
            <img
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
              <img
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
              <img
                src={img.webformatURL}
                alt="img"
                onClick={() => handleClick(img)}
              />
            </div>,
          );
        }
      }
    }
    return cards;
  }

  // Only set initial cards when images are loaded
  useEffect(() => {
    if (imgsArray && imgsArray.length > 0) {
      setCurrentCards(chooseCards());
    }
  }, [imgsArray, imgsPerRender]);

  // Create flipped cards
  const flippedCards = Array.from({ length: imgsPerRender }, (_, i) => (
    <div key={`flipped-${i}`} className="flippedImg">
      <img src={flippedImg} alt="Flipped Image" />
    </div>
  ));

  // Don't render if no images are loaded yet
  if (!imgsArray || imgsArray.length === 0) {
    return <div>Loading game...</div>;
  }

  return (
    <div className="cardsAndScore">
      <div className="score">
        <h1>Score: {score}</h1>
        <h1>Highest Score: {heighstScore}</h1>
      </div>
      <div
        className="cardsArea"
        style={{
          maxWidth: "90%",
          display: "grid",
          gridTemplateColumns: `repeat(${gridSize}, .25fr)`,
          gridTemplateRows: `repeat(${gridSize}, .25fr)`,
          gap: "1vh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {!gameOver && !wonRound && flipCards ? flippedCards : currentCards}
      </div>
      {gameOver && (
        <div>
          <div>Game Over</div>
          <PlayAgain />
        </div>
      )}
      {wonRound && (
        <div>
          <div>You Win</div>
          <PlayAgain />
        </div>
      )}
    </div>
  );
}

export default Cards;

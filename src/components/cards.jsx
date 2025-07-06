import { useEffect, useState } from "react";
import flippedImg from "../assets/backHome.svg";
/* [ ] replace flippedImg with an image of one of the ghost and write memory card under it  */

function Cards({
  imgsPerRender,
  totalRenders,
  pointsPerRound,
  totalImgsPerRound,
  searchTerm,
}) {
  const [imgs, setImgs] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_KEY = "51184474-32f1e0a0fae076cc4d45ae4d2";
  const BASE_URL = "https://pixabay.com/api/";

  const getImages = async (searchTerm) => {
    try {
      setLoading(true);
      setError(null);
      const url = `${BASE_URL}?key=${API_KEY}&image_type=illustration&order=popular&per_page=${totalImgsPerRound}&min_width=1024&max_width=1200&min_height=768&max_height=900`;

      const response = await fetch(url);
      console.log(searchTerm);

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

      console.log(images.length);
      setImgs(images);
    } catch (err) {
      setError("Error fetching images. Please try again.");
      console.error("Error fetching Images:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getImages(searchTerm);
  }, [searchTerm]);

  /* [ ] fetch background music to display while playing */
  return (
    <div className="cardsArea">
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
  const flippedCards = [];
  const handlePlayAgain = () => {
    setClickedImgs([]);
    setCurrentCards(chooseCards());
    setGameOver(false);
    setFlipCards(false);
    setRenderNum(0);
    setHeighstScore(score > heighstScore ? score : heighstScore);
    setWonRound(false);
  };
  const handleClick = (img) => {
    setRenderNum(renderNum + 1);
    if (clickedImgs.includes(img)) {
      setGameOver(true);
    } else if (renderNum === totalRenders) {
      setScore(score + pointsPerRound);
      setWonRound(true);
    } else {
      setScore(score + 1);
      setFlipCards(true);
      clickedImgs.push(img);
      setCurrentCards(chooseCards);
    }
  };

  function PlayAgain() {
    return <button onClick={handlePlayAgain}>Play Again</button>;
  }
  function chooseCards() {
    const cards = [];
    const ids = [];
    if (clickedImgs.length <= 1) {
      for (let i = 0; i < imgsPerRender; i++) {
        const img = newImgs[i];
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
    } else {
      //Assure there will be at least 1 new Image every Render //
      const index = Math.floor(Math.random() * newImgs.length);
      const img = newImgs[index];
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
      const numOfOldCards = Math.floor(Math.random() * clickedImgs.length);
      const numOfNewCards = imgsPerRender - 1 - numOfOldCards;

      for (let i = 1; i <= numOfOldCards; i++) {
        let index = Math.floor(Math.random() * clickedImgs.length);
        while (ids.includes(clickedImgs[index].id)) {
          index = Math.floor(Math.random() * clickedImgs.length);
        }
        const img = clickedImgs[index];
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
      for (let i = 1; i <= numOfNewCards; i++) {
        let index = Math.floor(Math.random() * newImgs.length);
        while (ids.includes(newImgs[index].id)) {
          index = Math.floor(Math.random() * newImgs.length);
        }
        const img = newImgs[index];
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
    return cards;
  }
  useEffect(() => {
    setCurrentCards(chooseCards());
    {
      for (let i = 0; i < imgsPerRender; i++) {
        flippedCards.push(
          <div className="flippedImg">
            <img src={flippedImg} alt="Flipped Image" />
          </div>,
        );
      }
    }
  }, []);

  return (
    <>
      <div>
        <div>Score: {score}</div>
        <div>Heights Score: {heighstScore}</div>
      </div>
      {!gameOver && !wonRound && flipCards ? flippedCards : currentCards}
      {gameOver && (
        <div>
          {" "}
          <div>Game Over</div> <PlayAgain />{" "}
        </div>
      )}
      {wonRound && (
        <div>
          <div>You Win</div>
          <PlayAgain />
        </div>
      )}
    </>
  );
}

export default Cards;

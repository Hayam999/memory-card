import { useEffect, useState } from "react";

function Card({ img }) {
  return (
    <div>
      <img src={img} alt="img" />
    </div>
  );
}

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

  return (
    <div className="cardsArea">
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: "red" }}>{error}</div>
      ) : (
        <Play
          newImgs={imgs}
          oldImgs={[]}
          totalRenders={totalRenders}
          pointsPerRound={pointsPerRound}
        />
      )}
    </div>
  );
}

function Play({ newImgs, oldImgs, totalRenders, pointsPerRound }) {
  /* 1_ if used images.length is <= 1:
            Add 3 new images
            else:
             a- choose a random number from 1 to the limited images per render - 1
            if there are suffecient used images for it
            reapat to reach 0: 
                 - choose a random number from 0 to used_images.length to be the index of the used image that you will display
            else: go back to a;
            render limited-images - random-used images times , new images
          2_ when one of them are clicked:
                1_save clicked img id in the used images[];
                2_ flip all images;
          3_ go back to step 1; repeat until you end rounds and the player wins the round or until he loses 
         */

  return <></>;
}

export default Cards;

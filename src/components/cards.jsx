import { useEffect, useState } from "react";

function Card({ img, name }) {
  const index = name.indexOf("GIF");
  const nameHeader = name.substring(0, index - 1);
  return (
    <div>
      <img src={img} alt="img" />
      <h4>{nameHeader}</h4>
    </div>
  );
}

function Cards({
  imgsPerRender,
  totalRenders,
  pointsPerRound,
  totalImgsPerRound,
}) {
  const [gifs, setGifs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("harry potter");
  const API_KEY = "natH5L3yloaSv21R6tsRZWQ89D1Nml6F";
  const BASE_URL = "https://api.giphy.com/v1/gifs";

  const fetchGifs = async (query = "cat", limit = "3") => {
    try {
      const url = `${BASE_URL}/search?api_key=${API_KEY}&q=${query}&limit=${limit}&rating=g`;
      console.log(`url: ${url}`);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`Data: ${data}`);

      const gifData = data.data.map((gif) => ({
        id: gif.id,
        title: gif.title,
        // Different image sizes available - choosing fixed_height for consistent sizing
        url: gif.images.fixed_height.url,
        webp: gif.images.fixed_height.webp, // More efficient format
        width: gif.images.fixed_height.width,
        height: gif.images.fixed_height.height,
      }));

      setGifs(gifData);
    } catch (err) {
      console.error("Error fetching GIFS:", err);
    }
  };

  useEffect(() => {
    fetchGifs(searchTerm);
  }, [searchTerm]);

  return (
    <div className="cardsArea">
      {gifs.map((gif) => {
        return (
          <div key={gif.id}>
            <Card img={gif.url} name={gif.title} />
          </div>
        );
      })}
    </div>
  );
}

export default Cards;

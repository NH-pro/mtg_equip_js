// Imports
import { useState, useEffect } from "react";
// Component Imports
import MatchSetup from "./components/MatchSetup";
import CardSearch from "./components/CardSearch";
// Styles Import
import "./App.css";

function App() {
  // gameSetting state to be saved.
  const [gameCacheSettings, setGameCacheSettings] = useState(null);

  // When app loads call getCache().
  useEffect(() => {
    getCache();
  }, []);

  /* 
    --- getCache Function ---
    1. Check to see if there is already a cache named "Game_Settings_Cache", create one if not.
    2. Then async request a response for the url of "http://localhost:3000/" within the opened cache.
    3. Await the response from the request, and then set our "GameCacheSettings" state with the response.
  */
  const getCache = () => {
    caches
      .open("Game_Settings_Cache")
      .then(async (cache) => {
        const cacheMatch = await cache.match("http://localhost:3000/");
        return cacheMatch;
      })
      .then(async (response) => {
        const data = await response.json();
        setGameCacheSettings(data);
      })
      .catch((err) => {
        console.log("Error in getCache!", err);
      });
  };

  // Rendered app.
  return (
    <div className="App">
      {/* Pass "getCache" function as a prop to the "MatchSetup" component. */}
      <MatchSetup getCache={getCache} />
      <br />
      <CardSearch />
      {gameCacheSettings && (
        <div
          style={{
            backgroundColor: "lightgreen",
            paddingTop: "1px",
            paddingBottom: "20px",
            paddingLeft: "10px",
            margin: "3px",
            borderRadius: "5px",
          }}
        >
          <h3>
            Last saved game data in cache: {gameCacheSettings.format} with{" "}
            {gameCacheSettings.playerCount} players.
          </h3>
          <div
            style={{
              display: "flex",
            }}
          >
            {gameCacheSettings.playerArray.map((player) => {
              return (
                <div
                  key={player.playerNum}
                  style={{
                    backgroundColor: "lightgoldenrodyellow",
                    margin: "3px",
                    padding: "3px",
                    borderRadius: "5px",
                  }}
                >
                  <h4>Name: {player.name}</h4>
                  <ul>
                    <li>Player number: {player.playerNum}</li>
                    <li>Deck image: {player.deck_image}</li>
                    <li>Life: {player.life}</li>
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

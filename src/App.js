import CreateMatch from "./components/CreateMatch";
import { useState, useEffect } from 'react';

function App() {
  const [gameData, setGameData] = useState(null);

  useEffect(() => {
    getCache()
  },[])

  const getCache = () => {
    caches
      .open('Game_Settings_Cache')
      .then((cache) => {
        cache.match('http://localhost:3000/')
          .then( async response => {
            const data = await response.json()
            return setGameData(data)
          })
      })
  }
  return (
    <div className="App">
      {gameData && 
        <h3>This is the current game format: {gameData.gameFormat} with {gameData.playerCount} players.</h3>
      }
      <CreateMatch />
    </div>
  );
}

export default App;

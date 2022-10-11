// Imports
import { useState, useEffect } from 'react';
// Component Imports
import MatchSetup from "./components/MatchSetup";


function App() {
  const [gameCacheSettings, setGameCacheSettings] = useState(null);

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
            return setGameCacheSettings(data)
          })
          .catch(err => {
            console.log('Error in getCache!', err)
          })
      })
  }
  
  return (
    <div className="App">
      <MatchSetup getCache={getCache}/>
      {gameCacheSettings && 
        <h3>This is the current game format: {gameCacheSettings.format} with {gameCacheSettings.playerCount} players.</h3>
      }
    </div>
  );
}

export default App;

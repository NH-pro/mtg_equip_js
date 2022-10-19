// Imports
import { useState, useEffect } from 'react';
// Component Imports
import MatchSetup from "./components/MatchSetup";


function App() {
  // Local State
  const [gameCacheSettings, setGameCacheSettings] = useState(null);
  const [search, setSearch] = useState('');
  const [card, setCard] = useState(null);

  // When app loads call getCache().
  useEffect(() => {
    getCache()
  },[])

  /* 
    --- getCache Function ---
    1. Check to see if there is already a cache named "Game_Settings_Cache", create one if not.
    2. Then async request a response for the url of "http://localhost:3000/" within the opened cache.
    3. Await the response from the request, and then set our "GameCacheSettings" state with the response.
  */
  const getCache = () => {
    caches
      .open('Game_Settings_Cache')
      .then( async (cache) => {
        const cacheMatch = await cache.match('http://localhost:3000/');
        return cacheMatch;
      })
      .then( async (response) => {
        const data = await response.json()
        return setGameCacheSettings(data)
      })
      .catch((err) => {
        console.log('Error in getCache!', err)
      })
  }

  /*
    --- searchHandle function ---
    API fetch request to "https://api.scryfall.com".
    1. Await response from api endpoint for the card name we are searching with.
    2. Convert response to json.
    3. set the cardList state to the converted array response.
  */
  const searchHandle = async () => {
    if(search === '') {
      return alert("You need to enter in a card name!");
    } else {
      await fetch(`https://api.scryfall.com/cards/named?fuzzy=${search}`)
      .then( async response =>
        await response.json()
        )
      .then(data => {
        setCard(data.image_uris.art_crop);
        console.log(data.image_uris.art_crop);
      })
      .catch(error => {
        console.log('Error in card fetch request', error);
      })
    }
  }

  // Rendered app.
  return (
    <div className="App">
      {/* Pass "getCache" function as a prop to the "MatchSetup" component. */}
      <MatchSetup getCache={getCache}/>
      {gameCacheSettings && 
        <h3>This is the current game format: {gameCacheSettings.format} with {gameCacheSettings.playerCount} players.</h3>
      }
      <input onChange={e => setSearch(e.target.value)} placeholder='Find Commander'/>
      <button onClick={() => searchHandle()}>Submit</button>
      {card && 
        <img src={card} alt="card_img"/>
      }
    </div>
  );
}

export default App;

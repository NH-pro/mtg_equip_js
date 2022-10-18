// Imports
import { useState, useEffect } from 'react';
// Component Imports
import MatchSetup from "./components/MatchSetup";


function App() {
  // Local State
  const [gameCacheSettings, setGameCacheSettings] = useState(null);
  const [search, setSearch] = useState('');
  const [cardList, setCardList] = useState(null);

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
    API fetch request to "magicthegathering.io".
    1. Await response from api endpoint for the card name we are searching with.
    2. Convert response to json.
    3. set the cardList state to the converted array response.
  */
  const searchHandle = async () => {
    if(search === '') {
      return alert("You need to enter in a card name!");
    } else {
      await fetch(`https://api.magicthegathering.io/v1/cards?name=${search}`)
      .then(response => response.json())
      .then(data => {
        setCardList(data.cards);
        console.log(data.cards);
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
      {cardList && 
        cardList.map(card => {
          if(card.imageUrl) {
            return (
              <ul
                key={card.id}
              >
                <li>{card.name}</li>
                <img src={card.imageUrl}/>
              </ul>
            )
          } else {
            return
          }
        })
      }
    </div>
  );
}

export default App;

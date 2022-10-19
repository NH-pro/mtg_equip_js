// Imports
import { useState, useEffect } from 'react';
// Component Imports
import MatchSetup from "./components/MatchSetup";


function App() {
  // Local State
  const [gameCacheSettings, setGameCacheSettings] = useState(null);
  const [search, setSearch] = useState('');
  const [card, setCard] = useState(null);
  const [suggestedCards, setSuggestedCards] = useState(null)

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
    3. set the cardList state to a card object.
  */
  const searchHandle = async () => {
    if(search === '') {
      return alert("You need to enter in a card name!");
    } else {
      await fetch(`https://api.scryfall.com/cards/named?fuzzy=${search}`)
      .then(async response =>
        await response.json()
      )
      .then(data => {
        setCard({
          name: data.name,
          art: data.image_uris.art_crop
        });
      })
      .catch(error => {
        console.log('Error in card fetch request', error);
      })
    }
  }

  const inputHandle = async (name) => {
    setSearch(name)

    if(name.length > 2) {
      await fetch(`https://api.scryfall.com/cards/autocomplete?q=${name}`)
      .then(async response => { 
        return await response.json()
      })
      .then(response => {
        setSuggestedCards(response.data);
      })
      .catch(error => {
        console.log('Error in card name suggestion', error)
      })
    }

    if(name.length < 2) {
      setSuggestedCards(null);
    }
    if(suggestedCards){console.log(suggestedCards)};
  }

  const sugCardClickHandle = (name) => {
    document.getElementById('search_input').value = name;
    inputHandle(name);
    setSearch(name);
  }

  // Rendered app.
  return (
    <div className="App">
      {/* Pass "getCache" function as a prop to the "MatchSetup" component. */}
      <MatchSetup getCache={getCache}/>
      {gameCacheSettings && 
        <h3>This is the current game format: {gameCacheSettings.format} with {gameCacheSettings.playerCount} players.</h3>
      }
      <input id='search_input' onChange={e => inputHandle(e.target.value)} placeholder='Find Commander'/>
      <button onClick={() => searchHandle()}>Submit</button>
      {suggestedCards &&
        <ul>
          {suggestedCards.map(sugCard => {
            return(
              <li 
                key={sugCard}
                onClick={() => sugCardClickHandle(sugCard)}
              >
                {sugCard}
              </li>
            )
          })}
        </ul>
      }
      {card &&
        <div>
          <h4>{card.name}</h4>
          <img src={card.art} alt="card_img"/>
        </div>
      }
    </div>
  );
}

export default App;

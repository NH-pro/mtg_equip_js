// Imports
import { useState, useEffect } from 'react';
// Component Imports
import MatchSetup from "./components/MatchSetup";
// Styles Import
import './App.css';


function App() {
  // gameSetting state to be saved.
  const [gameCacheSettings, setGameCacheSettings] = useState(null);
  // Input box search state.
  const [search, setSearch] = useState('');
  // Suggested card name array state.
  const [suggestedCards, setSuggestedCards] = useState(null);
  // Actual selected card state.
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
        setGameCacheSettings(data)
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
    3. Set the cardList state to a card object. If a 'transform' card, include both sides.
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
        if(data.layout === 'transform'){
          setCard({
            name: data.name,
            art: data.card_faces[0].image_uris.art_crop,
            transform_art: data.card_faces[1].image_uris.art_crop
          })
        } else {
          setCard({
            name: data.name,
            art: data.image_uris.art_crop
          })
        }
        setSuggestedCards(null);
        document.getElementById('search_input').value = '';
      })
      .catch(error => {
        console.log('Error in card fetch request', error);
      })
    }
  }

  /*
    --- inputHandle ---
    1. Set search state to the value in the input box.
    2. Fetch api autocomplete suggestions from "https://api.scryfall.com" and convert to json.
    3. Set suggestedCards state to the response.
    4. If input value is < 2, set suggestedCards to null.
  */
  const inputHandle = async (name) => {
    setSearch(name)

    if(name.length > 2) {
      await fetch(`https://api.scryfall.com/cards/autocomplete?q=${name}`)
      .then(async response => {
        if(response.ok) {
          return await response.json()
        }
        throw Error('Error in inputHandle')
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
  }

  /*
    --- sugCardClickHandle ---
    1. When the user clicks on one of the suggested cards,
        the input box value is changed to the suggested card value.
    2. Also updates search value.
  */
  const sugCardClickHandle = (name) => {
    document.getElementById('search_input').value = name;
    inputHandle(name);
    setSearch(name);
  }

  const sugCardFocusHandle = async (sugCard, e) => {
    try {
      const response = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${sugCard}`);
      if(response.ok) {
        const jsonResponse = await response.json();
        let newImg = document.createElement("img");
        newImg.id = `${sugCard}_art_id`;
        newImg.src = jsonResponse.image_uris.art_crop;
        newImg.style = `
          width: 200px;
          border: solid black 5px;
          position: absolute;
          top: ${e.clientY}px;
          left: ${e.clientX}px;
        `;
        document.body.append(newImg);
      }
    } catch (error) {
      console.log('Error in sugCardFocusHandle', error);
    }
  }

  const sugCardMouseLeaveHandle = (sugCard) => {
    const badElement = document.getElementById(`${sugCard}`);
    badElement.remove();
  }

  // Rendered app.
  return (
    <div className="App">
      {/* Pass "getCache" function as a prop to the "MatchSetup" component. */}
      <MatchSetup getCache={getCache}/>
      <br/>
      <input id='search_input' onChange={e => inputHandle(e.target.value)} placeholder='Find Commander'/>
      <button onClick={() => searchHandle()}>Submit</button>
      <div 
        id='sug_card_box'
        style={{
          position: 'absolute'
        }}
      >
      </div>
      {suggestedCards &&
        <div>
          {suggestedCards.map(sugCard => {
            return(
              <p
                className="suggestion"
                id={sugCard.name}
                key={sugCard}
                onClick={() => sugCardClickHandle(sugCard)}
                onMouseEnter={(e) => sugCardFocusHandle(sugCard, e)}
                onMouseLeave={() => sugCardMouseLeaveHandle(`${sugCard}_art_id`)}
              >
                {sugCard}
              </p>
            )
          })}
        </div>
      }
      {card &&
        <div>
          <h4>{card.name}</h4>
          <img 
            src={card.art}
            alt="card_img"
            style={{
              width: '300px'
            }}  
          />
          {card.transform_art &&
            <img
              src={card.transform_art}
              alt="card_img"
              style={{
                width: '300px'
              }} 
            />
          }
        </div>
      }
      {gameCacheSettings && 
        <div
          style={{
            backgroundColor: 'lightgreen',
            paddingTop: '1px',
            paddingBottom: '20px',
            paddingLeft: '10px',
            margin: '3px',
            borderRadius: '5px'
          }}
        >
          <h3>Last saved game data in cache: {gameCacheSettings.format} with {gameCacheSettings.playerCount} players.</h3>
          <div
                style={{
                    display:'flex'
                }}
            >
              {gameCacheSettings.playerArray.map(player => {
                return (
                  <div
                    key={player.playerNum}
                    style={{
                        backgroundColor: 'lightgoldenrodyellow',
                        margin: '3px',
                        padding: '3px',
                        borderRadius: '5px'
                    }}
                  >
                    <h4>Name: {player.name}</h4>
                    <ul>
                        <li>Player number: {player.playerNum}</li>
                        <li>Deck image: {player.deck_image}</li>
                        <li>Life: {player.life}</li>
                    </ul> 
                  </div>
                )
              })}
          </div>
        </div>
      }
    </div>
  );
}

export default App;

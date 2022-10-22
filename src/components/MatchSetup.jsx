// Imports
import { useState } from 'react';

function CreateMatch({getCache}) {
    // Local State
    const [format, setFormat] = useState('Commander');
    const [playerCount, setPlayerCount] = useState(2);
    const [playerArray, setPlayerArray] = useState([{name: 'blank', deck_image: 'blank'}, {name: 'blank2', deck_image: 'blank'}])
    let comPlayers = null;


    class Player {
        constructor(name, deck_image) {
            this.name = name;
            this.deck_image = deck_image;

            playerArray.forEach(player => {
                if(player.name !== this.name) {
                    this[`${player.name}_commander_damage`] = 0;
                }
            });
        }
    }

    class CommanderPlayer extends Player {
        constructor(name, deck_image) {
            super(name, deck_image);
        }
        life = 40;
    }


    if(playerArray) {
        comPlayers = playerArray.map(comPlayer => {
            return new CommanderPlayer(comPlayer.name, comPlayer.deck_image);
       })
    };

    // gameInfo Object to save into the cache.
    const gameInfo = {
        format,
        playerCount
    }

    /*
        --- confirmGameSettings Function ---
        1. Async function that takes parameters of a cacheName, url, and response.
        2. The response parameter is converted into an instance of a Response Object.
        3. Check to see if there is a "Game_Settings_Cache", create one if not.
        4. Use .put() to add data to the selected "Game_Settings_Cache".
        5. Call "getCache" function prop to update "gameCacheSettings" state.
    */
    const confirmGameSettings = async (cacheName, url, response) => {
        const data = new Response(JSON.stringify(response));
        await caches
            .open(cacheName)
            .then(cache => {
                cache.put(url, data)
                console.log('Game settings cache was updated:', gameInfo)
            });
        getCache();
    }

    const handlePlayerAmount = (numOfPlayers) => {
        setPlayerCount(numOfPlayers)
        let newPlayer = {name: 'blank', deck_image: 'blank'};
        let extraPlayers = Array(numOfPlayers).fill(newPlayer);
        setPlayerArray(extraPlayers)
    }

    console.log(playerArray)
    return(
        <div id='game_setup_container'>
            <div>
                <h3>Game format?</h3>
                <select
                    id='format_select'
                    onChange={e => {setFormat(e.target.value)}}
                >
                    <option value='Commander'>Commander</option>
                    <option value='Brawl'>Brawl</option>
                </select>
            </div>
            <div>
                <h3>How many players?</h3>
                <select 
                    id='player_amount_select' 
                    onChange={e => handlePlayerAmount(Number(e.target.value))}
                >
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                </select>
            </div>
            <br/>
            <button 
                onClick={() => {
                    confirmGameSettings(
                        'Game_Settings_Cache',
                        'http://localhost:3000/',
                        gameInfo
                    )}}
            >
                Confirm Game Settings
            </button>
            {comPlayers &&
                comPlayers.map(player => {
                    return (
                        <h3
                            key={player.name}
                        >
                            {player.name}, {player.deck_image}, {player.life}
                        </h3>
                    )
                })
            }
        </div>
    )
}
export default CreateMatch;
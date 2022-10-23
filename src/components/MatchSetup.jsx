// Imports
import { useState } from 'react';

function CreateMatch({getCache}) {
    // Local State
    const [format, setFormat] = useState('Commander');
    const [playerCount, setPlayerCount] = useState(2);
    const [playerArray, setPlayerArray] = useState([
            {name: 'blank', playerNum: 1, deck_image: 'blank'},
            {name: 'blank', playerNum: 2, deck_image: 'blank'}
    ])
    let comPlayers = null;


    class Player {
        constructor(name, deck_image) {
            this.name = name;
            this.playerNum = 0;
            this.deck_image = deck_image;
        }
    }

    class CommanderPlayer extends Player {
        constructor(name, deck_image, playerArray) {
            super(name, deck_image);

            playerArray.forEach(player => {
                if(player.name !== this.name) {
                    this[`${player.name}_commander_damage`] = 0;
                }
            });
        }
        life = 40;
    }

    class BrawlPlayer extends Player {
        life = 25;
    }


    if(playerArray && format === 'Commander') {
        comPlayers = playerArray.map(comPlayer => {
            return new CommanderPlayer(comPlayer.name, comPlayer.deck_image, playerArray);
       })
    } else if (playerArray && format === 'Brawl') {
        comPlayers = playerArray.map(comPlayer => {
            return new BrawlPlayer(comPlayer.name, comPlayer.deck_image, playerArray);
       })
    }

    // gameInfo Object to save into the cache.
    const gameInfo = {
        format,
        playerCount,
        comPlayers
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
        let newPlayer = {name: 'blank', playerNum: 0, deck_image: 'blank'};
        let extraPlayers = Array(numOfPlayers).fill(newPlayer);
        setPlayerArray(extraPlayers)
    }

    return(
        <div 
            id='game_setup_container'
            style={{
                backgroundColor: 'lightblue',
                paddingTop: '1px',
                paddingBottom: '20px',
                paddingLeft: '10px',
                margin: '3px',
                borderRadius: '5px'
            }}
        >
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
            <div
                style={{
                    display:'flex'
                }}
            >
                {comPlayers &&
                    comPlayers.map(player => {
                        return (
                            <div
                                key={player.playerNum}
                                style={{
                                    backgroundColor: 'lightcoral',
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
                    })
                }
            </div>
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
        </div>
    )
}
export default CreateMatch;
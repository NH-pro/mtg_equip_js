// Imports
import { useState } from 'react';

function CreateMatch({getCache}) {
    // Local State
    const [format, setFormat] = useState('Commander');
    const [playerCount, setPlayerCount] = useState(2);

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
            .then((cache) => {
                cache.put(url, data)
                console.log('Game settings cache was updated:', gameInfo)
            });
        getCache();
    }

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
                    onChange={e => {setPlayerCount(Number(e.target.value))}}
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
        </div>
    )
}
export default CreateMatch;
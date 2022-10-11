import { useState } from 'react';

function CreateMatch() {
    const [gameFormat, setGameFormat] = useState('Commander');
    const [playerCount, setPlayerCount] = useState(2);

    const gameData = {
        format: gameFormat,
        playerCount
    }

    function confirmGameSettings(cacheName, url, response) {

        const data = new Response(JSON.stringify(response));

        caches.open(cacheName)
            .then((cache) => {
                cache.put(url, data)
                console.log('Game_Settings_Cache was created')
            });
    }

    return(
        <div id='game_setup_container'>
            <div>
                <h3>Game format?</h3>
                <select
                    id='format_select'
                    onChange={e => {setGameFormat(e.target.value)}}
                >
                    <option value='Commander'>Commander</option>
                    <option value='Brawl'>Brawl</option>
                </select>
            </div>
            <div>
                <h3>How many players?</h3>
                <select 
                    id='player_amount_select' 
                    onChange={e => {setPlayerCount(e.target.value)}}
                >
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                </select>
            </div>
            <br/>
            <button 
                onClick={() => {confirmGameSettings(
                        'Game_Settings_Cache',
                        'http://localhost:3000/',
                        gameData
                    )}}
            >
                Confirm Game Settings
            </button>
        </div>
    )
}
export default CreateMatch;
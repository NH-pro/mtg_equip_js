import { useState } from 'react';

function CreateMatch({getCache}) {
    const [format, setFormat] = useState('Commander');
    const [playerCount, setPlayerCount] = useState(2);

    const gameInfo = {
        format,
        playerCount
    }

    async function confirmGameSettings(cacheName, url, response) {

        const data = new Response(JSON.stringify(response));

        await caches.open(cacheName)
            .then((cache) => {
                cache.put(url, data)
                console.log('Game settings cache was updated:', gameInfo)
            });
        await getCache();
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
                onClick={() => {confirmGameSettings(
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
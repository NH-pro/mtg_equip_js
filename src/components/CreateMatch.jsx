import { useState } from 'react';

function CreateMatch() {
    const [gameFormat, setGameFormat] = useState('Commander');
    const [playerCount, setPlayerCount] = useState(2);

    function confirmGameSettings() {
        console.log('Hello')
    }

    return(
        <>
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
            <button onClick={() => {confirmGameSettings()}}>Confirm Game Settings</button>
        </>
    )
}
export default CreateMatch;
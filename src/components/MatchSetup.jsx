// Imports
import { useState } from "react";
import { Player, CommanderPlayer, BrawlPlayer } from "../models/playerModels";

function CreateMatch({ getCache }) {
  // Local State
  const [format, setFormat] = useState(null);
  const [playerCount, setPlayerCount] = useState(2);
  const [playerArray, setPlayerArray] = useState(null);

  // gameInfo Object to save into the cache.
  const gameInfo = {
    format,
    playerCount,
    playerArray,
  };

  /**
   * confirmGameSettings function that sets and gets cached game data.
   * @param {*} cacheName 
   * @param {*} url 
   * @param {*} response 
   */
  const confirmGameSettings = async (cacheName, url, response) => {
    const data = new Response(JSON.stringify(response));
    await caches.open(cacheName).then((cache) => {
      cache.put(url, data);
      console.log("Game settings cache was updated:", gameInfo);
    });
    getCache();
  };

  /**
   * handlePlayerAmount sets player state and 
   * converts any existing players to the selected format.
   * @param {*} numOfPlayers 
   */
  const handlePlayerAmount = (numOfPlayers) => {
    setPlayerCount(numOfPlayers);

    let extraPlayers = [];

    let newPlayer = (num) => {
      if (format === "Commander") {
        return new CommanderPlayer("blank", "blank", num, playerCount);
      } else if (format === "Brawl") {
        return new BrawlPlayer("blank", "blank", num);
      } else {
        return new Player("blank", "blank", num);
      }
    };

    for (let i = 1; i <= numOfPlayers; i++) {
      extraPlayers.push(newPlayer(i));
    }

    setPlayerArray(extraPlayers);
  };

  /**
   * formatHandle sets the game format and if there is a playerArray,
   *  it converts all players to the new class type and sets playerArray to the new updated array.
   * @param {*} type 
   */
  const formatHandle = (type) => {
    setFormat(type);
    if (playerArray) {
      let updateArray = playerArray.map((player) => {
        if (type === "Commander") {
          return new CommanderPlayer(
            player.name,
            player.deck_image,
            player.playerNum,
            playerCount
          );
        } else if (type === "Brawl") {
          return new BrawlPlayer(
            player.name,
            player.deck_image,
            player.playerNum
          );
        } else {
          return new Player(player.name, player.deck_image, player.playerNum);
        }
      });
      setPlayerArray(updateArray);
    }
    console.log(`Format changed to ${type}!`);
  };

  const editPlayerHandle = (index, playerInfo) => {
    console.log(
      `This is index: ${index} and this is player Info: ${playerInfo.playerNum}`
    );
  };

  return (
    <div
      id="game_setup_container"
      style={{
        backgroundColor: "lightblue",
        paddingTop: "1px",
        paddingBottom: "20px",
        paddingLeft: "10px",
        margin: "3px",
        borderRadius: "5px",
      }}
    >
      <div>
        <h3>How many players?</h3>
        <select
          id="player_amount_select"
          onChange={(e) => handlePlayerAmount(Number(e.target.value))}
        >
          <option>0</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
        </select>
      </div>
      <div>
        <h3>Game format?</h3>
        <select
          id="format_select"
          onChange={(e) => {
            formatHandle(e.target.value);
          }}
        >
          <option value="NA">Select a format</option>
          <option value="Commander">Commander</option>
          <option value="Brawl">Brawl</option>
        </select>
      </div>
      <br />
      <div
        style={{
          display: "flex",
        }}
      >
        {playerArray &&
          playerArray.map((player) => {
            return (
              <div
                key={player.playerNum}
                style={{
                  backgroundColor: "lightcoral",
                  margin: "3px",
                  padding: "3px",
                  borderRadius: "5px",
                }}
                onClick={() =>
                  editPlayerHandle(
                    playerArray
                      .map((p) => p.playerNum)
                      .indexOf(player.playerNum),
                    player
                  )
                }
              >
                <h4>Name: {player.name}</h4>
                <ul>
                  <li>Player number: {player.playerNum}</li>
                  <li>Deck image: {player.deck_image}</li>
                  <li>Life: {player.life}</li>
                </ul>
              </div>
            );
          })}
      </div>
      <button
        onClick={() => {
          confirmGameSettings(
            "Game_Settings_Cache",
            "http://localhost:3000/",
            gameInfo
          );
        }}
      >
        Confirm Game Settings
      </button>
    </div>
  );
}
export default CreateMatch;

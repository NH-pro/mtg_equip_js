import { useState } from "react";

export default function CardSearch() {
  // Input box search state.
  const [search, setSearch] = useState("");
  // Suggested card name array state.
  const [suggestedCards, setSuggestedCards] = useState(null);
  // Actual selected card state.
  const [card, setCard] = useState(null);

 /**
  * searchHandle function is a fetch request to "https://api.scryfall.com".
  * Await response from api endpoint for the card name we are searching with.
  * Convert response to json and set cardList to the card object.
  * If the searched card has a "transform" type, include both card image urls.
  * @returns  card object
  */
  const searchHandle = async () => {
    if (search === "") {
      return alert("You need to enter in a card name!");
    } else {
      await fetch(`https://api.scryfall.com/cards/named?fuzzy=${search}`)
        .then(async (response) => await response.json())
        .then((data) => {
          if (data.layout === "transform") {
            setCard({
              name: data.name,
              art: data.card_faces[0].image_uris.art_crop,
              transform_art: data.card_faces[1].image_uris.art_crop,
            });
          } else {
            setCard({
              name: data.name,
              art: data.image_uris.art_crop,
            });
          }
          setSuggestedCards(null);
          document.getElementById("search_input").value = "";
        })
        .catch((error) => {
          console.log("Error in card fetch request", error);
        });
    }
  };

  /*
        --- inputHandle ---
        1. Set search state to the value in the input box.
        2. Fetch api autocomplete suggestions from "https://api.scryfall.com" and convert to json.
        3. Set suggestedCards state to the response.
        4. If input value is < 2, set suggestedCards to null.
    */
  const inputHandle = async (name) => {
    setSearch(name);

    if (name.length > 2) {
      await fetch(`https://api.scryfall.com/cards/autocomplete?q=${name}`)
        .then(async (response) => {
          if (response.ok) {
            return await response.json();
          }
          throw Error("Error in inputHandle");
        })
        .then((response) => {
          if (response.data.length >= 2) {
            setSuggestedCards(response.data);
          } else {
            setSuggestedCards(null);
          }
        })
        .catch((error) => {
          console.log("Error in card name suggestion", error);
        });
    }

    if (name.length < 2) {
      setSuggestedCards(null);
    }
  };

  /*
        --- sugCardClickHandle ---
        1. When the user clicks on one of the suggested cards,
            the input box value is changed to the suggested card value.
        2. Also updates search value.
    */
  const sugCardClickHandle = (name) => {
    document.getElementById("search_input").value = name;
    inputHandle(name);
    setSearch(name);
  };

  const sugCardFocusHandle = async (sugCard, e) => {
    try {
      const response = await fetch(
        `https://api.scryfall.com/cards/named?fuzzy=${sugCard}`
      );
      if (response.ok) {
        const jsonResponse = await response.json();
        let newImg = document.createElement("img");
        newImg.className = "sug_art";
        newImg.id = `${sugCard}_art_id`;
        newImg.src = jsonResponse.image_uris.art_crop;
        newImg.style = `
              width: 300px;
              border: solid black 3px;
              border-radius: 5px;
              position: absolute;
              top: ${e.clientY}px;
              left: ${Number(e.clientX) + 40}px;
            `;
        document.body.append(newImg);
      }
    } catch (error) {
      console.log("Error in sugCardFocusHandle", error);
    }
  };

  const sugCardMouseLeaveHandle = () => {
    const sugCardImages = document.getElementsByClassName("sug_art");
    for (let sugImage of sugCardImages) {
      sugImage.remove();
    }
  };

  return (
    <div>
      <input
        id="search_input"
        onChange={(e) => inputHandle(e.target.value)}
        placeholder="Find Commander"
      />
      <button onClick={() => searchHandle()}>Submit</button>
      <div
        id="sug_card_box"
        style={{
          position: "absolute",
        }}
      ></div>
      {suggestedCards && (
        <div>
          {suggestedCards.map((sugCard) => {
            return (
              <div
                className="suggestion"
                id={sugCard.name}
                key={sugCard}
                onClick={() => sugCardClickHandle(sugCard)}
                onMouseEnter={(e) => sugCardFocusHandle(sugCard, e)}
                onMouseLeave={() => sugCardMouseLeaveHandle()}
                style={{
                  cursor: "pointer",
                }}
              >
                <p
                  style={{
                    margin: "0px",
                  }}
                >
                  {sugCard}
                </p>
              </div>
            );
          })}
        </div>
      )}
      {card && (
        <div>
          <h4>{card.name}</h4>
          <img
            src={card.art}
            alt="card_img"
            style={{
              width: "300px",
            }}
          />
          {card.transform_art && (
            <img
              src={card.transform_art}
              alt="card_img"
              style={{
                width: "300px",
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

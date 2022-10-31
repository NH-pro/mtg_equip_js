export class Player {
  constructor(name, deck_image, playerNum = 0) {
    this.name = name;
    this.playerNum = playerNum;
    this.deck_image = deck_image;
  }
}

export class CommanderPlayer extends Player {
  constructor(name, deck_image, playerNum, playerCount) {
    super(name, deck_image, playerNum);

    for (let i = 1; i <= playerCount; i++) {
      if (playerNum !== i) {
        this[`player_${i}_commander_damage`] = 0;
      }
    }
  }
  life = 40;
  type = "Commander";
}

export class BrawlPlayer extends Player {
  life = 25;
  type = "Brawl";
}

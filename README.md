ChattleShip Twitch Bot
======================

ChattleShip is a game of battleship implemented in twitch chat. Vote for
coordinates by typing them in chat and see the game update in real-time

## Usage
Create a file called `auth.json` in the chattleship-bot directory and put
the username and oauth token for your twitch bot in it (see
`auth.json.example` for an example)

You'll probably want to change which channel this bot connects to in
`app.js`.

Then run the usual `npm install` and `node app.js` and you're good to go!

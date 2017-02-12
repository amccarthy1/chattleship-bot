/**
 * [DISCLAIMER] * THIS IS HACKATHON-QUALITY CODE.
 * BY READING THIS SOURCE FILE, YOU UNDERSTAND THAT THIS CODE IS NOT OF
 * PRODUCTION QUALITY, AND WAS WRITTEN IN A 24-HOUR TIMESPAN.
 * IT IS NOT ACTIVELY MAINTAINED.
 * app.js
 * Connects a chat bot to twitch and relays commands
 */
var tmi = require("tmi.js");
var identity = require("./auth.json");
var phases = require("./phases.js");
var vote = require("./vote.js");
var request = require("request");
var api = require("./api.js");

const VOTE_TIMEOUT = 5000;
const DELAY_BTW_GAMES_SEC = 60;

var options = {
    options: {
        debug: true
    },
    connection: {
        cluster: "aws",
        reconnect: true
    },
    identity: identity,
    channels: ["chattleship"]
};

var phase = phases.enum.FIRING; // TODO do fleet planning via chat as well.
var votes = {};

var client = tmi.client(options)
var api = new api("http://localhost:8080");
client.connect();

client.on("connected", function(address, port) {
    console.log("Connected to " + address + " on port " + port);
    // client.action("chattleship", "ChattleShip bot connected on port " + port);
});


client.on("chat", function(channel, user, message, self) {
    if (user["user-type"] === "mod") {
        if (message === "!reset") {
            api.reset(function (result) {
                vote.reset();
                client.say("chattleship", "Successfully reset game raysBeef");
            });
        }
    }
    var canonicalMessage = phases.canonicalize(message, phase);
    if (canonicalMessage == null) return; // ignore messages that don't match

    vote.vote(canonicalMessage, user["display-name"]);
});

function doVote() {
    var votewin = vote.pickWinner();
    if (votewin === null) return; // wait for more votes
    // TODO send winner to battleship server
    fire(votewin, client);
}

var voteTimer = setInterval(doVote, VOTE_TIMEOUT);

function fire(coords, cli) {
    api.fire(coords, 1, function(result) {
        debugger;
        vote.reset();
        cli.say("chattleship", result + " at: " + coords + " " + (result !== "MISS" ? "raysB" : ""));
        if (api.getState().winner) {
            var won = api.getState().winner === 1;
            cli.say("chattleship", "Game over! " + (won ? "chat" : "AI") + " won! " +
                (won ? "raysC " : "raysA ") +
                "Next game starting in " + DELAY_BTW_GAMES_SEC + " seconds"
            );
            clearInterval(voteTimer);
            setTimeout(function() {
                api.reset(function(result) {
                    vote.reset();
                });
                cli.say("chattleship", "A new game has begun! Cast votes " +
            "for which coords to hit!");
                voteTimer = setInterval(doVote, VOTE_TIMEOUT);
            }, 1000 * DELAY_BTW_GAMES_SEC);

        }
    });
}

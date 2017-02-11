var tmi = require("tmi.js");
var identity = require("./auth.json");
var phases = require("./phases.js");

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
client.connect();

client.on("connected", function(address, port) {
    console.log("Connected to " + address + " on port " + port);
    // client.action("chattleship", "ChattleShip bot connected on port " + port);
});


client.on("chat", function(channel, user, message, self) {
    var canonicalMessage = phases.canonicalize(message, phase);
    if (canonicalMessage == null) return; // ignore messages that don't match

    if (typeof votes[canonicalMessage] === "undefined") {
        votes[canonicalMessage] = 1;
    } else {
        votes[canonicalMessage]++;
    }
});

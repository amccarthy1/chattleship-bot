/**
 * [DISCLAIMER] * THIS IS HACKATHON-QUALITY CODE.
 * BY READING THIS SOURCE FILE, YOU UNDERSTAND THAT THIS CODE IS NOT OF
 * PRODUCTION QUALITY, AND WAS WRITTEN IN A 24-HOUR TIMESPAN.
 * IT IS NOT ACTIVELY MAINTAINED.
 * vote.js
 * Simple, in-memory voting system for chattleship.
 * Exposes a web API for tracking votes.
 */
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
var port = process.env.PORT || 8081;
var router = express.Router();

var votes = {};
var voters = new Set();

router.get('/votes', function(req, res) {
    // fudge some votes
    var votes = {
        "I1": 1237,
        "F7": 422,
        "H8": 16,
        "J6": 15,
        "E2": 14,
        "B9": 2,
        "J10": 1,
        "E5": 1,
        "A3": 1
    }
    res.json({
        votes: votes
    });
});
app.use('/', router);
app.use('/static', express.static("./static"));

function vote(choice, username) {
    if (voters.has(username)) return;
    if (typeof votes[choice] === "undefined") {
        votes[choice] = 1;
    } else {
        votes[choice]++;
    }
    voters.add(username);
}

/**
 * Pick a winner from the set of votes. Logic is as follows
 * * If one choice has more votes than the rest, that choice wins
 * * If several choices tie for the lead, a random winner is chosen from those
 *   choices.
 * * If no votes were cast, null is returned.
 */
function pickWinner() {
    var leader = -1;
    var winners = [];
    for (key in votes) {
        if (Object.prototype.hasOwnProperty.call(votes, key)) {
            var thisVotes = votes[key];
            if (thisVotes > leader) {
                winners = [key];
                leader = votes[key];
            } else if (thisVotes === leader) {
                winners.push(key);
            }
        }
    }
    if (winners.length === 0) {
        return null;
    }
    if (winners.length === 1) {
        return winners[0];
    }
    // pick a random winner
    return winners[Math.floor(Math.random()*winners.length)];
}

function reset() {
    votes = {};
    voters.clear();
}

module.exports = {
    vote: vote,
    pickWinner: pickWinner,
    reset: reset
};

app.listen(port);

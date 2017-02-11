var votes = {};
var voters = new Set();

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
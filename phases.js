var Phases = {
    SETUP: 0,
    FIRING: 1,
    OVER: 2
}

var Regexes = {}
Regexes[Phases.SETUP] = /\b([hv])([A-J])(10|[1-9])\b/i
// Regexes[Phases.SETUP] = /.*/
Regexes[Phases.FIRING] = /\b([A-J])\s*(10|[1-9])\b/i;
// Regexes[Phases.FIRING] = /.*/
Regexes[Phases.OVER] = /^gg$/i;

function canonicalize(msg, phase) {

    var matches = (msg).match(Regexes[phase]);
    if (!matches) return null;
    return matches[0].toUpperCase();
}

module.exports = {
    enum: Phases,
    canonicalize: canonicalize
}

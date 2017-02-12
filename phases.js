/**
 * [DISCLAIMER] * THIS IS HACKATHON-QUALITY CODE.
 * BY READING THIS SOURCE FILE, YOU UNDERSTAND THAT THIS CODE IS NOT OF
 * PRODUCTION QUALITY, AND WAS WRITTEN IN A 24-HOUR TIMESPAN.
 * IT IS NOT ACTIVELY MAINTAINED.
 * phases.js
 * Handles phase-dependent logic
 * Currently largely unnecessary. TODO Implement SETUP phase.
 */

var Phases = {
    SETUP: 0,
    FIRING: 1,
    OVER: 2
}

var Regexes = {}
Regexes[Phases.SETUP] = /^\s*([hv])([A-J])(10|[1-9])\b/i
// Regexes[Phases.SETUP] = /.*/
Regexes[Phases.FIRING] = /^\s*([A-J])\s*(10|[1-9])\b/i;
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

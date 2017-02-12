/**
 * [DISCLAIMER] * THIS IS HACKATHON-QUALITY CODE.
 * BY READING THIS SOURCE FILE, YOU UNDERSTAND THAT THIS CODE IS NOT OF
 * PRODUCTION QUALITY, AND WAS WRITTEN IN A 24-HOUR TIMESPAN.
 * IT IS NOT ACTIVELY MAINTAINED.
 * api.js
 * Abstraction of the HTTP API. Keeps track of the state of the game, in case
 *  the chat bot needs it.
 */

const request = require("request");

const resetEndpoint = "/reset";
const fireEndpoint = "/fire";

function api(baseUrl) {
    this.baseUrl = baseUrl;
    this.state = null;
}
api.prototype.apiPost = function(path, data, success, error) {
    if (typeof success !== 'function') success = function() {};
    if (typeof error !== 'function') error = function(err) {console.error(err)};
    var url = this.baseUrl + path;
    $this = this;
    request.post(url, {json: data}, function(err, response, body) {
        if (err) {
            error(err);
        }
        if (response.statusCode == 200) {
            if (body.success) {
                debugger;
                $this.state = body.state;
                success(body.result);
            } else {
                error(body.error);
            }
        }
    });
}

api.prototype.reset = function(success, error) {
    this.apiPost(resetEndpoint, {}, success, error);
}

api.prototype.fire = function(coords, player, success, error) {
    this.apiPost(fireEndpoint, {coords: coords, player: player}, success, error);
}

api.prototype.getState = function() {
    return this.state;
}

module.exports = api;

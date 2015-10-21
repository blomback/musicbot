var dotenv        = require('dotenv').load();
var fs            = require('fs');
var express       = require('express');
var bodyParser    = require('body-parser');
var cookieParser  = require('cookie-parser');
var SpotifyWebApi = require('spotify-web-api-node');

var randomString  = require('./randomString');
var findTrack     = require('./findTrack');

var spotifyApi = new SpotifyWebApi({
  clientId     : process.env.SPOTIFY_CLIENT_ID,
  clientSecret : process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri  : process.env.SPOTIFY_REDIRECT_URI
});

var app = express();
var port = process.env.SERVER_PORT || 3000;
var stateKey = 'spotify_auth_state';

var writeLog = function(text) {
	fs.writeFile('error.log', text, function (err) {
	    if (err)
	        return console.log(err);
	});
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
	if (spotifyApi.getAccessToken()) {
		return res.send('Logged in.');
	}
	return res.send('<a href="/login">Login</a>');
});

app.get('/login', function(req, res) {
	var state = randomString(16);
	var scopes = ['playlist-modify-private', 'playlist-modify-public'];
	res.cookie(stateKey, state);
	var authURL = spotifyApi.createAuthorizeURL(scopes, state);
	res.redirect(authURL);
});

app.get('/callback', function(req, res) {
	spotifyApi.authorizationCodeGrant(req.query.code)
	.then(function(data) {
		spotifyApi.setAccessToken(data.body['access_token']);
		spotifyApi.setRefreshToken(data.body['refresh_token']);
		return res.redirect('/');
	}, function(err) {
		return res.send(err);
	});
});

app.post('/music', function(req, res, next) {
	var tracks  = findTrack(req.body.text);

	if(tracks.length) {
		spotifyApi.refreshAccessToken()
		.then(function(data) {
			spotifyApi.setAccessToken(data.body['access_token']);

			if(data.body['refresh_token']) {
				spotifyApi.setRefreshToken(data.body['refresh_token']);
			}

			spotifyApi.addTracksToPlaylist(process.env.SPOTIFY_USERNAME, process.env.SPOTIFY_PLAYLIST_ID, tracks)
			.then(function(data) {
				return writeLog("Added " + tracks);
			}, function(err) {
			  return writeLog(err.message);
			});

		}, function(err) {
      		return res.send('Could not refresh access token. Please login again.');
    	});
	}
});

app.listen(port, function () {
  console.log('Musicbot on port ' + port);
});
var express       = require('express');
var bodyParser    = require('body-parser');
var querystring   = require('querystring');
var cookieParser  = require('cookie-parser');
var SpotifyWebApi = require('spotify-web-api-node');

var settings      = require('./settings.json');
var randomString  = require('./randomString');
var findTrack     = require('./findTrack');

var spotifyApi = new SpotifyWebApi({
  clientId     : settings.spotify.id,
  clientSecret : settings.spotify.secret,
  redirectUri  : settings.spotify.redirect
});

var app = express();
var port = settings.server.port || 3000;
var stateKey = 'spotify_auth_state';

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
		}, function(err) {
      		return res.send('Could not refresh access token. Please login again.');
    	});

		spotifyApi.addTracksToPlaylist(settings.spotify.username, settings.spotify.playlist_id, tracks)
		.then(function(data) {
			console.log(tracks);
		}, function(err) {
		  console.log(err.message);
		});
	}
});

app.listen(port, function () {
  console.log('Musicbot on port ' + port);
});
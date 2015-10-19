# Musicbot
Slack bot who adds posted songs to a playlist.

## Installation
Create settings.json and fill in with your details from Slack Integrations and your Spotify App. Then create a Slack integration that posts to <your url>/music.

### settings.json
```
{
	"server": {
		"port": <server port>
	},
	"slack": {
		"token": "<slack token>"
	},
	"spotify": {
		"username": "<spotify username>",
		"id": "<spotify app id>",
		"secret": "<spotify app secret>",
		"redirect": "<spotify callback uri>",
		"playlist_id": "<spotify playlist id>"
	}
}
```
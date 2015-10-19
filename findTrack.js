module.exports = function(string) {
	var pattern = /(http|https):\/\/(open|play).spotify.com\/track\/([a-z0-9]+)/gmi;
	var matches = [];
	var tracks = [];

	while ((matches = pattern.exec(string)) !== null) {
		var track = 'spotify:track:' + matches[3];
		tracks.push(track);
	}

	return tracks;
}
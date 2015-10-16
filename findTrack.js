module.exports = function(string) {
	var pattern = /(http|https):\/\/(open|play).spotify.com\/track\/([a-z0-9]+)/gmi;
	var matches = [];
	var tracks = [];

	while ((matches = pattern.exec(string)) !== null) {
		tracks.push(matches[3]);
	}

	return tracks;
}
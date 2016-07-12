module.exports = function(string) {
	var pattern = /(http|https):\/\/(open|play).spotify.com\/track\/([a-z0-9]+)|spotify:track:([a-z0-9]+)/gmi;
	var matches = [];
	var tracks = [];

	while ((matches = pattern.exec(string)) !== null) {
		var trackid;

		if (matches[3]) {
			trackid = matches[3];
		}
		else if (matches[4]) {
			trackid = matches[4];
		}
		var track = 'spotify:track:' + trackid;
		tracks.push(track);
	};

	return tracks;
}
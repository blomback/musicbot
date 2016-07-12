module.exports = function(string) {
	var pattern = /(http|https):\/\/(open|play).spotify.com\/track\/([a-z0-9]+)|spotify:track:([a-z0-9]+)/gmi;
	var matches = [];
	var tracks = [];

	while ((matches = pattern.exec(string)) !== null) {
		var trackid = matches[3] ? matches[3] : matches[4];
		var track = 'spotify:track:' + trackid;
		tracks.push(track);
	};

	return tracks;
}

module.exports = function (req, res, next) {
	var spotify  = require('./findTrack');
	var message = req.body.message;

	var payload = findTrack(message);

	return res.status(200).json(payload);
}
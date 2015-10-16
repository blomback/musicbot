module.exports = function (req, res, next) {
	var userName = req.body.user_name;
	var payload = {
		text: 'Hello, ' + userName + '!'
	};

	if (userName !== 'slackbot') {
		return res.status(200).json(payload);
	} else {
		return res.status(200).end();
	}
}
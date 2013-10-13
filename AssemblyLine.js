var Twit = require('twit');

var AssemblyLine = function(options) {
	this.filters = {
		follow: [],
		track: [],
		locations: []
	};
	this.T = new Twit({
		consumer_key: options.consumerKey,
		consumer_secret: options.consumerSecret,
		access_token: options.accessToken,
		access_token_secret: options.accessTokenSecret
	});

	this.quiet = options.quiet;
}

AssemblyLine.prototype = {
	addUserFilter: function(userId) {
		this.filters.follow.push(userId);
		this.restart();
	},
	addKeywordFilter: function(keyword) {
		this.filters.track.push(keyword);
		this.restart();
	},
	addLocationFilter: function(location) {
		this.filters.locations.push(location);
		this.restart();
	},
	clearFilters: function() {
		this.filters.follow = [];
		this.filters.track = [];
		this.filters.locations = [];
		this.restart();
	},
	start: function(callback) {
		this.callback = callback;
		this.restart();
	},
	restart: function() {
		if (!this.callback) return;

		var filter = {};
		if(this.filters.follow.length > 0) filter.follow = this.filters.follow.join(',');
		if (this.filters.track.length > 0) filter.track = this.filters.track.join(',');
		if (this.filters.locations.length > 0) filter.locations = this.filters.locations.join(',');

		try {
			this.stream.stop();
		} catch (err) {
		}

		this.stream = this.T.stream('statuses/filter', filter);

		//TODO: There's probably a better way to do this...
		var prototype = this;
		this.stream.on('tweet', function(tweet) {
			var response = prototype.callback(tweet);
			prototype.tweet(response, tweet.id_str);
		});
	},
	tweet: function(text, inResponseTo) {
		var prototype = this;
		if (!text) return;
		this.T.post('statuses/update', {status: text, in_reply_to_status_id: inResponseTo}, function(error) {
			if (error) {
				if (!prototype.quiet) {
					console.log('Could not post tweet: \'' + text + '\'');
					console.log('Reason: ' + error.message);
				}
			} else {
				if (!prototype.quiet)
					console.log('Posted tweet: \'' + text + '\'');
			}
		});
	}
}

module.exports = AssemblyLine;
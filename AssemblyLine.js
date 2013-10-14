var Twit = require('twit');

var ReplyBot = function(options) {
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

ReplyBot.prototype = {
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

var DMBot = function(options) {
	this.T = new Twit({
		consumer_key: options.consumerKey,
		consumer_secret: options.consumerSecret,
		access_token: options.accessToken,
		access_token_secret: options.accessTokenSecret
	});

	this.quiet = options.quiet;
	if (options.followBack)
		this.followBack = options.followBack;
	else
		this.followBack = true;
}

DMBot.prototype = {
	start: function(callback) {
		this.callback = callback;
		var prototype = this;
		var userId;
		if (this.followBack) {
			this.T.get('account/verify_credentials', function(error, response) {
				userId = response.id;
				var followers = [];
				var callback = function(error, response) {
					followers = followers.concat(response.ids);
					if (response.next_cursor !== 0) {
						prototype.T.get('followers/ids', { user_id: userId, cursor: response.next_cursor }, callback);
					} else {
						for (var i = 0; i < followers.length; i++) {
							prototype.T.post('friendships/create', { user_id: followers[i] }, function(error, response){});
						}
					}
				}

				prototype.T.get('followers/ids', { user_id: userId }, callback);
			});
		}
		this.stream = this.T.stream('user');
		this.stream.on('direct_message', function(dm) {
			if (dm.direct_message.sender.id === userId)
				return;

			var text = prototype.callback(dm);
			if (!text) return;
			prototype.T.post('direct_messages/new', { text: text, user_id: dm.direct_message.sender.id }, function(error, response) {
				if (error) {
					if (!prototype.quiet) {
						console.log('Could not send DM: \'' + text + '\'');
						console.log('Reason: ' + error.message);
					}
				} else {
					if (!prototype.quiet)
						console.log('Sent DM: \'' + text + '\'');
				}
			});
		});
		this.stream.on('follow', function(followEvent) {
			if (prototype.followBack)
				prototype.T.post('friendships/create', { user_id: followEvent.source.userId }, function(error, response){});
		});
	}
}

module.exports.ReplyBot = ReplyBot;
module.exports.DMBot = DMBot;
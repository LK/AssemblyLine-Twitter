# AssemblyLine
### Simple Twitter Bot Creation


AssemblyLine provides an incredibly simple way to create a Twitter bot in Node. Below you will find the documentation  - if you have any other questions, I'm [@LennyKhazan](http://twitter.com/LennyKhazan) on Twitter.

** Disclaimer: Use at your own risk. AssemblyLine should only be used lawfully and should not violate the Twitter Terms of Service. **

---

### Setup

    var AssemblyLine = require('AssemblyLine');
    var bot = new AssemblyLine({
	    consumerKey: '<consumer key>',
    	consumerSecret: '<consumer secret>',
    	accessToken: '<access token>',
    	accessTokenSecret: '<access token secret>'
    });

Make sure to fill in the information from the Twitter API Developer Console.

In addition to the options specified above, you can also add the option `quiet`, which if set to `true` will prevent AssemblyLine from logging messages.

### Bot Creation

The way an AssemblyLine Twitter Bot works is it filters all of the Tweets going through Twitter based on keywords, users, and locations. At least one filter must be specified in order for the bot to function properly. So, when creating a bot, you must first add filters. Below is the documentation for the various filter-related methods on an AssemblyLine object. If any of these are called after the bot was started, the bot will restart with the new filter automagically.


##`bot.addUserFilter(userId)`
This bot will be notified when a tweet is posted from the specified user.

## `bot.addKeywordFilter(keyword)`
This bot will be notified when a tweet with the specified  keyword is posted.

## `bot.addLocationFilter(location)`
This bot will be notified when a geotagged tweet is posted within the coordinates specified in `location`. `location` is a string with four comma-separated numbers that represent two lat/long coordinates.

## `bot.clearFilters()`
Clear all filters from the bot. New tweets will not be sent to the bot until at least one filter is added.

===

Now that the bot has some filters, it's time to start it up. To do that, we call `bot.start(callback)`.

## `bot.start(callback)`
When this is called the bot will begin monitoring tweets with the specified filters. When a tweet matching at least one of the filters is posted, `callback` is called with one parameter - the tweet that matched the filters. This will be an object of the same structure as a Twitter REST API request to retrieve a tweet - more information can be found [here](https://dev.twitter.com/docs/api/1.1/get/statuses/show/%3Aid). `callback` must return a string, which will be posted to Twitter as a reply to the tweet that triggered the callback.

# That's it.

No, really. It's that easy. A finished application will look something like this: 

    var AssemblyLine = require('AssemblyLine');
    var bot = new AssemblyLine({
	    consumerKey: '<consumer key>',
    	consumerSecret: '<consumer secret>',
	    accessToken: '<access token>',
    	accessTokenSecret: '<access token secret>'
    });

    bot.addKeywordFilter('AssemblyLine');
    bot.start(function(tweet) {
	    return '@' + tweet.user.screen_name + ' AssemblyLine is really cool!';
    });

This basic bot just sends an @reply to anybody who mentions AssemblyLine in their tweet with the message "AssemblyLine is really cool!"

## Contributions

Contributions are always welcome. If you find a bug, please create an issue, or (even better) a pull request. Most needed improvements:

- Tests
- Code Cleanup

Again, if you have any questions/comments/feedback, contact me on [Twitter](http://twitter.com/LennyKhazan).
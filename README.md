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

##### Optional Parameters
- `quiet` (default = false): When set to true, AssemblyLine will stop logging messages.
- `followBack` (default = true; only for DM bots): If set to false, AssemblyLine will not automatically follow everyone who follows the bot.
- `rateLimit` (default = 0; only for reply bots): The number of seconds to wait between tweets. Every time the number of seconds specified here passes, the next tweet matching the filters will be passed to the callback - otherwise the tweet will not be passed. If the rateLimit is set to 0 then all tweets will be passed to the callback.

### Bot Creation

# Reply Bot
The way an AssemblyLine Reply Bot works is it filters all of the Tweets going through Twitter based on keywords, users, and locations. At least one filter must be specified in order for the bot to function properly. So, when creating a bot, you must first add filters. Below is the documentation for the various filter-related methods on an AssemblyLine object. If any of these are called after the bot was started, the bot will restart with the new filter automagically.


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
When this is called the bot will begin monitoring tweets with the specified filters. When a tweet matching at least one of the filters is posted, `callback` is called with one parameter - the tweet that matched the filters. This will be an object of the same structure as a Twitter REST API request to retrieve a tweet - more information can be found [here](https://dev.twitter.com/docs/api/1.1/get/statuses/show/%3Aid). This object also has one additional property, `favoriteTweet`. This is a function that when called will favorite the tweet - it doesn't require any arguments. `callback` must return a string, which will be posted to Twitter as a reply to the tweet that triggered the callback, or `null` if nothing should be tweeted.

# DM Bot
A DM Bot simply replies to DMs sent to the bot. AssemblyLine will automatically follow any users who follow the bot (by default, this behavior is configurable). This makes DM bots incredibly simple to make.

## `bot.start(callback)`
When this is called the bot will begin monitoring for DMs. By default, it will automatically follow any users to followed the bot, and it will follow new users if they follow the bot while it is running. `callback` is called when a DM is sent to the bot with one parameter - the DM that was sent. The structure for this object is the same as the Twitter REST API, wrapped in `direct_message` - more information can be found [here](https://dev.twitter.com/docs/api/1.1/get/direct_messages/show). `callback` must return a string which will be sent as a response to the user who sent the DM, or `null` if nothing should be sent.

# That's it.

No, really. It's that easy. A finished ReplyBot will look something like this: 

    var AssemblyLine = require('AssemblyLine');
    var bot = new AssemblyLine.ReplyBot({
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

Here is an example of a basic DMBot:

    var AssemblyLine = require('AssemblyLine');
    var bot = new AssemblyLine.DMBot({
        consumerKey: '<consumer key>',
    	consumerSecret: '<consumer secret>',
	    accessToken: '<access token>',
    	accessTokenSecret: '<access token secret>'
    });
    
    bot.start(function(dm) {
        return 'Hey ' + dm.direct_message.sender.name + '!';
    });

This simple DMBot replies all DMs with "Hey \<name\>!"

## Contributions

Contributions are always welcome. If you find a bug, please create an issue, or (even better) a pull request. Most needed improvements:

- Tests
- Code Cleanup

Again, if you have any questions/comments/feedback, contact me on [Twitter](http://twitter.com/LennyKhazan).

## Note
Some people have asked about where the JS file goes. My setup is as follows: I placed AssemblyLine.js in the same directory as the rest of my project. Then, I ran `npm install twit`. Lastly, I replaced the `require('AssemblyLine')` line in my project with `require('./AssemblyLine.js')`. I am eventually planning on publishing this to NPM, which should make the setup process significantly simpler. If anybody has a better way of setting this up, please let me know on Twitter.
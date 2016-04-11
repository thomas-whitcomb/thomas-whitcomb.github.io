$(document).ready(function(){
	//global vairables need to be global so I can change their values as need be from fn to fn
	//also compiling handlebars templat
	var tweetList = $('.tweet-list')
	var templateHtml = $('#row').html();
  	var compiledTemplate = Handlebars.compile(templateHtml);
	var currTweetsList = []
	//var fireb = new Firebase("https://ga-final-project.firebaseio.com")
	var repeatTweets = 0
	var inputKeyword = ''

	$('.find-tweets-button').on('click',function(e){
		//On click, empty any previous tweets, take val from searchbox and call GetTweets

		e.preventDefault()
		tweetList.empty()
		
		inputKeyword = $('.search-box').val()
		$('.search-box').val('')
		//Call get Tweets with popular and 20 - will get most popular tweets and 20 of them
		getTweets(inputKeyword, 'popular', 20)
	})

	function getTweets(keyword, resultType, tweetNum){
		//useOAuth to get around cross-domain issue with JS and Twitter API
		//pass through keyword to search for, result type (new, popular or mixed) and number of tweets to be returned (max 100)
		//OAuth.redirect('twitter', 'http://localhost:8080')
		OAuth.initialize('XFW3J69pI4WCYLZsRuDEYhcSFFU')
		//OAuth.callback('twitter').done(function(result) {
		OAuth.popup('twitter').done(function(result) {
		    result.get('1.1/search/tweets.json?q=' + keyword + '&result_type=' + resultType + '&count=' + tweetNum).done(function(resp){
		    	//console.log(resp)
		    	resp.statuses.forEach(function(obj){
		    		tweetCheck(obj)
		    	})
		    })
		})
	}


	function tweetCheck(obj){
		//fn in place so when I need to reload new tweets onto page, it can loop through and not return tweets already on the page
		//stores all tweet ids that are loaded onto the page
		//calls createTweetBox once confirmed tweet is not already on page
		var id = obj.id_str
		var exists = true
		
		for(i=0; i<currTweetsList.length;i++){
			if (currTweetsList[i] === id) {
				exists = false
			}
		}
		if(exists){
			currTweetsList.push(id)
			createTweetBox(obj)
		} else {
			repeatTweets += 1 
			//will use this code when I make fn for when user goes to bottom of page and need to reload more tweets
		}
	}
	

	function createTweetBox(obj){
		//takes json object returned from twitter GET
		//stores tweet text, handle, profile name url and image in variables
		//passes those vars to handlebars template
		//appends to list of tweets on html page
    	var tweetText = obj.text
    	var twitterHandle = '@' + obj.user.screen_name
    	var profileName = obj.user.name
    	var profileURL = obj.user.url
    	var profImgURL = obj.user.profile_background_image_url

    	var row = compiledTemplate({
    		name: profileName,
   			screenName: twitterHandle,
   			twtText: tweetText,
   			profURL: profileURL,
   			profImg: profImgURL
    	})
    	tweetList.append(row)
	}

	//***BELOW IS FOR WHEN I WANT TO MAKE THIS PAGE RELOAD WHEN USER GETS TO THE BOTTOM***
	// $(window).scroll(function(e){
	// 	console.log(e)
	// 	below from internet - still need to figure out how/when to call getTweets
	// 	if($(window).scrollTop() + $(window).height() > $(document).height() - 100){
	// 		$(window).unbind('scroll')

	// 	}
	// 	var pageLength = ***size of page number***
	// 	if(e = pageLength){
	// 		pageLength *=2
	// 		getTweets(inputKeyword, 'recent', 10)
	// 	if(repeatTweets > 0){

	// 	}
			
	// 	}
	// })

})

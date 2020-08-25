// This code is licensed under the same terms as Habitica:
    // https://raw.githubusercontent.com/HabitRPG/habitrpg/develop/LICENSE

// https://github.com/Alys/tools-for-habitrpg/blob/master/habitrpg_user_data_display.html

// https://oldgods.net/habitica/cTheDragons/group.html

// Contributors:
    // cTheDragons https://github.com/cTheDragons
	// based on code from
	// Alys (Alice Harris), lady_alys@oldgods.net https://github.com/Alys
    // thepeopleseason (James Hsiao) https://github.com/thepeopleseason
    // goldfndr (Richard Finegold) https://github.com/goldfndr
    // Blade Barringer https://github.com/crookedneighbor
    // donoftime https://github.com/donoftime
    // me_and (Adam Dinwoodie) https://github.com/me-and

//History
// v 1.0 - 2020-07-22 - Creation
// v 1.1 - 2020-07-22 - Slowed down the sayings. More sayings
// v 2.0 - 2020-08-23 - Return version to display. More sayings. Few typo corrections.


function getApiVersion() {
	return '2.0'
}
	
function makeAjaxCall(call, userId, apiToken, rl){
	//////////////////////////////////////////////////////////////////////
	////   Global Constants                              /////////////////
	//////////////////////////////////////////////////////////////////////
	var DOUBLEQUOTES = 		'"' //This is to make my life easier... 
	var SINGLEQUOTE = 		"'" //This is to make my life easier... 
	
	var debug						= false;
	var debugShowObject				= false;

	
	var rlRemainingMax				= 30; //Max number of tries before reset.
	var rlRemainingSaftey			= 4; //Saftey before we try to revaluate number of tries before reset.
	var rlTimeoutBasePeriod			= 5000 // Max time it can be timeout when random.
	var rlTimeoutMaxPeriod 			= 7000 // Max time when we are close (Larger as there may be other calls happening)
	var rlTimeoutMinPeriod 			= 2450 // 60s /30 s with a bit of fudge
	var rlTimeoutCountDown 			= 1000 // Countdown per second for effect
	var rlMessageChangedPeriod		= 3700 // When the message needs to change
	var rlTimeoutPauseText			= [
										'One moment! Let me fix my hair.',
										'Where did I put my keys?',
										'How do you start a dragon?',
										'Did I break a nail?',
										'I don' + SINGLEQUOTE + 't need to ask for directions!',
										'Sword, sheild, food, shoes, I think I have everything for the quest!',
										'Did you hear that? I think something is under the bed...',
										'Watching the pot boil',
										'Let' + SINGLEQUOTE + 's see how long it takes paint to dry',
										'Wait, what did I come in here for?',
										'Intermission! Do you have snacks and drinks?',
										'Bet I could run outside and touch that tree before you knew I was gone',
										'Did I leave something on the stove?',
										'Hold the phone! ... and the mouse and keyboard?',
										'Let me pour you a nice cup of tea first',
										'Destiny waits for no man... but it will for a computer',
										'Never gonna give you up, never gonna let you down, never gonna - oh wait that'+ SINGLEQUOTE +'s the wrong file',
										'Maybe the real elevator music is the friends we made along the way',
										'Game time! The one who moves first loses.',
										'Well, Well, Well, Three holes in the ground.',
										'Hang on! It' + SINGLEQUOTE + 's so hard to put down a book about anti-gravity.',
										'Ohhhh.. I found a digital penny!',
										'Time flies like an arrow… Fruit flies like a banana!',
										'Bad puns…it' + SINGLEQUOTE + 's how eye roll.',
										'I' + SINGLEQUOTE + 'm a big fan of whiteboards. I find them quite re-markable.',
										'If you were a fruit, you' + SINGLEQUOTE + 'd be a fine-apple',
										'Wait, is that the light at the end of the tunnel or TRAIN!!!!',
										'Close your eyes and count to ten, and I' + SINGLEQUOTE + 'll hide behind this shiny new webpage in the meantime',
										'Bet you this will load faster than you can do five push-ups.... um maybe make that 50, 500, 5000?',
										'One moment! Just need to sharpen my sword so I can find the pass in password.',
										'Let' + SINGLEQUOTE + 's find the end of this rainbow!',
										'Let' + SINGLEQUOTE + 's play hide and seek! I' + SINGLEQUOTE + 'll count to ... ',
										'Inventing time travel: will be back immediately',
										'Waiting on the world to change',
										'Watching the sunrise',
										'Transcribing the history of the entire world into every written language',
										'Unlocking the secrets of the universe',
										'Building an Ikea desk',
										'Catching fireflies',
										'Watching the snow fall',
										'Temporarily indisposed (stuck as a starfish)',
										'Putting some roots out',
										'I' + SINGLEQUOTE + 'm dressed like this because it' + SINGLEQUOTE + 's laundry day. You want me to go change? Oh, okay...',
										'Seeing if the refrigerator is running... In case I need to catch it...',
										'Tea Time!',
										'Running away from digital bugs',
										'Setting up a Rube Goldberg machine',
										'Taking Fido for a walk',
										'Dusting off the cobwebs',
										'Re-inventing the wheel',
										'Do not disturb: cooking for the holidays',
										'Zoned out and over-steeping the tea',
										'Whatever you do, don' + SINGLEQUOTE + 't trust the person saying alt-f4 is the answer',
										'Chopping vegetables',
										'Out for lunch',
										'Your call could not be connected. Please leave a message after the tone',
										'Chasing after a dog chasing after a squirrel',
										'Trying to get the stick out of the dog' + SINGLEQUOTE + 's mouth',
										'Trying to convince the dog that this isn' + SINGLEQUOTE + 't a game and yes, I want my socks back',
										'Waiting for bread to rise',
										'Did you remember to buy milk?',
										'Remember to sit up straight!',
										'I' + SINGLEQUOTE + 'll be back before you can count to three. One. Two. Two and a half. Two and two thirds...',
										'Feeding Gryphons...',
										'Finding Testimonies...',
										'Fighting the Laundromancer...',										
										'Pausing to pet Melior',
										'Be there soon, Melior needs feeding',
										'Bringing in pixels by the barrowful',
										'Griffinishing loading...',
										'Searching for Meliora in the undergrowth',
										'Did you know pineapples are not a cross between pine trees and apple trees?',
										'Looking for honey to feed my pet. Where did my pet go?',
										'High-ho, high-ho off to get your data I go... ',
										'Where are the bars of soap?',
										'Did you remember to feed the cactus pet?',
										'Wait a moment, the Basi-List made the data-fairies run away.',
										'I lost count, I need to start again.',
										'Let' + SINGLEQUOTE + 's count the stars together!',
										'Just a moment... I just need to build this table...',
										'Waiting for water to boil',
										'There are x pet quests in Habitica. I think. Um, I will count them again.',
										'The Veloci-rapper came this way, everything run away, I just need to start... again?',
										'Collecting moonstones...',
										'Waiting for crowdsourced responses...',
										'Orange you glad I' + SINGLEQUOTE + 'm not telling jokes?',
										'What came first the chicken or the egg?',
										'Why is the sky blue?',
										'Uh-oh my shoe is untied!',
										'Waiting for the grass to grow.',
										'Look at the clouds!',
										'Take a deep breath. Hold it... Hold it... Almost there... Almost there... why are you blue?',
										'Hold on I' + SINGLEQUOTE + 'm almost ready.... I just need to get my hat.',
										'Jotting down a meeting for us in my day planner... how does the middle of next week work for you?',
										'Here there be hippogriffs.',
										'Buffering...',
										'Change is on the horizon. And also in the couch cushions.',
										'Don' + SINGLEQUOTE + 't be afraid of progress. Fear its opposite.',
										'How much flour would a cauliflower flour if -- no, wait...',
										'This screen is probably very purple.',
										'Grooming the wolves',
										'Ow! That cactus is prickly.',
										'Organising the quest scrolls',
										'One moment! Let me find that runaway Triceratops',
										'Trying to catch a turtle... be right back',
										'Waiting for two snails to finish the 100 mile race...',
										'Waiting for meat to rot',
										'Searching for the Aether Mount.... Why can' + SINGLEQUOTE + 't I see it?',
										'Waiting for the molasses to stop dripping...',
										'I need to finish washing the dishes first... Where is the garden hose?',
										'Wishing every star goodnight, one at a time',
										'Fluffing up some clouds',
										'Building a blanket fort',
										'Whispering a lullaby to the wind',
										'Waiting for the cat to get off my laptop...',
										'Hey wake up sleepy server! We have customers!',
										'Counting the grains in the sands of time'
									] //Thank you to @ReyBisCO, @Ceran, @MaybeSteveRogers, @BradleyTheGreat, @DebbieS, @SuperSaraA, @ieahleen, @citrusella, @QuartzFox, @BattleOfTheWarwings, @littlepurpleslipper for contributing to some of the sayings 


	var timeoutPeriod = Math.floor((Math.random() * rlTimeoutMaxPeriod) + rlTimeoutBasePeriod);
	var timeoutPeriodQueue = 0
	var rlRemainingCurrent = rlRemainingMax
	
	//ensure there is a value to evaluate
	if (rl.rlRemaining == undefined) rl.rlRemaining = rlRemainingSaftey
	if (rl.rlResetDateTime == undefined) rl.rlResetDateTime = '2001-07-21T14:12:45Z'
	if (rl.rlMessageChanged == undefined) rl.rlMessageChanged = '2001-07-21T14:12:45Z'

	

	evalAjaxCall(call)
	
	function evalAjaxCall(call) {
		//Reset variables so when called again start with clean slate.
		timeoutPeriod = Math.floor((Math.random() * rlTimeoutMaxPeriod) + rlTimeoutBasePeriod);
		timeoutPeriodQueue = 0
		rlRemainingCurrent = rlRemainingMax

		if (debug) console.log(rl.rlRemaining)
		if (debug) console.log(call.length)
		if (debug) console.log(rl.rlRemaining <= call.length)
		if (debug) console.log(moment.utc().subtract(timeoutPeriod, 'ms').format())
		if (debug) console.log(rl.rlResetDateTime)
		if (debug) console.log(moment.utc().subtract(timeoutPeriod, 'ms').isBefore(rl.rlResetDateTime))
		if (debug) console.log(moment(rl.rlResetDateTime).diff(moment(), 'ms'))

		if ((rl.rlRemaining < rlRemainingSaftey) && (rl.rlRemaining <= call.length) && (moment.utc().subtract(timeoutPeriod, 'ms').isBefore(rl.rlResetDateTime))) {
			//Throw the message we having to wait on....
			$('#loading .good').show();
			if (call[0].requestType == 'GET') {
				$('#loading #statusType').text('Fetching') 
			} else {
				$('#loading #statusType').text('Posting') 
			}

			$('#loading #statusMessage').text(call[0].statusText);
			$('#loading #statusWait').text('Looks like we been a little too busy talking to Habitica Servers. Lets get a drink and continue! Drinks for ' + Math.floor(timeoutPeriod/1000) + 's.'); 
			
			if (debug) console.log(moment(rl.rlResetDateTime).diff(moment(), 'ms'))

			timeoutPeriod = (moment(rl.rlResetDateTime).diff(moment(), 'ms')) + timeoutPeriod
			rlRemainingCurrent = rlRemainingMax
			drinksAjaxCall(call)
		} else {
			//all ok
			
			timeoutPeriod = 0
			rlRemainingCurrent = rl.rlRemaining
			sendAjaxCall(call)
		}
	}
	
	//Pause while we get a reset.
	function drinksAjaxCall(call) {
		
		if (debug) console.log('Getting Drinks for ' + timeoutPeriod)
		setTimeout(function () {
			$('#loading #statusWait').text('Looks like we been a little too busy talking to Habitica Servers. Lets get a drink and continue! Drinks for ' + Math.floor(timeoutPeriod/1000) + 's.'); 
			timeoutPeriod = timeoutPeriod - rlTimeoutCountDown
			if (timeoutPeriod > rlTimeoutCountDown) {	
				drinksAjaxCall(call)
			} else {
				sendAjaxCall(call)
			}
		}, rlTimeoutCountDown);
	}
	
	function sendAjaxCall(call) {
		if (debug) console.log('Sending Ajax call after ' + timeoutPeriod)
			
		var tempBox = []
		var tempBox_MaxWait = 0
		
		setTimeout(function () {
			if (rlRemainingCurrent < call.length) {
				timeoutPeriodQueue = rlTimeoutMinPeriod
			} else {
				timeoutPeriodQueue = 0
			}
			$.each(call, function(index,obj){
				//Check if we need breather to evaluate
				if ((rlRemainingCurrent >= rlRemainingSaftey) || (timeoutPeriodQueue == 0)) {
					tempBox_MaxWait = timeoutPeriodQueue * index
					setTimeout(function () {
						$('#loading .good').show();
						if (obj.requestType == 'GET') {
							$('#loading #statusType').text('Fetching') 
						} else {
							$('#loading #statusType').text('Posting') 
						}

						$('#loading #statusMessage').text(obj.statusText);
					
						//Time to change the message?
						if (moment.utc().subtract(rlMessageChangedPeriod, 'ms').isAfter(rl.rlMessageChanged)){
							if (timeoutPeriodQueue > 0 || call.length == 1) {
								//Change only every second message.
								if (index%2 == 0 ) {
									var randomText = Math.floor((Math.random() * rlTimeoutPauseText.length));
									$('#loading #statusWait').text(rlTimeoutPauseText[randomText])
									rl.rlMessageChanged = moment.utc()
								}
							} else {
								$('#loading #statusWait').text('Fluffy Bunny... I think I can swallow this...')
							}
						}
						
						execAjaxCall(obj.requestType, obj.urlTo, obj.newData, obj.fnSuccess, obj.fnFailure)
						
					}, timeoutPeriodQueue * index)
				} else {
					tempBox.push(obj)
				}
				rlRemainingCurrent--
			});
			if (tempBox.length > 0) {
				setTimeout(function () {
					if (debug) console.log('Running again to check current RL for the calls of ' + tempBox.length)	
					
					call = tempBox 
					evalAjaxCall(call)
							
				}, tempBox_MaxWait + timeoutPeriodQueue)
			}

		}, timeoutPeriod)
	}

	function execAjaxCall(requestType, urlTo, newData, fnSuccess, fnFailure){
		if (debug) console.log('execAjaxCall START ' + urlTo)
		var jqxhr = $.ajax({
			url: urlTo,
			type: requestType,
			contentType: 'application/json',
			data: newData,
			dataType: 'json',
			cache: false,
			beforeSend: function(xhr){
					xhr.setRequestHeader('x-api-user', userId);
					xhr.setRequestHeader('x-api-key',  apiToken);
				},
		});
		//this section is executed when the server responds with no error 
		jqxhr.done(function(data){
			if (debug) console.log('Success! ' + urlTo)
			if (debug) console.log('Remaining ' + jqxhr.getResponseHeader('X-RateLimit-Remaining') + '  Reset: '+ jqxhr.getResponseHeader('X-RateLimit-Reset'))
			rl.rlRemaining = jqxhr.getResponseHeader('X-RateLimit-Remaining')
			rl.rlResetDateTime = jqxhr.getResponseHeader('X-RateLimit-Reset')
			fnSuccess(data, rl)
			
		});
		//this section is executed when the server responds with error
		jqxhr.fail(function(data){
			if (debug) console.log('Fail! ' + urlTo)
			
			if (data.status == 429) {
				var timeoutPeriod = jqxhr.getResponseHeader('Retry-After')*1000 + Math.floor((Math.random() * rlTimeoutBasePeriod) + 1);
				if (debug) console.log("getting header Retry-After: " + jqxhr.getResponseHeader('Retry-After') + '  ms: ' + timeoutPeriod);
				//call again
				$('#loading #statusWait').text('Opps I lost my place, one moment...'); 
				setTimeout(function () {
					execAjaxCall(requestType, urlTo, newData, fnSuccess, fnFailure)
				}, timeoutPeriod);
			} else {
				rl.rlRemaining = jqxhr.getResponseHeader('X-RateLimit-Remaining')
				rl.rlResetDateTime = jqxhr.getResponseHeader('X-RateLimit-Reset')
				fnFailure(data, rl)
			}
			
		})
		//this section is always executed
		jqxhr.always(function(){


		});
	}
}


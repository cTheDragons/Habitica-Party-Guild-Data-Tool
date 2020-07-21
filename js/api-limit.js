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
	
function makeAjaxCall(call, userId, apiToken){
	//////////////////////////////////////////////////////////////////////
	////   Global Constants                              /////////////////
	//////////////////////////////////////////////////////////////////////
	var DOUBLEQUOTES = 		'"' //This is to make my life easier... 
	var SINGLEQUOTE = 		"'" //This is to make my life easier... 
	
	var debug						= true;
	var debugShowObject				= true;

	
	var rlRemaining					= 30;
	var rlRemainingMax				= 30; //Max number of tries before reset.
	var rlResetDateTime				= '2000-01-01'
	var rlTimeoutBasePeriod			= 5000 // Max time it can be timeout when random.
	var rlTimeoutMaxPeriod 			= 7000 // Max time when we are close (Larger as there may be other calls happening)
	var rlTimeoutMinPeriod 			= 2100 // 60s /30 s with a bit of fudge
	var rlTimeoutCountDown 			= 1000 // Countdown per second for effect
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
										'Wait, is that the light at the end of the tunnel or TRAIN!!!!'
									] //Thank you to @ReyBisCO, @Ceran for contributing to some of the sayings 

	
	var timeoutPeriod = Math.floor((Math.random() * rlTimeoutMaxPeriod) + rlTimeoutBasePeriod);
	var timeoutPeriodQueue = 0
	var rlRemainingCurrent = rlRemainingMax
	
	
	if (debug) console.log(rlRemaining)
	if (debug) console.log(call.length)
	if (debug) console.log(rlRemaining <= call.length)
	if (debug) console.log(moment.utc().subtract(timeoutPeriod, 'ms').format())
	if (debug) console.log(rlResetDateTime)
	if (debug) console.log(moment.utc().subtract(timeoutPeriod, 'ms').isBefore(rlResetDateTime))
	if (debug) console.log(moment(rlResetDateTime).diff(moment(), 'ms'))

	
	
	if ((rlRemaining <= call.length) && (moment.utc().subtract(timeoutPeriod, 'ms').isBefore(rlResetDateTime))) {
		//Throw the message we having to wait on....
		$('#loading .good').show();
		if (call[0].requestType == 'GET') {
			$('#loading #statusType').text('Fetching') 
		} else {
			$('#loading #statusType').text('Posting') 
		}

		$('#loading #statusMessage').text(call[0].statusText);
		$('#loading #statusWait').text('Looks like we been a little too busy talking to Habitica Servers. Lets get a drink and continue! Drinks for ' + Math.floor(timeoutPeriod/1000) + 's.'); 
		
		if (debug) console.log(moment(rlResetDateTime).diff(moment(), 'ms'))

		timeoutPeriod = (moment(rlResetDateTime).diff(moment(), 'ms')) + timeoutPeriod
		rlRemainingCurrent = rlRemainingMax
		drinksAjaxCall(call)
	} else {
		//all ok
		
		timeoutPeriod = 0
		rlRemainingCurrent = rlRemaining
		sendAjaxCall(call)
	}
	
	//Pause while we get a reset.
	function drinksAjaxCall(call) {
		
		if (debug) console.log('Getting Drinks for ' + timeoutPeriod)
		setTimeout(function () {
			$('#loading #statusWait').text('Looks like we been a little too busy talking to Habitica Servers. Lets get a drink and continue! Drinks for ' + Math.floor(timeoutPeriod/1000)); 
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
		setTimeout(function () {
			if (rlRemainingCurrent < call.length) {
				timeoutPeriodQueue = rlTimeoutMinPeriod
			} else {
				timeoutPeriodQueue = 0
			}
			$.each(call, function(index,obj){
				
				setTimeout(function () {
					$('#loading .good').show();
					if (obj.requestType == 'GET') {
						$('#loading #statusType').text('Fetching') 
					} else {
						$('#loading #statusType').text('Posting') 
					}

					$('#loading #statusMessage').text(obj.statusText);
				
					if (timeoutPeriodQueue > 0 ) {
						var randomText = Math.floor((Math.random() * rlTimeoutPauseText.length));
						$('#loading #statusWait').text(rlTimeoutPauseText[randomText])
					} else {
						$('#loading #statusWait').text('Fluffy Bunny... I think I can swallow this...')
					}	
					
					execAjaxCall(obj.requestType, obj.urlTo, obj.newData, obj.fnSuccess, obj.fnFailure)
					
				}, timeoutPeriodQueue * index)
				rlRemainingCurrent--
			});
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
			rlRemaining = jqxhr.getResponseHeader('X-RateLimit-Remaining')
			rlResetDateTime = jqxhr.getResponseHeader('X-RateLimit-Reset')
			fnSuccess(data)
			
		});
		//this section is executed when the server responds with error
		jqxhr.fail(function(data){
			if (debug) console.log('Fail! ' + urlTo)
			
			var timeoutPeriod = jqxhr.getResponseHeader('Retry-After') + Math.floor((Math.random() * rlTimeoutBasePeriod) + 1);
			if (data.status == 429) {
				if (debug) console.log("getting header Retry-After: " + jqxhr.getResponseHeader('Retry-After'));
				//call again
				$('#loading #statusWait').text('Opps I lost count, one moment...'); 
				setTimeout(function () {
					execAjaxCall(requestType, urlTo, newData, fnSuccess, fnFailure)
				}, timeoutPeriod);
			} else {
				fnFailure(data)
			}
			
		})
		//this section is always executed
		jqxhr.always(function(){


		});
	}
}


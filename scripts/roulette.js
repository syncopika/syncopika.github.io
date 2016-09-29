//ROULETTE SCRIPT
//turns a mixed-up phrase into a sensible one with a neat presentation
//recommended to use a font where all chars have a fixed width
//fonts good for this effect: monospace 
//TODO: change variable names so they make more sense in a general context
//I initially made this intending to decode an email

//helper function that returns new, edited string
//charRep = character you want to replace the former one with
//index = index of character you want replaced
function editString(string, charRep, index){

	var newStr = "";
	
	for(var i = 0; i < string.length; i++){
		if(i == index){
			newStr += charRep;
		}else{
			newStr += string[i];
		}
	}	
	return newStr;
}

//the roulette function
//array1 = real email, array2 = start 'email'
//string is the html in the target location, and target is the id or class of
//the target element
function roulette(array1, array2, string, target){

	var currentEmail = string;
	var emailArray = [];
	
	for(var i = 0; i < string.length; i++){
		
		//this is the char code we want to start with
		var startCharCode = array2[i].charCodeAt(0);
		
		//this is the code number we want to get to
		var emailCharCode = array1[i].charCodeAt(0);
		
		while(startCharCode !== emailCharCode){
			//is the start character larger than the actual email char code?
			//then go backwards
			if(startCharCode > emailCharCode){
				startCharCode--;
			}else{
				//the actual email char code should never equal the start email char code
				//unless it's a space or period 
				startCharCode++;
			}
			currentEmail = editString(currentEmail, String.fromCharCode(startCharCode), i);
			
			//put all steps in array, which will be used for setTimeout later.
			emailArray.push(currentEmail);
			//alternatively, if you don't want the cool animation,
			//you can just display the 'decoded' email with the code below
			//$('#email').html(currentEmail);
		}
	}
	
	displayEmail(emailArray, 0, target);
}

function displayEmail(array, index, target){
	
	$('#' + target).html(array[index]);
	
	if(index === array.length){
		return;
	}
	
	setTimeout(function(){
		displayEmail(array, index + 1, target);
	}, 30);
}
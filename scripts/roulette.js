//ROULETTE SCRIPT
//turns a mixed-up phrase into a sensible one with a neat presentation
//recommended to use a font where all chars have a fixed width
//fonts good for this effect: monospace 
//ALSO: needs jQuery, at least with this implementation

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
//caveat: the html of the target element (i.e. the element that has the placeholder html) has to be the same length of characters (and have spaces in the same places) as the replacement html.
//array1 = the string you want to end with (as an array), array2 = the string you start with (as an array) 
//string is the html in the target location (as a string), and target is the id of the target element
//example: roulette("user at gmail.com".split(""), $("#email").html().split(""), $("#email").html(), "email")
function roulette(array1, array2, string, target){

	// check lengths of array1 and array2 
	if(array1.length !== array2.length){
		return;
	}else if(array1.join("") === string){
		// email has already been decoded
		return;
	}

	var currentHTML = string;
	var newHTMLArray = [];
	
	for(var i = 0; i < string.length; i++){
		
		//this is the char code we want to start with
		var startCharCode = array2[i].charCodeAt(0);
		
		//this is the code number we want to get to
		var newCharCode = array1[i].charCodeAt(0);
		
		while(startCharCode !== newCharCode){
			//is the start character larger than the actual email char code?
			//then go backwards
			if(startCharCode > newCharCode){
				startCharCode--;
			}else{
				//the actual email char code should never equal the start email char code
				//unless it's a space or period 
				startCharCode++;
			}
			currentHTML = editString(currentHTML, String.fromCharCode(startCharCode), i);
			
			//put all steps in array, which will be used for setTimeout later.
			newHTMLArray.push(currentHTML);
			//alternatively, if you don't want the cool animation,
			//you can just display the 'decoded' email with the code below
			//$('#' + target).html(currentHTML);
		}
	}
	
	displayNewHTML(newHTMLArray, 0, target);
}

function displayNewHTML(array, index, target){
	
	var t = document.getElementById(target);
	t.innerHTML = array[index];
	
	if(index === array.length - 1){
		return;
	}
	
	setTimeout(function(){
		displayNewHTML(array, index + 1, target);
	}, 30);
}

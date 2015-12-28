var ref = new Firebase('https://blsimgsorter.firebaseio.com/'),
	imgRef = ref.child('imgs');
	tagsRef = ref.child('tags');
var firstTags = null;
var tags = [];
var running = false; 
var newBatch = {}
var searchResults = {};
//ref.child(""+key).remove()
//SEARCH
// imgRef.orderByValue().limitToFirst(5).on("value", function(snapshot) {
// 	renderThumnail ($("#mostPopular"), snapshot.key(), snapshot.val().file, snapshot.val().number)
// 	console.log(snapshot.key() + " has " + snapshot.val().number + " many tags");
// });
//on start put something somewhere
//say do the function 
//then clear 
//then I can say if something isn't there 

$(".tags").on ('click', '.tag', function() { //when a tag is clicked it runs search and renders the imgaes
	if ($(this).hasClass( "button-primary" ) === true) {
		$(this).removeClass('button-primary')
		$(this).addClass('clicked_off')
	}
	else {
		$(this).addClass('clicked button-primary')
	}
	// setTimeout(function () {
	//search if last search is finished do search 
	updateTags()
	
	if (running === false) {
		console.log(tags)
		firstTags = tags;
		//console.log("first", f)
		//console.log("before", tags)
		Search ()
		
	}
	

	
	
});//tags.on

function updateTags(){
	$(".clicked").each (function(i) {
		if (tags.length === 0) {
			tags.push("x")
		}
		tags.push (this.id);
		$(this).removeClass("clicked")
	});
	//console.log("css",tags)
	$(".clicked_off").each (function(i) {
		var index = tags.indexOf(this.id);
		tags.splice(index, 1);
		$(this).removeClass("clicked_off")
	});
}

//its running this every time you click even if search isn't finished 
//triggered when the data changes
function Search () { //pushes firebase img obj with any of the current tags into new obj (searchresults)
	// console.log(tags)
	//if it's clicked stop it and run it again 
	running = true;
	($("#loading").css("visibility","visible"))
	console.log(running)
	prevTags = tags
	//console.log("search", tags)
	imgRef.on("value", function(snapshot) {
	var data = snapshot.val();	
		Object.keys(data).forEach (function(img){
			var iO = data[img]
			var hasTags = {};
			var currentTags  = [];
			var allTags = [];
			
			for ( var i = 1; i < tags.length; ++i ) {
			 	if (typeof iO.tags[tags[i]] !== "undefined") {
			 		
			 		currentTags.push(tags[i])
			 		searchResults[iO.name] = {
			 			name: iO.name,
			 			number: (currentTags.length-((currentTags.length)*2))
			 		}
			 		//TEST>LENGTH= NUMBER
			 	}//if

			}//for
			
			if (typeof searchResults[iO.name] === "undefined") {
				searchResults[iO.name] = {
			 			name: iO.name,
			 			number: 0 
			 		}
			}
			var number = searchResults[iO.name].number
			//console.log(number, iO.name )
			imgRef.child(""+iO.name).update({number:number})
			
			
		});//obj,key img
		$("#fileList").empty();

	imgRef.orderByChild("number").endAt(-1).on("child_added", function(snapshot) {
	  	renderThumnail ($("#fileList"), snapshot.key(), snapshot.val().number)
	  	console.log(snapshot.key() + " has " + snapshot.val().number + " many tags");
	});
	running = false;
	($("#loading").css("visibility","hidden"))

	if ($("#third").hasClass ("invisible") === false) {
		$("#third").addClass("invisible");
		$("#fourth").removeClass("invisible");
		$(".photo .download").eq(0).css ({
			"-webkit-box-shadow": "10px 10px 129px 32px rgba(19,135,237,1)",
			"-moz-box-shadow": "10px 10px 129px 32px rgba(19,135,237,1)",
			"box-shadow": "10px 10px 129px 32px rgba(19,135,237,1)"})
	}
	console.log(running)
	console.log("first", firstTags, "second", tags)
	//if (firstTags === tags){
		//function callback 
	//}
});//img.on

}

//callback = search
//on load tags
tagsRef.orderByValue().on("value", function(snapshot) {//when a value changes  
    var data = snapshot.val();
    console.log(data)
	Object.keys(data).forEach (function(key){
	$(".tags").append("<button id="+key+" class='tag'>"+key+"</button>");	
	});
});

function renderThumnail (location, name, num) {
	location.append("<div class='photo'><div class=thumbnail_label><span class='download glyphicon glyphicon-download-alt'></div><img src='https://googledrive.com/host/0B58gM6k8rHBoZE5EY044TkJ1Ulk/"+name+"' class=thumbnail id="+name+"></div>")
}
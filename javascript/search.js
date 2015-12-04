var ref = new Firebase('https://blsimgsorter.firebaseio.com/'),
	imgRef = ref.child('imgs');
	tagsRef = ref.child('tags');
var tags = [];
var newBatch = {}
var searchResults = {};
//ref.child(""+key).remove()
//SEARCH
$(".tags").on ('click', '.tag', function() { //when a tag is clicked it runs search and renders the imgaes
	if ($(this).hasClass( "button-primary" ) === true) {
		$(this).removeClass('button-primary')
		$(this).addClass('clicked_off')
	}
	else {
		$(this).addClass('clicked button-primary')
	}
	Search ()
});//tags.on


function Search () { //pushes firebase img obj with any of the current tags into new obj (searchresults)
	$(".clicked").each (function(i) {
		if (tags.length === 0) {
			tags.push("x")
		}
		tags.push (this.id);
		$(this).removeClass("clicked")
	});

	$(".clicked_off").each (function(i) {
		var index = tags.indexOf(this.id);
		tags.splice(index, 1);
		$(this).removeClass("clicked_off")
	});
	// console.log(tags)
	imgRef.on("value", function(snapshot) {
	var data = snapshot.val();	
		Object.keys(data).forEach (function(img){
			var iO = data[img]
			var hasTags = {};
			var currentTags  = [];
			var allTags = [];
			
			 	//console.log(iO[key].tag, iO )
			  // imgRef.child(""+iO.name).update({number:null})
			for ( var i = 1; i < tags.length; ++i ) {
			  	
			 	if (typeof iO.tags[tags[i]] !== "undefined") {
			 		
			 		currentTags.push(tags[i])
			 		//console.log(iO.name, test)
			 		searchResults[iO.name] = {
			 			file: iO.file,
			 			name: iO.name,
			 			number: currentTags.length 
			 		}
			 		//TEST>LENGTH= NUMBER
			 	}//if

			}//for
			
			if (typeof searchResults[iO.name] === "undefined") {
				searchResults[iO.name] = {
			 			file: iO.file,
			 			name: iO.name,
			 			number: 0 
			 		}
			}
			var number = searchResults[iO.name].number
			//console.log(number, iO.name )
			imgRef.child(""+iO.name).update({number:number})
			
			
		});//obj,key img

	});//img.on
	
	$("#fileList").empty();
	imgRef.orderByChild("number").startAt(1).on("child_added", function(snapshot) {
  		
	  	renderThumnail (snapshot.key(), snapshot.val().file, snapshot.val().number)
	  	console.log(snapshot.key() + " has " + snapshot.val().number + " many tags");
	});
	
	//console.log(searchResults)
	// if (newBatch[prop].deleted.length < 0) {

	// }
}

//on load tags
tagsRef.orderByValue().on("value", function(snapshot) {//when a value changes  
    var data = snapshot.val();
    console.log(data)
	Object.keys(data).forEach (function(key){
	$(".tags").append("<button id="+key+" class='tag'>"+key+"</button>");	
	// 	var existing = document.getElementById(data[key].tag, key)
	// 		if (existing === null){
	// 	 		
	// 		}

	});
});

function renderThumnail (name, src, num) {
	$("#fileList").append("<div class='photo'><img src="+src+" class=thumbnail> <div class=thumbnail_label>"+name+"<span class='download glyphicon glyphicon-download-alt'></div></div> ")
// <li>"+num+"</li>
}
var ref = new Firebase('https://blsimgsorter.firebaseio.com/'),
    imgRef = ref.child('imgs');
var tags = [];
var searchResults = {};
var imgs = [];
var newBatch = {}
var newBatchTags
/////////////////////

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
	console.log(tags)
	imgRef.on("value", function(snapshot) {
	var data = snapshot.val();	
		Object.keys(data).forEach (function(img){
			var iO = data[img]
			var hasTags = {};
			var currentTags  = [];
			var allTags = [];
			Object.keys(data[img]).forEach (function(key){
			 	//console.log(iO[key].tag, iO )
			  // imgRef.child(""+iO.name).update({number:null})
			  for ( var i = 1; i < tags.length; ++i ) {
			  	
			 	if (iO[key].tag === tags[i]) {
			 		
			 		currentTags.push(iO[key].tag)
			 		//console.log(iO.name, test)
			 		searchResults[iO.name] = {
			 			file: iO.file,
			 			name: iO.name,
			 			number: currentTags.length 
			 		}
			 		//TEST>LENGTH= NUMBER
			 		}//if

			  }//for
			});//obj.keysdata[img]
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
}

//on load tags
ref.on("value", function(snapshot) {//when a value changes  
    var data = snapshot.val();
	Object.keys(data).forEach (function(key){
		
		var existing = document.getElementById(data[key].tag)
		//check each key in fire base 
		// if the element is isn't there create a tag for it		
			if (existing === null){
		 		$(".tags").append("<button id="+data[key].tag+" class='tag'>"+data[key].tag+"</button>");
			}
		
		
	});
});


//addBtn on when addbutton is clicked 
//


var holder = ["x","x","x"];

$('input').change(function() {    
	var fr = new FileReader;
	    fr.onload = function(e) {
			var img = new Image;
			var link = ($('input[type=file]').val())
			var name = getName(link)

			img.onload = function() {
			  var imgObj = imgRef.child(""+name)	

			  newBatch[name] = {
			  	file: fr.result,
			  	name:name,
			  	gtags: currentTags,
			  	deleted:[]
				};

			  imgObj.set ({file: fr.result, name:name});
			  holder.push (name)
	 		  preview ()
			 
			}//onload

	    img.src = fr.result;
	    console.log (newBatch)
		};//fr.onload
		fr.readAsDataURL(this.files[0]);
	    //console.log(fr.readAsBinaryString(this.files[0]);)
	    // holder.push(name)
	    // console.log(holder)
	    
	});//input.change 

  function preview () {
			  	$("#newGroup").empty()
			  	for (prop in newBatch) {

				$("#newGroup").append('<div class="imgBox"><div class="col-md-3 newThumbnail " style="background-image: src('+prop.file+')"></div><div class="col-md-9 newTags" id='+prop+'><span>'+prop+'</span><div id='+prop+' class="groupTags"></div></div></div>');
				//on img added // 
				// set up thumbnail of each obj 
				// set up tag div with all the img tags

				$("#"+prop).each (function(){
					console.log(this.id, newBatch[prop].gtags, currentTags)
				})

				$("#"+prop).each (function(){
					newBatch[prop].gtags.forEach (function (i){
						$("#"+prop).append ("<button class='tag'>"+i+"<span id ='"+prop+"_"+i+"'class='remove'>'      x'</span></button>")
					})
					//
				})
			
			}
		}	

$( "#newGroup" ).click(function( event ) {
  //alert(event.target.id)

  	var obj = event.target.id.substring(0, event.target.id.indexOf('_'))
	var tag = event.target.id.substring((event.target.id.indexOf('_') + 1), event.target.id.length)
	
	console.log(obj, tag, newBatch[obj].tags)
	newBatch[obj].tags.splice(indexOf(tag))

});

$('#test').keypress(function (e) {
	   if (e.keyCode === 13) {
	       	var tag = $('#test').val().toLowerCase();
		  		tag = getName (tag)
		  		console.log(tag)
		  		holder.forEach(function(i){
		  			console.log(i)
		  		})
		  	
		  	if (document.getElementById(tag) === null){
				
				$("#groupTags").append ("<button id="+tag+" class='tag'>"+tag+"</button>")
			}

		ref.push({tag: tag})
		currentTags.push (tag)

		for (prop in newBatch) {
			//console.log(prop, typeof prop)
			imgRef.child(""+prop).push ({tag:tag})
			//newBatch[prop].tags.push (tag)
			
		}
		preview ()
		

       	$('#test').val('');
	 	}//keycode 13
	});//keypress

	var currentTags = [];

/////////////UPLOADING NEW IMAGES 



function getName (str) {
	var start = str.lastIndexOf("\\")
	var end = str.length
	var title = str.slice(start+=1).replace(/[.,-\/#!$%\^&\*;:{}=\-_`~()]/g,"")
		title=title.replace(/ /g,"_")

	return title
}

function renderThumnail (name, src, num) {
	$("#fileList").append("<div class='photo'><img src="+src+" class=thumbnail> <ul>"+name+"<li>"+num+"</li></li> ")
}

//modal stuff
// $("#new").on ("click", function(){
// 	$("#addImg").removeClass ("invisible")
// })
// // $("upload")


var ref = new Firebase('https://blsimgsorter.firebaseio.com/'),
    imgRef = ref.child('imgs');
    tagsRef = ref.child('tags');
var tags = [];
var searchResults = {};
var imgs = [];
var newBatch = {}
var currentTags = [];

/////////////////////

////uploading code
$("#save").on ("click",function() {
		for (prop in newBatch) {
			newBatch[prop].added.forEach (function (i){
				newBatch[prop].objTags.push (i)
			});
			newBatch[prop].objTags.forEach (function (i){
				var obj = {};
				obj[ i ] = i;
				console.log(obj)
				if (i !== newBatch[prop].name) {
					imgRef.child(""+prop).child("tags").update(obj)
				}
				
			});
		}
})

$("#done").on ("click",function() {
	if (confirm("Are you sure you're done?")) {	
		window.location.replace("index.html");
	}
})

///adding images and tags
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
			  	objTags:[],
			  	deleted:[],
			  	added:[name]
				};

			  imgObj.set ({file: fr.result, name:name, tags:{name:name}});
	 		  preview ()
			 
			}//onload

	    img.src = fr.result;
	    console.log (newBatch)
		};//fr.onload
		fr.readAsDataURL(this.files[0]);
	    
});//input.change 

function preview () {
  	$("#newGroup").empty()
	  	for (prop in newBatch) {
	  	$("#newGroup").append('<div class="imgBox"><div class="col-md-5 newThumbnail " style="background-image: url('+newBatch[prop].file+')"></div><div class="col-md-6"><div class="newImgName">'+prop+'</div><input type="text" id="'+prop+'input" placeholder="new tag" style="width: 100%; marin-top:12px" class="imgBox_input"><div class="newTags" id='+prop+'><div id='+prop+' class="groupTags"></div></div></div></div>')

		//$("#newGroup").append('<div class="imgBox"><div class="col-md-3 newThumbnail" style="background-image: url('+newBatch[prop].file+')"><span class="imgText">'+prop+'</span></div><div class="col-md-9 newTags" id='+prop+'><div id='+prop+' class="groupTags"></div></div></div>');
		$("#"+prop).each (function(){
			newBatch[prop].gtags.forEach (function (i){
				if (newBatch[prop].deleted.length > 0) {
					newBatch[prop].deleted.forEach (function (j){	 
						if(i !== j) {
							console.log(prop, i,j)
							$("#"+prop).append ("<button type='button' class='btn btn-default tag'>"+i+"<span id ='"+prop+"//"+i+"'class='remove'>      x</span></button>")
						}
					});
				}
				else {
					//console.log(newBatch[prop].objTags[newBatch[prop].objTags.indexOf(i)], prop)
					if (typeof newBatch[prop].objTags[newBatch[prop].objTags.indexOf(i)] === "undefined"){
						newBatch[prop].objTags.push (i)
					}
					console.log("HERE", prop.name, newBatch[prop].objTags)
					$("#"+prop).append ("<button class='btn btn-default btn-xs tag'>"+i+"<span id ='"+prop+"//"+i+"'class='remove'>      x</span></button>")
				}

				
			})
			
			//
			console.log(newBatch[prop].objTags)
		
		})
		newBatch[prop].added.forEach (function (i){
				$("#"+prop).append ("<button class='btn btn-default btn-xs tag'>"+i+"<span id ='"+prop+"//"+i+"'class='remove'>      x</span></button>")
		})

	}
}	


$( "#newGroup" ).click( function( event ) {
	var id = event.target.id
	if (event.target.id.substr(id.length - 5) !== "input"){
		var obj = event.target.id.substring(0, event.target.id.indexOf('//'))
		var tag = event.target.id.substring((event.target.id.indexOf('//') + 2), event.target.id.length)
		var otags = newBatch[obj].objTags
		var deleted = newBatch[obj].deleted
		deleted.push(tag)
		otags.splice(otags.indexOf(tag))
		var par = $(event.target).parent();
		par.remove();
	}

});//str.slice(0, -1);
		
$( "#newGroup" ).on('keypress','.imgBox_input', function (e) {
	   var parString = this.id.slice(0, -5);
	   
	   if (e.keyCode === 13) {
	   		//console.log($(this).val())
	   		newBatch[parString].added.push($(this).val())
	   		preview();
	   }
}); 


$('#tagInput').keypress(function (e) {

	   if (e.keyCode === 13) {
	       	var tag = $('#tagInput').val().toLowerCase();
		  		tag = getName (tag)

		  	if (document.getElementById(tag) === null){
				$("#groupTags").append ("<li class='list-group-item tag' id="+tag+"'>"+tag+"</li>")
			}

		tagsRef.on("value", function(snapshot) {//when a value changes  
    		var data = snapshot.val();
    		var obj = {};
			obj[ tag ] = tag;
			console.log(obj)
    		if (data[tag] === undefined) {
    			tagsRef.update(obj)
    			console.log(tag)
    		}

		});
		//ref.push({tag: tag})
		currentTags.push (tag)
		preview ()
       	$('#test').val('');
	 	}//keycode 13
	});//keypress

	
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


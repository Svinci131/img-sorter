var ref = new Firebase('https://blsimgsorter.firebaseio.com/'),
    imgRef = ref.child('imgs');
    tagsRef = ref.child('tags');
var tags = [];
var searchResults = {};
var imgs = [];
var newBatch = {}
var currentTags = [];
var individTags = [];
var groupDeleted = [];
var isSaved = false;
///////////////////// 

////save tags to fire base 
$("#save").on ("click",function() {
	//goes through each img obj in new batch 
	for (prop in newBatch) {
		//adds the added individ tags to the obj tags 
		newBatch[prop].added.forEach (function (i){
			newBatch[prop].objTags.push (i)
		});

		//adds the the obj tags to the firebase img object
		//unless they are deleted group tags
		newBatch[prop].objTags.forEach (function (i){
			if (groupDeleted.indexOf(i) < 0) {
				var item = newBatch[prop].objTags
				var obj = {};
				obj[ i ] = i;
				if (i !== newBatch[prop].name) {
					imgRef.child(""+prop).child("tags").update(obj)
				}
			}
		});
	}
	//pushes the individual obj tags and current group tags to the firebase tags obj
	currentTags.concat(individTags).forEach (function(tag){
		tagsRef.on("value", function(snapshot) {//when a value changes  
 			var data=snapshot;
 			var obj = {};
			obj[ tag ] = tag;
	    		if (data[tag] === undefined) {
	    			tagsRef.update(obj)
	    			console.log(tag)
	    		}

		});
	});

	if (alert("Your changes have been saved")){
		isSaved = true;
	}
});
//exit
$("#done").on ("click",function() {
	if (isSaved === true) {
		if (confirm("Are you sure you're done?")) {	
		window.location.replace("index.html");
		}
	}
	else {
		if (confirm("You have unsaved changes. Are you sure you're done?")) {	
			window.location.replace("index.html");
		}
	}
})

//uploads imgae 
//creates firebase image obj and google drive url 
//adds img obj to new batch object 
//each img obj has a gtags key that is equal to current tags
$('input').change(function() {    
	var self = this;
	var fr = new FileReader;
	    fr.onload = function(e) {
			var img = new Image;
			var link = ($('input[type=file]').val())
			//var ext = link.slice(link.lastIndexOf("."), link.length)
			//var name = link.slice(0, link.lastIndexOf(ext))
			var name = getName(link)
			// console.log(name, ext)
			img.onload = function() {
				var imgObj = imgRef.child(""+name);
			  	  isDuplicate = false;
			  	   newBatch[name] = {
				  	file: fr.result,
				  	name:name,
				  	gtags: currentTags,
				  	objTags:[],
				  	deleted:[],
				  	added:[name]//https://googledrive.com/host/0B58gM6k8rHBoZE5EY044TkJ1Ulk/
					};

				  imgRef.once("value", function(snapshot) {
					var data = snapshot.val();	
					if (typeof data[name] === "undefined") {
						console.log(data[name])
						insertFile(self);
				 		imgObj.set ({name:name, tags:{name:name}});
		 		  		preview ()
					}
					else {
						alert("An Image with this name already exists")
					}
					
				  });
				 			 
			}//onload
	    img.src = fr.result;
		};//fr.onload
		fr.readAsDataURL(this.files[0]);
});//input.change 

//renders the image thumbnails
//checks to see if grouptags are deleted and if not adds to Img.objtags 
//renders objtags 
function preview () {
	isSaved = false;
  	$("#newGroup").empty()
	  	for (prop in newBatch) {
	  	$("#newGroup").append('<div class="imgBox"><div class="imgBox_photo " style="background-image: url('+newBatch[prop].file+')"></div><div class="imgBox_info"><div class="newImgName">'+prop+'</div><input type="text" id="'+prop+'input" placeholder="new tag" style="width: 100%; class="imgBox_input"><div class="newTags" id='+prop+'><div id='+prop+' class="groupTags"></div></div></div></div>');
	  	//$("#newGroup").append('<div class="imgBox"><div class="col-md-5 newThumbnail " style="background-image: url('+newBatch[prop].file+')"></div><div class="newTag_info"><div class="newImgName">'+prop+'</div><input type="text" id="'+prop+'input" placeholder="new tag" style="width: 100%; marin-top:12px" class="imgBox_input"><div class="newTags" id='+prop+'><div id='+prop+' class="groupTags"></div></div></div></div>');
		$("#"+prop).each (function(){
			newBatch[prop].gtags.forEach (function (i){
			//goes through the gtags(current tags at time it was uploaded)
			//if they haven't been deleted it adds the tags to the tags div 
				if (newBatch[prop].deleted.length > 0) {
					newBatch[prop].deleted.forEach (function (j){	 
						if(i !== j) {
							renderTag(prop, i)
						};
					});
				}
				//otherwise it adds the tag to that images object tags and renders all the objects tags
				else {
					var obj = newBatch[prop].objTags
					if (typeof obj[obj.indexOf(i)] === "undefined"){
						obj.push (i)
					}
					renderTag(prop, i)
				};
			});		
		});
		//renders the tags that were added to a specefic img 
		newBatch[prop].added.forEach (function (i){
			renderTag(prop, i)
		});
	}
}	

//delete tags from spefic images 
$( "#newGroup" ).click( function( event ) {
	isSaved = false;
	var id = event.target.id
	if (event.target.id.substr(id.length - 5) !== "input"){
		var obj = event.target.id.substring(0, event.target.id.indexOf('//'))
		var tag = event.target.id.substring((event.target.id.indexOf('//') + 2), event.target.id.length)
		var otags = newBatch[obj].objTags
		var deleted = newBatch[obj].deleted
		var added = newBatch[obj].added
		deleted.push(tag)
		otags.splice(otags.indexOf(tag))
		added.splice(added.indexOf(tag))
		var par = $(event.target).parent();
		par.remove();
	}
});

//delete tags from all images 
$(".list-group").on ('click', '.list-group-item', function() {
	currentTags.splice(currentTags.indexOf(this.id), 1)
	groupDeleted.push(this.id)
	$(this).remove();
	preview();
});

//handles individual image tags 	
$("#newGroup" ).on('keypress','.imgBox_input', function (e) {
	   var parString = this.id.slice(0, -5);	   
	   if (e.keyCode === 13) {
	   		var tag = ($(this).val()).toLowerCase();
	   		tag = getName (tag)
	   		//console.log(tag)
	   		individTags.push(tag)
	   		newBatch[parString].added.push($(this).val())
	   		preview();
	   }
}); 

//adds group image tags 
$('#tagInput').keypress(function (e) {
   if (e.keyCode === 13) {
       	var tag = $('#tagInput').val().toLowerCase();
	  		tag = getName (tag)

	  	if (document.getElementById(tag) === null){
			$("#groupTags").append ("<li class='list-group-item tag' id="+tag+">"+tag+"<span class='glyphicon glyphicon-remove'></li>")
		}
	currentTags.push (tag)
	preview ()
   	$('#tagInput').val('');
 	}//keycode 13
});

//strips out punctuation
function getName (str) {
	var start = str.lastIndexOf("\\")
	var end = str.length
	var title = str.slice(start+=1).replace(/[.,-\/#!$%\^&\*;:{}=\-_`~()]/g,"")
		title=title.replace(/ /g,"_")
	return title
}


function renderTag (parent, tag) {
	$("#"+parent).append ("<button class='btn btn-default btn-xs tag'><span class='tag_name'>"+tag+"</span><span id ='"+parent+"//"+tag+"'class='remove'>      x</span></button>")	
	// $("#fileList").append("<div class='photo'><img src="+src+" class=thumbnail> <ul>"+name+"<li>"+num+"</li></li> ")
}
///create url- insert with google api
function insertFile(fileData, callback) {
	const boundary = '-------314159265358979323846';
	const delimiter = "\r\n--" + boundary + "\r\n";
	const close_delim = "\r\n--" + boundary + "--";
	var reader = new FileReader();
	reader.readAsBinaryString(fileData.files[0]);
	var link = ($('input[type=file]').val())
	var name = getName(link)
	 console.log(link, name)
	// .readAsDataURL(input.files[0])
	//console.log(fileData)
	reader.onload = function(e) {
	  var contentType = 'application/octet-stream';
	  var metadata = {
	    'title': name,
	    'mimeType': contentType,
		  "parents": [{
		    "kind": "drive#fileLink",
		    "id": "0B58gM6k8rHBoZE5EY044TkJ1Ulk"
		  }],
		  "webViewLink": "https://googledrive.com/host/0B58gM6k8rHBoZE5EY044TkJ1Ulk/"+name
	  };

	  var base64Data = btoa(reader.result);
	  var multipartRequestBody =
	      delimiter +
	      'Content-Type: application/json\r\n\r\n' +
	      JSON.stringify(metadata) +
	      delimiter +
	      'Content-Type: ' + contentType + '\r\n' +
	      'Content-Transfer-Encoding: base64\r\n' +
	      '\r\n' +
	      base64Data +
	      close_delim;

	  var request = gapi.client.request({
	      'path': '/upload/drive/v2/files',
	      'method': 'POST',
	      'params': {'uploadType': 'multipart'},
	      'headers': {
	        'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
	      },
	      'body': multipartRequestBody});
	  if (!callback) {
	    callback = function(file) {
	      console.log(file)
	    };
	  }
	  request.execute(callback);
	}
}

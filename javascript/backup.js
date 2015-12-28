

     // * Insert new file.
     // *
     // * @param {File} fileData File object to read data from.
     // * @param {Function} callback Function to call when the request is complete.
     // */

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
	//var currentObj= {}

// function readURL(input) {
//     var reader = new FileReader();
//     var link = ($('input[type=file]').val())
//     console.log(link)
//     reader.onload = function (e) {
//         $('#blah').attr('src', e.target.result);
//         //currentObj[link]=e.target.result
//         insertFile(e.target.result) 
//     }

//     reader.readAsDataURL(input.files[0]);
// }

$('input').change(function(){
	var fr = new FileReader;
	    fr.onload = function(e) {
			var img = new Image;
			var link = ($('input[type=file]').val())
			var name = getName(link)

			img.onload = function() {
			 // var imgObj = imgRef.child(""+name)	

			 //  newBatch[name] = {
			 //  	file: fr.result,
			 //  	name:name,
			 //  	gtags: currentTags,
			 //  	objTags:[],
			 //  	deleted:[],
			 //  	added:[name]
				// };

			 //  imgObj.set ({file: fr.result, name:name, tags:{name:name}});
	 		//   preview ()
			 
			}//onload
	    img.src = fr.result;
		};//fr.onload
		fr.readAsDataURL(this.files[0]);
	    
     insertFile(this);
});

function getName (str) {
	var start = str.lastIndexOf("\\")
	var end = str.length
	var title = str.slice(start+=1).replace(/[.,-\/#!$%\^&\*;:{}=\-_`~()]/g,"")
		title=title.replace(/ /g,"_")

	return title
}




// 	return currentObj
// }();
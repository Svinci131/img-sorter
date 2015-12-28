//put in something that says whether you've saved 
//style everything 
//google apis
//look into multiple image uploading 

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
        console.log(fileData)
        reader.readAsBinaryString(fileData.files[0]);
        // .readAsDataURL(input.files[0])
        //console.log(fileData)
        reader.onload = function(e) {
          var contentType = 'application/octet-stream';
          var metadata = {
            'title': "cat.jpg",
            'mimeType': contentType,
			  "parents": [{
			    "kind": "drive#fileLink",
			    "id": "0B58gM6k8rHBoZE5EY044TkJ1Ulk"
			  }]
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

	 function readURL(input) {

	    // if (input.files && input.files[0]) {
	    	// console.log(input)
	        var reader = new FileReader();
	        var link = ($('input[type=file]').val())
	        console.log(link)
	        reader.onload = function (e) {
	            $('#blah').attr('src', e.target.result);
	            //currentObj[link]=e.target.result
	            insertFile(e.target.result) 
	        }

	        reader.readAsDataURL(input.files[0]);
	    //}
	}

	$('input').change(function(){
	  console.log("foo")
	     insertFile(this);

	});



// 	return currentObj
// }();
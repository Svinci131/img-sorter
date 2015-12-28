$(".thumbnails").on ('click', '.download', function() {
	var id = $( this ).parents('.photo').find('img').attr("id");
	var link = $( this ).parents('.photo').find('img').attr("src");

	// var url = $( this ).parents('.photo').find('img').attr("src")
	// console.log( src );

 	var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function() {
      var reader  = new FileReader();
      reader.onloadend = function () {
          console.log(reader.result);
          downloadURI(reader.result, id+".jpg");
          //link = reader.result;
          //var url = link.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
		  //window.open(url);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', link);
    xhr.send();
});

function downloadURI(uri, name) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    link.click();
}

// downloadURI("data:,Hello%2C%20World!", "helloWorld.txt");
/**
 * Download a file's content.
 *
 * @param {File} file Drive File instance.
 * @param {Function} callback Function to call when the request is complete.
 */
function downloadFile(file, callback) {
  if (file.downloadUrl) {
    var accessToken = gapi.auth.getToken().access_token;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', file.downloadUrl);
    xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
    xhr.onload = function() {
      callback(xhr.responseText);
    };
    xhr.onerror = function() {
      callback(null);
    };
    xhr.send();
  } else {
    callback(null);
  }
}

//download the url 
// http://stackoverflow.com/questions/10473932/browser-html-force-download-of-image-from-src-dataimage-jpegbase64
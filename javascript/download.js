$(".thumbnails").on ('click', '.download', function() {
	var id = $( this ).parents('.photo').find('img').attr("id");
	var link = $( this ).parents('.photo').find('img').attr("src");
	// var url = $( this ).parents('.photo').find('img').attr("src")
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


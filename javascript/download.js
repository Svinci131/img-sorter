$(".thumbnails").on ('click', '.download', function() {
  return;
	var id = $( this ).parents('.photo').find('img').attr("id");
	var link = $( this ).parents('.photo').find('img').attr("src");
  var self = $( this );

	// var url = $( this ).parents('.photo').find('img').attr("src")
 	var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function() {
      var reader  = new FileReader();
      reader.onloadend = function () {
          console.log(reader.result);
          downloadURI(reader.result, id+".jpg", self);
          //link = reader.result;
          //var url = link.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
		  //window.open(url);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', link);
    xhr.send();
});

function downloadURI(uri, name, self) {
    var link = document.createElement("a");
    link.innerHTML = name;
    link.setAttribute('download', name)
    link.setAttribute('href', uri);
    // link.style.visibility = 'hidden';
    // link.style.height = '0px';
    link.style.display = 'block';
    self.parents('.thumbnail_label').append( link );
    $(self).parents('.thumbnail_label').find('a').click();
        console.log( self, link, $( self ).parents('.thumbnail_label').find('a') )
}


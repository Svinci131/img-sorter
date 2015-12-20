$(".thumbnails").on ('click', '.download', function() {
	console.log( $( this ).parents('.photo').find('img').attr("src"));
	var link = $( this ).parents('.photo').find('img').attr("src")
	var url = link.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
	window.open(url);
});

// http://stackoverflow.com/questions/10473932/browser-html-force-download-of-image-from-src-dataimage-jpegbase64
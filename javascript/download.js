$(".thumbnails").on ('click', 'img', function() {
	console.log(this.src)
	var url = this.src.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
	window.open(url);
});

// http://stackoverflow.com/questions/10473932/browser-html-force-download-of-image-from-src-dataimage-jpegbase64
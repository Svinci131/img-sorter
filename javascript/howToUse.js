//force a firebase state of demo to equal true//
var ref = new Firebase('https://blsimgsorter.firebaseio.com/')

function start (first) {
	$(".howTo").removeClass("invisible")
	$("#"+first).removeClass("invisible")
}
$("#demo").click (function (){
	ref.update ({demo: true});
	start("first")
});

var holder = null;
$(".next").click (function (){

	var prev = $(this).parent().attr("id")
	var next = ($(this).parent().next().attr("id"))
	//alert(prev)

	$("#"+prev).addClass("invisible")
	$("#"+next).removeClass("invisible")

	if (next === "third"){
		third ();
	}
	if (prev === "fourth"){
		window.location.replace("createalbum.html");
	}
	if (prev === "fifth") {
		$("#upload").removeClass("shadow")
		highlight ($("#tagInput"))
	}
	if (prev === "sixth") {
		$("#tagInput").removeClass("shadow")
		highlight ($(".imgBox_input"))
	}
	if (prev === "seventh") {
		$(".imgBox_input").removeClass("shadow")
		highlight($(".btn-xs").eq(0))
	}
	if (prev === "eighth") {
		$(".btn-xs").eq(0).removeClass("shadow")
		highlight($(".list-group-item").eq(0))
	}
	if (prev === "ninth") {
		($(".list-group-item").eq(0)).removeClass("shadow")
		highlight($("#save").eq(0))
		ref.update ({demo: false});
		window.location.replace("index.html");
	}
});


function third () {//click the tags 
	$('#nick').click(); 
	$('#students').click(); 
	$('#professors').click(); 
}

ref.on("value", function(snapshot) {
	if(snapshot.val().demo !== false){
		start("fifth")
		highlight ($("#upload"))
	};
});


function callFunction (place, el, fun) {
	if (place === el){
		fun
	}
};

function highlight (el) {
	el.eq(0).addClass("shadow")
}


//show and hide a bunch of modals on next click 
//force state clicked 
//save a thing that lets you know your in a window 
//change window 
//upload images in image file 
//add tags 
//on done// demo = false 
//go back to index.html 

//force a firebase state of demo to equal true//
var ref = new Firebase('https://blsimgsorter.firebaseio.com/')

function start (first) {
	$(".howTo").removeClass("invisible")
	$("#"+first).removeClass("invisible")
}
$("._demo").click (function (){
	ref.update ({demo: true});
	var path = findPath(window.location.pathname)
	console.log(path)
	if (path === "about"){
		window.location.replace("index.html")
	}	
});

var holder = null;
$(".next").click (function (){

	var prev = $(this).parent().attr("id")
	var next = ($(this).parent().next().attr("id"))
	
	var viewportWidth = $("body").innerWidth();
	$("#"+prev).addClass("invisible")
	$("#"+next).removeClass("invisible")


	if (next === "second"){
		console.log("foo", next)
		$("#first").css("display", "none")
		third ();
		var amount = $(".howTo").css("left")+100
		if (viewportWidth <= 540){
			$(".howTo").css("left", amount)
		}
		// else {
		// 	$(".howTo").css("left", "10%")
		// }
	}
	if (next === third) {
		$(".howTo").css("left", "600px")
	}
	if (prev === "third") {
		console.log("foo")
		highlight ($(".download").eq(0))
		$(".download").eq(0).css ("background-color","#a51c30")
		$(".download").eq(0).click(); 
	}
	if (prev === "fourth"){
		$(".download").eq(0).removeClass("shadow")
		$(".download").eq(0).css ("background-color","#89959f")
		window.location.replace("createalbum.html");

	}
	if (prev === "fifth") {
		$("#upload").removeClass("shadow")
		highlight ($("#tagInput"))
		$(".howTo").css("left", "15%")
		
	}
	if (prev === "sixth") {
		$("#tagInput").removeClass("shadow")
		highlight ($(".imgBox_info input").eq(0))
		$(".howTo").css("left", "15%")
		$(".howTo").css("top", "20%")

	}
	if (prev === "seventh") {
		$(".imgBox_info input").eq(0).removeClass("shadow")
		highlight($(".btn-xs").eq(0))
		// $(".howTo").css("left", "500px")
		$(".howTo").css("top", "120px")
	}
	if (prev === "eighth") {
		$(".btn-xs").eq(0).removeClass("shadow")
		highlight($(".list-group-item").eq(0))
		// $(".howTo").css("left", "200px")
		$(".howTo").css("top", "5%")
	}
	if (prev === "ninth") {
		($(".list-group-item").eq(0)).removeClass("shadow")
		highlight($("#save").eq(0))

		ref.update ({demo: false});
		window.location.replace("index.html");
		$(".howTo").css("left", "300px")
		$(".howTo").css("top", "90px")
	}
});


function third () {//click the tags 
	$('#nick').click(); 
	$('#students').click(); 
	$('#professors').click(); 
}

ref.on("value", function(snapshot) {
	var path = findPath(window.location.pathname)
	if (snapshot.val().demo !== false && path === "createalbum") {
		start("fifth");
		highlight ($("#upload"));
	}
	else if (snapshot.val().demo !== false && path === "index"){
		start("first")
	
	}
});


function callFunction (place, el, fun) {
	if (place === el){
		fun
	}
};

function highlight (el) {
	el.eq(0).addClass("shadow")
}

function findPath (url){
	var path = url
	var path = path.slice ((path.lastIndexOf("/")+1), path.lastIndexOf(".") )
	return path;
}
//show and hide a bunch of modals on next click 
//force state clicked 
//save a thing that lets you know your in a window 
//change window 
//upload images in image file 
//add tags 
//on done// demo = false 
//go back to index.html 

//force a firebase state of demo to equal true//
var ref = new Firebase('https://blsimgsorter.firebaseio.com/')
$("#demo").click (function (){
	ref.update ({demo: true});
	$("#search_modal").removeClass("invisible")
	$("#first").removeClass("invisible")
});

var holder = null;
$(".next").click (function (){
	var prev = $(this).parent().attr("id")
	var next = ($(this).parent().next().attr("id"))
	// alert($(this).parent().next().attr("id"))
	$("#"+prev).addClass("invisible")
	$("#"+next).removeClass("invisible")

	if (next === "third"){
		third ();
	}
	if (next === "fourth"){

		fourth ();

	}
});



function third () {//none 
	//click the tags 
	$('#nick').click(); 
	$('#students').click(); 
	$('#professors').click(); 

}
// function third () {//none 
// 	//when They load do fourth
// 	//if img div is empty hide node 
// }
function fourth () {//none 
	// $(".photo .download").eq(0)
	alert("test")
}


//show and hide a bunch of modals on next click 
//force state clicked 
//save a thing that lets you know your in a window 
//change window 
//upload images in image file 
//add tags 
//on done// demo = false 
//go back to index.html 

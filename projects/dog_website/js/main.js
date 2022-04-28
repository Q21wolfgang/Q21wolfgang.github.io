///////////////////////////////Services Sizes//////////////////////////////////
var a = document.getElementById("serv-small").clientHeight+6;
var b = document.getElementById("serv-big").clientHeight+6;
var c = document.getElementById("serv-small2").clientHeight+6;
document.getElementById("serv-small").style.paddingBottom = b - a + "px";
document.getElementById("serv-small2").style.paddingBottom = b - c + "px";
//////////////////////////////Sticky Navbar///////////////////////////////////
window.onscroll = function(){myFunction()};
function myFunction(){
	var head = document.getElementById("head").clientHeight;
	var height = window.pageYOffset;
	if(head > height){
		document.getElementById("hidden").style.display = "none";
		document.getElementById("hidden").style.opacity = 0;
	}else if(head <= height){
		document.getElementById("hidden").style.display = "block";
		document.getElementById("hidden").style.opacity = 1;
		
	}
}
//////////////////////////////Hover Sticky Navbar////////////////////////////
function change(id,color){
	document.getElementById(id).style.color = color;
}
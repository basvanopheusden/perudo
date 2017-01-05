var images = ["maija.png", "mingyu.jpg", "andra.jpg", "aspen.jpg"];
var ncats = images.length;
var ndice = 4; 

var task = function(){
	do_trial();
	$('#nextbutton').click(function(){click_next();});	
}

function respond(resp,correct_resp,r,d_opp){
	$('#yesbutton').prop("disabled",true);
	$('#nobutton').prop("disabled",true);
	$("#" + (resp==true ? "yes" : "no") + "button").css("border","3px solid #222222");
	showdice_opp(d_opp);
	console.log(r);
	if(resp==correct_resp){
		$("#feedback").text("Correct: " + r.toString() + " point" + (r>1 ? "s" : ""));
	}
	else {
		$("#feedback").text("Incorrect");
	}
	$("#feedback").show();
	$('#nextbutton').show();
	$('#nextbutton').prop("disabled", false);
}

function click_next(){
	$('#nextbutton').prop("disabled", true);
	$('#yesbutton').prop("disabled",false);
	$('#nobutton').prop("disabled",false);
	$("#yesbutton").css("border","");
	$("#nobutton").css("border","");
	$('#nextbutton').hide();
	$('#feedback').hide();
	hidedice_opp();
	do_trial();
}

function do_trial(){
	var d_self=[];
	var d_opp=[];
	var n=0;
	var d_statement=Math.floor(ncats*Math.random());
	var r_yes=Math.ceil(5*Math.random());
	var r_no=Math.ceil(5*Math.random());
	var n_target;
	for(i=0;i<4;i++){
		d_self[i]=Math.floor(ncats*Math.random());
		if(d_statement==d_self[i]){n++};
	}
	n_target=n+Math.ceil(ndice*Math.random());
	for(i=0;i<4;i++){
		d_opp[i]=Math.floor(ncats*Math.random());
		if(d_statement==d_opp[i]){n++};
	}
	set_rewards(r_yes,r_no);
	showdice_self(d_self);
	showstatement(n_target,d_statement);
	correct_resp=(n>=n_target);
	r=(correct_resp==true ? r_yes : r_no);
	$('#yesbutton').off("click").click(function(){respond(true,correct_resp,r,d_opp);});	
	$('#nobutton').off("click").click(function(){respond(false,correct_resp,r,d_opp);});	
}

function set_rewards(r_yes,r_no){
	$('#yesbutton').text("Yes: " + r_yes.toString() + " point" + (r_yes>1? "s": ""))
	$('#nobutton').text("No: " + r_no.toString() + " point" + (r_no>1? "s": ""))	
}

function showdice_self(l){
	for(i=0;i<4;i++){
		$('#'+"die_self"+i.toString()).css("background-image","url('media/" + images[l[i]] + "')");
	}
}

function showdice_opp(l){
	$(".die p").hide();
	for(i=0;i<4;i++){
		$('#'+"die_opp"+i.toString()).css("background-image","url('media/" + images[l[i]] + "')");
	}
}

function hidedice_opp(){
	$(".die p").show();
	for(i=0;i<4;i++){
		$('#'+"die_opp"+i.toString()).css("background-image","none");
	}
}

function showstatement(n,i){
	$("#statement_pic").attr("src","media/" + images[i]);
	if(n>1){
		$("#statement_begin").text("There are at least " + n.toString());
		$("#statement_end").text("'s");
	}
	else {
		$("#statement_begin").text("There is at least 1");
		$("#statement_end").text("");
	}
}

$(document).ready( function(){
    currentview = new task();
});

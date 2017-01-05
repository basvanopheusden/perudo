var images = ["maija.png", "mingyu.jpg", "andra.jpg", "aspen.jpg"];
var ncats;
var ndice_self;
var ndice_opp;
var trials_completed;
var data;

var task = function(){
	trials_completed=0;
	data=[];
	$('#nextbutton').click(function(){click_next();});
	start_block();
}

function start_block(){
	ndice_opp=Math.ceil(5*Math.random());
	ndice_self=Math.ceil(5*Math.random());
	ncats=Math.ceil(3*Math.random())+1;
	for(i=0;i<5;i++){
		if(i<ndice_self){
			$('#'+"die_self"+i.toString()).css({bottom: "30%", right: ((50-(ndice_self/2-i-1/2)*15).toString() + "%")}).show();			
		}
		else {
			$('#'+"die_self"+i.toString()).hide();			
		}
	}
	for(i=0;i<5;i++){
		if(i<ndice_opp){
			$('#'+"die_opp"+i.toString()).css({bottom: "80%", right: ((50-(ndice_opp/2-i-1/2)*15).toString() + "%")}).show();			
		}
		else {
			$('#'+"die_opp"+i.toString()).hide();			
		}
	}
	do_trial();
}

function respond(resp,correct_resp,r,d_opp){
	$('#yesbutton').prop("disabled",true);
	$('#nobutton').prop("disabled",true);
	$("#" + (resp==true ? "yes" : "no") + "button").css("border","3px solid #222222");
	showdice_opp(d_opp);
	if(resp==correct_resp){
		$("#feedback").text("Correct: " + r.toString() + " point" + (r>1 ? "s" : ""));
	}
	else {
		$("#feedback").text("Incorrect");
	}
	$("#feedback").show();
	add_resp_to_data(resp,correct_resp);
	$('#nextbutton').show();
	$('#nextbutton').prop("disabled", false);
}

function add_resp_to_data(resp,correct_resp){
	data[trials_completed]["resp"]=resp;
	data[trials_completed]["correct_resp"]=correct_resp;
}

function add_stim_to_data(ntarget, dtarget, dself, dopp, ryes, rno){
	data[trials_completed]={"ncats" :ncats, "ntarget" : ntarget, "dtarget" : dtarget, 
							"dopp" : dopp, "dself" : dself, 
							"ryes" : ryes, "rno" : rno};
}

function save(filename){
    var blob = new Blob([JSON.stringify(data)], {type: 'text/csv'});
	var elem = window.document.createElement('a');
	elem.href = window.URL.createObjectURL(blob);
	elem.download = filename;        
	document.body.appendChild(elem);
	elem.click();
	document.body.removeChild(elem);
}

function click_next(){
	$('#yesbutton').prop("disabled",false);
	$('#nobutton').prop("disabled",false);
	$("#yesbutton").css("border","");
	$("#nobutton").css("border","");
	$('#nextbutton').prop("disabled", true);
	$('#nextbutton').hide();
	$('#feedback').hide();
	hidedice_opp();
	trials_completed++;
	if(trials_completed==10){
		save("perudo_responses.txt");
	}
	else if(trials_completed%5==0){
		start_block();
	}
	else{
		do_trial();
	}
	
}

function do_trial(){
	var d_self=[];
	var d_opp=[];
	var n=0;
	var d_statement=Math.floor(ncats*Math.random());
	var r_yes=Math.ceil(5*Math.random());
	var r_no=Math.ceil(5*Math.random());
	var n_target;
	for(i=0;i<ndice_self;i++){
		d_self[i]=Math.floor(ncats*Math.random());
		if(d_statement==d_self[i]){n++};
	}
	n_target=n+Math.ceil(ndice_opp*Math.random());
	for(i=0;i<ndice_opp;i++){
		d_opp[i]=Math.floor(ncats*Math.random());
		if(d_statement==d_opp[i]){n++};
	}
	set_rewards(r_yes,r_no);
	showdice_self(d_self);
	showstatement(n_target,d_statement);
	correct_resp=(n>=n_target);
	r=(correct_resp==true ? r_yes : r_no);
	add_stim_to_data(n_target, d_statement, d_self, d_opp, r_yes, r_no);
	$('#yesbutton').off("click").click(function(){respond(true,correct_resp,r,d_opp);});	
	$('#nobutton').off("click").click(function(){respond(false,correct_resp,r,d_opp);});	
}

function set_rewards(r_yes,r_no){
	$('#yesbutton').text("Yes: " + r_yes.toString() + " point" + (r_yes>1? "s": ""))
	$('#nobutton').text("No: " + r_no.toString() + " point" + (r_no>1? "s": ""))	
}

function showdice_self(l){
	for(i=0;i<ndice_self;i++){
		$('#'+"die_self"+i.toString()).css("background-image","url('media/" + images[l[i]] + "')");
	}
}

function showdice_opp(l){
	$(".die p").hide();
	for(i=0;i<ndice_opp;i++){
		$('#'+"die_opp"+i.toString()).css("background-image","url('media/" + images[l[i]] + "')");
	}
}

function hidedice_opp(){
	$(".die p").show();
	for(i=0;i<ndice_opp;i++){
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

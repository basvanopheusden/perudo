var imgs = ["puppy.jpg", "turtle.jpg", "jag.jpg", "duckling.jpg", "volcano.jpg","lightning.jpg","castle.jpg","waterfall.jpg",
              "sunset.jpg","barn.jpg","coffee.jpg","owl.jpg","wall.jpg","space_shuttle.jpg","lego.jpg","cat.jpg","banana.jpg","sushi.jpg",
			  "ramen.jpg","porkbuns.jpg","panda.jpg","dragonfruit.jpg","moon.jpg","goldengate.jpg","chess.jpg","monet.jpg","dali.jpg"];
var imgs_block;
var ncats;
var ndice_self;
var ndice_opp;
var trials_completed;
var data;
var n_blocks=10;
var trials_per_block=25;
var max_reward=10;

function shuffle(array){
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex){
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function binom(n, k) {
    var coeff = 1;
    for (var i = n-k+1; i <= n; i++) coeff *= i;
    for (var i = 1;     i <= k; i++) coeff /= i;
    return coeff;
}

var task = function(){
	trials_completed=0;
	data=[];
	$('#instructions_block p span:eq(0)').text(trials_per_block.toString());	
	$('#instructions_task p span:eq(0)').text((trials_per_block*n_blocks).toString());	
	$('#instructions_task p span:eq(1)').text(trials_per_block.toString());	
	$('#instructions_block button').click(function(){
		$('#instructions_block').hide();
		$(".overlayed").hide();
		do_trial();
	});
	$('#instructions_task button').click(function(){
		$('#instructions_task').hide();
		start_block();
	});
	$('#nextbutton').click(function(){click_next();});
}

function start_block(){
	ndice_opp=Math.ceil(5*Math.random());
	ndice_self=Math.ceil(5*Math.random());
	ncats=Math.ceil(4*Math.random())+1;
	imgs_block=shuffle(imgs).slice(0,ncats);
	for(i=0;i<5;i++){
		if(i<ndice_self){
			$('#'+"die_self"+i.toString()).css({bottom: "15%", right: ((50-(ndice_self/2-i-1/2)*15).toString() + "%")}).show();			
		}
		else {
			$('#'+"die_self"+i.toString()).hide();			
		}
	}
	for(i=0;i<5;i++){
		if(i<ndice_opp){
			$('#'+"die_opp"+i.toString()).css({bottom: "85%", right: ((50-(ndice_opp/2-i-1/2)*15).toString() + "%")}).show();			
		}
		else {
			$('#'+"die_opp"+i.toString()).hide();			
		}
	}
	for(i=0;i<5;i++){
		if(i<ncats){
			$('#'+"example"+i.toString()).css("background-image","url('media/" + imgs_block[i] + "')").show();
		}
		else {
			$('#'+"example"+i.toString()).hide();			
		}
	}
	$(".overlayed").show();
	$('#instructions_block').show();
	$('#instructions_block p b').first().text(ndice_self.toString());
	$('#instructions_block p b').last().text(ndice_opp.toString());
	$('#instructions_block p span:eq(1)').text(ndice_self>1?"s":"");
	$('#instructions_block p span:eq(2)').text(ndice_opp>1?"s":"");
}

function respond(resp,correct_resp,r,d_opp,d_target){
	$('#yesbutton').prop("disabled",true);
	$('#nobutton').prop("disabled",true);
	$("#" + (resp==true ? "yes" : "no") + "button").css("border","3px solid #222222");
	showdice_opp(d_opp,d_target);
	$("#feedback p").first().text(correct_resp?"True":"False");
	$("#feedback p").last().text(correct_resp==resp?"$" + r.toString():"");
	$("#feedback").show();
	$(".die").css("opacity",0.5);
	$(".correct_die").css("opacity",1);	
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
	$('#nextbutton').prop("disabled", true);
	$('#nextbutton').hide();
	$('#feedback').hide();
	hidedice_opp();
	trials_completed++;
	$(".die").removeClass("correct_die").css("opacity",1);
	if(trials_completed==n_blocks*trials_per_block){
		save("perudo_responses.txt");
	}
	else {
		$('#yesbutton').prop("disabled",false);
		$('#nobutton').prop("disabled",false);
		$("#yesbutton").css("border","");
		$("#nobutton").css("border","");
		if(trials_completed%trials_per_block==0){
			start_block();
		}
		else{
			do_trial();
		}
	}
}

function do_trial(){
	var d_self=[];
	var d_opp=[];
	var n=0;
	var d_target=Math.floor(ncats*Math.random());
	var temp=get_nopp();
	var n_opp=temp[0];
	var p=temp[1];
	var r=set_rewards(p);
	for(i=0;i<ndice_self;i++){
		d_self[i]=Math.floor(ncats*Math.random());
		if(d_target==d_self[i]){n++};
	}
	n_target=n+n_opp;
	for(i=0;i<ndice_opp;i++){
		d_opp[i]=Math.floor(ncats*Math.random());
		if(d_target==d_opp[i]){n++};
	}	
	show_rewards(r[0],r[1]);
	showdice_self(d_self,d_target);
	showstatement(n_target,d_target);
	correct_resp=(n>=n_target);
	r_corr=(correct_resp==true ? r[0] : r[1]);
	add_stim_to_data(n_target, d_target, d_self, d_opp, r[0], r[1]);
	$('#yesbutton').off("click").click(function(){respond(true,correct_resp,r_corr,d_opp,d_target);});	
	$('#nobutton').off("click").click(function(){respond(false,correct_resp,r_corr,d_opp,d_target);});	
}

function show_rewards(r_yes,r_no){
	$('#yesbutton p').last().text("$" + r_yes.toString());
	$('#nobutton p').last().text("$" + r_no.toString());
}

function showdice_self(l,t){
	for(i=0;i<ndice_self;i++){
		$('#'+"die_self"+i.toString()).css("background-image","url('media/" + imgs_block[l[i]] + "')");
		if(l[i]==t){
			$('#'+"die_self"+i.toString()).addClass("correct_die");
		}
	}
}

function showdice_opp(l,t){
	$(".die p").hide();
	for(i=0;i<ndice_opp;i++){
		$('#'+"die_opp"+i.toString()).css("background-image","url('media/" + imgs_block[l[i]] + "')");
		if(l[i]==t){
			$('#'+"die_opp"+i.toString()).addClass("correct_die");
		}
	}
}

function hidedice_opp(){
	$(".die p").show();
	for(i=0;i<ndice_opp;i++){
		$('#'+"die_opp"+i.toString()).css("background-image","none");
	}
}

function showstatement(n,i){
	$("#statement_pic").css("background-image","url('media/" + imgs_block[i] + "')");
	if(n>1){
		$("#statement_begin").text("There are at least " + n.toString());
		$("#statement_end").text("s");
	}
	else {
		$("#statement_begin").text("There is at least 1");
		$("#statement_end").text("");
	}
}

function generate_lognormal(mu,sigma){
	var alpha = Math.random(), beta = Math.random();
    var z=Math.sqrt(-2 * Math.log(alpha)) * Math.sin(2 * Math.PI * beta);
	return mu*Math.exp(sigma*z);
}

function set_rewards(p){
	var ratio=generate_lognormal(p/(1-p),0.5);
	return [Math.ceil(max_reward/(1+ratio)),Math.ceil(max_reward*ratio/(1+ratio))] 
}

function get_nopp(){
	var n=ndice_opp;
	var cdf=[1,1-Math.pow(1 - 1/ncats,n)];
	var x=cdf[1]*Math.random();
	var i=1;
	while(x<cdf[i]){
		cdf[i+1]=cdf[i]-binom(n,i) * Math.pow(1/ncats,i) * Math.pow(1 - 1/ncats,n - i);
		i++;
	}
	return [i-1,cdf[i-1]];
}

$(document).ready( function(){
	currentview = new task();
});

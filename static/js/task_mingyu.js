/*
 * Requires:
 *     psiturk.js
 *     utils.js
 */

// Initalize psiturk object
/*var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);

var mycondition = condition;  // these two variables are passed by the psiturk server process
var mycounterbalance = counterbalance;  // they tell you which condition you have been assigned to
// they are not used in the stroop code but may be useful to you

// All pages to be loaded
var pages = [
	"instructions/instruction1.html",
	"instructions/instruction2.html",
	"instructions/instruction3.html",
	"instructions/instruction3_result.html",
	"instructions/instruction4.html",
	"instructions/instruction4-2.html",
	"instructions/instruction5.html",
	"instructions/instruction6.html",
	"instructions/instruction7.html",
	"instructions/not_qualified.html",
	"postquestion.html"
];

psiTurk.preloadPages(pages);

var instructionPages = [ // add as a list as many pages as you like
	"instructions/instruction1.html",
	"instructions/instruction2.html",
	"instructions/instruction3.html",
	"instructions/instruction3_result.html",
	"instructions/instruction4.html",
	"instructions/instruction4-2.html",
	"instructions/instruction5.html",
	"instructions/instruction6.html",
	"instructions/instruction7.html"
];

var images = [
	"static/img/smileface.png",
	"static/img/distribution.png",
	"static/img/quiz2-1.png",
	"static/img/quiz2-2.png",
	"static/img/screenshot.png"
];

psiTurk.preloadImages(images);*/


/********************
* HTML manipulation
*
* All HTML files in the templates directory are requested 
* from the server when the PsiTurk object is created above. We
* need code to get those pages from the PsiTurk object and 
* insert them into the document.
*
********************/


/********************
* TASK       *
********************/
var windowwidth;
var windowheight;

var num_trial_repeat = 30; //30
var num_total_trial=num_trial_repeat*6; //6
var breaktimeunit=90; //90
var breaktimelength=30000; //30000
var N_pre=new Array;
for(var j=1;j<=num_trial_repeat;j++){
	N_pre=N_pre.concat([5,6,7,8,9,10]); //
}
var N= N_pre.sort(randomsort);

var tdnames;

var newchart;
var dat_x = [1.0,1.1,1.2,1.3,1.4,1.5,1.6,1.7,1.8,1.9,2.0,2.1,2.2,2.3,2.4,2.5,2.6,2.7,2.8,2.9,3.0,3.1,3.2,3.3,3.4,3.5,3.6,3.7,3.8,3.9,4.0,4.1,4.2,4.3,4.4,4.5,4.6,4.7,4.8,4.9,5.0];
var dat = [26,44,74,120,190,292,437,636,900,1239,1658,2159,2734,3367,4033,4699,5324,5868,6290,6557,6649,6557,6290,5868,5324,4699,4033,3367,2734,2159,1658,1239,900,636,437,292,190,120,74,44,26];

var num_trial=1;
var i = 0;
var action_thistrial=new Array(0);
var reward_thistrial=new Array(0);
var totalreward_thistrial = 0;
var currentmax;
var currentmax_ind;
var clicktime;

var bonusdata=new Array(num_total_trial);
var bonus;

var strategy;

var savedata=new Array;


var task = function(){
	windowwidth=screen.availWidth;
	clearinstruction();
	appendelements(setheight);
	trialprepare();
	$('#goback').click(function(){
		clickbutton(0);
	});
	$('#gonew').click(function(){
		clickbutton(1);
	});
	$('#nexttrial').click(function(){
		nexttrial();
	})
}

function clearinstruction(){
	//$('body').empty();
	clicktime=performance.now();
}

function appendelements(callback){
	$('body').append("<div id='page'></div>");
	$('#page').append("<div id='abovegraph'><div id='trial_ind'></div></div>");
	$('#page').append("<div id='canvas'></div>");
	$('#page').append("<div id='belowgraph'></div>");
		$('#belowgraph').append("<div id='showrewardvalue'></div>");
			$('#showrewardvalue').append("<table id='reward_his'></table>");
				$('#reward_his').append("<tr></tr>");
			$('#showrewardvalue').append("<table id='total_reward'><tr><td id='write_total_reward'> Score so far: </td></tr></table>");
		$('#belowgraph').append("<div id='notice'></div>");
			$('#notice').append("<div id='noticel1'>Now take a break. You will be able to continue after 30 seconds.</div>");
			$('#notice').append("<div id='noticel2'></div>");
		$('#belowgraph').append("<div id='askaction'></div>");
		$('#belowgraph').append("<div id='twobuttons'></div>");
			$('#twobuttons').append("<button id='gonew' class='taskbutton'>Go to a random new restaurant</button>");
			$('#twobuttons').append("<button id='goback' class='taskbutton'>Go back to the best restaurant so far</button>");
		$('#belowgraph').append("<div id='nexttrialdiv'><button id='nexttrial' class='taskbutton'>Begin the next assignment</button></div>");
	callback();
}
function setheight(){
	/*margintop=120;
	$('#page').css('margin-top',margintop);*/
}

function trialprepare(){
	if(i===0){
		$('#notice').hide();
		$('#nexttrial').hide();
		document.getElementById("goback").disabled = false;
		document.getElementById("gonew").disabled = false;
		append_square();
		display_text();
		display_distribution(-1);
		$('#goback').hide();
		$('#twobuttons').css('margin-left',(windowwidth-350)/2);
	}
}
function append_square(){
	tdnames = new Array(N[num_trial-1]);
	for(var j=0;j<N[num_trial-1];j++){
		tdnames[j]='t'+j.toString();
	}
	for(var j=0;j<N[num_trial-1];j++){
		$('#reward_his tr').append("<td class='square' id="+"'"+tdnames[j]+"'"+"></td>");
	}
	var leftmargin=(windowwidth-(38*10+171))/2;
	$('#reward_his').css('margin-left',leftmargin);
	$('#total_reward').css('margin-left',20+38*(10-N[num_trial-1]));
}
function display_text(){
	$('#askaction').text("You have "+N[num_trial-1].toString()+" days left. What do you want to do?");
	$('#write_total_reward').text("Score so far:");
	$('#trial_ind').text("Assignment: "+num_trial.toString()+"/"+num_total_trial.toString());
}


function clickbutton(action){
	//resizewindow();
	//resizeelement();
	calRT();
	if (i<N[num_trial-1]){
		action_thistrial.push(action);
		newaction(action);
		diaplayupdate();
		savetrialdata();
		// i=click-1
		// 上面几行都发生在i=i+1之前是为了方便写成reward[i]，而不用写reward[i-1]
		i=i+1;
		if(i===1){$('#goback').show();}
		if(i===N[num_trial-1]){finish();}
	}
}
function resizewindow(){
	window.moveTo(0,0);
	window.resizeTo(screen.availWidth,screen.availHeight);
    windowwidth=screen.availWidth;
}
function resizeelement(){
	$('#twobuttons').css('margin-left',(windowwidth-350)/2);
	var leftmargin=(windowwidth-(38*10+171))/2;
	$('#reward_his').css('margin-left',leftmargin);
	newchart.setSize(windowwidth*0.9375,windowwidth*0.9375/4);
}
function calRT(){
	newclicktime=performance.now();
	RT=newclicktime-clicktime;
	clicktime=newclicktime;
}
function newaction(action){
	if (action===0){reward_thistrial.push(Math.max.apply(Math,reward_thistrial));}//exploit
	else if(action===1){
		newreward=jStat.normal.sample(3,0.6);/*jStat.randn()*0.6+3*//*normrand(3,0.6)*/ //explore still some problem: error giving 999999..
		if(newreward<1){newreward=1};
		if(newreward>5){newreward=5};
			reward_thistrial.push(parseFloat(newreward.toFixed(1)));
		}
	totalreward_thistrial=totalreward_thistrial+reward_thistrial[i];
}
function diaplayupdate(){
	$('#write_total_reward').text("Score so far: "+totalreward_thistrial.toFixed(1));
	$('#'+tdnames[i]).text(reward_thistrial[i].toFixed(1));
	$('#'+tdnames[i]).css('background-color','gainsboro');
	if(N[num_trial-1]-i-1>1){
		$('#askaction').text("You have "+(N[num_trial-1]-i-1).toString()+" days left. What do you want to do?");	
	}
	if(N[num_trial-1]-i-1===1){
		$('#askaction').text("You have "+(N[num_trial-1]-i-1).toString()+" day left. What do you want to do?");
	}
	highlightmaxsquare();
	display_distribution(i);
}
function highlightmaxsquare(){
	currentmax = Math.max.apply(Math,reward_thistrial);
	for(var j=0;j<=i;j++){
		if(reward_thistrial[j]===currentmax) {$('#'+tdnames[j]).css("color","red");currentmax_ind=j;}
		else {$('#'+tdnames[j]).css("color","black");}
	}
}
function savetrialdata(){
	//var trial_data={"phase":"TASK","trial_num":num_trial,"trial_length":N[num_trial-1],"click_num":i+1,"RT":RT, "action":action_thistrial[i],"reward":reward_thistrial[i]};
	var trial_data=new Array(num_trial,N[num_trial-1],i+1,RT,action_thistrial[i],reward_thistrial[i]);
	savedata.push(trial_data);
	//psiTurk.recordTrialData(trial_data);
	//psiTurk.saveData();
}


function nexttrial(){
	$('#trial_ind').show();$('#canvas').show();$('#showrewardvalue').show();$('#askaction').show();$('#twobuttons').show();$('#notice').hide();
	for(var j=0;j<N[num_trial-1];j++){
		$('#'+tdnames[j]).remove();
	}
	num_trial++;
	cleardata();
	trialprepare();
}
function cleardata(){
	i = 0;
	action_thistrial=new Array(0);
	reward_thistrial=new Array(0);
	totalreward_thistrial = 0;
	clicktime=performance.now();
}


function finish(){
	if(i===N[num_trial-1]){
		bonusdata[num_trial-1]=new Array(N[num_trial-1],totalreward_thistrial);
		document.getElementById("goback").disabled = true;
		document.getElementById("gonew").disabled = true;
		$('#askaction').text("You have finished this assignment. You got an assignment score of "+totalreward_thistrial.toFixed(1)+".");
		if(num_trial<num_total_trial){
			if(num_trial%breaktimeunit!=0){
				$('#nexttrial').show();
			}
			else{
				setTimeout("takebreak()",1000);
			}
		}
		else{
			computebonus(); //& call allfinish
			setTimeout("postquestion()",1500);
		}
	}
}
function takebreak(){
	$('#notice').show();
	showtimer();
	$('#trial_ind').hide();$('#canvas').hide();$('#showrewardvalue').hide();$('#askaction').hide();$('#twobuttons').hide();
	setTimeout("recover()",breaktimelength);
}
function showtimer(){
	var breakduration = breaktimelength/1000-1,
    display = $('#noticel2');
    startTimer(breakduration, display);
}
function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        display.text(minutes + ":" + seconds);
        if (--timer < 0) {
            timer = 0;
        }
    }, 1000);
}
function recover(){
	$('#nexttrial').show();
}
function computebonus(){
	var bonusind=Math.floor(Math.random()*num_total_trial); //actually is ind-1
	var bonusreward = bonusdata[bonusind][1];
	var bonusclicknum = bonusdata[bonusind][0];
	var zscore = (bonusreward-3*bonusclicknum)/(0.6*Math.sqrt(bonusclicknum));
	bonus = 5*(1-Math.exp(-zscore/3));
	if(bonus<0){bonus=0;}
}

function postquestion(){
	//psiTurk.showPage('postquestion.html');
	$('body').empty();
	$('body').append("<div class='page'><br><br></div>");
	$('.page').append("<div id='postpage' class='instructions well'></div>");
	$('#postpage').append("<p id='p1'>Good job! You have completed all the assignments! </p>");
	$('#postpage').append("<p id='p2'><br>Please answer the last question:</p>");
	$('#postpage').append("<p id='p3'>What strategy did you use in the task?</p>");
	$('#postpage').append("<textarea rows='4' id='postquestioninput'></textarea>");
	$('#postpage').append("<button id='postquestionsubmit'>Submit</button>");
	$('#postquestioninput').css('width',windowwidth*0.7);
	$('#postquestionsubmit').click(function(){
		strategy = document.getElementById('postquestioninput').value;
		//psiTurk.recordTrialData({"phase":"POSTQUESTION","action":"SubmitStrategy","strategy":strategy});
		//psiTurk.saveData();
		allfinish();
	});
}
function allfinish(){
	$('#postquestioninput').hide();
	$('#postquestionsubmit').hide();
	$('#p1').text("Thanks for participating in the experiment!");
	$('#p2').text("You get a bonus of $"+bonus.toFixed(0)+'.');
	$('#p3').text("Please let the experimenter know that you have finished.");
	$(document).keydown(function(event){
        if(event.keyCode == 192){
			$('body').empty();
			$('body').append("<div id='data1'></div>");
			$('body').append("<div id='data2'></div>");
			setTimeout("$('#data1').text(savedata);$('#data2').text(strategy);",500);
	    }
	});
}


/*function normrand(mean,std){ //也许需要更好的生成随机数的办法
    var sum=0.0;
    for(var j=0; j<12; j++){
        sum=sum+Math.random();
    }
    var norm=mean+(sum-6.0)*std;
    if(norm<1){norm=1;}
    if(norm>5){norm=5;}
    return norm;
}*/

function randomsort(){
	return Math.random()>.5 ? -1 : 1;
}


function display_distribution(ind){
	if(ind===-1){
		var options = {
			chart: {
				width:windowwidth*0.94,
				height:windowwidth*0.25,
		        renderTo: 'canvas',
		        defaultSeriesType: 'column',
		        animation:false,
		        reflow:false
		    },
		    series: [{data:[]}],
		    title:{text:[]},
		    xAxis:{
		    	categories:[],
		    	title:{
		    		text:'Restaurant rating',
		    		style:{fontSize:'17px',color: 'black'}
		    	},
		    	labels:{style:{color:'black'},rotation:0,format:'{value:.1f}'}
		    },
		    yAxis:{
		    	labels:{
		    		enabled:true, // whether or not show y label
		    		format:'{value:.0f}',
		    		style:{color:'black'},
		    		x:-8,
		    		//distance:100
		    	}, 
		    	lineWidth:1, // show y axis
		    	gridLineWidth: 0, // no grid
		    	title:{
		    		text:'Number of restaurants',
		    		style:{fontSize:'17px',color:'black',fontWeight:'lighter'},
		    		margin:18
		    	}
		    },
		    legend:{enabled:false},// no legend below the graph 
		    tooltip:{enabled: false},// no data when hover
        	plotOptions: {
        		series: {
        			animation:false,// cancel the loading animation
        			dataLabels:{enabled:false},// no data label above data
		            states: {// no color change when hover
		                hover: {
		                    enabled: false
		                }
		            },
		            colorByPoint: false,// each bar has the same color
					pointPadding: 0.01,// intervals of bars
					groupPadding: 0.01// intervals of bars
		        }
		    }
		};
		for(var j=0;j<dat.length;j++){
			options.xAxis.categories.push(dat_x[j]);
		    options.series[0].data.push(dat[j]);
		}
		newchart = new Highcharts.Chart(options);
		newchart.xAxis[0].update({
			labels:{
				formatter: function(){
					if(this.value.toFixed(1)==='1.0'){
						var brlabel=this.value.toFixed(1)+"<br/>.";
						return /*'<span style="font-size:15px;">' + */brlabel /*+ '</span>'*/;
					}
					else {return this.value.toFixed(1);}
				}
			}
		});
	}
	if(ind>=0){
		for(var j=0;j<dat.length;j++){
			if(dat_x[j].toFixed(1)===reward_thistrial[i].toFixed(1)){
				newchart.series[0].data[j].graphic.attr({fill:'blue'});
			}
			else{newchart.series[0].data[j].graphic.attr({fill:'#7cb5ec'});}
		}
		newchart.xAxis[0].update({
			labels:{
				formatter: function(){
					if(currentmax===this.value){
						return '<span style="fill:red">' + this.value.toFixed(1) + '</span>'
						+'<br/>'+'<span style="fill:red">' + 'Best' + '</span>';
					}
					else {return this.value.toFixed(1);}
				}
			}
		});
	}
}


// Task object to keep track of the current phase
var currentview;

/*******************
 * Run Task
 ******************/
$(document).ready( function(){
	/*psiTurk.finishInstructions();
    psiTurk.doInstructions(
    	instructionPages, // a list of pages you want to display in sequence
    	function() { currentview = new task(); } // what you want to do when you are done with instructions
    );*/
    currentview = new task();
});
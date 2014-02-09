$(document).ready(init);

function init(){
	//$.mobile.showPageLoadingMsg(); 
	
	reset_style();
	//$(window).resize(reset_style);
	messagesButtonClickHandler();
	setButtons();
	receiveMessageRequest();
}

var myScroll,
	pullDownEl, pullDownOffset,
	pullUpEl, pullUpOffset,
	generatedCount = 0;

function pullDownAction () {
	//some ajax action
	//myScroll.refresh();
	setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
		//alert("oli");
		myScroll.refresh();		// Remember to refresh when contents are loaded (ie: on ajax completion)
	}, 1000);
}



function loaded() {
	pullDownEl = document.getElementById('pullDown');
	pullDownOffset = pullDownEl.offsetHeight;
	
	
	myScroll = new iScroll('wrapper', {
		hScrollbar: false, 
		vScrollbar: true,
		fixedScrollbar: true,
		useTransition: true,
		topOffset: pullDownOffset,
		onRefresh: function () {
			if (pullDownEl.className.match('loading')) {
				pullDownEl.className = '';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新';
			} 
		},
		onScrollMove: function () {
			if (this.y > 5 && !pullDownEl.className.match('flip')) {
				pullDownEl.className = 'flip';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = '释放刷新';
				this.minScrollY = 0;
			} else if (this.y < 5 && pullDownEl.className.match('flip')) {
				pullDownEl.className = '';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新';
				this.minScrollY = -pullDownOffset;
			} 
		},
		onScrollEnd: function () {
			if (pullDownEl.className.match('flip')) {
				pullDownEl.className = 'loading';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = '加载中';				
				pullDownAction();	// Execute custom function (ajax call?)
			} 
		}
	});
	
	//setTimeout(function () { document.getElementById('wrapper').style.left = '0'; }, 800);
	
}

function setIcon(){
	var height = $("ul#menuButtons").css("height");
	height = miner_px(height);
	height = height/3*2;
	height = height + "px";
	$(".icon").css("height",height);
	$(".icon").css("width",height);
}

function reset_style(){
	$( "#tabs" ).tabs();
	$("#nears").tabs();
	$("#settings").tabs();
	loaded();
	setMessage();
	setIcon();
	setContent();
	messagesButtonClickHandler();
	nearsMapButtonHandler();
	if(localStorage["noficationType"]==null || localStorage["noficationType"]==undefined)
		localStorage["noficationType"] = 1;

	
	if(!localStorage["nearContactCount"])
		localStorage["nearContactCount"] = 0;
	if(localStorage["nearContactCount"]>0)
		$("span#countMessageSpan").html(localStorage["nearContactCount"]);
}

function miner_px(str){
	var p_pos = str.indexOf("px");
	var str2 = str.substr(0,p_pos);
	return str2*1;
}

function setContent(){
	var height = $("#header").css("height");
	height = miner_px(height);
	height = height - 1;
	$("div.content").css("top",height);
}


function messagesButtonClickHandler(){
	//alert("fuck");
	document.getElementById("messagesButton").style.background = "linear-gradient(#39aaFF,#338ee2)";
	document.getElementById("nearsButton").style.background = "linear-gradient(#1E90FF,#1874CD)";
	document.getElementById("settingsButton").style.background = "linear-gradient(#1E90FF,#1874CD)";
		document.getElementById("messagesButton").style.background = "-webkit-linear-gradient(#39aaFF,#338ee2)";
	document.getElementById("nearsButton").style.background = "-webkit-linear-gradient(#1E90FF,#1874CD)";
	document.getElementById("settingsButton").style.background = "-webkit-linear-gradient(#1E90FF,#1874CD)";
	document.getElementById("header_text").innerHTML = "消息列表";

	setListView("erer","dfadfdsfjsdfkjhsd,fgnbsdgnsdkjgsdajbgsdkhgskdjhgsdkjhgsdkjhg","1212",false);
	myScroll.refresh();
	//reset_style();
	initListView();
}

function nearsButtonClickHandler(){
	document.getElementById("nearsButton").style.background = "linear-gradient(#39aaFF,#338ee2)";
	document.getElementById("messagesButton").style.background = "linear-gradient(#1E90FF,#1874CD)";
	document.getElementById("settingsButton").style.background = "linear-gradient(#1E90FF,#1874CD)";
		document.getElementById("nearsButton").style.background = "-webkit-linear-gradient(#39aaFF,#338ee2)";
	document.getElementById("messagesButton").style.background = "-webkit-linear-gradient(#1E90FF,#1874CD)";
	document.getElementById("settingsButton").style.background = "-webkit-linear-gradient(#1E90FF,#1874CD)";
	document.getElementById("header_text").innerHTML = "附近的人";
	get_geo();
}

function settingsButtonClickHandler(){
	document.getElementById("settingsButton").style.background = "linear-gradient(#39aaFF,#338ee2)";
	document.getElementById("messagesButton").style.background = "linear-gradient(#1E90FF,#1874CD)";
	document.getElementById("nearsButton").style.background = "linear-gradient(#1E90FF,#1874CD)";
	document.getElementById("settingsButton").style.background = "-webkit-linear-gradient(#39aaFF,#338ee2)";
	document.getElementById("messagesButton").style.background = "-webkit-linear-gradient(#1E90FF,#1874CD)";
	document.getElementById("nearsButton").style.background = "-webkit-linear-gradient(#1E90FF,#1874CD)";
	document.getElementById("header_text").innerHTML = "设置";
	get_inf();
	$("input#settingTx").change(uploadTxHandler);
	$("li#submit").click(submitClickHandler);
}


function nearsListButtonHandler(){

	//alert("click");
	$("li#nears_list_button a div.nears_button_text").css("border","none");
	$("li#nears_map_button a div.nears_button_text").css("border","inset");

	var _height_ = $("div.nearTx img").height();
	$("div.nearTx img").css("width",_height_);

}

function nearsMapButtonHandler(){

	//alert("click");
	$("li#nears_list_button a div.nears_button_text").css("border","inset");
	$("li#nears_map_button a div.nears_button_text").css("border","none");
}

function setButtons(){
	$("#mb").click(messagesButtonClickHandler);
	$("#nb").click(nearsButtonClickHandler);
	$("#sb").click(settingsButtonClickHandler);

	$("li#nears_list_button").click(nearsListButtonHandler);
	$("li#nears_map_button").click(nearsMapButtonHandler);
	//$(".aNear").click(function(){window.location.href="../information/information.html";});
	
}

function setMessage(){
	var height = $(window).height();
	console.log(height);
	height = height*0.12;
	$("div.message").css("height",height);
}

function initListView(){
	listviewJson = localStorage["listview"]
	if(listviewJson){
		listview = JSON.parse(listviewJson);
		if(listview.length){
			for(i=0;i<listview.length;i++){
				setListView(listview[i].id,listview[i].content,listview[i].date,listview[i].status);
				myScroll.refresh();
			}
		}
	}
}

function receiveMessageRequest(){
	if(!localStorage["last_message"]){
		var init_last_message = {
			sender: "",
			receiver: getId(),
			content: "",
			time: ""
		};
		var init_last_message_json = JSON.stringify(init_last_message);
		localStorage["last_message"] = init_last_message_json;
	}
	$.ajax({
		type:"POST",
		url:server+"getMessage.php",
		data:"lastMessage="+localStorage["last_message"],
		crossDomain:true
	}).done(receiveMessage);
	setTimeout(receiveMessageRequest,500);
}

function receiveMessage(messageJson){
	if(messageJson=="1")
		return;
	notif();
	var message = JSON.parse(messageJson);
	localStorage["last_message"] = messageJson;
	localStorage['message_to_write'] = messageJson;
	messageToFile();

	var messageRecord = {
		content:message.content,
		type:0
	};
	changeListviewBuffer(message.sender,messageRecord,false,message.time);
	setListView(message.sender,message.content,message.time);
	myScroll.refresh();	
}

function changeListviewBuffer(sender,messageRecord,status_,time_){
	var listviewBufferJson = localStorage["listview"];
	var listviewBuffer;
	if(listviewBufferJson)
		listviewBuffer = JSON.parse(listviewBufferJson);
	else
		listviewBuffer = [];
	if(!listviewBuffer.length){
		listviewBuffer = [];
	}
	else{
		var i;
		for(i=0;i<listviewBuffer.length;i++){
			if(listviewBuffer[i].id == sender){
				listviewBuffer.splice(i,1);
				if(localStorage["nearContactCount"]>0)
					localStorage["nearContactCount"] = localStorage["nearContactCount"] - 1;
			}
		}
	}
	var messageInBuffer = {
		id : sender,
		content : messageRecord.content,
		status: status_,
		date:time_
	};

	listviewBuffer.push(messageInBuffer);
	localStorage["nearContactCount"] = localStorage["nearContactCount"] + 1;
	listviewBufferJson = JSON.stringify(listviewBuffer);
	localStorage["listview"] = listviewBufferJson;
	$("span#countMessageSpan").html(localStorage["nearContactCount"]);
}

function getId(){
	var account = JSON.parse(localStorage['account']);
	var id =account.id;
	return id;
}
window.onload = init;

function init(){
	$.mobile.hidePageLoadingMsg(); 
	setStyle();	
	getNickname();
	setButtons();
	init_conversations();
	window.location.href = "#padding";
	receiveMessageRequest();

}

function setStyle(){
	setBackButton();
	setInputBox();
	setTx();
	setContent();
}

function setButtons(){
	$("div#backButton").click(function(){window.location.href="../main/main.html#messages"});
	$("button#sendButton").click(sendButtonClickHandler);
}

function setBackButton(){
	var height = $(window).height();
	console.log(height);
	height = height * 0.09 * 0.65;
	$("div#header div#backButton").css("font-size",height);
}

function setInputBox(){
	var height = $("div#footer textarea#inputBox").css("height");
	console.log(height);
	height=miner_px(height);
	height = height * 0.5;
	height = height + "px";
	 $("div#footer textarea#inputBox").css("font-size",height);
}

function miner_px(str){
	var p_pos = str.indexOf("px");
	var str2 = str.substr(0,p_pos);
	return str2*1;
}

function inputBoxFocusHandler(){
	//alert("click");
	$("div#footer").css("top","45%");
}

function inputBoxBlurHandler(){
	$("div#footer").css("top","90%");
}

function sendButtonClickHandler(){

	var t = new Date();
	var message = {
		content:$("div#footer textarea#inputBox").val(),
		sender: getId(),
		receiver: getChatterId(),
		time: t.getHours()+":"+t.getMinutes()+":"+t.getSeconds()
	};

	if(message.content=="")
		return;
	var messageRecord = {
		type:1,
		content:message.content
	};
	
	ajaxSend(message);
	var messageJson = JSON.stringify(message);
	localStorage['message_to_write'] = messageJson;
	messageToFile();
	changeListviewBuffer(getChatterId(),messageRecord,true,message.time);
	addToConversation(messageRecord);	
	
	$("div#footer textarea#inputBox").val("");
	$("div#footer textarea#inputBox").focus();
	//window.location.href="#padding";
	localStorage["nearContactCount"] = localStorage["nearContactCount"] - 1;
}

function setTx(){
	var width = $(window).width();
	//alert(width);
	width = width * 0.13;
	$("div.tx").css("height",width);
}

function setContent(){
	var width = $(window).width();
	//alert(width);
	width = width * 0.07;
	$("div.content").css("font-size",width);
}

function addToConversation(messageRecord){
	var width = $(window).width();
	var conversationLi = document.createElement("li");

	var txDiv = document.createElement("div");
	txDiv.className = "tx";
	txDiv.style.width = width*0.13+"px";
	txDiv.style.height = width * 0.13+"px";
	//txDiv.innerHTML = '<img width=100% height=100% src="'+server+'tx/'+message.sender+'.jpg'+'">';

	var contentDiv = document.createElement("div");
	contentDiv.innerHTML = messageRecord.content;
	contentDiv.className = "content";	
	contentDiv.style.fontSize = width * 0.07 +"px";

	if(messageRecord.type==0){
		conversationLi.className = "receive";
		txDiv.innerHTML = '<img width=100% height=100% src="'+server+'tx/'+getChatterId()+'.jpg'+'">';
	}
	else{
		conversationLi.className = "send";
		txDiv.innerHTML = '<img width=100% height=100% src="'+server+'tx/'+getId()+'.jpg'+'">';
	}

	conversationLi.appendChild(txDiv);
	conversationLi.appendChild(contentDiv);

	$("ul#chats li#padding").remove();

	$("ul#chats").append(conversationLi);

	var paddingli = document.createElement("li");
	paddingli.id = "padding";
	$("ul#chats").append(paddingli);
	window.location.href="#padding";

}

function getId(){
	var account = JSON.parse(localStorage['account']);
	var id =account.id;
	return id;
}

function getChatterId(){
	var url = window.location.href;
	var pos = url.indexOf("=");
	var npos = url.indexOf("#");
	if(npos>0)
		chatterId = url.substring(pos+1,npos);
	else
		chatterId= url.substring(pos+1);
	return chatterId;
}

function ajaxSend(message){
	var messageJson = JSON.stringify(message);
	$.ajax({
		type:"POST",
		url: server+"sendMessage.php",
		data:"message="+messageJson,
		crossDomain:true
	}).done(function(feedback){

		if(feedback!=0){
			alert("网络错误，发送失败");
		}
	});
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
				if(localStorage["nearContactCount"]>=0)
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
}

function getNickname(){
	$.ajax({
		type:"POST",
		url:server+"get_nickname.php",
		data:"id="+getChatterId(),
		crossDomain:true
	}).done(function(data){
		$("div#header_text").html(data);
	});
}

function fileError(e){
	alert(e.code + e.message);
}

function init_conversations(){
	//alert("init");
	window.requestFileSystem(LocalFileSystem.PERSISTENT,0,requestFileSystemSuccessHandler,fileError);
}

function requestFileSystemSuccessHandler(fileSystem){
	//alert("init1");
	getRootDirectorySuccessHandler(fileSystem.root);
}

function getRootDirectorySuccessHandler(root){
	//alert("init2");
	var directoryOption = {
		create:true
	};

	root.getDirectory("nearAppData",directoryOption,getDirectorySuccessHandler,fileError);
}

function getDirectorySuccessHandler(directory){
	//alert("init3");
	var id = getChatterId();
	var fileOption = {
		create:true
	};
	directory.getFile(id+".txt",fileOption,getFileEntrySuccessHandler,fileError);
}

function getFileEntrySuccessHandler(fileEntry){
	//alert("init4");
	fileEntry.file(getFileSuccessHandler,fileError);
}

function getFileSuccessHandler(file){
	//alert("init5");
	var fileReader = new FileReader();
	fileReader.onload = function(e){
		process_result(e.target.result);
	};
	fileReader.readAsText(file);
}

function process_result(recordsJson){
	//$("ul#chats").html("");
	
	if(recordsJson!=""){
		// alert("init6");
		var records = JSON.parse(recordsJson);
		var i;
		for(i=0;i<records.length;i++){
			var record = records[i];
			addToConversation(record);
		}	
	}
}

function receiveMessage(messageJson){
	if(messageJson=="1")
		return;
	//alert(messageJson);
	notif();
	var message = JSON.parse(messageJson);
	localStorage["last_message"] = messageJson;
	localStorage['message_to_write'] = messageJson;
	messageToFile();

	var messageRecord = {
		content:message.content,
		type:0
	};

	if(message.sender==getChatterId()){
		changeListviewBuffer(message.sender,messageRecord,true,message.time);
		addToConversation(messageRecord);
	}
	else{
		changeListviewBuffer(message.sender,messageRecord,false,message.time);
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
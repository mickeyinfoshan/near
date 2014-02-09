$(document).ready(init);

function init(){
	set_style();
	set_button();
	setInf();
}

function set_style(){
	setTx();	
}

function setTx(){
	var width = $("div#tx").width();
	$("div#tx").height(width);
}

function set_button(){
	$("#back").click(function(){window.location.href="../main/main.html";});
	$("#sendMessage").click(function(){window.location.href="../chat/chat.html?chatterId="+getChatterId();});
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

function setInf(){
	$.ajax({
		type:"POST",
		url: server + "user_information.php",
		data: "id="+getChatterId(),
		crossDomain:true
	}).done(setInfAjaxDone);
}

function setInfAjaxDone(userInfJson){
	var userInf = JSON.parse(userInfJson);
	$("div#tx img").attr("src",server+"tx/"+getChatterId()+".jpg");
	$("span#nickName").html(userInf.nickName);
	$("span#sex").html(userInf.sex);
	$("span#age").html(userInf.age);
	$("span#place").html(userInf.place);
	$("span#signature").html(userInf.signature);
}
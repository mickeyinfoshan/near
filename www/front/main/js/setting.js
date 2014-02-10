function get_inf(){
	$.ajax({
		type: "POST",
		url : server+"user_information.php",
		data: "id="+getId(),
		crossDomain: true
	}).done(int_inf);
}

function int_inf(infJson){
	var userInf = JSON.parse(infJson);
	initImg();
	initNickname(userInf.nickName);
	initSex(userInf.sex);
	initAge(userInf.age);
	initPlace(userInf.place);
	initSignature(userInf.signature);
	init_notificationType_checkbox();

	$("input#beep").click(beepClickHandler);
	//$("label#beepLabel").click(beepClickHandler);

	$("input#vibrate").click(vibrateClickHandler);
	//$("label#vibrateLabel").click(vibrateClickHandler);
}

function getId(){
	var account = JSON.parse(localStorage['account']);
	var id =account.id;
	return id;
}

function getSexVal(){
	if($("input#male").prop("checked"))
		return "男";
	else
		return "女";
}

function initImg(){
	var src = server+"tx/"+getId()+".jpg";
	$("#settingTxImg").attr("src",src);
}

function initNickname(nn){
	$("input#name").attr("value",nn);
}

function initSex(sex){
	if(sex=="男"){
		$("input#male").click();
		$("input#male").click();
	}
	else{
		$("input#female").click();
		$("input#female").click();
	}
}

function initAge(age){
	$("input#age").attr("value",age);
}

function initPlace(place){
	$("input#place").attr("value",place);
}

function initSignature(signature){
	$("input#signature").attr("value",signature);
}

function submitClickHandler(){
	var nickName_ = $("input#name").val();
	var sex_ = getSexVal();
	var age_ = $("input#age").val();
	var place_ = $("input#place").val();
	var signature_ = $("input#signature").val();

	if((nickName_=="")||(sex_=="")||(age_=="")||(place_=="")||(signature_=="")){
		alert("请完整输入信息");
		return;
	}
	else{
		if(checkAge(age_)){
		var user = {
			id: getId(),
			nickName:nickName_,
			sex:sex_,
			age:age_,
			place:place_,
			signature:signature_
		};
		var user_json = JSON.stringify(user);
		var ajax = $.ajax({
			type:"POST",
			url: server+"setting_inf.php",
			data:"user="+user_json,
			crossDomain:true
		});
		ajax.done(finishSettingHandler);
	}
	else{
		wrongAgeHandler();
	}
	}

}

function finishSettingHandler(data){
	if(data==0)
		alert("修改成功");
	else
		alert("wrong request");
}

function checkAge(age){
	for(i=0;i<age.length;i++){
		if(age[i]<'0' || age[i]>'9'){
			return false;
		}
	}
	return true;
}

function wrongAgeHandler(){
	alert("年龄请输入数字");
	$("input#age").val("");
}

function uploadTxHandler(){

	$.ajaxFileUpload({
		url:server+"uploadTx.php?id="+getId(),
		secureuri:false,
		fileElementId:"settingTx",
		dataType: 'json',
		success:successHandler,
		error: errorHandler
	});

	$("input#settingTx").change(uploadTxHandler);
}

function successHandler(data){

	if(data==0){
		showTx();
	}
	else if(data==1){
		alert("类型错误");
	}
	else{
		alert("error request");
	}
}

function errorHandler(){
	alert("错误，请重试");
	$("input#settingTx").val("");
}

function showTx(){
	$("#settingTxImg").attr("src",server+"tx/"+getId()+".jpg?"+Date.now());
}

/*
	0: nothing
	1: beep
	2: vibrate
	3: beep and vibrate
*/
function beepClickHandler(){
	var nt = localStorage['notificationType'];
	//alert(nt);
	if(nt==0 || !nt){
		nt = 1;
	}
	else if(nt==1){
		nt=0;
	}
	else if(nt==2){
		nt=3;
	}
	else if(nt==3){
		nt = 2;
	}
	localStorage["notificationType"] = nt;
	//alert(localStorage["notificationType"]);
}

function vibrateClickHandler(){
	var nt = localStorage['notificationType'];
	if(nt==0 || !nt){
		nt = 2;
	}
	else if(nt==1){
		nt=3;
	}
	else if(nt==2){
		nt=0;
	}
	else if(nt==3){
		nt = 1;
	}
	localStorage["notificationType"] = nt;
	//alert(localStorage["notificationType"]);
} 

function init_notificationType_checkbox(){
	if(!localStorage["notificationType"]){
		localStorage["notificationType"] = 1;
	}
	var nt = localStorage["notificationType"];
	if(nt==1){
		$("input#beep").click();
	}
	else if(nt==2){
		$("input#vibrate").click();	
	}
	else if(nt==3){
		$("input#beep").click();
		$("input#vibrate").click();	
	}
}
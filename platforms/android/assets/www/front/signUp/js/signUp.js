$(document).ready(init);

function init(){
	$("#backToLogin").click(function(){window.location.href="../login/login.html"});
	$("button#signUpButton").click(signUpButtonClickHandler);
	$("li#submit").click(submitClickHandler);
	$("input#settingTx").change(uploadTxHandler);
}

function signUpButtonClickHandler(){
	var id_ = $("input#user_name").val();
	var password_ = $("input#passwd").val();
	var password_cfg = $("input#passwd_configure").val();
	if(id_==""||password_==""||password_cfg==""){
		alert("请完整输入信息");
		return;
	}

	if(password_!=password_cfg){
		wrongPasswdCfgHandler();
	}
	else{
		rightPasswdCfgHandler(id_,password_);
	}
}

//wrong password configure handler
function wrongPasswdCfgHandler(){
	alert("两次输入的密码不一致,请重新输入");
	$("input#passwd").val("");
	$("input#passwd_configure").val("");
}

function rightPasswdCfgHandler(id_,password_){
	var account = {
		id : id_,
		password: password_
	};

	var account_json = JSON.stringify(account);
	localStorage['account'] = account_json;
	var ajax = $.ajax({
		type:"POST",
		url: server+"init_account.php",
		data: "account="+account_json
	});
	ajax.done(ajaxDoneHandler);
}

function ajaxDoneHandler(data){
	if(data==0){
		normalHandler();
	}
	else if(data==1){
		accountExistHandler();
	}
	else{
		alert("wrong request");
	}
}

function normalHandler(){
	window.location.href="signUp2.html";
}

function accountExistHandler(){
	alert("用户名已存在,请重新输入");
	$("input#user_name").val("");
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
			url: server+"init_inf.php",
			data:"user="+user_json,
			crossDomain:true
		});
		ajax.done(finishSignUpHandler);
	}
	else{
		wrongAgeHandler();
	}

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

function finishSignUpHandler(data){
	//alert(data);
	alert("成功注册");
	window.location.href = "../login/login.html";
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
	$("#txImg").attr("src",server+"tx/"+getId()+".jpg?"+Date.now());
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
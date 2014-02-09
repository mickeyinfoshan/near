var account_json;

$(document).ready (init);

function init(){
	checkLogged();
	reset_style();
	$("input#user_name").blur(function(){setTx(document.getElementById("user_name").value);});
	$(window).resize(reset_style);
	
	$("#signUpButton").click(function(){window.location.href="../signUp/signUp.html";});
	$("#signInButton").click(signInButtonClickHandler);
}

function setLogoHeight(){
	var width = $("div#logo").css("width");
	$("div#logo").css("height",width);
}

function setInput_boxes_style(){
	var logo_top = $("div#logo").css("top");
	var logo_heigth = $("div#logo").css("height");
	logo_heigth = miner_px(logo_heigth);
	logo_top = miner_px(logo_top);
	var top_height = logo_top+logo_heigth+logo_heigth*0.3;
	top_height = top_height+"px";
	$("div#input_boxes").css("top",top_height); 
}

function reset_style(){
	setLogoHeight();
	setInput_boxes_style();
}

function miner_px(str){
	var p_pos = str.indexOf("px");
	var str2 = str.substr(0,p_pos);
	return str2*1;
}

function signInButtonClickHandler(){

	var id_ = document.getElementById("user_name").value;
	var password_ = document.getElementById("passwd").value;

	if(id_=="" || password_==""){
		alert("请输入用户名或密码");
		return ;
	}

	var account = {
						id : id_,
						password : password_
	};
	account_json = JSON.stringify(account);	
	check_account(account_json);	
}

function check_account(account){
	var ajax = $.ajax({
		type:"POST",
		url:server+"check_login.php",
		data: "account="+account,
		crossDomain:true
	});
	ajax.done(ajaxDoneHandler);
}

function ajaxDoneHandler(data){
	console.log("done");
	if(data==0){
		normalHandler();
	}
	else if(data==1){
		wrongPwdHandler();
	}
	else if(data==2){
		accountNotExsistHandler();
	}
	else{
		alert("wrong request");
	}
}


//正常登陆handler
function normalHandler(){
	localStorage["account"] = account_json;
	window.location.href = "../main/main.html";
}

//密码错误handler
function wrongPwdHandler(){
	alert("密码错误，请重新输入");
	document.getElementById("passwd").value="";
	$("#passwd").focus();
}

//用户名不存在handler
function accountNotExsistHandler(){
	alert("该用户名不存在,请先注册");
	document.getElementById("user_name").value="";
	document.getElementById("passwd").value="";
}

//检测是否第一次登录
function checkLogged(){
	//不是第一次登录，直接登录
	account_json = localStorage["account"];
	if(account_json!=null && account_json!=undefined){
		check_account(account_json);
	}
}

function setTx(id){
	document.getElementById("tx").src = server+"/tx/"+id+".jpg";
}
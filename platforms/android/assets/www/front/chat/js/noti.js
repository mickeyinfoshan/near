function notif(){
	if(!localStorage["notificationType"]){
		localStorage['notificationType'] = 1;
	}
	var nt = localStorage['notificationType'];
	if(nt==0){

	}
	else if(nt==1){
		navigator.notification.beep(1);

	}else if(nt==2){
		navigator.notification.vibrate(1000);

	}else if(nt==3){
		navigator.notification.beep(1);
		navigator.notification.vibrate(1000);
	}
}

function statusBar(sender,content){
	$.ajax({
		type:"POST",
		url:server+"get_nickname.php",
		data:"id="+sender,
		crossDomain:true
	}).done(function(nickname){
		window.plugins.statusBarNotification.notify(nickname+":", content);
	});
}
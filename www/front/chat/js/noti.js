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

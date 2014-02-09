function setListView(id,content,date,status){
	$.ajax({
		type:"POST",
		url:server+"get_nickname.php",
		data:"id="+id,
		crossDomain:true
	}).done(function(nickname){
		setListView_(id,nickname,content,date,status);
	});
}

function setListView_(id,nickname,content,date,status){
	$("div.message#"+id).remove();

	var messageDiv = document.createElement("div");
	messageDiv.className = "message";
	messageDiv.id = id;

	var window_height = $(window).height();
	var window_width = $(window).width();
	var wrapper_height = window_height * 0.8;
	var messageDiv_height_ = wrapper_height * 0.15;
	var messageDiv_height = messageDiv_height_ + "px";
	messageDiv.style.height = messageDiv_height;

	var dateDiv = document.createElement("div");
	dateDiv.className = "date";
	dateDiv.innerHTML = date;


	var txDiv = document.createElement("div");
	txDiv.className = "tx";
	txDiv.style.height = "80%";
	txDivWidth = messageDiv_height_ *0.8+"px";
	txDiv.style.width = txDivWidth;
	txDiv.innerHTML = '<img width=100% height=100% src="'+server+'tx/'+id+'.jpg">';
	
	var nameDiv = document.createElement("div");
	nameDiv.innerHTML = nickname;
	var nameDivFontSize_ = messageDiv_height_ * 0.8 *0.4;
	var nameDivFontSize = nameDivFontSize_ + "px";
	nameDiv.style.fontSize = nameDivFontSize;
	nameDivMarginLeft = window_width *0.03 + messageDiv_height_ * 0.82;
	nameDivMarginLeft = nameDivMarginLeft + "px";
	nameDiv.style.marginLeft = nameDivMarginLeft;

	dateDivFontSize = nameDivFontSize_ * 0.7;
	dateDivFontSize = dateDivFontSize+"px";
	dateDiv.style.fontSize = dateDivFontSize;

	var contentDiv = document.createElement("div");
	contentDiv.className =  "message_content";
	contentDiv.innerHTML = content;
	contentDiv.style.left = window_width *0.03 + "px";
	contentDiv.style.width = window_width * 0.6 + "px";
	contentDiv.style.top = messageDiv_height_ * 0.1+"px";
	contentDiv.style.fontSize = nameDivFontSize_ * 0.8 +"px";


	if(!status){
		contentDiv.style.color = "#32CD32";
	}

	messageDiv.appendChild(dateDiv);
	messageDiv.appendChild(txDiv);
	messageDiv.appendChild(nameDiv);
	messageDiv.appendChild(contentDiv);

	messageDiv.onclick = function(e){
		messageClickHandler__(id);
		//window.location.href = "../chat/chat.html?chatterId="+id;
	}
	$("div#pullDown").after(messageDiv);	
}

function messageClickHandler__(id_){
	//alert("click");
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
			if(listviewBuffer[i].id == id_){				
				//alert("changed");
				if(!listviewBuffer[i].status)
					localStorage["nearContactCount"] = localStorage["nearContactCount"] - 1;
				listviewBuffer[i].status = true;
			}
		}
	}
	listviewBufferJson = JSON.stringify(listviewBuffer);
	//alert(listviewBufferJson);
	localStorage["listview"] = listviewBufferJson;

	if(localStorage["nearContactCount"]>0){
		$("span#countMessageSpan").html(localStorage["nearContactCount"]);
	}
	window.location.href = "../chat/chat.html?chatterId="+id_;
}
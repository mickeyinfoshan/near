var map;
var geo;
var coords;
var markers;
var nickName;
function get_geo(){

	if(!markers)
		markers = new Array();
	else{
		clearAll();
	}
	var getGeoOption = { maximumAge: 3000
				
						};

	geo = navigator.geolocation.getCurrentPosition(getGeoSuccess,getGeoFail,getGeoOption);
}

function getGeoSuccess(position){
	coords = position.coords;
	showMap();
	updatePositon();
	document.getElementById("nears_list").innerHTML = "";
	getNearPos();
}

function showMap(){
	var googleCoords = new google.maps.LatLng(coords.latitude,coords.longitude);
	var mapOption = {
		zoom:15,
		center:googleCoords,
		mapTypeId:google.maps.MapTypeId.ROADMAP
	};
	var mapDiv = document.getElementById("map");
	if(!map)
		map = new google.maps.Map(mapDiv,mapOption);
	map.panTo(googleCoords);
	
}

function getGeoFail(error){
	alert(error.message+error.code);
}

function getId(){
	var account = JSON.parse(localStorage['account']);
	var id =account.id;
	return id;
}

function updatePositon(){
	var userPos = {
		id:getId(),
		latitude:coords.latitude,
		longitude:coords.longitude
	};
	var userPos_json = JSON.stringify(userPos);

	$.ajax({
		type:"POST",
		url:server+"position.php",
		data:"userPosition="+userPos_json,
		crossDomain:true
	}).done(updatePositonAjaxHandler);

}

function updatePositonAjaxHandler(data){
	if(data==0)
		return;
	else
		alert(data);
}

function getNearPos(){
	$.ajax({
		type:"POST",
		url:server+"getPositions.php",
		data:"id="+getId(),
		crossDomain:true
	}).done(getNearPosHandler);
}

function getNearPosHandler(data){
	var near_array = JSON.parse(data);
	for(i=0;i<near_array.length;i++){
		var near_coords = {
			latitude: near_array[i].latitude,
			longitude:near_array[i].longitude
		};
		near_array[i].distance = computeDistance(coords,near_coords);
	}
	near_array.sort(compareDistance);
	for(i=0;i<near_array.length;i++){
		dealNearHandler(near_array[i]);
	}
}

function dealNearHandler(near){
	addMarker(near);

	addToList(near);
}

function compareDistance(near_a,near_b){
	return near_a.distance - near_b.distance;
}

function computeDistance(startCoords,destCoords){
	var startLatRads = degreeToRadians(startCoords.latitude);
	var startLongRads = degreeToRadians(startCoords.longitude);
	var desLatRads = degreeToRadians(destCoords.latitude);
	var desLongRads = degreeToRadians(destCoords.longitude);

	var Radius = 6371000;
	var distance = Math.acos(
						Math.sin(startLatRads)*
						Math.sin(desLatRads)+
						Math.cos(startLatRads)*
						Math.cos(desLatRads)*
						Math.cos(startLongRads - desLongRads)

					)*Radius;
	distance = distanceHandler(distance);
	return distance;
}

function degreeToRadians(degree){
	var radians = (degree * Math.PI) / 180;
	return radians;
}

function addMarker(near){
	var googleCoords = new google.maps.LatLng(near.latitude,near.longitude);
	/*var image = {
		url:server+"tx/"+near.id+".jpg",
		size:new google.maps.Size(100,100)
	};*/
	var image_ = new google.maps.MarkerImage(
			server+"tx/"+near.id+".jpg",
			null,
			null,
			null,
			new google.maps.Size(50,50)
		);
	var marker = new google.maps.Marker({
		position:googleCoords,
		map:map,
		icon:image_,
		clickable:true
	});
	markers.push(marker);
	google.maps.event.addListener(marker,"click",function(){
		window.location.href = "../information/information.html?nearId="+near.id;
	});
}

function addToList(near){
	$.ajax({
		type:"POST",
		url:server+"get_nickname.php",
		data:"id="+near.id,
		crossDomain:true
	}).done(
		function(data){
			var nearDiv = document.createElement("div");
			nearDiv.className = "aNear";
			nearDiv.id = near.id;
			nearDiv.onclick = function(){
				window.location.href = "../information/information.html?nearId="+near.id;
			};
			nearDiv.style.fontSize = "250%";
			var distanceDiv = document.createElement("div");
			distanceDiv.className = "nearDistance";
			distanceDiv.innerHTML=  "相距 "+near.distance;

			var nickNameDiv = document.createElement("div");
			nickNameDiv.className = "nearName";
	 		nickNameDiv.innerHTML = data;

	 		var nearTxDiv = document.createElement("div");
			 nearTxDiv.className = "nearTx";
	 		nearTxDiv.innerHTML = '<img width=100% height=100% src="'+server+'tx/'+near.id+'.jpg'+'">';

	 		nearDiv.appendChild(distanceDiv);
	 		nearDiv.appendChild(nearTxDiv);
	 		nearDiv.appendChild(nickNameDiv);

	 		var paddingDiv = document.createElement("div");
	 		paddingDiv.className = "padding";
	 		paddingDiv.style.marginBottom = "25%";
	 		$("div.padding").remove();
	 		var nearListDiv = document.getElementById("nears_list");
	 		nearListDiv.appendChild(nearDiv);
	 		nearListDiv.appendChild(paddingDiv);
	 		setListTx();


		}
	);
	//setListTx();
	
}

function distanceHandler(distance){
	if(distance>1000){
		distance = distance/1000;
		distance = Math.round(distance);
		distance = distance + " 千米";
	}
	else{
		distance = Math.round(distance);
		distance = distance + " 米";
	}
	return distance;
}

function setListTx(){
	var height = $("div.nearTx img").height();
	//$("div.nearTx").width(height);
	$("div.nearTx img").width(height);
}

function clearAll(){
	for(i=0;i<markers.length;i++)
		markers[i].setMap(null);
	markers=[];
}
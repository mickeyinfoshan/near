var fileContentJson;
var TheFile;

function messageToFile(){
	//alert(localStorage["message_to_write"]);
	window.requestFileSystem(LocalFileSystem.PERSISTENT,0,requestFileSystemSuccessHandler_,fileError);
}

function requestFileSystemSuccessHandler_(fileSystem){
	getRootDirectorySuccessHandler_(fileSystem.root);	
}

function fileError(e){
	alert(e.code + e.message);
}

function getRootDirectorySuccessHandler_(root){
	//alert(3);
	var directoryOption = {
		create:true
	};

	root.getDirectory("nearAppData",directoryOption,getDirectorySuccessHandler_,fileError);
}

function getDirectorySuccessHandler_(directory){
	//alert(4);
	var message = JSON.parse(localStorage["message_to_write"]);
	var id;
	if(message.sender==getId())
		id = message.receiver;
	else
		id = message.sender;
	var fileOption = {
		create:true
	};
	var fileName = id+".txt";
	directory.getFile(fileName,fileOption,getFileEntrySuccessHandler_,fileError);
}
function getFileEntrySuccessHandler_(fileEntry){
	TheFile = fileEntry;
	readContent_(fileEntry);
}

function readContent_(fileEntry){
	fileEntry.file(getFileSuccessHandler_,fileError);
}

function getFileSuccessHandler_(file){
	//alert(7);
	var fileReader = new FileReader();
	fileReader.onerror = function(){
		//alert("error");
	};
	fileReader.onload = function(e){
		fileContentJson = e.target.result;
		//alert(fileContentJson);
		process();
		//alert(fileContentJson);
	};

	fileReader.readAsText(file);
}

function process(){
	//alert(8);
	if(fileContentJson=="")
		fileContentJson = "[]";
	var message_array = JSON.parse(fileContentJson);
	if(!message_array.length){
		message_array = new Array();
	}
	var message = JSON.parse(localStorage["message_to_write"]);
	var messageRecord = {
		content: message.content
	};
	if(message.sender == getId()){
		messageRecord.type = 1;
	}
	else{
		messageRecord.type = 0;
	}
	message_array.push(messageRecord);
	fileContentJson = JSON.stringify(message_array);
	//alert(fileContentJson);
	writeContent_();
}


function writeContent_(){
	//alert(9);
	TheFile.createWriter(createWriterSuccessHandler_,fileError);
}

function createWriterSuccessHandler_(writer){
	//alert(10);
	writer.write(fileContentJson);
	//alert(fileContentJson);
}

/*function getChatterId(){
	var url = window.location.href;
	var pos = url.indexOf("=");
	var npos = url.indexOf("#");
	if(npos>0)
		chatterId = url.substring(pos+1,npos);
	else
		chatterId= url.substring(pos+1);
	return chatterId;
}*/
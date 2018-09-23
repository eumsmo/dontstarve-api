const http = require('http');
const url = require('url');
const fs = require('fs');
let recipes = require('./loadRecipes');


const JSONBeauty = '\t';
const port = 8000;
const mainFile = "about.html";

function endJSON(obj,res){
	res.writeHeader(200,{'Content-Type':'application/json'});
	res.end(JSON.stringify(obj,null,JSONBeauty));
}
function endNotFound(res){
	res.writeHeader(404);
	res.end();
}
function getItem(name,res){
	if(recipes.items[name]){
		let obj = recipes.items[name];
		obj.name = name;
		endJSON(obj,res);
	} else {
		endNotFound(res);
	}
}
function arrayPath(path){
	let arr = path.split('/');
	arr.shift();
	return arr;
}


const server = http.createServer(function(req,res){
	let urlObj = url.parse(req.url,true),
		pathname = urlObj.pathname,
		path = arrayPath(pathname);
		console.log(pathname);

	if(path[0]=="item"){
		if(path[1] && path[1]!="") getItem(path[1],res);
		else endJSON(recipes.items,res);
	}
	else if(path[0]=='itemlist'){
		endJSON(recipes.itemlist,res);
	}
	else if(path[0]=='resourcelist'){
		endJSON(recipes.resourcelist,res);
	} else if(path[0]==""){
		let src = fs.createReadStream(mainFile);
		src.pipe(res);
	} else {
		endNotFound(res);
	}
});
server.listen(port);

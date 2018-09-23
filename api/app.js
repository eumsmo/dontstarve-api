const http = require('http');
const url = require('url');
const fs = require('fs');
const recipes = require('./loadRecipes');
const func = require('./func');


const port = process.env.PORT|| 5000;
const mainFile = "api/about.html";
const spritesFile = "sprite.png";

function recipesGet(what,name,res){
	if(recipes[what][name])
		func.endJSON(recipes[what][name],res);
	else
		func.endNotFound(res);
}
function getItemProp(name,prop,res){
	if(!recipes.items[name]){
		func.endNotFound(res);
		return;
	}
	let item = recipes.items[name];

	if(item[prop]) func.endJSON(item[prop],res);
	else func.endNotFound(res);
}
function getImg(name,res){
	name = name.endsWith('.png')? name: name+'.png';
	if(func.images.includes(name))
		func.pipeImg('./img/'+name,res);
	else func.endNotFound(res);
}
function getList(name,res){
	switch (name){
		case 'item':
		case 'resource':
			func.endJSON(recipes[name+'list'],res);
			break;
		case 'image':
			func.endJSON(func.images,res);
			break;
		default:
			func.endNotFound(res);
			break;
	}
}

const server = http.createServer(function(req,res){
	let urlObj = url.parse(req.url,true),
		pathname = urlObj.pathname,
		path = func.arrayPath(pathname);
		console.log(pathname);

	switch (path[0]){
		// IMAGE
		case "image":
			if(path[1] && path[1]!="") {
				getImg(path[1],res);
				break;
			}
			else func.pipeImg(spritesFile,res);
			break;
		case "image.png":
			if(path[1] && path[1]!="") func.endNotFound(res);
			else func.pipeImg(spritesFile,res);
			break;
		// ITEM
		case "item":
			if(path[1] && path[1]!=""){
				if(path[2] && path[2]!="") getItemProp(path[1],path[2],res);
				else recipesGet('items',path[1],res);
			}
			else func.endJSON(recipes.items,res);
			break;
		// RESOURCE
		case "resource":
			if(path[1] && path[1]!="") recipesGet('resources',path[1],res);
			else func.endJSON(recipes.resources,res);
			break;
		// LIST
		case "list":
			getList(path[1],res);
			break;
		// ABOUT
		case "":
			func.pipeHTML(mainFile,res);
			break;
		// ERROR 404 - Not Found
		default:
			func.endNotFound(res);
	}
});
server.listen(port);

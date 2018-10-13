const fs = require('fs');
const JSONBeauty = '\t';

let images = [], head = {
  "Access-Control-Allow-Origin": '*',
  "Access-Control-Allow-Credentials": true,
  'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS'
};

function fileExist(file,call,res){
  if(fs.existsSync(file)) call();
  else endNotFound(res);
}
function endJSON(obj,res){
  head['Content-Type'] = 'application/json';
	res.writeHeader(200,head);
	res.end(JSON.stringify(obj,null,JSONBeauty));
}
function endNotFound(res){
	res.writeHeader(404);
	res.end();
}
function arrayPath(path){
	let arr = path.split('/');
	arr.shift();
	return arr;
}
function pipeFile(file,res){
  fileExist(file,()=>{
    let src = fs.createReadStream(file);
  	src.pipe(res);
  }, res);
}

function pipeImg(file,res){
  head['Content-Type'] = 'image/png';
  res.writeHeader(200,head);
  pipeFile(file,res);
}
function pipeHTML(file,res){
  head['Content-Type'] = 'text/html';
  res.writeHeader(200,head);
  pipeFile(file,res);
}
function readDir(pasta,ext,callback){
	fs.readdir(pasta,function(err, list){
		if(err) return callback(err);

		let arr=[];
		list.forEach(arquivo=>{
			if(arquivo.endsWith('.'+ext))
				arr.push(arquivo);
		});
		callback(null,arr);
	});
}

readDir('./img','png',(err,arr)=>{
  if(!err)
    images.push(...arr);
    else
      console.log(err);
});

module.exports = {
  images,
  readDir,
  endJSON,
  endNotFound,
  arrayPath,
  pipeFile,
  pipeHTML,
  pipeImg
};

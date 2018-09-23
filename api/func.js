const fs = require('fs');
const JSONBeauty = '\t';

let images = [];

function endJSON(obj,res){
	res.writeHeader(200,{'Content-Type':'application/json'});
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
	let src = fs.createReadStream(file);
	src.pipe(res);
}
function pipeImg(file,res){
  res.writeHeader(200,{'Content-Type':'image/png'});
  pipeFile(file,res);
}
function pipeHTML(file,res){
  res.writeHeader(200,{'Content-Type':'text/html'});
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
  pipeHTML,
  pipeImg
};

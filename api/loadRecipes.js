const recipesFile = "api/recipes.lua";
const fs = require('fs');

let items = {},
    resources = {},
    itemlist = [],
    resourcelist = [];

function redirect(line){
  if(line=="" || line==" "||line=="\n") return;
  if(line[0]=='-') return;
  else transformItem(line);
}
function transformItem(line){
  let item = {
    recipe: {}
  }, item_name;

  line = line.replace(/Ingredient\("(\w*)", (\w*)\)/g,(str,name,quant)=>{
    item.recipe[name]=quant;
  });

  line = line.replace(/Recipe\("(\w*)"/,(str,name)=>{
    item_name = name;
  });

  line = line.replace(/RECIPETABS.(\w*)/,(str,tab)=>{
      item.tab = tab;
  });

  line = line.replace(/TECH.(\w*)/,(str,science)=>{
      item.science = science;
  });

  items[item_name] = item;
}
function resourceItem(name,item){
  for(let resource in item.recipe){
    if(resources[resource]) resources[resource].push(name);
    else resources[resource] = [name];
  }
}

//Ler o arquivo "recipes.lua", que foi extraido das pastas do jogo
fs.readFile(recipesFile,function(err,buffer){
	let recipes = buffer.toString();
	recipes = recipes.split('\n');

  //Extrair itens de cada linha do arquivo
  recipes.forEach(redirect);

  for (let item in items){
    resourceItem(item,items[item]);
    itemlist.push(item);
  }

  for (let resource in resources)
    resourcelist.push(resource);
});

module.exports = {
  items,
  resources,
  itemlist,
  resourcelist
};

/*
function ler_pasta(pasta,ext,callback){
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
*/

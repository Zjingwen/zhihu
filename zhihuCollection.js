'use strict';

var zhihu = require("./zhihuapi/api.js").zhihu;
var fs = require("fs");

var readline = require('readline');

/**
 * [rl 命令行输入框]
 */
var  rl = readline.createInterface({
    input:process.stdin,
    output:process.stdout
});

rl.question("知乎收藏id是多少？",function(answer){
    console.log("收藏ID是"+answer);
    console.log("正在开始，不要慌张！！！！");
	GetCollectionList(answer);
	//test id 42474270
    rl.close();
});

/**
 * 获取当前页数，并且调取保存
 * @param {int} id 当前专题id
 */
function GetCollectionList(id){
	zhihu.GetCollectionPages(id).then(function(pages){
		if(!pages) return false;
		console.log("当前专题共计："+pages.last+'页');
		GetCollection(id,pages.first,pages.last);
	});
}

/**
 * 读取知乎收藏夹
 * @param  {string} id   收藏的id
 * @param  {string} page 当前页码
 */
function GetCollection(id,pagefirst,pagelast){
	var page = pagefirst;
	zhihu.GetCollection(id,page).then(function(value){
		console.log("----- 第"+page+"页已获取 -----");
		return value;
	}).then(function(value){
		value.forEach(function(value){
			var item = {
				title:value.title,
				content:value.body,
				name:value.name
			};
			io(item.title,item.content,item.name);
		})
		setTimeout(function() {
			if(page < pagelast){
				++page;
				GetCollection(id,page,pagelast);	
			};
		},500);
	});
}

/**
 * 保存文件
 * @param  {string} title   文件名
 * @param  {string} content 文件内容
 */
function io(title,content,name){
	fs.open('zhihu/'+title+name+'.md','w',function(err,data){
		if(err){
			console.log("文件创建失败");
			return false;
		}
	})
	fs.writeFile('zhihu/'+title+name+'.md',content,function(err,data){
		if(err){
			console.log("文件写入失败");
			return console.error(err);
		}
		console.log(title+".md"+"-----文件写入成功");
	})
}

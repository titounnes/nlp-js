
var html2json = {};

html2json.readFile = function(path, callback){
    var fs = require('fs');
    this.data = '';
    fs.readFile(__dirname+path, function(err, data){
        if(err){
            throw err;
        }
        html2json.data = data.toString();
        var tmpFunc = new Function(callback + '()');
        tmpFunc();
    })
}

html2json.readFile('/data/test.html', 'dataHtml');

dataHtml = function(){
    var pTag =  html2json.data.match(/\<p(.*?)\>.*?\<\/p\>/ig);
    var pOut = [];
    pTag.forEach(function(v, i){
        pOut[i] = {};
        var pInd = {};
        var pAttr = v.match(/\<p style=(")(.*?)(")\>/);
        if(pAttr != null){
            var pSt = pAttr[0].match(/.*?(text-align)(:)(justify|left|right).*?/)
            if(pSt != null){
                pInd.align = pSt[3];
            }else{
                pInd.align = 'left';
            }
            pInd.margin = {};
            var pSt = pAttr[0].match(/.*?(margin-left)(:)(\d)px.*?/);
            
            if(pSt != null){
                pInd.margin['left'] = pSt[3]+'px';
            }else{
                pInd.margin.left = {};
            }
            //pInd.margin = margin;
        }else{
            //pInd.align = 'left';
            /*var margin = {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
            }
            pInd.margin = margin;*/
        }
        pOut[i].style = pInd; 
        //console.log(pSt)
        //console.log(i)
        //console.log(pAttr)
        //console.log(i);
        //console.log(v)
    })
    console.log(pOut)
    //console.log(pTag.length)
}



//html2json.dataHTml = function(response){
    //console.log(response.toString())
//}
//console.log(html2json.dataHtml);

//html2json.data = require('./data/test.html');
//console.log(html2json.data)
return 1;
fs.readFile( __dirname + '/data/test.html', function (err, data) {
  if (err) {
    throw err; 
  }
  html2json.data = data;
});
fs.readFile( __dirname + '/data/test.html', function (err, data) {
    if (err) {
      throw err; 
    }
    html2json.data = data;
  });
  
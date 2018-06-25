var nlp = {};
nlp.text = 'Pada bagian ini mahasiswa diminta untuk memaparkan latar belakang mengapa media yang akan dirancang sangat diperlukan dalam mengatasi masalah dalam pembelajaran kimia di sekolah. Tunjukkan bahwa permasalahan pembelajaran tersebut bisa diselesaikan dengan pengembangan media yang relevan. Hal ini ditunjukkan dengan data yang difapatkan serta merujuk dari hasil-hasil penelitian yang telah dipublikasikan dan teori-teori yang relevan (dinyatakan sebagai sitasi dalam style Harvard Anglia). Latar belakang masalah ditulis dalam 3-4 paragraf secara mengerucut. Untuk menguatkan pernyataan dapat disertakan gambar atau tabel yang mendukung. Cara menampilkan gambar mengikuti panduan seperti contoh  Gambar 1. ' +
  'Pada baian ini mahasiswa menjelaskan masalah yang ingin dipecahkan berdasarkan hasil identifikasi, yang didasarkan pada kapasitas dan kompetensi dari mahasiswa terkait masalah tersebut. Jika terdapat beberapa masalah yang memungkinkan untuk diselesaikan maka urgensi menjadi faktor penentu. Permasalahan dinyatakan dalam kalimat tanya. Jika masalah yang ingin diselesaikan lebih dari satu maka dinyatakan sebagai numbering.  Bagian ini ditulis dalam 1-2 paragraf.  C. Permasalahan. Pada baian ini mahasiswa menjelaskan masalah yang ingin dipecahkan berdasarkan hasil identifikasi, yang didasarkan pada kapasitas dan kompetensi dari mahasiswa terkait masalah tersebut. Jika terdapat beberapa masalah yang memungkinkan untuk diselesaikan maka urgensi menjadi faktor penentu. Permasalahan dinyatakan dalam kalimat tanya. Jika masalah yang ingin diselesaikan lebih dari satu maka dinyatakan sebagai numbering.  Bagian ini ditulis dalam 1-2 paragraf  (style normal).' +
  'Pada bagian ini mahasiswa diminta untuk menjelaskan tujuan dari penelitian. Tujuan penelitian haruslah merupakan jawaban sementara atas masalah yang ingin dipecahkan sehingga butr-butir tujuan harus sama banyaknya dengan butir-butir masalah. Ditulis dalam 1 paragraf.' +
  'Pada bagian ini mahasiswa menjelaskan manfaat yang bisa didapatkan jika tujuan dari penelitian tercapai. Manfaat yang disampaikan harus relevan dengan tujuan penelitian. Manfaat penelitian merupakan akibat yang timbul dari tercapainya tujuan penelitian (outcome). Bagian ini ditulis dalam 1 paragraf (style normal).';

nlp.fastLevenshtein = function(s1, s2) {
  //if(typeof s1 != 'string' || typeof s2!= 'string') return 'Kedua argumen harus beerupa string';
  //if(s1.length + s2.length >20) return 'Kata yang anda masukkan terlalu panjang';
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  if (!s1.length || s1.indexOf(s2) >= 0) return s2.length;
  if (!s2.length || s2.indexOf(s1) >= 0) return s1.length;

  var s1l = s1.length;
  var s2l = s2.length;

  var curCol, nextCol, i, j, tmp, prevRow = [],
    str2char = [];

  // initialise previous row
  for (i = 0; i < s2l; ++i) {
    prevRow.push(i);
    str2char.push(s2[i]);
  }
  prevRow[s2l] = s2l;
  for (i = 0; i < s1l; ++i) {
    nextCol = i + 1;

    for (j = 0; j < s2l; ++j) {
      curCol = nextCol;

      var comp = true;
      if(str2char[j]){
        comp = s1[i] === str2char[j];
      }

      // substution
      nextCol = prevRow[j] + (comp ? 0 : 1);

      // insertion
      tmp = curCol + 1;
      if (nextCol > tmp) {
        nextCol = tmp;
      }
      // deletion
      tmp = prevRow[j + 1] + 1;
      if (nextCol > tmp) {
        nextCol = tmp;
      }

      // copy current col value into previous (in preparation for next iteration)
      prevRow[j] = curCol;
    }

    // copy last col value into previous (in preparation for next iteration)
    prevRow[j] = nextCol;

  }
  return nextCol;
}

nlp.suggest = function(word) {
  if(nlp.words.indexOf(word)>=0){
    return word;
  }
  var dicLen = nlp.words.length;
  var scoreMin = word.length;
  var wordCan = [];
  for(i=0; i < dicLen; i++){
    var distance = nlp.fastLevenshtein(word, nlp.words[i]);
    if(distance < scoreMin){
      scoreMin = distance;
      wordCan = [];
      wordCan.push(nlp.words[i])
    }else if(distance == scoreMin){
      wordCan.push(nlp.words[i])
    }
  }
  return wordCan.join(', ');
}

nlp.cosinus = function(s1, s2) {
  var output = 0, arr = [], arrLen;
  if(typeof s1 == 'undefined'){
    return 0;
  }
  if(s1 == ''){
    return 0;
  }
  console.log(s1)
  s1 = s1.toLowerCase().replace(/[^a-z0-9 ]/, '');
  s2 = s2.toLowerCase().replace(/[^a-z0-9 ]/, '');
  arr = s1.split(' ');
  arrLen = arr.length;
  for(i=0; i < 10; i++){
    /*if (s2.indexOf(arr[i].toLowerCase()) > -1 && nlp.stopWords.indexOf(arr[i].toLowerCase()) < 0) {
      output++;
    }*/
  }
  return 1;
  return output / Math.sqrt(s1.split(' ').length * s2.split(' ').length);
}

nlp.summary = function(text, number) {
  text = text.replace(/[.?!]/gi, '|');
  var sentences = text.split('|');
  text = '';
  var stc = {};
  var stLen = 0;
  for(i=0; i< sentences.length; i++){
    if(sentences[i] != '')
    {
      if(sentences[i].split(' ').length > 3)
      { 
        stc[stLen] = sentences[i];
        stLen ++;
      }
    }
  }
  sentences = '';
  
  var score = [];
  var scoreRank = [];
  for(i=0; i < stLen; i++){
    var s = 0;
    for(j=0; j < stLen; j++){
      if(j != i){
        //console.log(i+'-'+j)

        s += nlp.cosinus(stc[i], stc[j])
        //console.log(nlp.cosinus(sentences[i], sentences[j]));
        //s += 1;
      }
    }
  
    //console.log(i+' '+s)
    score.push(s)
    //if(sentences[i].split(' ').length > 3){
      //for(j=0;j < stLen; j++){
        //if(j != i){
          //console.log(sentences[i])
          //console.log(sentences[j])
          //console.log(i+'-'+j)
          //console.log(nlp.cosinus(sentences[i], sentences[j]))
          //s+= nlp.cosinus(sentences[i], sentences[j]);
        //}
      //}
      //score.push(s);
      //scoreRank.push(s)
      //console.log(i)
    //}
  }
  //console.log(score)
    
/*  $.each(sentences, function(i, v) {
    if (v.split(' ').length > 3) {
      var s = 0;
      for (j = 0; j < sentences.length; j++) {
        if (j != i) {
          s += nlp.cosinus(v, sentences[j]);
        }
      }
      score.push(s);
      scoreRank.push(s)
    }
  })*/
  //var result = '';
  //var candidate = scoreRank.sort().reverse().splice(0, !number ? 3 : number);
  /*$.each(score, function(i, v) {
    if (candidate.indexOf(v) > -1) {
      result += sentences[i] + '. ';
    }
  })*/
  //console.log(scoreRank);
  //return result;
}

nlp.inDict = function(txt, oriTxt){
  if(txt==false){
    return false;
  }
  if(nlp.words.indexOf(txt) > -1){
    var w = {};
    w.o = oriTxt;
    w.s = txt; 
    nlp.stemmed.push(w);
    return true;
  }
  return false;
}

nlp.passStem = function(word, patt){
  var basic = false;
  var oriTxt = word;
  word = nlp.match(word, patt[0]);
  if(word){
    basic = nlp.inDict(word, oriTxt);
    if(! basic && typeof patt[1] == 'object'){
      word = nlp.match(word, patt[1]);
      if(word){
        basic = nlp.inDict(word, oriTxt);
        if(! basic && typeof patt[2] == 'object'){
          word = nlp.match(word, patt[2]);
          if(word){
            basic = nlp.inDict(word, oriTxt);
            /*if(! basic && typeof patt[3] == 'object'){
              word = nlp.match(word, patt[3]);
            }*/
          }
        }
      }
    }
  }
  return basic;
}
nlp.match = function(txt, pattern){ 
  var p = '^';
  //memeeriksa awalan
  if(typeof pattern[0] == 'string'){
    p += '('+pattern[0]+')';
  }
  //memeriksa sisipan
  if(typeof pattern[1] == 'string'){
    p += '.*?('+pattern[1]+')';
  }
  //memeriksa akhiran
  if(typeof pattern[2] == 'string'){
    p += '.*?('+pattern[2]+')';
  }
  p += '$';
  //mencari pola
  var arr = txt.match(new RegExp(p));
  if(arr != null){
    //menghapus sisipan
    txt = txt.substr(0, txt.indexOf(arr[2]))+txt.substr(txt.indexOf(arr[2])+arr[2].length, txt.length-txt.indexOf(arr[2])-arr[2].length);
    //menghapus akhiran
    txt = txt.substr(0, txt.length-arr[3].length);

    var repl = "";
    if(typeof pattern[3] == 'string'){
      var replacement = pattern[3].split('|');
      var need = pattern[0].split('|');
      if(typeof replacement[need.indexOf(arr[1])] != 'undefined'){
        repl = replacement[need.indexOf(arr[1])];
      }
    }
    //menghapus awalan
    txt = repl + txt.substr(arr[1].length, txt.length-arr[1].length);
        
    return txt;
  }
  return false;
}

nlp.stem = function(str) {
  var basic;
  
  str.toLowerCase().replace(/\s\s+/g, ' ').split(' ').forEach(function(word, key){
    basic = nlp.inDict(word, word);
    if(! basic){
      nlp.patterns.forEach(function(pattern, i){
        basic = nlp.passStem(word, pattern);
      })
      if(! basic){
        if(typeof nlp.stemmed[key] == 'undefined' && word != ''){
          var out = {};
          out.o = word;
          out.s = "*"+word+"*";
          nlp.stemmed.push(out);
        }
      }
    }
  })
  return nlp.stemmed;
}

nlp.words = require('./words.js');
nlp.stemmed = [];
nlp.stopWords = require('./stopWords.js');
nlp.patterns = require('./pattern.js');
var s = 'mempertemukan memperbarui makron menyelisihi mengelabui memakan mengesampingkan  diperbarui mempekerjakan dalam pencarian pertemuan bersamaan hatikupun yang sulit bagaimanapun juga itu adalah pencarian yang sulit';
console.log('kalimat asli')
console.log(s);
console.log('hasil stemming')
nlp.stem(s).forEach(function(v){
  console.log(v.o+' => '+ v.s);
})
console.log('Mencari indek kmiripan');
var t = 'ketika itu juga pencarian menjadi sulit';
var u = 'pencarian jati diri juga sangat penting';
console.log('antara ['+t+'] dengan ['+u+']')
console.log(nlp.cosinus(t, u))
var t = 'saiya';
console.log('Saran koreksi kata ['+t+']')
console.log('Saran kata untuk '+t+' adalah '+nlp.suggest(t))

var nlp = {};
nlp.text = 'Pada bagian ini mahasiswa diminta untuk memaparkan latar belakang mengapa media yang akan dirancang sangat diperlukan dalam mengatasi masalah dalam pembelajaran kimia di sekolah. Tunjukkan bahwa permasalahan pembelajaran tersebut bisa diselesaikan dengan pengembangan media yang relevan. Hal ini ditunjukkan dengan data yang difapatkan serta merujuk dari hasil-hasil penelitian yang telah dipublikasikan dan teori-teori yang relevan (dinyatakan sebagai sitasi dalam style Harvard Anglia). Latar belakang masalah ditulis dalam 3-4 paragraf secara mengerucut. Untuk menguatkan pernyataan dapat disertakan gambar atau tabel yang mendukung. Cara menampilkan gambar mengikuti panduan seperti contoh  Gambar 1. ' +
  'Pada baian ini mahasiswa menjelaskan masalah yang ingin dipecahkan berdasarkan hasil identifikasi, yang didasarkan pada kapasitas dan kompetensi dari mahasiswa terkait masalah tersebut. Jika terdapat beberapa masalah yang memungkinkan untuk diselesaikan maka urgensi menjadi faktor penentu. Permasalahan dinyatakan dalam kalimat tanya. Jika masalah yang ingin diselesaikan lebih dari satu maka dinyatakan sebagai numbering.  Bagian ini ditulis dalam 1-2 paragraf.  C. Permasalahan. Pada baian ini mahasiswa menjelaskan masalah yang ingin dipecahkan berdasarkan hasil identifikasi, yang didasarkan pada kapasitas dan kompetensi dari mahasiswa terkait masalah tersebut. Jika terdapat beberapa masalah yang memungkinkan untuk diselesaikan maka urgensi menjadi faktor penentu. Permasalahan dinyatakan dalam kalimat tanya. Jika masalah yang ingin diselesaikan lebih dari satu maka dinyatakan sebagai numbering.  Bagian ini ditulis dalam 1-2 paragraf  (style normal).' +
  'Pada bagian ini mahasiswa diminta untuk menjelaskan tujuan dari penelitian. Tujuan penelitian haruslah merupakan jawaban sementara atas masalah yang ingin dipecahkan sehingga butr-butir tujuan harus sama banyaknya dengan butir-butir masalah. Ditulis dalam 1 paragraf.' +
  'Pada bagian ini mahasiswa menjelaskan manfaat yang bisa didapatkan jika tujuan dari penelitian tercapai. Manfaat yang disampaikan harus relevan dengan tujuan penelitian. Manfaat penelitian merupakan akibat yang timbul dari tercapainya tujuan penelitian (outcome). Bagian ini ditulis dalam 1 paragraf (style normal).';

nlp.levenshtein = function(s1, s2) {
  if (typeof s1 != 'string' || typeof s2 != 'string') return 'Kedua argumen harus beerupa string';
  if (s1.length + s2.length > 30) return 'Kata yang anda masukkan terlalu panjang';
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  if (!s1.length || s1.indexOf(s2) >= 0) return s2.length;
  if (!s2.length || s2.indexOf(s1) >= 0) return s1.length;

  return Math.min(
    nlp.levenshtein(s1.substr(1), s2) + 1,
    nlp.levenshtein(s2.substr(1), s1) + 1,
    nlp.levenshtein(s1.substr(1), s2.substr(1)) + (s1[0] !== s2[0] ? 1 : 0)
  );
}

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

nlp.cosinus = function(s1, s2) {
  var stopword = ['di', 'ke', 'yang', 'pada', 'oleh'];
  var output = 0;
  s1 = s1.toLowerCase().replace(/[^a-z0-9 ]/, '');
  s2 = s2.toLowerCase().replace(/[^a-z0-9 ]/, '');
  $.each(s1.split(' '), function(i, v) {
    if (s2.indexOf(v.toLowerCase()) > -1 && stopword.indexOf(v.toLowerCase()) < 0) {
      output++;
    }
  })
  return output / Math.sqrt(s1.split(' ').length * s2.split(' ').length);
}

nlp.suggest = function(word, reference) {
  var score = word.length;
  var result;
  $.each(reference, function(i, v) {
    var check = nlp.levenshtein(word, v);
    if (check < score) {
      score = check;
      result = v.toLowerCase();
    }
  })
  return result;
}

nlp.summary = function(text, number) {
  text = text.replace(/[.?!]/gi, '|');
  var sentences = text.split('|');
  var score = [];
  var scoreRank = [];
  $.each(sentences, function(i, v) {
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
  })
  var result = '';
  var candidate = scoreRank.sort().reverse().splice(0, !number ? 3 : number);
  $.each(score, function(i, v) {
    if (candidate.indexOf(v) > -1) {
      result += sentences[i] + '. ';
    }
  })
  return result;
}

nlp.include = function(file, callback, obj){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', file);
  xhr.onload = function() {
    if (xhr.status === 200) {
        console.log('User\'s name is ' + xhr.responseText);
    }
    else {
        console.log('Request failed.  Returned status of ' + xhr.status);
    }
  };
  xhr.send();
  /*nlp.script = this.createElement('script');
  nlp.script.src = file;
  scriptTag.onload = implementationCode;
  scriptTag.onreadystatechange = implementationCode;
  this.appendChild(scriptTag);*/
}

nlp.inDict = function(t, out){
  if(t==false){
    return false;
  }
  if(nlp.word.indexOf(t) > -1){
    out.push(t);
    return true;
  }
  return false;
}

nlp.match = function(txt, pattern, st){
  var arr = txt.match(pattern);
  if(arr == null){
    return false;
  }
  if(st==2){
    return txt.substr(arr[1].length, txt.length - arr[1].length - arr[2].length);
  }
  if(st == 1){
    return txt.substr(0, txt.length - arr[1].length);
  }
  return txt.substr(arr[1].length, txt.length - arr[1].length);
}

nlp.test = function() {
  var s1 = 'mempertemukan memperbarui memakan mengesampingkan  diperbarui mempekerjakan dalam pencarian pertemuan bersamaan sipunten hatikupun yang sulit bagaimanapun juga itu adalah pencarian yang sulit';
  var start = new Date().getTime();
  var w = s1.split(' ');
  var s2 = [];
  var basic;
  for(i=0; i<w.length; i++){
    //mencari dalam kamus, jika ketemu termasuk dalam kata dasar
    if(! nlp.inDict(w[i], s2)){
      //menghilangkan akhiran pun, kah, lah, ku, mu dan nya
      basic = nlp.match(w[i], /^.*?(pun|kah|lah|ku|mu|nya)$/, 1);
      if(basic){
        if(! nlp.inDict(basic, s2)){
          nlp.inDict(nlp.match(basic, /^.*?(ku|mu|nya)$/, 1), s2);
        }
      }
      basic = nlp.match(w[i], /^(ber).*?$/, 0);
      if(basic){
        if(! nlp.inDict(basic, s2)){
          nlp.inDict(nlp.match(basic, /^.*?(an)$/, 1), s2);
        }
      }
      nlp.inDict(nlp.match(w[i], /^(per|ke).*?(an)$/,2), s2);
      nlp.inDict(nlp.match(w[i], /^(memper|mempe|diper|menge).*?(kan|i)$/,2), s2);
      nlp.inDict(nlp.match(w[i], /^(me|di).*?(kan|i)$/,2), s2);
      t= nlp.inDict(nlp.match(w[i], /^(me|di).*?$/,0), s2);
      console.log(t)
    }
  }
  console.log(s2);
  //console.log(pat1.test('bagaimanapun'))
  //console.log(words);
  //console.log('output: '+nlp.fastLevenshtein(s1,s2))
  //console.log('Execution time: '+(new Date().getTime() - start));
}

nlp.word = require('./words.js');
//nlp.include('words.js', 'nlp.test', nlp);
nlp.test();

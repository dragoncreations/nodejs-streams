/*
 * Przykłąd zapisu danych tekstowych do pliku
 */

var fs = require('fs');
var FILE = 'myfile3.txt';
var DATA = 'Ala ma kota\n';
var res;

var writeStream = fs.createWriteStream(FILE);

res = writeStream.write(DATA, 'utf8', function () {
    console.log('Callback');
});

console.log('Wszystko zapisane?: %s', res);
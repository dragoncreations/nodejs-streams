/*
 * Przykład zapisu danych podczas wystąpienia zdarzenia drain - modyfikacja
 */

var fs = require('fs');
var FILE = 'myfile3.txt';
var res;
var writeStream = fs.createWriteStream(FILE);

// Generujemy trochę danych do zapisu
var DATA = [];
var chunk;
var count = 100;

while (count--) {
    chunk = new Array(100000);
    chunk = chunk.join('Ala ma kota\n');
    chunk = chunk.toString();
    DATA.push(chunk);
}

writeStream.on('drain', function () {
    var data = DATA.pop();
    if (data) {
        writeStream.write(data, 'utf8');
    } else {
        writeStream.end('Koniec zapisu', 'utf8');
    }
});

writeStream.on('finish', function () {
    console.log('Koniec ...');
});

writeStream.write(DATA.pop(), 'utf8');
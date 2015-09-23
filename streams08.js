/*
 * Przykład zapisu danych podczas wystąpienia zdarzenia drain
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
    // Za każdym kolejnym zdarzeniem bierzemy
    // z tablicy kolejny element i zapisujemy
    // go do strumienia, aż do momentu całkowitego
    // opróżnienia tablicy.
    var data = DATA.pop();
    if (data) {
        writeStream.write(data, 'utf8');
    }
    console.log('Strumień zapisał dane');
});

// Zapisujemy dane po raz pierwszy.
// Pozostałe dane przeznaczone do zapisu zostaną
// zapisane dopiero po wystąpieniu
// zdarzenia drain
writeStream.write(DATA.pop(), 'utf8');
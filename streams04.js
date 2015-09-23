/*
 * Przykład zmiany postaci odczytywanych danych
 */

var fs = require('fs');

// Zawartość pliku:
// "Ala ma kota"
var FILE = 'myfile2.txt';

var readStream1 = fs.createReadStream(FILE);
var readStream2 = fs.createReadStream(FILE);
var readStream3 = fs.createReadStream(FILE);

readStream2.setEncoding('hex');
readStream3.setEncoding('utf8');

readStream1.on('readable', function () {
    // Wyświetli:
    // <Buffer 41 6c 61 20 6d 61 20 6b 6f 74 61>
    console.log(readStream1.read());
});

readStream2.on('readable', function () {
    // Wyświetli:
    // "416c61206d61206b6f7461"
    console.log(readStream2.read());
});

readStream3.on('readable', function () {
    // Wyświetli:
    // "Ala ma kota"
    console.log(readStream3.read());
});
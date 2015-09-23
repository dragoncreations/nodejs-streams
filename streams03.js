/*
 * Przykład odczytu danych poza zdarzeniem readable.
 * W tym przypadku jest to funkcja setTimeout, która odczyta całą
 * zawartość strumienia, która zdążyła się zbuforować od czasu
 * zainicjowania funckcji setTimeout.
 */

var fs = require('fs');
var FILE = 'myfile.txt';

var readStream = fs.createReadStream(FILE, {
    encoding: 'utf8'
});

readStream.on('readable', function () {

});

setTimeout(function () {
    console.log(readStream.read());
}, 3000);
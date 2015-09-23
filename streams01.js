/*
 * Odczytywanie zawartości pliku za pomocą strumienia
 */

var fs = require('fs');
var FILE = 'myfile.txt';

var readStream = fs.createReadStream(FILE, {
    encoding: 'utf8'
});

readStream.on('readable', function(){
    // Wyświetli zawartość pliku:
    console.log(readStream.read());
    
    // Wyświetli kolejne dane
    // jeżeli są dostępne,
    // w przeciwnym razie
    // wyświetli null:
    console.log(readStream.read());
});
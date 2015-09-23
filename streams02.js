/*
 * Tym razem odczytujemy dane ze strumienia po jednym znaku naraz.
 */

var fs = require('fs');
var FILE = 'myfile.txt';

var readStream = fs.createReadStream(FILE, {
    encoding: 'utf8'
});

readStream.on('readable', function(){
    var data;
    do{
        data = readStream.read(1);
        console.log(data);
    } while (data);
});
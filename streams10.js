// Klasa bazowa, po której będziemy dziedziczyć.
var Readable = require('stream').Readable;
var util = require('util');

// Rozszerzamy naszą klasę
// o interfejs stream.Readable
util.inherits(RandomString, Readable);

// Konstruktor
function RandomString(options) {
    // Wprowadzamy domyślną opcję
    // tak aby dane były ciągiem znaków.
    if (typeof options.encoding === 'undefined') {
        options.encoding = 'utf8';
    }

    // Wywołujemy konstruktor klasy bazowej
    Readable.call(this, options);
}

// Implementujemy metodę _read, zostanie ona
// wywołana za każdym razem , gdy nastąpi
// próba odczytu ze strumienia
RandomString.prototype._read = function () {
    // Generujemy nasz losowy ciąg znaków
    var s = Math.random();
    s = s.toString(36);
    s = s.substring(2);

    // Następnie dodajemy go do wewnętrznego
    // bufora
    this.push(s, 'utf8');
};

// Tworzymy instancję naszego strumienia.
// Możemy też zmienić kodowanie znaków dla
// naszej instancji.
var rStr = new RandomString({
    encoding: 'hex'
});

rStr.on('data', function (data) {
    console.log(data);
});
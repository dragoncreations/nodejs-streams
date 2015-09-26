var Writable = require('stream').Writable;
var util = require('util');

util.inherits(MemoryStore, Writable);

function MemoryStore(options) {
    // Jeżeli nie podano żadnego argumentu ...
    options = options || {};

    // Wymuszamy, by dane jakie do nas dojdą
    // w metodzie _write, zawsze były buforem
    // (nawet jeśli podczas użycia faktycznie
    // zostanie podany ciąg znaków to zostanie
    // on skonwertowany na bufor.)
    // Gdyby poniższa wartość była podana jako
    // false, dostalibyśmy do zapisu ciąg znaków.
    options.decodeStrings = true;

    // Wywołujemy konstruktor stream.Writable
    // w konstruktorze naszej klasy
    Writable.call(this, options);

    // Pierwszym argumentem w konstruktorze
    // Buffer, zawsze musi być dana typu
    // number, array badź string. Dlatego też
    // new Buffer lub new Buffer() rzuci błędem.
    this._data = new Buffer('');
}

function _write(chunk, encoding, callback) {
    // Alternatywnie do options.decodeStrings
    // możemy też bezpośrednio w _write
    // zamienić dane na bufor, jeżeli nim nie są.
    if (!Buffer.isBuffer(chunk)) {
        chunk = new Buffer(chunk, encoding);
    }

    // By zasymulować w celach edukacyjnych
    // opóźnienie z jakim możemy mieć styczność
    // w przypadku np. strumieni sieciowych
    // użyjemy funkcji setTimeout by opóźnić zapis
    // do pamięci.
    var self = this;
    setTimeout(function () {
        // By połączyć dwa bufory ze sobą musimy
        // skorzystać z funkcji Buffer.concat, która
        // jako argument przyjmuje tablicę buforów
        // jakie ma ze sobą złączyć. Funkcja ta
        // zwraca nowy bufor zawierający dane
        // obu buforów.
        self._data = Buffer.concat([
            self._data,
            chunk
        ]);

        // Callback zostanie wywołany dopiero po
        // zakończeniu powyższej operacji.
        callback();
    }, 200);

}

MemoryStore.prototype._write = _write;

// Dla testu nadpiszmy domyślny 16KiB limit wewnętrznego bufora.
// Dzięki temu szybciej dojdzie do wystąpienia zdarzenia drain na
// strumieniu.
var ms = new MemoryStore({
    highWaterMark: 10
});

// Zdarzenie informujące nas, że wewnętrzny bufoer
// został już opróżniony (dane zostały
// przeniesione z bufora do miejsca docelowego,
// w tym wypadku ms._data
ms.on('drain', function () {
    console.log('Stream ready for write ...');
});

// Zdarzenie wystąpi po wywołaniu ms.end()
// czyli zamknięciu strumienia
ms.on('finish', function () {
    console.log('-------------------');
    console.log('Stream closed.');
    console.log('Saved data:');
    console.log(ms._data.toString());
    console.log('-------------------');
});

// Zapisujemy dane do strumienia 5 razy,
// gdzie za każdym razem zapisujemy ciąg 10 znaków
// będących cyframi od 0 do 5.
var n = 0;
var maxCount = 5;

!function writeFn(){
    console.log('Writing data ...');
    ms.write(new  Array(11).join(n), function(){
        console.log('Data written (%s)\n', n+1);
        n++;
        if(n === maxCount){
            ms.end('The End.');
        } else {
            writeFn();
        }
    });
}();

// Na końcu naszego skryptu wywołamy jeszcze raz zapis danych do
// strumienia. Da to nam pewien pogląd dlaczego wywołanie
// kolejnego zapisu do strumienia bez czekania na callback jest
// złym pomysłem. Skutkiem może być zapisanie danych do miejsca
// docelowego w innej kolejności niż zamierzaliśmy.
console.log('Writing data ...');
ms.write(new  Array(101).join('?'));
// Timeout, który wykorzystamy podczas
// ostatniego testu. Wartość podana
// jako argument w konsoli podczas
// uruchomienia skryptu.
var timeout = parseInt(process.argv[2]) || 0;
var Readable = require('stream').Readable;
var util = require('util');

util.inherits(Count, Readable);

// Biblioteka do obsługi zdarzeń,
// to z niej będzie korzystał nasz generator
// by emitować zdarzenie o wygenerowaniu
// losowych danych.
var EventEmitter = require('events').EventEmitter;

// Rozszerzamy nasz generator o obsługę zdarzeń
util.inherits(Generator, EventEmitter);

// Wyposażamy nasz generator w metodę
// rozpoczęcia generowania danych w interwałach
// oraz w metodę zatrzymania całego procesu.
function Generator() {
    this.is_running = false;
    this._id = null;
}

Generator.prototype.generate = function () {
    var chrt = '0';
    var rand = Math.round(Math.random() * 50);
    var data = new Array(1 + rand).join(chrt);
    return data;
};

Generator.prototype.start = function () {
    var self = this;
    // Na wszelki wypadek, gdybyśmy wywołali metodę
    // start w trakcie trwania timeoutu.
    this.stop();
    this.is_running = true;
    // Poniższa konstrukcja jest o tyle przydatna, iż
    // daje nam pewność, że dane zostaną wygenerowane
    // nim kolejny timeout zostanie
    // zainicjalizowany. Oznacza to, że proces
    // generowania danych będzie wydajniejszy i nie
    // uświadczymy żadnych "zwiech" związanych
    // z faktem, iż pojedynczy skrypt działa na
    // jednym wątku
    (function run() {
        self._id = setTimeout(function () {
            if (self.is_running) {
                self.emit('data', self.generate());
                run();
            }
        }, 10);
    })();
};

Generator.prototype.stop = function () {
    this.is_running = false;
    clearTimeout(this._id);
};

function Count(options) {
    var self = this;

    this.readCount = 0;
    this.timestamps = [];
    this.timestamps[0] = Date.now();
    this.timestamps[1] = Date.now();
    this.generator = new Generator;

    Readable.call(this, options);

    // Nasłuchujemy na zdarzeniu generatora i
    // wpychamy dane do bufora. Jeżeli dostaniemy w
    // odpowiedzi informację o tym, że bufor
    // przekroczył swój limit to powinniśmy przerwać
    // odczyt danych, aż do momentu gdy bufor zejdzie
    // z ilością danych poniżej ustawionego limitu.
    this.generator.on('data', function (data) {
        if (!self.push(data)) {
            self.generator.stop();
        }
    });
}

// Tym razem funkcja _read nie będzie
// odpowiadać za dostarczanie danych,
// jej zadaniem będzie jedynie dostarczanie
// nam informacji na temat użycia strumienia.
Count.prototype._read = function () {
    this.readCount++;
    this.timestamps[0] = this.timestamps[1];
    this.timestamps[1] = Date.now();

    if (!this.generator.is_running) {
        this.generator.start();
    }
};

// Funkcja check wydrukuje w konsoli informacje
// na temat użycia strumienia.
var checkCount = 1;
function check() {
    var data = test.read();
    console.log(
            'N: %d, length: %d, reads: %d, time: %d ms',
            checkCount,
            data ? data.length : null,
            test.readCount,
            test.timestamps[1] - test.timestamps[0]
            );

    checkCount++;
}

// Ustawiamy limit naszego
// wewnętrznego bufora na
// 100 bajtów.
var test = new Count({
    highWaterMark: 100
});

// Wywołamy 5 razy funkcję, która prezentuje
// informacje na temat ilości wygenerowanych
// danych w strumieniu, liczby wywołań metod oraz
// odstępach czasowych ich wywołań.
setInterval(function () {
    check();
}, timeout);
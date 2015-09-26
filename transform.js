var Readable = require('stream').Readable;
var util = require('util');
var fs = require('fs');
var zlib = require('zlib');

util.inherits(Numbers, Readable);

// Nasz strumień będzie generatorem zdefiniowanej
// liczby, która będzie dostępna do odczytu
// co N czasu. Na możliwą ilość wygenerowanych
// liczb ustawimy limit, po którego osiągnięciu
// strumień zakończy nadawanie i wyemituje
// zdarzenie end.
function Numbers(options) {
    Readable.call(this, options);
    this.number = options.number || 0;
    this.interval = options.interval || 100;
    this.limit = options.limit || 1;
    this._count = 0;
    this._running = false;
    this._alive = true;
}

Numbers.prototype.start = function () {
    var self = this;
    self._running = true;

    clearTimeout(self._tid);

    !function run() {
        self._tid = setTimeout(function () {
            if (self._running) {
                // Pamiętajmy, że jeżeli metoda push zwróci
                // false, powinniśmy nie wpychać więcej
                // danych do wewnętrznego bufora, gdyż
                // właśnie został on przepełniony.
                if (!self.push(self.number.toString())) {
                    self.stop();
                } else {
                    self._count++;

                    if (self._count < self.limit) {
                        // Wywołujemy całą procedurę na nowo,
                        // aż do momentu osiągnięcia limitu.
                        run();
                    } else {
                        // Zatrzymujemy całkowicie
                        // generowanie danych
                        self.kill();

                        // Zamykamy strumień
                        self.push(null);
                    }
                }
            }
        }, this.interval);
    }();
};

Numbers.prototype.kill = function () {
    this._running = false;
    this._alive = false;
};

Numbers.prototype.stop = function () {
    this._running = false;
};

Numbers.prototype._read = function () {
    if (this._alive) {
        this.start();
    }
};

// W pierwszym przykładzie będziemy zapisywali
// do jednego pliku dane z dwóch strumieni
// jednocześnie. Natomiast w drugim przykładzie
// jeden strumień potokiem przekaże dane do
// strumienia typu stream.Transform
// (strumień kompresujący), a ten z kolei przekaże
// już skompresowane dane do strumiena
// zapisującego je na dysku.

var limit = 10;

// Dane ze strumieni będziemy generować w różnych
// interwałach czasowych, dlatego też w pliku
// wynikowym wygenerowane liczby będą
// zapisane w postaci np. 1212121212121212...
var one = new Numbers({
    number: 1,
    interval: 100,
    limit: limit,
    encoding: 'utf8'
});

var two = new Numbers({
    number: 2,
    interval: 200,
    limit: limit,
    encoding: 'utf8'
});

// Trzeci strumień wykorzystamy
// w drugim przykładzie
var three = new Numbers({
    number: 3,
    interval: 50,
    limit: limit,
    encoding: 'utf8'
});

// Przykład pierwszy
// Zapis danych z dwóch źródeł
var txtOutput = fs.createWriteStream('out.txt');
one.pipe(txtOutput, {end: false});
two.pipe(txtOutput, {end: false});

// Przykład drugi
// Kolejkowanie potoków
var zipOutput = fs.createWriteStream('out.gz');
var gzip = zlib.createGzip();
three.pipe(gzip).pipe(zipOutput);

three.on('end', function(){
    // W przypadku zlib by poprawnie zapisać plik
    // musimy przesłać wszelkie pozostałe dane.
    // Jest to wymaganie typowe akurat dla tej
    // biblioteki i niekoniecznie musi się tyczyć
    // wszelkich innych implementacji strumieni.
    gzip.flush(function(){
        console.log('Kompresja zakończona');
    });
});
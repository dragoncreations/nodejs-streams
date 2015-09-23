/*
 * Przykład pauzowania i wznawiania strumienia
 */

var http = require('http');

http.request({
    host: 'programistamag.pl'
}).on('response', function (incomingMessage) {

    incomingMessage.setEncoding('utf8');

    var running = true;

    incomingMessage.on('data', function (data) {
        if (running) {
            // Wstrzymujemy wszystkie następne
            // zdarzenia data aż do momentu
            // wywołania metody resume.
            // Wszystkie przychodzące dane będą
            // odtąd zapisywane do wewnętrznego
            // bufora strumienia.
            incomingMessage.pause();
            running = false;
        }
        
        // Pierwsze dane pojawią się od razu,
        // na następną partię będziemy 
        // musieli poczekać do wznowienia strumienia.
        console.log('data', data);
    });

    // Wznawiamy strumień
    setTimeout(function () {
        incomingMessage.resume();
    }, 1000);
}).end();
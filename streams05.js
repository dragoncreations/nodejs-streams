/*
 * Przykład zdarzenia data na obiekciez odpowiedzi żądania HTTP.
 * W tym przykładzie wykorzystano moduł http, który wykorzystuje strumienie
 * między innymi jako odpowiedzi na zapytania.
 */

var http = require('http');

http.request({
    host: 'programistamag.pl'
}).on('response', function (incomingMessage) {
    // incomingMessage jest implementacją
    // strumienia stream.Readable.
    incomingMessage.setEncoding('utf8');
    incomingMessage.on('data', function (data) {
        console.log('data', data);
    });
}).end();
var http = require('http'),
    pulse = require('./pulse');

var host = process.argv[2] || 'jz.jvl.io';
var port = process.argv[3] || 80;
console.info('Sending pulse to ' + host);
var options = {
    host: host,
    port: port,
    path: '/pulse',
    //This is what changes the request to a POST request
    method: 'POST',
    headers: {
        "Authentication": "super secret password$$##[[",
        'Content-Type': "application/json"
    }
};

setInterval(function() {

    if (pulse.pulse !== 'Unknown') {
        var req = http.request(options);
        var pulseJson = '{"pulse": ' + pulse.pulse + '}';
        console.log('sending ' + pulseJson)
        req.write(pulseJson);
        req.end();
    }
}, 1000);
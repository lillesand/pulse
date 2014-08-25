var express = require('express'),
    cors = require('cors'),
    pulse = require('./pulse');

var app = express();

app.get('/', cors(), function(req, res){
    res.send(pulse.pulse);
});

app.listen(2000, function() {
    console.log('listening to port ' + 2000);
});
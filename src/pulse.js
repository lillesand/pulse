var BleHR = require('heartrate'),
    keypress = require('keypress');


module.exports = Pulse;

function Pulse() {

}

Pulse.pulse = 'Unknown';

console.log("Scanning for devices. You can choose any device as they appear. Press 'e' to exit.");
var devices = [];
var list = BleHR.list();
list.on('data', function (data) {
    var advertisement = data.advertisement;
    if (advertisement.serviceUuids.indexOf('180d') >= 0) {
        var newLength = devices.push({
            uuid: data.uuid,
            name: advertisement.localName
        });

        console.log("[" + newLength + "] " + advertisement.localName);
    }
});

keypress(process.stdin);
process.stdin.on('keypress', function(char, key) {
    if (char == 'e' || (key && key.ctrl && key.name == 'c')) {
        process.exit(0);
    }

    var number = parseInt(char);
    if (!isNaN(number) && devices.length <= number) {
        var device = devices[number - 1];
        list.removeAllListeners('data');
        console.log('\n\nArrriiite, connecting to ' + device.name);
        listenForData(device.uuid);
    }
});

process.stdin.setRawMode(true);
process.stdin.resume();

function listenForData(uuid) {
    var device = new BleHR({
        uuid: uuid
    });

    var printedBattery = false;
    device.getBatteryLevel(function (err, level) {
        if (typeof level !== undefined) {
            printedBattery  = true;
            console.log('Battery level: ' + level + "%");
        }
    });

    var pulse;
    device.on('data', function (data) {
        pulse = data.toString();
    });
    setInterval(function() {
        if (pulse && printedBattery) {
            Pulse.pulse = pulse;
            console.log(pulse);
        }

    }, 1000);

    device.on('error', function(error) {
        console.log('Error:');
        console.error(error);
    });

}

process.on('SIGINT', function () {
    process.exit(0);
});
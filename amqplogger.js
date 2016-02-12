
/*
 * Module dependencies
 */

var amqp = require('amqplib/callback_api');

/*
 * Module exports
 */

module.exports = createLogger;

var unconnectedStub = function (msg) {
    console.warn(` > '${msg}' logging didn't go through -- unconnected`);
};

function createLogger(opts, cb) {
    opts = opts || {};
    var amqpHost = opts.host || 'localhost';
    var amqpUser = opts.user || 'guest';
    var amqpPassword = opts.password || 'guest';
    var exchange = opts.exchange || '';

    var logger = {
        log: unconnectedStub,
        info: unconnectedStub,
        debug: unconnectedStub,
        warn: unconnectedStub,
        error: unconnectedStub
    };

    var amqpAddr = `amqp://${amqpUser}:${amqpPassword}@${amqpHost}`;
    amqp.connect(amqpAddr, function (err, conn) {
        if (err) {
            cb(err);
            return;
        }

        conn.createChannel(function (err, ch) {
            if (err) {
                cb(err);
                return;
            }

            ch.assertExchange(exchange, 'direct', { durable: false });

            var publish = function (msg, level) {
                ch.publish(exchange, level, new Buffer(msg));
            };

            logger.log = function (msg) { publish(msg, '') };
            logger.info = function (msg) { publish(msg, 'INFO') };
            logger.debug = function (msg) { publish(msg, 'DEBUG') };
            logger.warn = function (msg) { publish(msg, 'WARN') };
            logger.error = function (msg) { publish(msg, 'ERROR') };

            cb(null, logger);
        });
    });

    return logger;
}

var AMQPLogger = require('../amqplogger');

var logger = AMQPLogger({
    host: 'localhost',
    user: 'uni_rabbitmquser',
    password: 'uni_rabbitmqpassword',
    exchange: 'logs'
}, (err, logger) => {
    if (err) {
        console.error(err.toString());
        return;
    }

    console.log('Connected to AMQP!');

    logger.log('Hello World!');
    logger.debug('This is debug-level log');
    logger.error('That\'s an error!');
    
});

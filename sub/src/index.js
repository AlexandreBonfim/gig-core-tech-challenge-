
// let io = require('../Socket/socket');
const app = require('express')();
const server = require('http').Server(app);
const PORT = process.env.PORT || 5001;

const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function (error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }
        var queue = 'challenge-gig';

        channel.assertQueue(queue, {
            // Saves the data on the memory no backup in case service stops
            durable: false
        });

        console.log(" [*] Waiting for stockData messages in %s. To exit press CTRL+C", queue);

        channel.consume(queue, function (data) {
            const message = JSON.parse(data.content.toString())
            console.log("message === ", message);
            //Socket Trigger All Clients
            // io.socket.emit("updatedStock", stock);
        }, {
            // Data is consumed, it will remove from the queue
            noAck: true
        });
    });
});

try {
    server.listen(PORT, () => {
        console.log(`Connected successfully on port ${PORT}`);
    });
    } catch (error) {
    console.error(`Error: ${error.message}`);
}
  
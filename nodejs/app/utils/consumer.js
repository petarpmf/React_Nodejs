const db = require("../models");
const Log = db.log;
const amqp = require("amqplib");
const config = require("../config/rabbit.config");
const Observable = require('rxjs');
const Rx = require('rxjs');

//const Observable = require("rxjs/Observable").Observable;
//step 1 : Connect to the rabbitmq server
//step 2 : Create a new channel
//step 3 : Create the exchange
//step 4 : Create the queue
//step 5 : Bind the queue to the exchange
//step 6 : Consume messages from the queue
class Consumer {
     consumeMessages() {
      const observable$ = new Rx.Observable(async (subscriber) => {
        const connection = await amqp.connect(config.rabbitMQ.url);
        const channel = await connection.createChannel();
  
        await channel.assertExchange("logExchange", "direct");
  
        const q = await channel.assertQueue("InfoQueue", {maxPriority: 10});
      
        await channel.bindQueue(q.queue, "logExchange", "Info");
        await channel.consume(q.queue, (msg) => {
          if (msg != null) {
            channel.ack(msg);
            subscriber.next(msg);            
          }else{
            subscriber.complete();
          }
        })
      });

      observable$.subscribe({
        next(x) {
          let contentStr = x.content.toString();
          let priority = x.properties.priority;
          let content = JSON.parse(contentStr);
          Log.create({
            priority: priority,
            username: content.data.username,
            email: content.data.email            
          }).then(log => {
             console.log("The log "+log +" was created") 
          });
        },
        error(err) {
          console.error('something wrong occurred: ' + err);
        },
        complete() {
           console.log('done');
        }
      });
    }
    // test() {
    //   const observable$ = new Rx.Observable(async (subscriber) => {
    //     subscriber.next(1);
    //     subscriber.next(2);
    //     subscriber.next(3);
    //     subscriber.complete();
    //   });
    //   return observable$;
    // }
}
module.exports = Consumer;
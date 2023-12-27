const db = require("../models");
const Log = db.log;
const Consumer = require("../utils/consumer");
const consumer = new Consumer();
const Observable = require("rxjs");

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.logs = (req, res) => {
   consumer.consumeMessages();
   Log.findAll({
    where: {}
   }).then(logs => {
    res.status(200).send(JSON.stringify(logs));
   })

  // consumer.test().subscribe({
  //   next(x) {
  //     console.log('got value ' + x)
  //   },
  //   error(err) {
  //     console.error('something wrong occurred: ' + err);
  //   },
  //   complete() {
  //      console.log('done');
  //   }
  // });
  //res.status(200).send(allMessages);
};
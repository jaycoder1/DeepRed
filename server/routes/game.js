const express = require('express');
const ChessGame = require('../chess/ChessGame');
const ConversationV1 = require('watson-developer-cloud/conversation/v1');
const errorBot = require('../chess/errorBot.js');

const env = process.env.NODE_ENV || 'local';
let local;
if (env === 'local' || env === 'localtest') local = require('../../config/config.dev.js');

const conversation = new ConversationV1({
  // url: 'https://gateway.watsonplatform.net/conversation/api',
  username: process.env.WATSON_USERNAME || local.Watson.username,
  password: process.env.WATSON_PASSWORD || local.Watson.password,
  path: { workspace_id: '4440e6fc-92da-4518-afb9-9f47aae615cc' },
  version: 'v1',
  version_date: '2017-05-26',
});

const router = express.Router();

const processResponse = (err, response) => {
  if (err) {
    // console.error(err);
    return err;
  }
  if (response.output.text.length !== 0) {
    if (!response.output) {
      response.output = {};
    }
    // console.log('response: ', response);
    return response;
  }
};

router.route('/')
  .get((req, res) => {
    const newGame = new ChessGame();
    res.status(200).send(JSON.stringify(newGame));
  })
  .post((req, res) => {
    // console.log('in the correct route');
    res.status(201).send({ data: 'Posted!' });
  });

router.route('/updateUserGameStat')
  .post((req, res) => {
    // console.log(req.body);
    // query function goes here to update user game win lose stats
    res.send('done');
  });

router.route('/conversation')
  .post((req, res) => {
    console.log('triggered event and message: ', req.body);

    const payload = {
      workspace_id: '4440e6fc-92da-4518-afb9-9f47aae615cc',
      context: req.body.context || {},
      input: req.body.input || {},
    };

    conversation.message(payload, (err, data) => {
      res.send(processResponse(err, data));
    });
  });

router.route('/errorMessage')
    .post((req, res) => {
      // console.log('req: ', req.body.input);
      res.send(errorBot(req.body.input));
    });

const fakeData = [
  {
    name: 'Caleb Cordry',
    count: 11,
  },
  {
    name: 'Carlo Las Marias',
    count: 2,
  },
  {
    name: 'Ryan Chow',
    count: 3,
  },
  {
    name: 'Shawn Feng',
    count: 5,
  },
  {
    name: 'Jason Yu',
    count: 6,
  },
  {
    name: 'Karel Luwena',
    count: 7,
  },
  {
    name: 'Max Braz',
    count: 3,
  },
  {
    name: 'Ivana He',
    count: 1,
  },
  {
    name: 'Yvonne Zhang',
    count: 3,
  },
  {
    name: 'Tariq West',
    count: 5,
  },
  {
    name: 'Edward Kim',
    count: 1,
  },
];

router.route('/getLoserList')
    .get((req, res) => {
      // query database for all the loser;
      res.send(fakeData);
    });

module.exports = router;

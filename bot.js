var HTTPS = require('https');
var cool = require('cool-ascii-faces');
var dotenv = require('dotenv').config();
var stats = require('./stats.js');
var rp = require('request-promise');

var botID = process.env.BOT_ID;

async function respond() {
  var request = JSON.parse(this.req.chunks[0]),
    botRegex = /^\!stats$/;
  console.log(request.group_id);

  if (request.text && botRegex.test(request.text)) {
    this.res.writeHead(200);
    let groupStats = await stats.makeStats(request.group_id);
    postMessage(groupStats);
    this.res.end();
  } else if (request.text && /^\!avgs$/.test(request.text)) {
    console.log('ghere');
    this.res.writeHead(200);
    let avgStats = await stats.makeAvgs(request.group_id, []);
    postMessage(avgStats);
    this.res.end();
  } else if (request.text && /^\!top10$/.test(request.text)) {
    this.res.writeHead(200);
    let topStats = await stats.makeTop(request.group_id, []);
    postMessage(topStats);
    this.res.end();
  } else {
    // DO MENU HERE
    if (request.text.charAt(0) === '!') {
      this.res.writeHead(200);
      let statMenu = `That's not a valid command!\n
      Try using one of these commands instead:
      !stats -- complete stats
      !top10 -- top 10 posts of the group
      !avgs -- average likes of all members
      !TBD -- more to come
      `;
      postMessage(statMenu);
      this.res.end();
    } else {
      console.log("don't care");
      this.res.writeHead(200);
      this.res.end();
    }
  }
}

async function postMessage(groupStats) {
  var botResponse, body, botReq;

  botResponse = groupStats;

  console.log(botResponse.length);

  let options = {
    method: 'POST',
    url: 'https://api.groupme.com/v3/bots/post',
    qs: {
      bot_id: botID,
      text: botResponse.substring(0, 1000)
    },
    headers: {
      'cache-control': 'no-cache'
    }
  };

  for (let i = 0; i < botResponse.length; i += 1000) {
    await rp(options)
      .then(function(body) {
        console.log('any luck?');
        options.qs.text = botResponse.substring(i + 1000, i + 2000);
      })
      .catch(function(err) {
        console.log(err);
      });
  }
}

exports.respond = respond;

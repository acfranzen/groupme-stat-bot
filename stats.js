var HTTPS = require('https');
const request = require('request');
var rp = require('request-promise');

var botID = process.env.BOT_ID;

async function makeStats(group_id) {
  const messages = await getMessages(group_id);
  const members = await getMembers(group_id);
  // console.log(members);
  // console.log(members[0].user_id);
  // console.log(messages[7].favorited_by.length);
  let found = members.find(obj => {
    return obj.user_id === members[0].user_id;
  });
  // console.log(found);

  // average likes per message
  let avgLikes = [];
  messages.forEach(obj => {
    let cur = avgLikes.find(user => {
      return user.user_id === obj.user_id;
    });
    if (cur) {
      cur.likes += obj.favorited_by.length;
      cur.messages++;
    } else {
      let newUsr = {
        user_id: obj.user_id,
        name: obj.name,
        likes: obj.favorited_by.length,
        messages: 1
      };
      avgLikes.push(newUsr);
    }
  });
  console.log(avgLikes);
  // return avgLikes;

  let printString = '';

  avgLikes.forEach(obj => {
    let avg = (obj.likes / obj.messages).toFixed(2);
    console.log(obj);
    if (obj.user_id !== 'system') {
      printString = printString.concat(
        `${obj.name}: ${obj.likes} likes, ${
          obj.messages
        } messages, avg ${avg} likes/msg\n\n`
      );
    }
  });

  return printString;

  // most liked messages

  // never messaged in group
  let noMsg = [];

  //
}

async function getMessages(group_id) {
  let count = 0;
  let messages = [];
  let total = 0;

  let loopOptions = {
    method: 'GET',
    url: `https://api.groupme.com/v3/groups/${group_id}/messages`,
    qs: {
      limit: '100',
      before_id: '',
      access_token: process.env.ACCESS_TOKEN
    },
    headers: {
      'cache-control': 'no-cache'
    },
    json: true
  };

  await rp(loopOptions)
    .then(function(body) {
      total = body.response.count;
      console.log(total);
    })
    .catch(function(err) {
      console.log(err);
    });

  for (let i = 0; i < total; i += 100) {
    console.log('here');
    await rp(loopOptions)
      .then(function(body) {
        messages = messages.concat(body.response.messages);
        count = Object.keys(messages).length;
        loopOptions.qs.before_id = messages[count - 1].id;
        console.log(loopOptions.qs.before_id);
        console.log(count);
      })
      .catch(function(err) {
        console.log(err);
      });
  }
  return messages;
}

async function getMembers(group_id) {
  let members = [];
  let loopOptions = {
    method: 'GET',
    url: `https://api.groupme.com/v3/groups/${group_id}`,
    qs: {
      access_token: process.env.ACCESS_TOKEN
    },
    headers: {
      'cache-control': 'no-cache'
    },
    json: true
  };

  await rp(loopOptions)
    .then(function(body) {
      members = body.response.members;
    })
    .catch(function(err) {
      console.log(err);
    });

  return members;
}

exports.makeStats = makeStats;
exports.getMessages = getMessages;

var HTTPS = require('https');
const request = require('request');
var rp = require('request-promise');

var botID = process.env.BOT_ID;

async function makeStats(group_id) {
  const msgInfo = await getMessages(group_id);
  const messages = msgInfo.messages;
  const count = msgInfo.count;
  const members = await getMembers(group_id);

  let avgString = await makeAvgs(0, messages);
  let top10String = await makeTop(0, messages);
  let printString = `Total of ${count} messages sent\n\n\n`;
  printString += avgString + top10String;

  return printString;
}

async function makeAvgs(group_id, messages) {
  // get messages if not passed in
  if (messages.length === 0) {
    console.log('getting ere?');
    const msgInfo = await getMessages(group_id);
    messages = messages.concat(msgInfo.messages);
  }

  let printString =
    'Each Members number of likes, messages sent, and likes per message:\n\n';

  // average likes per message
  let avgLikes = [];
  messages.forEach(obj => {
    // console.log(obj.favorited_by);
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

  avgLikes.forEach(obj => {
    let avg = (obj.likes / obj.messages).toFixed(2);
    // console.log(obj);
    if (obj.user_id !== 'system') {
      printString = printString.concat(
        `${obj.name}: ${obj.likes} likes, ${
          obj.messages
        } messages, avg ${avg} likes/msg\n\n`
      );
    }
  });

  return printString;
}

async function makeTop(group_id, messages) {
  if (messages.length === 0) {
    console.log('getting ere?');
    const msgInfo = await getMessages(group_id);
    messages = messages.concat(msgInfo.messages);
  }

  // most liked messages
  let mostLiked = [];
  let tempMsgs = messages;

  let tempPrint = 'Top 10 most liked messages of all time:\n\n';

  for (let i = 0; i < 10; ++i) {
    let curMax = Math.max.apply(
      Math,
      tempMsgs.map(obj => {
        // console.log(obj);
        return obj.favorited_by.length;
      })
    );
    let objMax = tempMsgs.find(obj => {
      return obj.favorited_by.length == curMax;
    });
    // console.log(objMax);
    mostLiked.push(objMax);
    objMax.favorited_by = [];
    let d = new Date(objMax.created_at * 1000);
    console.log(objMax.attachments);
    if (
      objMax.attachments[0] === undefined ||
      objMax.attachments[0].url === undefined ||
      objMax.attachments === 0
    ) {
      tempPrint = tempPrint.concat(
        `${i + 1}. ${objMax.name} --  "${
          objMax.text
        }"\n${curMax} likes -- posted ${d.toDateString()}\n\n`
      );
    } else {
      console.log(objMax.attachments[0]);
      tempPrint = tempPrint.concat(
        `${i + 1}. ${objMax.name} -- "${objMax.text}"\n${
          objMax.attachments[0].url
        }\n${curMax} likes -- posted ${d.toDateString()}\n\n`
      );
    }
  }
  return tempPrint;
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
  return { messages: messages, count: count };
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
exports.makeAvgs = makeAvgs;
exports.makeTop = makeTop;
exports.getMessages = getMessages;

var http, director, cool, bot, router, server, port;

http = require('http');
director = require('director');
cool = require('cool-ascii-faces');
bot = require('./bot.js');
dotenv = require('dotenv').config();

router = new director.http.Router({
  '/': {
    post: bot.respond,
    get: ping
  }
});

server = http.createServer(function(req, res) {
  req.chunks = [];
  req.on('data', function(chunk) {
    req.chunks.push(chunk.toString());
  });

  router.dispatch(req, res, function(err) {
    res.writeHead(err.status, { 'Content-Type': 'text/plain' });
    res.end(err.message);
  });
});

const devMode = process.argv[2] === '--dev';
console.log(process.env.BOT_ID);

port = Number(process.env.PORT || 5000);
server.listen(port);

if (this.devMode) {
  require('./dev').dev(this.port, process.env.LT_SUBDOMAIN);
}

function ping() {
  this.res.writeHead(200);
  this.res.end("Hey, I'm Cool Guy.");
}

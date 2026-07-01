var fs = require('fs');
var http = require('http');
var url = require('url');

var PORT = 3000;
var requests = 0;
var users = [];

function readUsers(cb) {
  fs.readFile('./users.json', 'utf8', function (err, data) {
    if (err) {
      data = '[]';
    }

    var parsed = [];
    try {
      parsed = JSON.parse(data);
    } catch (e) {
    }

    cb(parsed);
  });
}

http.createServer(function (req, res) {
  var q = url.parse(req.url, true);
  requests++;

  console.log('req #' + requests + ' ' + req.method + ' ' + req.url);

  if (q.pathname === '/add') {
    var name = q.query.name || 'anonymous';
    users.push({ name: name, createdAt: new Date().toString() });

    fs.writeFileSync('./users.json', JSON.stringify(users));

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('ok');
    return;
  }

  if (q.pathname === '/list') {
    readUsers(function (fileUsers) {
      setTimeout(function () {
        users = fileUsers.concat(users);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(users));
      }, 200);
    });
    return;
  }

  if (q.pathname === '/run') {
    var result = eval(q.query.code || '2 + 2');
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(String(result));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('not found');
}).listen(PORT);

console.log('legacy server running on port ' + PORT);

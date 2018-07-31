const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const errorhandler = require('errorhandler');

const app = express();
const server = http.createServer(app);
const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({ server: server });
var colors = ['red', 'green', 'blue', 'magenta', 'purple', 'plum', 'orange'];
colors.sort(function(a, b) {
	return Math.random() > 0.5;
});
var clients = [];

wss.on('connection', function(ws) {
	clients.push(Object.assign(ws, { userID: Date.now() }));
	let userName = false;
	let userColor = false;
	ws.on('message', function(msg) {
		if (!userName) {
			userName = msg;
			userColor = colors.shift();

			for (let i = 0; i < clients.length; i++) {
				clients[i].send(JSON.stringify({ type: 'connected_new_user', userID: ws.userID, userName}   ));
			}

			console.log(userName + ' login');
		} else {
			console.log(userName + ' say: ' + msg);
			const obj = {
				time: (new Date()).getTime(),
				text: msg,
				author: userName,
				color: userColor
			};
			const json = JSON.stringify({ type: 'message', data: obj });
			for (let i = 0; i < clients.length; i++) {
				clients[i].send(json);
			}
		}
	});
	ws.on('close', function() {
		const index = clients.indexOf(ws);

		clients.splice(index, 1);
		if (userName !== false && userColor != false) {
			colors.push(userColor);
		}

		const json = JSON.stringify({ type: 'disconnected_user', userID: ws.userID });
		for (let i = 0; i < clients.length; i++) {
			clients[i].send(json);
		}

	});

});


app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV === 'development') {
    app.use(errorHandler());
}

app.get('/', function(req, res) {
	res.sendfile('views/chat.html');
});

server.listen(app.get('port'), function() {
	console.log("Express server listening on port " + app.get('port'));
});

var express = require('express'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	errorHandler = require('errorhandler'),
	morgan = require('morgan'),
	routes = require('./backend'),
	api = require('./backend/api');

var app = module.exports = express();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use('/bulletin-board', express.static(__dirname + '/'));

var env = process.env.NODE_ENV;
if ('development' == env) {
	app.use(errorHandler({
		dumpExceptions: true,
		showStack: true
	}));
}

if ('production' == app.get('env')) {
	app.use(errorHandler());
}

app.get('/bulletin-board', routes.index);
app.get('/bulletin-board/api/events', api.events);
app.post('/bulletin-board/api/events', api.event);
app.delete('/bulletin-board/api/events/:eventId', api.event);

const server = app.listen(8080);
app.shutdown = function () {
	console.log("Shutting down...")
	server.close();
};
console.log('Server started on port 8080...');
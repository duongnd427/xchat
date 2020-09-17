const express = require('express');
const next = require('next');
const ipRequest = require('request-ip');

// Import middleware.
const routes = require('./src/routes');

// Setup app.
const app = next({ dev: 'production' !== process.env.NODE_ENV });

const handler = routes.getRequestHandler(app, ({ req, res, route, query }) => {
	app.render(req, res, route.page, query);
});

app.prepare().then(() => {
	// Create server.
	const server = express();

	server.get('/xgaming/ip', (req, res) => {
		var ipAddress = ipRequest.getClientIp(req);
		console.log(ipAddress);
		res.json({ ip_address: ipAddress });
	});

	server.use('/', (req, res) => handler(req, res));

	server.get('/login', (req, res) => {
		app.render(req, res, '/login');
	});

	// Use our handler for requests.
	server.use(handler);

	// Don't remove. Important for the server to work. Default route.
	server.get('*', (req, res) => {
		return handler(req, res);
	});

	// Get current port.
	const port = process.env.PORT || 3001;

	// Error check.
	server.listen(port, (err) => {
		if (err) {
			throw err;
		}
		// Where we starting, yo!
		console.log(`> Ready on port ${port}...`);
	});
});

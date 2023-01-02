const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
	app.use(
		'/api',
		createProxyMiddleware({
			// target: "https://mernchatapppg.herokuapp.com/",
			target: 'https://chatappbackend1.onrender.com/',

			changeOrigin: true
		})
	);
};

module.exports = {
	apps: [
		{
			name: 'test_xgamingwap', // application name
			script: '/u01/vt_media/websites/test_xgamingwap/server.js', // script path to pm2 start

			// Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
			args: 'one two', // string containing all arguments passed via CLI to script
			instances: 1, // number process of application
			autorestart: true, // auto restart if app crashes
			watch: false,
			max_memory_restart: '5G', // restart if it exceeds the amount of memory specified
			env: {
				NODE_ENV: 'development',
			},
			env_production: {
				NODE_ENV: 'production',
			},
			error_file: './err.log',
			out_file: './out.log',
		},
	],
};

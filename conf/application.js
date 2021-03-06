/*
** This is your application configuration
** See https://terrajs.org/mono/configuration
*/

module.exports = {
	mono: {
		// See https://terrajs.org/mono/configuration/modules
		modules: [
			'mono-mongodb'
		],
		// See https://terrajs.org/mono/configuration/http
		http: {
			port: 8000
		},
		// See https://terrajs.org/mono/configuration/log
		log: {
			level: 'verbose'
		},
		jwt: {
			secret: 'yourSecretKey',
			options: {
				algorithm: 'HS384',
				expiresIn: '7d'
			}
		}
	}
}

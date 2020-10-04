import winston from 'winston';

export default winston.createLogger({
	transports: [
		new winston.transports.Console({
			level: `verbose`,
			format: winston.format.combine(
				winston.format.colorize(),
				winston.format.splat(),
				winston.format.timestamp(),
				winston.format.simple()
			)
		}),
		new winston.transports.File({
			filename: `./logs/actions.log`,
			level: `info`,
			format: winston.format.combine(
				winston.format.timestamp()
			)
		}),
		new winston.transports.File({
			filename: `./logs/errors.log`,
			level: `error`,
			format: winston.format.combine(
				winston.format.timestamp()
			)
		})
	],
});
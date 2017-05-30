const {
    MAX_LOG_SIZE,
    MAX_LOG_FILES,
    LOG_INFO_NAME,
    LOG_EXCEPTION_NAME,
    LOG_DIR,
} = require('./constants/index');

const winston = require('winston');
const logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({json: false, timestamp: true}),
        new winston.transports.File({
            filename: LOG_DIR + LOG_INFO_NAME,
            json: false,
            maxsize: MAX_LOG_SIZE,
            maxFiles: MAX_LOG_FILES
        })
    ],
    exceptionHandlers: [
        new (winston.transports.Console)({json: false, timestamp: true}),
        new winston.transports.File({
            filename: LOG_DIR + LOG_EXCEPTION_NAME,
            json: false,
            maxsize: MAX_LOG_SIZE,
            maxFiles: MAX_LOG_FILES
        })
    ],
    exitOnError: false
});

const Nightmare = require('nightmare');
const nightmare = Nightmare({show: true});

const argv = require('yargs')
    .usage('Usage: node $0 -u [url] -w [wait]')
    .array(['w'])
    .demandOption(['u', 'w'])
    .argv;
const url = argv.u;
const waits = argv.w;

nightmare
    .goto(url)
    .wait.apply(nightmare, waits)
    .evaluate(function () {
        return document.querySelector('body').innerHTML;
    })
    .end()
    .then(function (result) {
        logger.info(result);
    })
    .catch(function (error) {
        console.error('Search failed:', error);
    });
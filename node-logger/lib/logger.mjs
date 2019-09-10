import { Console } from 'console';
import path from 'path';
import fs from 'fs';
import moment from 'moment';

import configs from '../config.mjs';

const { 
    LOGGING_PREFIX,
    LOGGIN_FILE_NAME,
    LOGGING_MODE,
    LOGGIN_PATH,
    ROOT_PATH
} = configs;

// if ROOT_PATH not specified in config, then we take a temp folder as root folder
/**
 *  os.tmpdir()
 *  windows => C:\Users\username\AppData\Local\Temp
 *  Linux => /home/tmp
 */
let rootPath = ROOT_PATH ? ROOT_PATH : os.tmpdir();

function generateLoggingPath() {
    // if logging path is not absolute, then use it as reltive path to root path.
    if (! path.isAbsolute(LOGGIN_PATH)) {
        try {
            // check if the path is accessible
            fs.accessSync(`${rootPath}/${LOGGIN_PATH}`)
        } catch(err) {
            // if not the directory will be created
            fs.mkdir(`${rootPath}/${LOGGIN_PATH}`, {
                recursive : true
            }, (err) => {
                console.log(err)
            } )
        }
        
        return `${rootPath}/${LOGGIN_PATH}/`
    }
    // if it is absolute, then use it as absolute
    try { 
        fs.accessSync(`${LOGGIN_PATH}`)
    } catch(err) {
        try {
            fs.mkdirSync(`${LOGGIN_PATH}`, {
                recursive : true
            })
        } catch (err1) {
            console.log(err1)
        }
        console.log(err)
    }

    return `${LOGGIN_PATH}/`
}

let fileName = '';

if ('daily' === LOGGING_MODE) {
    fileName = `${LOGGING_PREFIX}-${moment().year()}-${moment().day()}-${moment().date()}`
} else {
    fileName = LOGGIN_FILE_NAME;
}

// create a writable stream stream.Writable
// fs.WriteStream => by specifying logginPath as underlying resource where stream be flushed. 
let loggingWriteStream = fs.createWriteStream(`${generateLoggingPath()}${fileName}.log`,
{ flags: 'a'}, (err) => {
    console.log(err)
});

// Logger extends Console to customize 
class Logger extends Console{
    constructor() {
        super(loggingWriteStream)
    }

    // return V8 error stack trace.
    callsites() {
        const _prepareStackTrace = Error.prepareStackTrace;
        Error.prepareStackTrace = (_, stack) => stack;
        const stack = new Error().stack.slice(2);
        Error.prepareStackTrace = _prepareStackTrace;
        return stack;
    };

    /**
     * format log line as:
     * 
     * Date-Time | processID | logLevel | fileName:lineNumber | message
     *
     * @param {String} level
     * @param {Strin} message
     * @returns {String}: formatted log line
     * @memberof Logger
     */
    formatLogLine(level, message) {
        const __filename = path.basename(this.callsites()[1].getFileName());
        const  __linenumber = this.callsites()[1].getLineNumber();
    
        return `${moment().format()} | ${process.pid}  | ${level}  | ${__filename}:${__linenumber} | ${message}`
    }

    // Console methods redfinition
    info(info) { 
        super.info(this.formatLogLine('INFO', info));
    }

    error(error) {
        super.error(this.formatLogLine('ERROR', error));
    }

    warn(warn) {
        super.error(this.formatLogLine('WARN', warn));
    }
}

const logger = new Logger()

export default logger;

import os from 'os';
import path from 'path';

import dotenv from 'dotenv';

dotenv.config({path: path.resolve(path.dirname('')) + '/.env'});

const configs = {
    LOGGIN_PATH : process.env.LOGGIN_PATH || `${os.tmpdir()}/storage`,
    ROOT_PATH : process.env.ROOT_PATH || '.',
    LOGGIN_FILE_NAME : process.env.ROOT_PATH || 'ndlog',
    LOGGING_MODE : process.env.LOGGING_MODE || 'daily',
    LOGGING_PREFIX: process.env.LOGGING_PREFIX || 'daily',
}

export default configs ;
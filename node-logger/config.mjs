import os from 'os';

import dotenv from 'dotenv';

dotenv.config();

export const SEPARATED_ERROR = process.env.SEPARATED_ERROR || false;
export const LOGGIN_PATH = process.env.LOGGIN_PATH || `${os.tmpdir()}/storage1`;
// export const LOGGIN_PATH = process.env.LOGGIN_PATH || `storage`;
export const ROOT_PATH = process.env.ROOT_PATH || '.';
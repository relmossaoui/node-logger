import logger from '../node-logger/lib/logger.mjs'

import fs from 'fs'

// will be throwed 
fs.access('.fddg', (err) => {
    logger.error(err)
})

let i = 0;
let timerId = setInterval(() => {
    
    logger.info(` logging ${i} `, {id: 1, user: 'redouan'})
    logger.error(` logging ${i} `)
    logger.warn(` logging ${i} `)

    i += 1;
}, 1000)

setTimeout(() => {
    clearInterval(timerId)
}, 1000)
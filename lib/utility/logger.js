// logger.js can write log messages with these functions:
// log.debug(), log.verbose(), log.info(), log.warn(), and log.error().
// Pass in a "LOGLEVEL=(value)" environment variable on the command line
// to display those log level messages and above.

import winston from 'winston';

const colorizer = winston.format.colorize();
const logLevel = process.env.LOGLEVEL || 'warn';

const format = winston.format.printf(({ level, message }) => {
  // get timestamp string
  const date = new Date()
    .toLocaleString('en-US', {
      timeZone: 'America/Los_Angeles',
      hour12: false,
      dateStyle: 'short',
      timeStyle: 'medium'
    })
    .replaceAll(', ', '/')
    .replaceAll(':', '/');

  const [month, day, hour, minute, second] = date.split('/');
  let [, , year] = date.split('/');
  year = 2000 + Number.parseInt(year, 10);
  const timestamp = `[${year}/${month}/${day} ${hour}:${minute}:${second}] `;

  // get worker index
  let workerIndex = process.env.TEST_WORKER_INDEX || '';
  try {
    // try to parse integer & increment worker index
    // (so it matches test result index in playwright's output)
    if (workerIndex) {
      workerIndex = Number.parseInt(workerIndex, 10) + 1;
      workerIndex = `${workerIndex}`; // convert back to string
      workerIndex = `w${workerIndex.padStart(2, '0')} `; // zero pad
    }
  } catch (err) {
    // if error caught, just set worker index to empty string
    workerIndex = '';
  }

  // get capitalized level
  const capLevel = `${level.toUpperCase()}: `;

  // return colorized, formatted message (timestamp + level + message)
  return colorizer.colorize(
    level,
    (timestamp + workerIndex + capLevel + message).replace(/"/g, '')
  );
});

const transports = [new winston.transports.Console({ level: logLevel })];

export default winston.createLogger({ format, transports });

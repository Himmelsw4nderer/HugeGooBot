/**The logger class */
export default class Logger {
  /** The prefix */
  prefix: string;

  /**
   * Creates an incetance of Logger
   * @param prefix The prefix of this logger
   */
  constructor(prefix: string) {
    this.prefix = prefix;
  }

  /**
   * Logs data to the console*
   * @param data loggable data
   */
  log(data: any) {
    process.stdout.write(`[${this.prefix}] `);
    console.log(data);
  }

  /**
   * Throws an error to the console
   * @param data loggable data
   */
  error(data: any) {
    process.stdout.write(`[ERROR][${this.prefix}] `);
    console.log(data);
  }

  /**
   * Loggs debug data to console
   * @param data loggable data
   */
  debug(data: any) {
    process.stdout.write(`[DEBUG][${this.prefix}] `);
    console.log(data);
  }
}
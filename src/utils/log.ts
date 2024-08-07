export default class Log {
  private static LOG_PREFIX: string = '[JH-APN]';

  static info(msg: string) {
    console.log(`${this.LOG_PREFIX} ${msg}`);
  }

  static warn(msg: string) {
    console.warn(`${this.LOG_PREFIX} ${msg}`);
  }

  static error(msg: string) {
    console.error(`${this.LOG_PREFIX} ${msg}`);
  }
}

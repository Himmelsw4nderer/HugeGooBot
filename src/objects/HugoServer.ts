export default class HugoServer {
  /**
   * Discord id of hugo server
   */
  id: string;
  /**
   * Prefix of hugo server
   */
  prefix: string | null | undefined;

  /**
   * Creates an instance of hugo server.
   * @param id Discord id of hugo server
   * @param prefix Prefix of hugo server
   */
  constructor(id: string, prefix: string | null | undefined) {
    this.id = id;
    this.prefix = prefix;
  }
}

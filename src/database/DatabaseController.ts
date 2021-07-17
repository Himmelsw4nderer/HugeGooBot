import { symlink } from "fs";
import sqlite3, { Database } from "sqlite3";
import HugoServer from "../objects/HugoServer";
import HugoNotification from "../objects/notifications/HugoNotification";
import Logger from "../tools/Logger";

/**
 * The database 
 */
let db: Database;
/**
 * The logger 
 */
let logger = new Logger("DatabaseController");

/** 
 * Controls all interactions with the database and the bot itself
*/
class DatabaseController {
  /**The constructer */
  constructor() {
    const path = "./././res/database/hugo.db";
    db = new sqlite3.Database(path, sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        logger.error(err.message);
        return;
      }
      logger.log("Connected to the database");
    });
  }

  /**
   * Adds a new server to the database
   * @param id The discord id of the server
   */
  initializeServer(id: string) {
    logger.log(`Trying to add server with id ${id} to database`);
    const checkSql = db.prepare("SELECT * FROM Servers WHERE id=?");
    checkSql.get(id, (err, row) => {
      if (err) {
        logger.error(err.message);
        return;
      }
      if (row && row.length) {
        logger.error("Server already exists");
        return;
      }
      const addSql = db.prepare("INSERT INTO Servers(id) VALUES(?)");
      addSql.run(id);
      logger.log(`Inserted Server with id ${id} to database`);
    });
  }

  /**
   * Adds a server to the database
   * @param server The informations of the server
   */
  addServer(server: HugoServer) {
    const deleteSql = db.prepare("DELETE FROM Servers WHERE id = ?");
    deleteSql.run(server.id);
    const addSql = db.prepare("INSERT INTO Servers(id, prefix) VALUES(?, ?)");
    addSql.run(server.id, server.prefix);
    logger.log(`Added server with id ${server.id} to the database`);
  }

  /**
   * Gets the server by the id in the database
   * @param id The discord server id
   * @returns The server
   */
  getServerById(id: string): Promise<HugoServer> {
    return new Promise<HugoServer>(async (resolve, reject) => {
      const sql = db.prepare("SELECT * FROM Servers WHERE id=?");
      let server = new HugoServer(id, "§");
      sql.get(id, async (err, row) => {
        if (err !== null) {
          resolve(server);
          return;
        }
        if (row == null || !row.id || !row.prefix || row.length == 0) {
          await this.initializeServer(id);
          return;
        }
        server.prefix = row.prefix;
        logger.debug("asd");
        resolve(server);
      });
    });
  }

  /**
   * Gets all servers of the database
   * @returns All servers
   */
  async getServers(): Promise<HugoServer[]> {
    return new Promise<HugoServer[]>((resolve, reject) => {
      const sql = db.prepare("SELECT * FROM Servers");
      let servers = new Array<HugoServer>(0);
      sql.all((err, rows) => {
        if (err !== null) {
          reject(err);
          return;
        }
        if (rows == null) {
          reject(rows);
          return;
        }
        for (let row of rows) {
          let server = new HugoServer(row.id, row.prefix);
          servers.push(server);
        }
      });
      resolve(servers);
    });
  }

  /**
   * Changes the prefix of the server in the database
   * @param id The discord server id
   * @param prefix The new prefix
   */
  async changePrefix(id: string, prefix: string) {
    const sql = db.prepare("UPDATE Servers SET prefix = ? WHERE id = ?");
    sql.run(prefix, id);
  }

  /**
   * Adds a new notification to the database
   * @param type The platform from witch the notifications will be send
   * @param channel The discord id of the channel were the notifications will be send
   * @param place The user for notifications
   */
  async newNotification(type: string, channel: string, place: string) {
    const sql = db.prepare(
      "INSERT INTO Notifications(type, channel, place) Values(?, ?, ?)"
    );
    logger.debug(1)
    sql.run(type, channel, place);
  }

  /**
   * Adds a new notification to the database
   * @param id The id of the notification
   * @param result The last result for notifications
   */
  async newLastOfNotification(id: number, result: string) {
    const sql = db.prepare(
      "UPDATE Notifications SET last = ? WHERE id = ?"
    );
    sql.run(result, id);
  }

  /**
   * Gets all notifications from the database
   * @returns the notifications of this bot
   */
  async getNotifications() {
    return new Promise<Array<HugoNotification>>((resolve, reject) => {
      const sql = db.prepare("SELECT * FROM Notifications");
      let notifications = new Array<HugoNotification>(0);
      sql.get((err, rows) => {
        if (err !== null) {
          reject(err);
          return;
        }
        if (rows == null) {
          reject(rows);
          return;
        }
        for (let row of rows) {
          const notification = new HugoNotification(
            row.id,
            row.type,
            row.channel,
            row.place,
            row.last
          );
          notifications.push(notification);
        }
      });
      resolve(notifications);
    });
  }

  /**
   * Gets all notifications with specified type from the database
   * @returns The notifications of a type
   */
  async getNotificationsByType(type: string) {
    return new Promise<Array<HugoNotification>>((resolve, reject) => {
      const sql = db.prepare("SELECT * FROM Notifications WHERE type=?");
      let notifications = new Array<HugoNotification>(0);
      sql.all(type, (err, rows) => {
        if (err !== null || rows == null) {
          resolve(notifications);
          return;
        }
        for (let row of rows) {
          const notification = new HugoNotification(
            row.id,
            row.type,
            row.channel,
            row.place,
            row.last
          );
          notifications.push(notification);
          resolve(notifications);
        }
      });
    });
  }
}

export default new DatabaseController();

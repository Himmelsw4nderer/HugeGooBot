import { NewsChannel, Snowflake } from "discord.js";
import sqlite3, { Database } from "sqlite3";
import HugoServer from "../objects/HugoServer";
import Logger from "../tools/Logger";

let db: Database;
let logger = new Logger("DatabaseController");

class DatabaseController {
  constructor() {
    //logging in to the database
    db = new sqlite3.Database(
      "./././res/database/hugo.db",
      sqlite3.OPEN_READWRITE,
      (err) => {
        //sending error
        if (err) {
          logger.error(err.message);
        }
        logger.log("Connected to the database");
      }
    );

    //db.run('CREATE TABLE "Users" ("Id"    TEXT NOT NULL UNIQUE, PRIMARY KEY("Id"))');
  }

  initializeServer(id: string) {
    logger.log(`Trying to add server with id ${id} to database`);
    //checking if old server exists
    const checkSql = db.prepare("SELECT * FROM Servers WHERE id=?");
    //running request
    checkSql.get(id, (err, row) => {
      //checking for error
      if (err) {
        logger.error(err.message);
        return;
      }
      //returning if there is already a row
      if (row && row.length) {
        logger.error("Server already exists");
        return;
      }
      //creating the request string
      const addSql = `INSERT INTO Servers("id") VALUES("${id}")`;
      //running the request
      db.run(addSql);
      logger.log(`Inserted Server with id ${id} to database`);
    });
  }

  addServer(server: HugoServer) {
    //creating the request string for deletion of old server
    const deleteSql = `DELETE FROM Servers WHERE id = "${server.id}"`;
    //running the request
    db.run(deleteSql);
    //creating the request string for adding the new server
    const addSql = `INSERT INTO Servers("id", "prefix") VALUES("${server.id}", "${server.prefix}")`;
    //running the request
    db.run(addSql);
    logger.log(`Added server with id ${server.id} to the database`);
  }

  getServerById(id: string): Promise<HugoServer> {
    return new Promise<HugoServer>((resolve, reject) => {
      //creating the request string
      const sql = db.prepare("SELECT * FROM Servers WHERE id=?");
      //sending the request
      sql.get(id, (err, row) => {
        //checking for error
        if (err !== null) reject(err);
        //checking if server exists in database
        if (row == null) reject();
        //creating the server objekt
        let server = new HugoServer(row.id, row.prefix);
        //returning the server object
        resolve(server);
      });
    });
  }

  async changeServer(server: HugoServer) {
    //getting the old server data
    const databaseserver = await this.getServerById(server.id.toString());
    //setting old values if there are no new ones
    if (!server.prefix) server.prefix = databaseserver?.prefix;
    //adding the server to the database
    this.addServer(server);
  }
}

export default new DatabaseController();
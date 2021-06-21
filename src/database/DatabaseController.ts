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
          return;
        }
        logger.log("Connected to the database");
      }
    );
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
      const addSql = db.prepare("INSERT INTO Servers(id) VALUES(?)");
      //running the request
      addSql.run(id);
      logger.log(`Inserted Server with id ${id} to database`);
    });
  }

  addServer(server: HugoServer) {
    //creating the request string for deletion of old server
    const deleteSql = db.prepare("DELETE FROM Servers WHERE id = ?");
    //running the request
    deleteSql.run(server.id);
    //creating the request string for adding the new server
    const addSql = db.prepare("INSERT INTO Servers(id, prefix) VALUES(?, ?)");
    //running the request
    addSql.run(server.id, server.prefix);
    logger.log(`Added server with id ${server.id} to the database`);
  }

  getServerById(id: string): Promise<HugoServer> {
    return new Promise<HugoServer>((resolve, reject) => {
      //creating the request string
      const sql = db.prepare("SELECT * FROM Servers WHERE id=?");
      //sending the request
      sql.get(id, (err, row) => {
        //checking for error
        if (err !== null) {
          reject(err);
          return;
        }
        //checking if server exists in database
        if (row == null && !row.id && !row.prefix){
          this.addServer(new HugoServer(id, "§"));
          reject();
          return;
        }
        //creating the server objekt
        let server = new HugoServer(row.id, row.prefix);
        //returning the server object
        resolve(server);
      });
    });
  }

  async getServers(): Promise<HugoServer[]> {
    return new Promise<HugoServer[]>((resolve, reject) => {
      //creating the get request
      const sql = db.prepare("SELECT * FROM Servers");
      //getting sql
      sql.all((err, rows) => {
        //checking for error
        if (err !== null) {
          reject(err);
          return;
        }
        //checking if there are servers
        if (rows == null) {
          reject(rows);
          return;
        }
        //result
        let servers = new Array<HugoServer>(0);
        //for all rows
        for (let row of rows) {
          //creating the server object
          let server = new HugoServer(
            row.id,
            row.prefix,
            row.tiktokchannel,
            row.tiktoktextchannel,
            row.tiktoklastvideo
          );
          //adding results to array
          servers.push(server);
        }
        //resolving
        resolve(servers);
      });
    });
  }

  async changePrefix(id: string, prefix: string) {
    //creating the request string for deletion of old server
    const sql = db.prepare(
      "UPDATE Servers SET prefix = ? WHERE id = ?"
    );
    //running the request
    sql.run(prefix, id);
  }

  async initializeTikTok(id: string, channel?: string, textchannel?: string) {
    //creating the request string for deletion of old server
    const sql = db.prepare(
      "UPDATE Servers SET tiktokchannel = ?, tiktoktextchannel = ? WHERE id = ?"
    );
    //running the request
    sql.run(channel, textchannel, id);
  }

  async newTikTokVideo(id: string, vidoeId: string) {
    //creating the request string for deletion of old server
    const sql = db.prepare(
      "UPDATE Servers SET tiktoklastvideo = ? WHERE id = ?"
    );
    //running the request
    sql.run(vidoeId, id);
  }
}

export default new DatabaseController();

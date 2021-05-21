import { Snowflake } from 'discord.js';
import sqlite3, { Database } from 'sqlite3';

let db: Database;

export default class DatabaseController{
    constructor(){
        //logging in to the database
        db = new sqlite3.Database("./././res/database/hugo.db", sqlite3.OPEN_READWRITE, (err) => {
            //sending error
            if (err) {
                console.error(err.message);
            }
        console.log('Connected to the database');
        });

        //db.run('CREATE TABLE "Users" ("Id"    TEXT NOT NULL UNIQUE, PRIMARY KEY("Id"))');
    }

    //adding a user to the database
    addUser(id: Snowflake) {
        //creating the request string
        const sql = `INSERT INTO Users("Id") VALUES("${id}")`

        //running the request
        db.run(sql);
    }

    //returning the user with the given IP
    getUserById(id: Snowflake){

    }


}
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const sqlDbFactory = require("knex");
const process = require("process");

let sqlDb;

function initSqlDB() {
  /* Locally we should launch the app with TEST=true to use SQLlite:

       > TEST=true node ./index.js

    */
  if (process.env.TEST) {
    sqlDb = sqlDbFactory({
      client: "sqlite3",
      debug: true,
      connection: {
        filename: "./petsdb.sqlite"
      },
      useNullAsDefault: true
    });
  } else {
    sqlDb = sqlDbFactory({
      debug: true,
      client: "pg",
      connection: process.env.DATABASE_URL,
      ssl: true
    });
  }
}

function initDb() {
    
    /* LOCATIONS */
    return sqlDb.schema.hasTable("locations").then(exists => {
    if (!exists) {
      sqlDb.schema
        .createTable("locations", table => {
          table.increments();
          table.string("name");
          table.string("description");
          table.string("phone")
          table.string("mail")
          table.string("operating-time");
          table.string("map-iframe");
        })
        .then(() => {
          return Promise.all(
            _.map(locList, l => {
              delete l.id;
              return sqlDb("locations").insert(p);
            })
          );
        });
    } else {
      return true;
    }
    });
    
    /* LOCATION SLIDESHOWS */
    return sqlDb.schema.hasTable("loc-slides").then(exists => {
        if (!exists) {
          sqlDb.schema
            .createTable("loc-slides", table => {
              table.increments();
              table.string("url");
              table.string("name");
            })
            .then(() => {
              return Promise.all(
                _.map(servList, slide => {
                  delete slide.id;
                  return sqlDb("loc-slides").insert(slide);
                })
              );
            });
        } else {
          return true;
        }
      });
    
    
    /* SERVICES */
    return sqlDb.schema.hasTable("services").then(exists => {
        if (!exists) {
          sqlDb.schema
            .createTable("services", table => {
              table.increments();
              table.string("name");
              table.string("description");
              table.enum("target", ["5+", "13+", "20+"]);
              table.string("pic-url");
            })
            .then(() => {
              return Promise.all(
                _.map(servList, s => {
                  delete s.id;
                  return sqlDb("services").insert(s);
                })
              );
            });
        } else {
          return true;
        }
      });
    
    /* EVENTS */
    return sqlDb.schema.hasTable("events").then(exists => {
        if (!exists) {
          sqlDb.schema
            .createTable("events", table => {
              table.increments();
              table.string("title");
              table.string("description");
              table.string("flyer-url");
              table.date("date");
            })
            .then(() => {
              return Promise.all(
                _.map(eventList, e => {
                  delete e.id;
                  return sqlDb("events").insert(e);
                })
              );
            });
        } else {
          return true;
        }
      });
    
    /* PEOPLE */
    return sqlDb.schema.hasTable("people").then(exists => {
        if (!exists) {
          sqlDb.schema
            .createTable("people", table => {
              table.increments();
              table.string("name");
              table.string("description");
              table.date("birthdate");
              table.integer("experience");
              table.integer("assisted");
              table.string("pic-url");
              table.string("cv-url");
            })
            .then(() => {
              return Promise.all(
                _.map(eventList, p => {
                  delete p.id;
                  return sqlDb("people").insert(p);
                })
              );
            });
        } else {
          return true;
        }
      });
}
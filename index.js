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
              table.string("nickname");
              table.string("first-name");
              table.string("last-name");
              table.string("nickname");
              table.string("description");
              table.string("birthdate");
              table.integer("experience");
              table.integer("assisted");
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
        
    /* SERVICES - PEOPLE (WORKS) */
    return sqlDb.schema.hasTable("works").then(exists => {
        if (!exists) {
          sqlDb.schema
            .createTable("works", table => {
              table.increments();
              table.string("service");
              table.string("person");
            })
            .then(() => {
              return Promise.all(
                _.map(eventList, e => {
                  delete e.id;
                  return sqlDb("works").insert(e);
                })
              );
            });
        } else {
          return true;
        }
      });
    
     /* SERVICES - LOCATIONS (OFFERS) */
    return sqlDb.schema.hasTable("offers").then(exists => {
        if (!exists) {
          sqlDb.schema
            .createTable("offers", table => {
              table.increments();
              table.string("service");
              table.string("location");
            })
            .then(() => {
              return Promise.all(
                _.map(eventList, e => {
                  delete e.id;
                  return sqlDb("offers").insert(e);
                })
              );
            });
        } else {
          return true;
        }
      });
    
     /* EVENTS - LOCATIONS (HOSTS) */
    return sqlDb.schema.hasTable("hosts").then(exists => {
        if (!exists) {
          sqlDb.schema
            .createTable("hosts", table => {
              table.increments();
              table.string("events");
              table.string("locations");
            })
            .then(() => {
              return Promise.all(
                _.map(eventList, e => {
                  delete e.id;
                  return sqlDb("hosts").insert(e);
                })
              );
            });
        } else {
          return true;
        }
      });
    
     /* LOCATIONS - SLIDES (PICTURE OF) */
    return sqlDb.schema.hasTable("picturesOf").then(exists => {
        if (!exists) {
          sqlDb.schema
            .createTable("picturesOf", table => {
              table.increments();
              table.string("location");
              table.string("picture");
            })
            .then(() => {
              return Promise.all(
                _.map(eventList, e => {
                  delete e.id;
                  return sqlDb("picturesOf").insert(e);
                })
              );
            });
        } else {
          return true;
        }
      });
}


const _ = require("lodash");

let serverPort = process.env.PORT || 5000;

//let servicesList = require("other/db/servicesdata.json");
//let locationsList = require("other/db/locationsdata.json");
let peopleList = require("other/db/peopledata.json");
//let eventsList = require("other/db/eventsdata.json");
//let servicePerson = require("other/db/worksrel.json");
//let serviceLocation = require("other/db/offersrel.json");
//let eventLocation = require("other/db/hostsrel.json");
//let locationSlide = require("other/db/picturesofrel.json");


app.use(express.static(__dirname + "/public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// /* Register REST entry point */
app.get("/people", function(req, res) {
  let start = parseInt(_.get(req, "query.start", 0));
  let limit = parseInt(_.get(req, "query.limit", 5));
  let sortby = _.get(req, "query.sort", "none");
  let myQuery = sqlDb("people");

  if (sortby === "nickname") {
    myQuery = myQuery.orderBy("nickname", "asc");
  } else if (sortby === "-nickname") {
    myQuery = myQuery.orderBy("nickname", "desc");
  }
  myQuery
    .limit(limit)
    .offset(start)
    .then(result => {
      res.send(JSON.stringify(result));
    });
});

// /* Register REST entry point */
app.get("/people", function(req, res) {
  let start = parseInt(_.get(req, "query.start", 0));
  let limit = parseInt(_.get(req, "query.limit", 5));
  let sortby = _.get(req, "query.sort", "none");
  let myQuery = sqlDb("people");

  if (sortby === "nickname") {
    myQuery = myQuery.orderBy("nickname", "asc");
  } else if (sortby === "-nickname") {
    myQuery = myQuery.orderBy("nickname", "desc");
  }
  myQuery
    .limit(limit)
    .offset(start)
    .then(result => {
      res.send(JSON.stringify(result));
    });
});

app.get("/services", function(req, res) {
  let start = parseInt(_.get(req, "query.start", 0));
  let limit = parseInt(_.get(req, "query.limit", 5));
  let myQuery = sqlDb("services");
});

app.get("/locations", function(req, res) {
  let start = parseInt(_.get(req, "query.start", 0));
  let limit = parseInt(_.get(req, "query.limit", 5));
  let myQuery = sqlDb("locations");
});

app.get("/events", function(req, res) {
  let start = parseInt(_.get(req, "query.start", 0));
  let limit = parseInt(_.get(req, "query.limit", 5));
  let myQuery = sqlDb("events");
});

app.get("/loc-slides", function(req, res) {
  let start = parseInt(_.get(req, "query.start", 0));
  let limit = parseInt(_.get(req, "query.limit", 3));
  let myQuery = sqlDb("loc-slides");
});


app.set("port", serverPort);

initSqlDB();
initDb();

/* Start the server on port 3000 */
app.listen(serverPort, function() {
  console.log(`Your app is ready at port ${serverPort}`);
});
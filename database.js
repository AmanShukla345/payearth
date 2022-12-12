var sqlite3 = require('sqlite3').verbose()
//var md5 = require('md5')

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            mobile INTEGER UNIQUE,
            name text,
            cat INTEGER,
            password text, 
            wallet INTEGER,
            CONSTRAINT mobile_unique UNIQUE (mobile)
            )`,
        (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                var insert = 'INSERT INTO user (mobile,name,cat, password,wallet) VALUES (?,?,?,?,?)'
                db.run(insert, [9716863391,"admin",1,"admin123456",0])
                db.run(insert, [9716863392,"distibuter",2,"distibuter123456",0])
                db.run(insert, [9716863393,"user",3,"user123456",0])
            }
        });  
    }
});


module.exports = db
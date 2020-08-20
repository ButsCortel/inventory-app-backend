const Pool = require("pg").Pool;

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config(); //if server is started as dev env, dotenv will be imported
}
const { PGUSER, PGPASS, PGHOST, PGPORT, PGDB } = process.env;
const pool = new Pool({
  user: PGUSER,
  password: PGPASS,
  host: PGHOST,
  port: PGPORT,
  database: PGDB,
});

module.exports = pool;

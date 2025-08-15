const { Pool } = require('pg');
const ENV = process.env.NODE_ENV || 'development';
const config = {}
require('dotenv').config({
  path: `${__dirname}/../.env.${ENV}`,
});
let pool;
if(ENV === "production"){
  pool = new Pool({connectionString: ENV, ssl: { rejectUnauthorized: false}, max: 1, idleTimeoutMillis: 30000})

}
else{
  pool = new Pool(config)
}

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error('PGDATABASE or DATABASE_URL not set');
}

module.exports = pool

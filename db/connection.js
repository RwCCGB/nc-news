const { Pool } = require('pg');
const ENV = process.env.NODE_ENV || 'development';
const connectionString = process.env.DATABASE_URL
const config = {}
require('dotenv').config({
  path: `${__dirname}/../.env.${ENV}`,
});
let pool;
if(ENV === "production"){
  const sanitiseConnectionString = connectionString.replace(/^postgresql:\/\//, 'postgres://')

  try{
    const log = new URL(process.env.DATABASE_URL)
    console.log('[DB]', 'host:', log.host)
  }
  catch(error){
    console.log('[DB] DATABASE_URL is invalid')
  }

  pool = new Pool({connectionString: sanitiseConnectionString, ssl: { rejectUnauthorized: false},})
}
else{
  pool = new Pool(config)
}

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error('PGDATABASE or DATABASE_URL not set');
}

module.exports = pool

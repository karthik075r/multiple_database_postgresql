import pg from "pg";
import QueryService from "../query/QueryService";
const { Pool } = pg;
class Database {
  getDefault() {
    return new Pool({
      user: process.env.user,
      database: process.env.database,
      password: process.env.password,
      host: process.env.host,
      port: +process.env.port,
    }).connect();
  }

  async createAndGetConnectionByOrganizationName(dbName) {
    const pool = await this.getDefault();
    let existingDb = true;
    const pools = await pool.query(`SELECT datname FROM pg_database
    WHERE datistemplate = false;`);
    // console.log(pools);
    let found = await pools.rows.find((row) => row.datname === dbName);
    if (!found) {
      await pool.query(`CREATE DATABASE ${dbName};`);
      existingDb = false;
    }
    return {
      db: await this.getConnectionByName(dbName),
      existingDb,
    };
  }

  getConnectionByName(dbName) {
    return new Pool({
      user: process.env.user,
      database: dbName,
      password: process.env.password,
      host: process.env.host,
      port: +process.env.port,
    }).connect();
  }

  getDefaultTables() {
    return QueryService.getDefaultTables();
  }
  getV2MigrationQueries() {
    return QueryService.getV2MigrationQueries();
  }
}

export default Database;

import pg from "pg";
const { Pool } = pg;
class Database {
  getDefault() {
    return new Pool({
      user: process.env.user,
      database: process.env.database,
      password: process.env.password,
      host: process.env.host,
      port: +process.env.port,
    });
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
    return [
      `CREATE TABLE "metaVersion" (
        "v1" BOOLEAN
      )`,
      `CREATE TABLE "users" (
        "id" INT GENERATED ALWAYS AS IDENTITY,
        "name" VARCHAR(30),
        "email" VARCHAR(30),
        "organizationName" VARCHAR(30),
        PRIMARY KEY("id")
      );`,
      `CREATE TABLE address (
        "id" INT GENERATED ALWAYS AS IDENTITY,
        "userId" INT,
        "street" VARCHAR(30),
        "city" VARCHAR(30),
        "state" VARCHAR(30),
        PRIMARY KEY("id"),  
         CONSTRAINT fk_user
          FOREIGN KEY("userId") 
	          REFERENCES users("id")        
      );`,
      `CREATE TABLE cars (
        "id" INT GENERATED ALWAYS AS IDENTITY,
        "name" VARCHAR(30),
        "model" VARCHAR(30),
        "color" VARCHAR(30),
        PRIMARY KEY("id")
      );`,
      `CREATE TABLE users_car_mapping (
        "id" INT GENERATED ALWAYS AS IDENTITY,
        "userId" INT,
        "carId" INT,
        PRIMARY KEY(id),  
         CONSTRAINT fk_user
          FOREIGN KEY("userId") 
	          REFERENCES users("id"),
        CONSTRAINT fk_car
          FOREIGN KEY("carId") 
	          REFERENCES cars("id")  
      );`,
    ];
  }
  getMigrationQueries() {
    return [
      `ALTER TABLE users
        ADD COLUMN IF NOT EXISTS "phoneNumber" VARCHAR;`,
      `ALTER TABLE "metaVersion"
        ADD COLUMN IF NOT EXISTS "v2" VARCHAR;`,
    ];
  }
}

export default Database;

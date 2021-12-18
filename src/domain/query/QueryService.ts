export default class QueryService {
  static getDefaultTables() {
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

  static getV2MigrationQueries() {
    return [
      `ALTER TABLE users
        ADD COLUMN IF NOT EXISTS "phoneNumber" VARCHAR;`,
      `ALTER TABLE "metaVersion"
        ADD COLUMN IF NOT EXISTS "v2" VARCHAR;`,
    ];
  }

  static getMigrationQueriesToCreateNewTableForManufactures() {
    return [
      `CREATE TABLE "machinary" (
        "id" INT GENERATED ALWAYS AS IDENTITY,
        "name" VARCHAR(30),
        "model" VARCHAR(30),
        "count" INT,
        PRIMARY KEY("id")
      );`,
    ];
  }
}

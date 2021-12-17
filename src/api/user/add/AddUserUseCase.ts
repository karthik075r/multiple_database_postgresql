import Pool from "../../../domain/database/Database";
import BaseUseCase from "../../BaseUseCase";
import express, { Request, Response } from "express";

class AddUserUseCase extends BaseUseCase {
  constructor(request, response) {
    super(request, response);
  }

  validate() {
    throw new Error("Method not implemented.");
  }

  async execute() {
    let client;
    try {
      console.log(this.request.body);
      const { organizationName, name, email, phoneNumber } = await this.request
        .body;

      const pool = new Pool();

      let connectionObj = await pool.createAndGetConnectionByOrganizationName(
        organizationName.toLowerCase()
      );
      const { db, existingDb } = connectionObj;
      console.log(existingDb);

      client = db;

      await client.query("BEGIN");

      if (!existingDb) {
        const tables = pool.getDefaultTables();

        for await (let table of tables) {
          console.log(table, "=====>");
          await client.query(table);
        }
      }

      const migrations = pool.getMigrationQueries();
      for await (const migration of migrations) {
        console.log("migration = = => ", migration);
        await client.query(migration);
      }
      let x = await client.query(
        `INSERT INTO users (name, email, organizationName,phoneNumber) VALUES ('${name}', '${email}', '${organizationName.toLowerCase()}','${phoneNumber}');`
      );

      let data = await client.query(
        `SELECT *
        FROM users
        `
      );

      await client.query("COMMIT");

      return {
        message: "Successfully added user",
        data: data.rows,
      };
    } catch (error) {
      console.log(error, "err");
      await client?.query("ROLLBACK");
      throw error;
    } finally {
      await client?.release();
    }
  }

  static create(request: Request, response: Response) {
    let useCase = new AddUserUseCase(request, response);
    return useCase;
  }
}
export default AddUserUseCase;

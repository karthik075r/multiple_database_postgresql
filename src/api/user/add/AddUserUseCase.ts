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
      if (!existingDb) {
        const tables = pool.getDefaultTables();

        for await (let table of tables) {
          console.log(table, "=====>");
          await db.query(table);
        }
      }

      const migrations = pool.getMigrationQueries();
      for await (const migration of migrations) {
        console.log("migration = = => ", migration);
        await db.query(migration);
      }
      let x = await db.query(
        `INSERT INTO users (name, email, organizationName,phoneNumber) VALUES ('${name}', '${email}', '${organizationName.toLowerCase()}','${phoneNumber}');`
      );

      let data = await db.query(
        `SELECT *
        FROM users
        `
      );
      return {
        message: "Successfully added user",
        data: data.rows,
      };
    } catch (error) {
      console.log(error, "err");

      throw error;
    }
  }

  static create(request: Request, response: Response) {
    let useCase = new AddUserUseCase(request, response);
    return useCase;
  }
}
export default AddUserUseCase;

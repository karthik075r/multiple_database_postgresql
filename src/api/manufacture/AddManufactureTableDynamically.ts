import Pool from "../../domain/database/Database";
import BaseUseCase from "../BaseUseCase";
import express, { Request, Response } from "express";
import QueryService from "../../domain/query/QueryService";

class AddManufactureTableDynamically extends BaseUseCase {
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

      const pool = new Pool();
      client = await pool.getDefault();
      await client.query("BEGIN");

      const pools = await client.query(`SELECT datname FROM pg_database
    WHERE datistemplate = false;`);

      await client.query("COMMIT");

      const queryArr =
        QueryService.getMigrationQueriesToCreateNewTableForManufactures();

      for await (const row of pools.rows) {
        if (row.datname.startsWith(process.env.manufacturer)) {
          client = await pool.getConnectionByName(row.datname);
          for await (const query of queryArr) {
            await client.query("BEGIN");
            await client.query(query);

            await client.query("COMMIT");
          }
        }
      }
      return {
        message: "Successfully created tables for manufacturer",
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
    let useCase = new AddManufactureTableDynamically(request, response);
    return useCase;
  }
}
export default AddManufactureTableDynamically;

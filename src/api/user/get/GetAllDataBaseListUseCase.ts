import BaseUseCase from "../../BaseUseCase";
import Pool from "../../../domain/database/Database";

class GetAllDataBaseListUseCase extends BaseUseCase {
  constructor(request, response) {
    super(request, response);
  }
  validate() {
    throw new Error("Method not implemented.");
  }
  async execute() {
    try {
      console.log(this.request.body);
      const { organizationName } = await this.request.query;
      const pool = new Pool();
      let db = await pool.getDefault();
      let data = await db.query(
        `SELECT datname FROM pg_database
    WHERE datistemplate = false;`
      );
      return {
        message: "Success",
        dbList: data.rows,
      };
    } catch (error) {
      console.log(error, "err");

      throw error;
    }
  }

  static create(request, response) {
    let useCase = new GetAllDataBaseListUseCase(request, response);
    return useCase;
  }
}
export default GetAllDataBaseListUseCase;

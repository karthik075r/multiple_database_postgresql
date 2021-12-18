import express, { Request, Response } from "express";
import AddManufactureTableDynamically from "./AddManufactureTableDynamically";

const router = express.Router();

router.post("/manufacture", async (request: Request, response: Response) => {
  const useCase = AddManufactureTableDynamically.create(request, response);
  await useCase.executeAndHandleErrors();
});

export default router;

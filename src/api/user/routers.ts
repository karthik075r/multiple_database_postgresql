import express, { Request, Response } from "express";
import AddUserUseCase from "./add/AddUserUseCase";
import GetAllDataBaseListUseCase from "./get/GetAllDataBaseListUseCase";

const router = express.Router();

router.post("/user", async (request: Request, response: Response) => {
  const useCase = AddUserUseCase.create(request, response);
  await useCase.executeAndHandleErrors();
});
router.get("/dbList", async (request: Request, response: Response) => {
  const useCase = GetAllDataBaseListUseCase.create(request, response);
  await useCase.executeAndHandleErrors();
});

export default router;

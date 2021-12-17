import UseCaseInterface from "./UseCaseInterface";
import express, { Request, Response } from "express";


abstract class BaseUseCase implements UseCaseInterface {
  constructor(public request:Request, public response:Response) {
    this.request = request;
    this.response = response;
  }

  abstract validate();

  abstract execute();

  async executeAndHandleErrors() {
    try {
      let data: any = await this.execute();
      if (data == null) {
        data = {};
      }
      if (data.error) {
        let error = data;
        throw error;
      }
      let code = 200;
      data.code = code;
      this.response.status(code).json(data);
    } catch (error) {
      if (error != null) {
        let message = error.message;
        if (error.code == 11000) {
          message = error.message;
        }

        let code = error.code ? error.code : 400;
        let data = { code: code, message: message };
        this.response.status(code >= 100 && code < 600 ? code : 500).json(data);
      } else {
        let data = {
          code: 400,
          message: "Unable to process your request, please try again",
        };
        this.response.status(400).json(data);
      }
    }
  }
}
export default BaseUseCase;

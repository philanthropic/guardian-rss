import { Request, Response } from 'express';
import { AppError } from '../error';

export class GuardianController {
  constructor() {}

  handleSection(req: Request, resp: Response) {
    // regex to match kebab-case strings
    const re = /^[a-z]+(?:-[a-z]+)*$/;

    const section = req.params.section;

    if (!re.test(section)) {
      throw new AppError(400, `invalid guardian api section name: ${section}`);
    }

    resp.status(200).send(`coming from controller :${section}`);
  }
}

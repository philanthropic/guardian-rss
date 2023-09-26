import { Request, Response } from 'express';

export class GuardianController {
  constructor() {}

  handleSection(req: Request, resp: Response) {
    // regex to match kebab-case strings
    const re = /^[a-z]+(?:-[a-z]+)*$/;

    const section = req.params.section;

    if (!re.test(section)) {
      throw new Error('invalid section name');
    }

    resp.status(200).send(`coming from controller :${section}`);
  }
}

import { Request, Response } from 'express';
import { HttpStatusCode } from 'axios';
import { CacheService } from '../services/cache';
import { AppError } from '../error';

export class GuardianController {
  constructor(private cache: CacheService) {}

  handleSection(req: Request, resp: Response) {
    // regex to match kebab-case strings
    const re = /^[a-z]+(?:-[a-z]+)*$/;

    const section = req.params.section;

    if (!re.test(section)) {
      throw new AppError(
        HttpStatusCode.BadRequest,
        `invalid guardian api section name: ${section}`
      );
    }

    // TODO: need to build feedService
    if (!this.cache.get(section)) {
      const xml = '<xml></xml>';

      this.cache.save(section, xml);
    }

    resp.header('Content-Type', 'application/xml');
    resp.send(this.cache.get(section));
  }
}

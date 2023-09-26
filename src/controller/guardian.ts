import { Request, Response } from 'express';
import { HttpStatusCode } from 'axios';
import { FeedService } from '../services/feed';
import { CacheService } from '../services/cache';
import { AppError } from '../error';

export class GuardianController {
  constructor(
    private feedSvc: FeedService,
    private cache: CacheService
  ) {}

  async handleSection(req: Request, resp: Response) {
    // regex to match kebab-case strings
    const re = /^[a-z]+(?:-[a-z]+)*$/;

    const section = req.params.section;

    if (!re.test(section)) {
      throw new AppError(
        HttpStatusCode.BadRequest,
        `invalid guardian api section name: ${section}`
      );
    }

    if (!this.cache.get(section)) {
      const hostUrl = `${req.protocol}://${req.get('host')}`;
      const xml = await this.feedSvc.generate(section, hostUrl);

      this.cache.save(section, xml);
    }

    resp.header('Content-Type', 'application/xml');
    resp.send(this.cache.get(section));
  }
}

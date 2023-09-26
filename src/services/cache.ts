import NodeCache from 'node-cache';

export class CacheService {
  private storage: NodeCache;

  constructor(ttl: number) {
    this.storage = new NodeCache({ stdTTL: ttl });
  }

  get(section: string) {
    return this.storage.get(section);
  }

  save(section: string, data: string) {
    this.storage.set(section, data);
  }
}

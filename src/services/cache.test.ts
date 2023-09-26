import { CacheService } from './cache';

const mockNodeCache = {
  get: jest.fn(),
  set: jest.fn(),
};

jest.mock('node-cache', () => ({
  __esModule: true,
  default: jest.fn(() => mockNodeCache),
}));

describe('CacheService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get data from cache', () => {
    const cacheService = new CacheService(60);
    const section = 'testSection';
    const cachedData = 'cachedData';

    mockNodeCache.get.mockReturnValueOnce(cachedData);

    const result = cacheService.get(section);

    expect(result).toBe(cachedData);
    expect(mockNodeCache.get).toHaveBeenCalledWith(section);
  });

  it('should save data to cache', () => {
    const cacheService = new CacheService(60);
    const section = 'testSection';
    const dataToCache = 'dataToCache';

    cacheService.save(section, dataToCache);

    expect(mockNodeCache.set).toHaveBeenCalledWith(section, dataToCache);
  });
});

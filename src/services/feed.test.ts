import { FeedService } from './feed';
import { GuardianService } from './guardian';
import { AppError } from '../error';
import { HttpStatusCode } from 'axios';

class MockedGuardianService implements Partial<GuardianService> {
  async articles(section: string) {
    const sampleArticles = [
      {
        id: 'article1',
        webTitle: 'Article 1',
        webUrl: 'https://www.example.com/article1',
        webPublicationDate: '2023-09-26T10:00:00Z',
        sectionName: 'Technology',
        sectionId: 'technology',
      },
    ];
    return sampleArticles;
  }
}

const feedService = new FeedService(
  new MockedGuardianService() as GuardianService
);

describe('FeedService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should generate an RSS feed for a section with articles', async () => {
    const section = 'technology';
    const hostUrl = 'https://example.com';

    const rssFeed = await feedService.generate(section, hostUrl);

    expect(rssFeed).toContain(
      '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">'
    );
    expect(rssFeed).toContain('<title>The Guardian - Technology</title>');
    expect(rssFeed).toContain(
      '<link>https://www.theguardian.com/technology</link>'
    );
  });

  it('should throw an error when generating an RSS feed for an empty section', async () => {
    const section = 'empty-section';
    const hostUrl = 'https://example.com';

    (feedService as any).guardianSvc.articles = jest
      .fn()
      .mockResolvedValueOnce([]);

    await expect(feedService.generate(section, hostUrl)).rejects.toThrowError(
      new AppError(
        HttpStatusCode.NoContent,
        'empty-section does not have any content'
      )
    );
  });
});

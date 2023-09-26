import axios from 'axios';
import { GuardianService } from './guardian';

describe('GuardianService', () => {
  const apiURL = 'https://api.guardian.com';
  const apiKey = '';
  const service = new GuardianService(apiURL, apiKey);

  it('should fetch articles for a section successfully', async () => {
    const section = 'technology';
    const mockData = {
      response: {
        status: 'ok',
        section: {
          id: 'technology',
          webTitle: 'Technology',
          webUrl: 'https://www.guardian.com/technology',
        },
        results: [
          {
            id: 'article1',
            webTitle: 'Article 1',
            webPublicationDate: '2023-09-26T10:00:00Z',
            sectionName: 'Technology',
            sectionId: 'technology',
            webUrl: 'https://www.guardian.com/article1',
          },
        ],
      },
    };

    const axiosGetSpy = jest.spyOn(axios, 'get');
    axiosGetSpy.mockResolvedValueOnce({
      data: mockData,
      status: 200,
      statusText: 'OK',
    });

    const articles = await service.articles(section);

    expect(axiosGetSpy).toHaveBeenCalledWith(`${apiURL}/${section}`, {
      params: { 'api-key': apiKey },
    });

    expect(articles).toEqual(mockData.response.results);

    axiosGetSpy.mockRestore();
  });
});

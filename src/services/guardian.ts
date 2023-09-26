import axios, { AxiosError, HttpStatusCode } from 'axios';
import { AppError } from '../error';

interface APISection {
  id: string;
  webTitle: string;
  webUrl: string;
}

export interface APIResult extends APISection {
  webPublicationDate: string;
  sectionName: string;
  sectionId: string;
}

interface APIResponse {
  response: {
    status: string;
    section: APISection;
    results: APIResult[];
  };
}

const isAxiosError = (e: AxiosError | any): e is AxiosError => {
  return e && e.isAxiosError;
};

export class GuardianService {
  constructor(
    private apiURL: string,
    private apiKey: string
  ) {}

  private async fetch(url: string) {
    try {
      const response = await axios.get(url, {
        params: { 'api-key': this.apiKey },
      });

      return response;
    } catch (e) {
      if (isAxiosError(e)) {
        const status = e.response?.status ?? HttpStatusCode.BadRequest;

        throw new AppError(
          status,
          `failed to fetch data from the guardian api: ${url}: ${e.response?.statusText}`
        );
      }

      throw new AppError(
        HttpStatusCode.InternalServerError,
        `an unexpected error occurred: ${url} : ${String(e)}`
      );
    }
  }

  async articles(section: string) {
    const fetchRes = await this.fetch(`${this.apiURL}/${section}`);

    if (fetchRes.status !== HttpStatusCode.Ok) {
      throw new AppError(fetchRes.status, fetchRes.statusText);
    }

    return (fetchRes.data as APIResponse).response.results;
  }
}

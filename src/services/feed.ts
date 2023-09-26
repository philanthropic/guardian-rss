import { HttpStatusCode } from 'axios';
import { AppError } from '../error';
import { APIResult, GuardianService } from './guardian';

export class FeedService {
  constructor(private guardianSvc: GuardianService) {}

  async generate(section: string, hostUrl: string) {
    const articles = await this.guardianSvc.articles(section);

    if (articles.length === 0) {
      throw new AppError(
        HttpStatusCode.NoContent,
        `${section} does not have any content`
      );
    }

    // rss specification: https://www.rssboard.org/rss-specification#sampleFiles
    const xml = `<?xml version="1.0"?>
      <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
        <channel>
          <title>The Guardian - ${articles[0].sectionName}</title>
          <link>https://www.theguardian.com/${articles[0].sectionId}</link>
          <description>${
            articles[0].sectionName
          } | Original reporting and incisive analysis, direct from the Guardian every morning</description>
          <language>en-us</language>
          <copyright>© 2023 Guardian News & Media Limited or its affiliated companies. All rights reserved. (modern)</copyright>
          <docs>https://validator.w3.org/feed/docs/rss2.html</docs>
          <generator>Guardian RSS by Gopal KC</generator>
          <atom:link href="${hostUrl}/${section}" rel="self" type="application/rss+xml"/>
          ${this.rssItems(articles)}
        </channel>
      </rss>
    `;

    return this.excapeXmlChars(xml);
  }

  private rssItems(articles: APIResult[]) {
    return articles
      .map(
        article => `<item>
          <title>${article.webTitle}</title>
          <link>${article.webUrl}</link>
          <guid>${article.webUrl}</guid>
          <pubDate>${new Date(
            article.webPublicationDate
          ).toUTCString()}</pubDate>
          <category>${article.sectionName}</category>
        </item>`
      )
      .join('');
  }

  private excapeXmlChars(xml: string) {
    return xml.replace(/&/g, '&amp;').replace(/'/g, '&apos;');
  }
}

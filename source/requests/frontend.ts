/*!
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';

import * as Responses from '../responses';

import { Input } from './input';
import { Helper } from './helper';

/**
 * Frontend client class.
 */
@Class.Describe()
export class Frontend extends Class.Null {
  /**
   * Get all response headers as native headers map.
   * @param headers Non-native headers object.
   * @returns Returns the native headers map.
   */
  @Class.Private()
  private static getResponseHeaders(headers: Headers): Responses.Headers {
    const data = <Responses.Headers>{};
    for (const pair of headers.entries()) {
      const [name, value] = pair;
      const entry = name.toLowerCase();
      const current = data[entry];
      if (current === void 0) {
        data[entry] = value;
      } else if (current instanceof Array) {
        current.push(value);
      } else {
        data[entry] = [current];
      }
    }
    return data;
  }

  /**
   * Gets the response output entity.
   * @param input Request input.
   * @param payload Response payload.
   * @param response Response object.
   * @returns Returns the response output entity.
   */
  @Class.Private()
  private static getResponseOutput(input: Input, payload: string, response: Response): Responses.Output {
    const output = <Responses.Output>{
      input: input,
      headers: this.getResponseHeaders(response.headers),
      status: {
        code: response.status,
        message: response.statusText
      }
    };
    if (payload.length > 0) {
      if (Helper.isAcceptedContentType(<string>output.headers['content-type'], 'application/json')) {
        output.payload = JSON.parse(payload);
      } else {
        output.payload = payload;
      }
    }
    return output;
  }

  /**
   * Request a new response from the API using a frontend HTTP/HTTPS client.
   * @param input Request input.
   * @returns Returns the request output.
   */
  @Class.Public()
  public static async request(input: Input): Promise<Responses.Output> {
    const options = <RequestInit>{
      method: input.method,
      headers: new Headers(<any>input.headers)
    };
    if (input.payload) {
      options.body = JSON.stringify(input.payload);
      (<Headers>options.headers).set('Content-Type', 'application/json');
    }
    const response = await fetch(input.url, options);
    const payload = await response.text();
    return this.getResponseOutput(input, payload, response);
  }
}

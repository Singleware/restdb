/*!
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';

import * as Response from '../response';

import { Headers as ResponseHeaders } from '../headers';
import { Input } from './input';

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
  private static getResponseHeaders(headers: Headers): ResponseHeaders {
    const data = <ResponseHeaders>{};
    const entries = headers.entries();
    for (const entry of entries) {
      const [name, value] = entry;
      const current = data[name];
      if (current === void 0) {
        data[name] = <string>headers.get(name);
      } else if (current instanceof Array) {
        current.push(value);
      } else {
        data[name] = [current];
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
  private static getResponseOutput(input: Input, payload: string, response: Response): Response.Output {
    const output = <Response.Output>{
      input: input,
      headers: this.getResponseHeaders(response.headers),
      status: {
        code: response.status,
        message: response.statusText
      }
    };
    if (payload.length > 0) {
      output.payload = JSON.parse(payload);
    }
    return output;
  }

  /**
   * Request a new response from the API using a frontend HTTP/HTTPS client.
   * @param input Request input.
   * @returns Returns the request output.
   */
  @Class.Public()
  public static async request(input: Input): Promise<Response.Output> {
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

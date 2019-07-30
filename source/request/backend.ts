/*!
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Http from 'http';

import * as Class from '@singleware/class';

import * as Response from '../response';

import { Input } from './input';

/**
 * Backend client class.
 */
@Class.Describe()
export class Backend extends Class.Null {
  /**
   * Gets the request options entity.
   * @param input Request input.
   * @param url Request URL.
   * @returns Return the request options entity.
   */
  @Class.Private()
  private static getRequestOptions(input: Input, url: URL): Http.RequestOptions {
    const options = {
      method: input.method,
      headers: input.headers,
      protocol: url.protocol,
      port: url.port,
      host: url.hostname,
      path: url.pathname
    };
    return options;
  }

  /**
   * Gets the response output entity.
   * @param input Request input.
   * @param payload Response payload.
   * @param response Response object.
   * @returns Returns the response output entity.
   */
  @Class.Private()
  private static getResponseOutput(input: Input, payload: string, response: Http.IncomingMessage): Response.Output {
    const output = <Response.Output>{
      input: input,
      headers: response.headers,
      status: {
        code: response.statusCode || 0,
        message: response.statusMessage || ''
      }
    };
    if (payload.length > 0) {
      output.payload = JSON.parse(payload);
    }
    return output;
  }

  /**
   * Response, event handler.
   * @param input Input request.
   * @param resolve Promise resolve callback.
   * @param reject Promise reject callback.
   * @param response Request response.
   */
  @Class.Private()
  private static responseHandler(input: Input, resolve: Class.Callable, reject: Class.Callable, response: Http.IncomingMessage): void {
    let payload = '';
    response.setEncoding('utf8');
    response.on('data', (data: string) => (payload += data));
    response.on('error', (error: Error) => reject(error));
    response.on('end', () => resolve(this.getResponseOutput(input, payload, response)));
  }

  /**
   * Request a new response from the API using a backend HTTP/HTTPS client.
   * @param input Request input.
   * @returns Returns the request output.
   */
  @Class.Public()
  public static async request(input: Input): Promise<Response.Output> {
    const url = new URL(input.url);
    const client = require(url.protocol.substr(0, url.protocol.length - 1));
    let payload: string;
    if (input.payload) {
      payload = JSON.stringify(input.payload);
      input.headers['Content-Length'] = payload.length.toString();
      input.headers['Content-Type'] = 'application/json';
    }
    return new Promise<Response.Output>((resolve: (value: Response.Output) => void, reject: (value: Error) => void): void => {
      const request = client.request(this.getRequestOptions(input, url), this.responseHandler.bind(this, input, resolve, reject));
      if (payload) {
        request.write(payload);
        request.end();
      }
    });
  }
}

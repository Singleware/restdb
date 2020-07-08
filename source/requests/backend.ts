/*!
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Http from 'http';

import * as Class from '@singleware/class';

import * as Responses from '../responses';

import { Input } from './input';
import { Helper } from './helper';

/**
 * Backend client class.
 */
@Class.Describe()
export class Backend extends Class.Null {
  /**
   * Get all response headers as native headers map.
   * @param headers Non-native headers object.
   * @returns Returns the native headers map.
   */
  @Class.Private()
  private static getResponseHeaders(headers: Http.IncomingHttpHeaders): Responses.Headers {
    const data = <Responses.Headers>{};
    for (const name in headers) {
      data[name.toLowerCase()] = headers[name];
    }
    return data;
  }

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
      headers: this.getResponseHeaders(input.headers),
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
  private static getResponseOutput(input: Input, payload: Buffer, response: Http.IncomingMessage): Responses.Output {
    const output = <Responses.Output>{
      input: input,
      headers: response.headers,
      status: {
        code: response.statusCode ?? 0,
        message: response.statusMessage ?? 'Undefined status'
      }
    };
    if (payload.length > 0) {
      if (Helper.isAcceptedContentType(<string>output.headers['content-type'], 'application/json')) {
        output.payload = JSON.parse(payload.toString('utf-8'));
      } else {
        output.payload = payload;
      }
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
  private static responseHandler(
    input: Input,
    resolve: Class.Callable,
    reject: Class.Callable,
    response: Http.IncomingMessage
  ): void {
    let chunks = <Uint8Array[]>[];
    response.on('data', chunk => chunks.push(new Uint8Array(chunk)));
    response.on('error', error => reject(error));
    response.on('end', () => resolve(this.getResponseOutput(input, Buffer.concat(chunks), response)));
  }

  /**
   * Request a new response from the API using a backend HTTP/HTTPS client.
   * @param input Request input.
   * @returns Returns the request output.
   */
  @Class.Public()
  public static async request(input: Input): Promise<Responses.Output> {
    const url = new URL(input.url);
    const client = require(url.protocol.substr(0, url.protocol.length - 1));
    let payload: string;
    if (input.payload) {
      payload = JSON.stringify(input.payload);
      input.headers['Content-Length'] = Buffer.byteLength(payload).toString();
      input.headers['Content-Type'] = 'application/json';
    }
    return new Promise<Responses.Output>(
      (resolve: (value: Responses.Output) => void, reject: (value: Error) => void): void => {
        const options = this.getRequestOptions(input, url);
        const request = <Http.ClientRequest>client.request(options, this.responseHandler.bind(this, input, resolve, reject));
        if (payload) {
          request.write(payload);
        }
        request.end();
      }
    );
  }
}

/*!
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';

/**
 * Request helper class.
 */
@Class.Describe()
export class Helper extends Class.Null {
  /**
   * Check if the specified content type is accepted based on the expected content types.
   * @param content Content type.
   * @param expected Expected content types.
   * @returns Returns true when the specified content type is accepted, false otherwise.
   */
  @Class.Public()
  public static isAcceptedContentType(content: string, ...expected: string[]): boolean {
    const index = content.indexOf(';');
    const mime = content.substr(0, index === -1 ? content.length : index);
    return expected.includes(mime.trim());
  }

  /**
   * Check if the specified status code is accepted or not.
   * @param status Status code.
   * @returns Returns true when the specified status code is accepted, false otherwise.
   */
  @Class.Public()
  public static isAcceptedStatusCode(status: number): boolean {
    return status >= 200 && status <= 299;
  }
}

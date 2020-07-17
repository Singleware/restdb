/*!
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';

import * as RestDB from '../source';

/**
 * Connection string.
 */
const connection = 'http://127.0.0.1:8080';

/**
 * Database driver.
 */
const driver = new RestDB.Common.Driver();

/**
 * Test class.
 */
@RestDB.Schema.Entity('UserEntity')
@Class.Describe()
class UserEntity extends Class.Null {
  /**
   * User id.
   */
  @RestDB.Schema.Primary()
  @RestDB.Schema.Id()
  @Class.Public()
  public id?: string;
  /**
   * User first name.
   */
  @RestDB.Schema.String()
  @Class.Public()
  public firstName?: string;
  /**
   * User last name.
   */
  @RestDB.Schema.String()
  @Class.Public()
  public lastName?: string;
}

/**
 * Database mapper.
 */
@Class.Describe()
class UserMapper extends Class.Null {
  /**
   * Mapper instance.
   */
  @Class.Private()
  private mapper = new RestDB.Mapper<UserEntity>(driver, UserEntity);

  /**
   * Create a test user.
   * @returns Returns a promise to get the new user Id.
   */
  @Class.Public()
  public async create(): Promise<string> {
    const id = await this.mapper.insert({ firstName: 'First 1', lastName: 'Last 1' });
    if (typeof id !== 'string') {
      throw new Error(`Unable to insert new users.`);
    }
    return id;
  }

  /**
   * Change the test user.
   * @param id User id.
   * @returns Returns a promise to get the number of updated users.
   */
  @Class.Public()
  public async change(id: string): Promise<number> {
    const state = await this.mapper.update({ id: { operator: RestDB.Operator.Equal, value: id } }, { firstName: 'Changed!' });
    if (state === void 0) {
      throw new Error(`Unable to update the user '${id}'.`);
    }
    return state;
  }

  /**
   * Replace the test user.
   * @param id User id.
   * @returns Returns a promise to get the replacement status.
   */
  @Class.Public()
  public async replace(id: string): Promise<boolean> {
    const state = await this.mapper.replaceById(id, { firstName: 'Replaced!' });
    if (state === void 0) {
      throw new Error(`Unable to replace the user '${id}'.`);
    }
    return state;
  }

  /**
   * Read the test user.
   * @param id User id.
   * @returns Returns a promise to get the list of found users.
   */
  @Class.Public()
  public async read(id: string): Promise<UserEntity[]> {
    const users = await this.mapper.find({
      pre: {
        id: { operator: RestDB.Operator.Equal, value: id }
      },
      sort: {
        id: RestDB.Order.Ascending
      },
      limit: {
        start: 0,
        count: 1
      }
    });
    if (users === void 0) {
      throw new Error(`Unable to read the user '${id}'.`);
    }
    return users;
  }

  /**
   * Remove the test user.
   * @param id User id.
   * @returns Returns a promise to get the number of removed users.
   */
  @Class.Public()
  public async remove(id: string): Promise<number> {
    const state = await this.mapper.delete({ id: { operator: RestDB.Operator.Equal, value: id } });
    if (state === void 0) {
      throw new Error(`Unable to remove the user '${id}'.`);
    }
    return state;
  }
}

/**
 * Test operations.
 */
async function crudTest(): Promise<void> {
  // User mapper class.
  const mapper = new UserMapper();
  let result;

  // Connect
  await driver.connect(connection);
  console.log('Connect');

  // Create user
  const id = await mapper.create();
  result = (await mapper.read(id))[0];
  console.log('Create:', id, result?.firstName, result?.lastName);

  // Update user
  const update = await mapper.change(id);
  result = (await mapper.read(id))[0];
  console.log('Update:', update, result?.firstName, result?.lastName);

  // Replace user
  const replace = await mapper.replace(id);
  result = (await mapper.read(id))[0];
  console.log('Replace:', replace, result?.firstName, result?.lastName);

  // Delete user
  console.log('Delete:', await mapper.remove(id));
}

crudTest();

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
class UserMapper extends RestDB.Mapper<UserEntity> {
  /**
   * Default constructor.
   */
  constructor() {
    super(driver, UserEntity);
  }

  /**
   * Create a test user.
   * @returns Returns a promise to get the new user id.
   */
  @Class.Public()
  public async create(): Promise<string> {
    return await this.insert({ firstName: 'First 1', lastName: 'Last 1' });
  }

  /**
   * Change the test user.
   * @param id User id.
   * @returns Returns a promise to get the number of updated users.
   */
  @Class.Public()
  public async change(id: string): Promise<number> {
    return await this.update({ id: { operator: RestDB.Operator.Equal, value: id } }, { firstName: 'Changed!' });
  }

  /**
   * Replace the test user.
   * @param id User id.
   * @returns Returns a promise to get the replacement status.
   */
  @Class.Public()
  public async replace(id: string): Promise<boolean> {
    return await this.replaceById(id, { firstName: 'Replaced!' });
  }

  /**
   * Read the test user.
   * @param id User id.
   * @returns Returns a promise to get the list of found users.
   */
  @Class.Public()
  public async read(id: string): Promise<UserEntity[]> {
    return await this.find({
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
  }

  /**
   * Remove the test user.
   * @param id User id.
   * @returns Returns a promise to get the number of removed users.
   */
  @Class.Public()
  public async remove(id: string): Promise<number> {
    return await this.delete({ id: { operator: RestDB.Operator.Equal, value: id } });
  }
}

/**
 * Test operations.
 */
async function crudTest(): Promise<void> {
  // User mapper class.
  const mapper = new UserMapper();

  // Connect
  await driver.connect(connection);
  console.log('Connect');

  // Create user
  const id = await mapper.create();
  const before = await mapper.read(id);
  console.log('Create:', id, before[0].firstName, before[0].lastName);

  // Update user
  const update = await mapper.change(id);
  const middle = await mapper.read(id);
  console.log('Update:', update, middle[0].firstName, middle[0].lastName);

  // Replace user
  const replace = await mapper.replace(id);
  const after = await mapper.read(id);
  console.log('Replace:', replace, after[0].firstName, after[0].lastName);

  // Delete user
  console.log('Delete:', await mapper.remove(id));
}

crudTest();

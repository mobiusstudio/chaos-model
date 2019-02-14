import { DatabaseTable } from '../../../lib'

export class User extends DatabaseTable {
  constructor() {
    super({
      schemaName: 'user',
      tableName: 'user',
      pkeyIndex: 0,
      columns: [
        {
          type: 'id-auto',
          name: 'id',
        },
        {
          type: 'string',
          name: 'username',
        },
        {
          type: 'password',
          name: 'password',
          alias: 'user_password',
        },
        {
          type: 'string',
          name: 'idToken',
        },
      ],
    })
  }
}

export class UserProfile extends DatabaseTable {
  constructor() {
    super({
      schemaName: 'user',
      tableName: 'profile',
      pkeyIndex: 0,
      columns: [
        {
          type: 'id',
          name: 'userId',
          foreign: ['user', 'user'],
        },
        {
          type: 'string',
          name: 'name',
        },
        {
          type: 'int',
          name: 'age',
        },
        {
          type: 'id',
          name: 'loverId',
          foreign: ['user', 'user'],
        },
        {
          type: 'id',
          name: 'carId',
        },
      ],
    })
  }
}

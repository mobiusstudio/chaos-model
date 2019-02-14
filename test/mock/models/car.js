import { DatabaseTable } from '../../../lib'

export class Car extends DatabaseTable {
  constructor() {
    super({
      schemaName: 'car',
      tableName: 'car',
      pkeyIndex: 0,
      columns: [
        {
          type: 'id-auto',
          name: 'id',
        },
        {
          type: 'string',
          name: 'carName',
          required: 'true',
        },
        {
          type: 'id',
          name: 'ownerId',
        },
      ],
    })
  }
}

import { DatabaseTable } from '../../../lib'

export class Task extends DatabaseTable {
  constructor() {
    super({
      schemaName: 'task',
      tableName: 'task',
      pkeyIndex: 0,
      columns: [
        {
          name: 'id',
          alias: 'taskId',
          type: 'id',
        },
        {
          name: 'isCompleted',
          type: 'boolean',
        },
        {
          name: 'title',
          type: 'string',
        },
        {
          name: 'content',
          alias: 'taskContent',
          type: 'string',
        },
        {
          name: 'deadline',
          type: 'timestamp',
        },
      ],
    })
  }
}

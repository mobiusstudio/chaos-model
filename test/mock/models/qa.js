import { DatabaseTable } from '../../../lib'

export class Question extends DatabaseTable {
  constructor() {
    super({
      schemaName: 'library',
      tableName: 'question',
      pkeyIndex: 0,
      columns: [
        {
          name: 'id',
          alias: 'questionId',
          type: 'id',
        },
        {
          name: 'content',
          table: 'question',
          type: 'string',
        },
        {
          name: 'answerId',
          foreign: ['library', 'answer'],
          type: 'id',
        },
      ],
    })
  }
}

export class Answer extends DatabaseTable {
  constructor() {
    super({
      schemaName: 'library',
      tableName: 'answer',
      pkeyIndex: 0,
      columns: [
        {
          name: 'id',
          alias: 'answerId',
          type: 'id',
        },
        {
          name: 'description',
          type: 'id',
        },
      ],
    })
  }
}
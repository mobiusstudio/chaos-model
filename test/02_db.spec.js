import { DatabaseTable, ColumnArray, Column } from '../lib'
class Gallery extends DatabaseTable {
  constructor() {
    super('gallery', 'gallery')
    this.columns = new ColumnArray([
      new Column({
        name: 'id',
        alias: 'galleryId',
        type: 'id',
      }),
      new Column({
        name: 'name',
        type: 'string',
      }),
      new Column({
        name: 'imageUrl',
        type: 'string',
      }),
      new Column({
        name: 'tenantId',
        type: 'int',
      }),
      new Column({
        name: 'botId',
        type: 'string',
      }),
    ], this.tableName)
  }
}

describe('========== Query from database ==========', () => {
  it('query from db', async () => {
    const galleries = await new Gallery().from().select().do()
    console.log(galleries)
  })
})


import { snakeCase } from 'lodash'
import { BaseColumn } from './column-base'
import { AggrColumn } from './column-aggr'

export class Column extends BaseColumn {
  constructor({ name, alias, foreign, table, type, def, required }) {
    super({ name, alias, foreign, table, type, def, required })
  }

  sqlize = () => `${snakeCase(this.table)}.${snakeCase(this.name)}`

  aggr = (aggrType, alias) => {
    const res = new AggrColumn(aggrType, alias, this)
    return res
  }
}

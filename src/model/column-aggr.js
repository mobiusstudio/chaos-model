import { snakeCase } from 'lodash'
import { BaseColumn } from './column-base'

export class AggrColumn extends BaseColumn {
  constructor(aggrType, alias, column) {
    const { name, foreign, table, type, def, required } = column
    super({ name, alias, foreign, table, type, def, required })
    this.aggrType = aggrType
  }

  sqlize = () => {
    switch (this.aggrType) {
      case 'array': return `array_agg(${snakeCase(this.table)}.${snakeCase(this.name)})`
      case 'min': return `min(${snakeCase(this.table)}.${snakeCase(this.name)})`
      case 'max':
      case 'avg':
      case 'sum':
      case 'count':			// TODO: different design
      default: return `${snakeCase(this.table)}.${snakeCase(this.name)}`
    }
  }
}

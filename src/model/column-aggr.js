import { snakeCase } from 'lodash'
import { ColumnBase } from 'chaos-library'

export class ColumnAggr extends ColumnBase {
  constructor(aggrType, alias, column) {
    const { schemaName, tableName, type, name, foreign, default: def, required } = column
    super({
      schemaName,
      tableName,
      type,
      name,
      alias,
      foreign,
      required,
      default: def,
    })
    this.aggrType = aggrType
  }

  sqlize = () => {
    switch (this.aggrType) {
      case 'array': return `array_agg("${snakeCase(this.schemaName)}".${snakeCase(this.tableName)}.${snakeCase(this.name)})`
      case 'min': return `min("${snakeCase(this.schemaName)}".${snakeCase(this.tableName)}.${snakeCase(this.name)})`
      case 'max':
      case 'avg':
      case 'sum':
      case 'count':			// TODO: different design
      default: return `${super.sqlize()}`
    }
  }
}

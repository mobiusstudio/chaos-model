import { snakeCase } from 'lodash'
import { ColumnBase } from 'chaos-library'
import { ColumnAggr } from './column-aggr'

export class Column extends ColumnBase {
  constructor({
    schemaName,
    tableName,
    type,
    name,
    alias = null,
    foreign = null,
    required = false,
    default: def = null,
  }) {
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
  }

  sqlize = () => `"${snakeCase(this.schemaName)}".${snakeCase(this.tableName)}.${snakeCase(this.name)}`


  sqlizeForeign = () => {
    if (this.foreign === null) return null
    if (typeof this.foreign === 'string') return `"${snakeCase(this.schemaName)}".${snakeCase(this.foreign)}`
    if (this.foreign.length === 1) return `"${snakeCase(this.schemaName)}".${snakeCase(this.foreign[0])}`
    if (this.foreign.length === 2) return `"${snakeCase(this.foreign[0])}".${snakeCase(this.foreign[1])}`
    return null
  }

  aggr = (aggrType, alias) => new ColumnAggr(aggrType, alias, this)
}

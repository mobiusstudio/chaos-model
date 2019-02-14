/* eslint-disable no-param-reassign */
import joi from 'joi'
import { schemaRules } from '../types'

export class ColumnBase {
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
    const result = joi.validate({
      schemaName,
      tableName,
      type,
      name,
      alias,
      foreign,
      required,
      default: def,
    }, joi.object().keys(schemaRules.column))
    if (!result.error) {
      this.schemaName = schemaName
      this.tableName = tableName
      this.type = type
      this.name = name
      this.alias = alias
      this.foreign = foreign
      this.required = required
      this.default = def
    } else {
      console.log(result.error)
      throw new Error('Invalid column data')
    }
  }
}

export class TableBase {
  constructor({
    schemaName,
    tableName,
    pkeyIndex = 0,
    columns = [],
  }) {
    const result = joi.validate({
      schemaName,
      tableName,
      pkeyIndex,
      columns,
    }, joi.object().keys(schemaRules.table))
    if (!result.error) {
      this.schemaName = schemaName
      this.tableName = tableName
      this.pkeyIndex = pkeyIndex
      this.columns = columns
    } else {
      console.log(result.error)
      throw new Error('Invalid table data')
    }
  }
}

export class SchemaBase {
  constructor({
    schemaName,
    tables = [],
  }) {
    const result = joi.validate({
      schemaName,
      tables,
    }, joi.object().keys(schemaRules.schema))
    if (!result.error) {
      this.schemaName = schemaName
      this.tables = tables
    } else {
      console.log(result.error)
      throw new Error('Invalid schema data')
    }
  }
}

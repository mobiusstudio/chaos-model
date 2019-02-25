import joi from 'joi'
import { snakeCase } from 'lodash'
import { typeMap as T } from '../libs/types'
import { Column } from './column'
import { ColumnAggr } from './column-aggr'
import errors from '../errors'

errors.register({
  ValidateFailed: 400,
})

export class ColumnArray {
  constructor(items) {
    this.items = items.map((item) => {
      const {
        schemaName,
        tableName,
        type,
        name,
        alias = null,
        foreign = null,
        required = false,
        default: def = null,
        aggrType = null,
      } = item
      const newColumn = new Column({
        schemaName,
        tableName,
        type,
        name,
        alias,
        foreign,
        required,
        default: def,
      })
      if (aggrType && typeof aggrType === 'string') return new ColumnAggr(aggrType, alias, newColumn)
      return newColumn
    })
  }

  map = func => this.items.map(func)

  forEach = (func) => {
    this.items.forEach(func)
  }

  validateAll = (data) => {
    const obj = {}
    this.items.forEach((item) => {
      const { type, name, required: req, default: def } = item
      obj[name] = T.get(type).joi({ req, def })
    })
    const schema = joi.object().keys(obj)
    const result = joi.validate(data, schema)
    if (result.error) {
      console.log(result.error)
      throw new errors.ValidateFailedError(result.error.details[0].message)
    }
  }

  validate = (type, value) => {
    const result = joi.validate(value, T.get(type).joi({ req: true }))
    if (result.error) {
      console.log(result.error)
      throw new errors.ValidateFailedError(result.error.details[0].message)
    }
  }

  objlize = () => {
    const res = {}
    this.items.forEach((item) => {
      const alias = item.alias ? item.alias : item.name
      if (res[`${snakeCase(alias)}`]) {
        // eslint-disable-next-line no-console
        console.warn('duplicate column', item.alias, item.name)
      }
      res[`"${snakeCase(alias)}"`] = item.sqlize() // BUG: sqorn auto snakecase has problem with "
    })
    return res
  }

  filter = (names) => {
    const newItems = this.items.filter((column) => {
      let flag = false
      names.forEach((name) => {
        if (name === column.name || name === `${column.tableName}.${column.name}`) {
          flag = true
        }
      })
      return flag
    })
    return new ColumnArray(newItems)
  }

  remove = (names) => {
    const newItems = this.items.filter((column) => {
      let flag = true
      names.forEach((name) => {
        if (name === column.name || name === `${column.tableName}.${column.name}`) {
          flag = false
        }
      })
      return flag
    })
    return new ColumnArray(newItems)
  }

  concat = (columns) => {
    const newItems = this.items.concat(columns.items)
    return new ColumnArray(newItems)
  }

  first = name => this.items.find(column => name === column.name || name === `${column.tableName}.${column.name}`)
}

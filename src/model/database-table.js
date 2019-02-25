import { snakeCase, camelCase, mapKeys } from 'lodash'
import { TableBase } from '../libs/schema'
import { Table } from './table'
import { ColumnArray } from './column-array'
import { sq } from './sq'
import errors from '../errors'

errors.register({
  AddFailed: 400,
  UpdateFailed: 400,
  DeleteFailed: 400,
})

export class DatabaseTable extends TableBase {
  constructor({
    schemaName,
    tableName,
    pkeyIndex = 0,
    columns = [],
  }) {
    super({
      schemaName,
      tableName,
      pkeyIndex,
      columns,
    })
    this.schemaName = schemaName
    this.tableName = tableName
    this.pkeyName = columns[pkeyIndex].name || '#pkeyName#'
    this.pkeyType = columns[pkeyIndex].type
    this.columns = new ColumnArray(columns.map(column => ({
      schemaName,
      tableName,
      ...column,
    })))
  }

  getState = () => sq.from(`"${snakeCase(this.schemaName)}".${snakeCase(this.tableName)}`)

  sqlizePkey = () => `"${snakeCase(this.schemaName)}".${snakeCase(this.tableName)}.${snakeCase(this.pkeyName)}`

  from = () => new Table(this.getState(), this.columns)

  isExit = async (pkeyValue, client) => {
    try {
      if (!pkeyValue) return false
      this.columns.validate(this.pkeyType, pkeyValue)
      const sql = this.getState().where`${sq.raw(`${snakeCase(this.pkeyName)}`)} = ${pkeyValue}`.query
      const res = await client.query(sql.text, sql.args)
      return res.rowCount > 0
    } catch (error) {
      throw error
    }
  }

  push = async ({ data, pkeyValue = null }, client = db) => {
    try {
      const isExit = await this.isExit(pkeyValue, client)
      if (!pkeyValue || !isExit) return await this.add({ data, pkeyValue }, client)
      else return await this.update({ data, pkeyValue }, client)
    } catch (error) {
      throw error
    }
  }

  batchPush = async (dataArray) => {
    try {
      const res = db.transaction(async (client) => {
        const promiseArray = []
        dataArray.forEach((data) => {
          const item = this.push(data, client)
          promiseArray.push(item)
        })
        const resultArray = await Promise.all(promiseArray)
        return resultArray
      })
      return res
    } catch (error) {
      throw error
    }
  }

  add = async ({ data, pkeyValue = null }, client = db) => {
    try {
      const tempData = data
      this.columns.validateAll(tempData)
      if (!pkeyValue) delete tempData[this.pkeyName]
      else tempData[this.pkeyName] = pkeyValue
      const newData = mapKeys(tempData, (value, key) => snakeCase(key))
      const sql = this.getState().insert(newData).return('*').query
      const res = await client.query(sql.text, sql.args)
      if (res.rowCount === 0) throw new errors.AddFailedError()
      return mapKeys(res.rows[0], (value, key) => camelCase(key))
    } catch (error) {
      throw error
    }
  }

  // batchAdd = async (dataArray) => {
  //   try {
  //     const res = db.transaction(async (client) => {
  //       const promiseArray = []
  //       dataArray.forEach((data) => {
  //         const item = this.add(data, client)
  //         promiseArray.push(item)
  //       })
  //       const resultArray = await Promise.all(promiseArray)
  //       return resultArray
  //     })
  //     return res
  //   } catch (error) {
  //     throw error
  //   }
  // }

  update = async ({ data, pkeyValue }, client = db) => {
    try {
      const tempData = data
      tempData[`${this.pkeyName}`] = pkeyValue
      this.columns.validateAll(tempData)
      const newData = mapKeys(data, (value, key) => snakeCase(key))
      delete newData[snakeCase(this.pkeyName)]
      const sql = this.getState().where`${sq.raw(`${snakeCase(this.pkeyName)}`)} = ${pkeyValue}`.set(newData).return('*').query
      const res = await client.query(sql.text, sql.args)
      if (res.rowCount === 0) throw new errors.UpdateFailedError(`${pkeyValue}`)
      return mapKeys(res.rows[0], (value, key) => camelCase(key))
    } catch (error) {
      throw error
    }
  }

  // batchUpdate = async (paramsArray) => {
  //   try {
  //     const res = db.transaction(async (client) => {
  //       const promiseArray = []
  //       paramsArray.forEach((params) => {
  //         const item = this.update(params, client)
  //         promiseArray.push(item)
  //       })
  //       const resultArray = await Promise.all(promiseArray)
  //       return resultArray
  //     })
  //     return res
  //   } catch (error) {
  //     throw error
  //   }
  // }

  delete = async (pkeyValue, client = db) => {
    try {
      this.columns.validate(this.pkeyType, pkeyValue)
      const sql = this.getState().where`${sq.raw(`${snakeCase(this.pkeyName)}`)} = ${pkeyValue}`.delete.query
      const res = await client.query(sql.text, sql.args)
      if (res.rowCount === 0) throw new errors.DeleteFailedError(`${pkeyValue}`)
      return pkeyValue
    } catch (error) {
      throw error
    }
  }

  batchDelete = async (pkeyArray) => {
    try {
      const res = db.transaction(async (client) => {
        const promiseArray = []
        pkeyArray.forEach((pkeyValue) => {
          const item = this.delete(pkeyValue, client)
          promiseArray.push(item)
        })
        const resultArray = await Promise.all(promiseArray)
        return resultArray
      })
      return res
    } catch (error) {
      throw error
    }
  }
}

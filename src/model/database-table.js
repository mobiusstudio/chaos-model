import { snakeCase, mapKeys } from 'lodash'
import { camelCaseObject } from '../utils'
import { Table } from './table'
import { ColumnArray } from './column-array'
import { sq } from './sq'
import errors from '../errors'

errors.register({
  AddFailed: 400,
  UpdateFailed: 400,
  DeleteFailed: 400,
})

export class DatabaseTable {
  constructor(schemaName, tableName) {
    this.schemaName = schemaName
    this.tableName = tableName
    this.columns = new ColumnArray([])
    this.pkey = 'id'
  }

  getState = () => sq.from(`"${snakeCase(this.schemaName)}".${snakeCase(this.tableName)}`)

  sqlizePkey = () => `${snakeCase(this.tableName)}.${snakeCase(this.pkey)}`

  from = () => new Table(this.getState(), this.columns)

  add = async (data, client = db) => {
    try {
      this.columns.validate(data)
      const newData = mapKeys(data, (value, key) => snakeCase(key))
      delete newData[this.pkey]
      const sql = this.getState().insert(newData).return('*').query
      const res = await client.query(sql.text, sql.args)
      if (res.rowCount === 0) throw new errors.AddFailedError()
      console.log(res.rows[0])
      return(camelCaseObject(res.rows[0]))
    } catch (error) {
      throw error
    }
  }

  batchAdd = async (dataArray) => {
    try {
      const res = db.transaction(async (client) => {
        const promiseArray = []
        dataArray.forEach((data) => {
          const item = this.add(data, client)
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

  update = async ({ data, pkeyValue }, client = db) => {
    try {
      const tempData = data
      tempData[`${this.pkey}`] = pkeyValue
      this.columns.validate(tempData)
      const newData = mapKeys(data, (value, key) => snakeCase(key))
      delete newData[this.pkey]
      const sql = this.getState().where`${sq.raw(`${this.pkey}`)} = ${pkeyValue}`.set(newData).return('*').query
      const res = await client.query(sql.text, sql.args)
      if (res.rowCount === 0) throw new errors.UpdateFailedError(`${pkeyValue}`)
      return camelCaseObject(res.rows[0])
    } catch (error) {
      throw error
    }
  }

  batchUpdate = async (paramsArray) => {
    try {
      const res = db.transaction(async (client) => {
        const promiseArray = []
        paramsArray.forEach((params) => {
          const item = this.update(params, client)
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

  delete = async (pkeyValue, client = db) => {
    try {
      const data = {
        [`${this.pkey}`]: pkeyValue,
      }
      this.columns.validate(data)
      const sql = this.getState().where`${sq.raw(`${this.pkey}`)} = ${pkeyValue}`.delete.query
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

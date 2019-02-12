import { camelCase, snakeCase, mapKeys } from 'lodash'
import errors from '../errors'
import { sq } from './sq'

errors.register({
  InvalidFilterSymbol: 400,
  InvalidNextKey: 400,
})

export class Table {
  constructor(state, columns) {
    this.state = state
    this.columns = columns
  }

  // sample: where(e`genre = ${'Fantasy'}`)
  where = (string, ...values) => {
    const state = this.state.where(string, ...values)
    return new Table(state, this.columns)
  }

  join = (dt) => {
    const ons = {}
    this.columns.forEach((column) => {
      if (column.foreign === dt.tableName) {
        ons[column.sqlize()] = sq.raw(dt.sqlizePkey())
      }
    })
    const state = this.state.join(`"${snakeCase(dt.schemaName)}".${snakeCase(dt.tableName)}`)
      .on(ons)
    const columns = this.columns.concat(dt.columns)
    return new Table(state, columns)
  }

  leftJoin = (dt) => {
    const ons = {}
    this.columns.forEach((column) => {
      if (column.foreign === dt.tableName) {
        ons[column.sqlize()] = sq.raw(dt.sqlizePkey())
      }
    })
    const state = this.state.leftJoin(`"${snakeCase(dt.schemaName)}".${snakeCase(dt.tableName)}`)
      .on(ons)
    const columns = this.columns.concat(dt.columns)
    return new Table(state, columns)
  }

  rightJoin = (dt) => {
    const ons = {}
    this.columns.forEach((column) => {
      if (column.foreign === dt.tableName) {
        ons[column.sqlize()] = sq.raw(dt.sqlizePkey())
      }
    })
    const state = this.state.rightJoin(`"${snakeCase(dt.schemaName)}".${snakeCase(dt.tableName)}`)
      .on(ons)
    const columns = this.columns.concat(dt.columns)
    return new Table(state, columns)
  }

  groupBy = (columns, aggrColumns) => {
    const newColumns = columns.concat(aggrColumns)
    const state = this.state.groupBy(columns.map(column => column.sqlize()))
      .return(newColumns.objlize())

    return new Table(state, newColumns)
  }

  select = (columns = null) => {
    const newColumns = columns || this.columns
    const state = this.state.return(newColumns.objlize())
    return new Table(state, newColumns)
  }

  filter = (state, filters) => {
    if (filters.length === 0) return state
    const symbols = ['=', '<>', '>', '<', '>=', '<=', 'LIKE', '@>', '<@']
    let newState = state
    filters.forEach((item) => {
      if (!symbols.includes(item.symbol)) throw new errors.InvalidFilterSymbolError(item.symbol)
      newState = newState.where`${sq.raw(`${snakeCase(item.key)}`)} ${sq.raw(`${item.symbol}`)} ${item.value}`
    })
    return newState
  }

  paging = (params) => {
    const { page, next, nextKey, filters, orderBy } = params
    const pagesize = params.pagesize || 10
    let { state } = this
    if (filters) {
      state = this.filter(state, filters)
    }
    const count = state.return('count(*)').query
    if (orderBy && orderBy.length > 0) {
      orderBy.forEach((item) => {
        const newItem = item
        newItem.by = snakeCase(newItem.by)
        state = state.orderBy(newItem)
      })
    }
    if (typeof page === 'number') { // page type
      state = state.limit(pagesize).offset(page * pagesize)
    } else if (typeof next === 'number') { // next type
      if (!nextKey || typeof nextKey !== 'string') throw new errors.InvalidNextKeyError(nextKey)
      state = state.limit(pagesize).where`${sq.raw(`${snakeCase(nextKey)}`)} > ${next}`
    }
    const sql = state.query
    return {
      count,
      sql,
    }
  }

  do = async (pagingParams) => {
    try {
      if (pagingParams) {
        const { count, sql } = this.paging(pagingParams)
        const countRes = await db.query(count.text, count.args)
        if (countRes.rowCount < 1) return { total: 0, items: [] }
        const total = countRes.rows[0].count
        const itemsRes = await db.query(sql.text, sql.args)
        if (itemsRes.rowCount < 1) return { total: 0, items: [] }
        const items = itemsRes.rows.map(item => mapKeys(item, (value, key) => camelCase(key)))
        return {
          total,
          items,
        }
      }
      {
        const sql = this.state.query
        const res = await db.query(sql.text, sql.args)
        if (res.rowCount > 0) {
          const newRes = res.rows.map(item => mapKeys(item, (value, key) => camelCase(key)))
          return newRes
        }
      }
      return []
    } catch (error) {
      throw error
    }
  }
}

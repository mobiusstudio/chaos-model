import pg from 'pg'
import errors from './errors'

pg.defaults.parseInt8 = true

export const connect = (connectionString) => {
  const pool = new pg.Pool({ connectionString })

  pool.transaction = async (actions) => {
    let client = null
    try {
      client = await pool.connect()
      await client.query('BEGIN')
      const result = await actions(client)
      await client.query('COMMIT')
      return result
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    } finally {
      if (client) client.end()
    }
  }
  global.db = pool
}

export * from './model'
export { errors }

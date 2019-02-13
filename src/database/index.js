import pgAsPromised from 'pg-then'
import connections from './connections'
import { DbManager } from './manager'

// configure pg
pgAsPromised.pg.defaults.parseInt8 = true

const configure = (options) => {
  connections.configure(options.database)
  return new DbManager({ connections, patchPath: options.patchPath })
}

const query = async (...args) => {
  let argments = args
  let connection = null
  const database = args[0]
  if (Object.prototype.hasOwnProperty.call(connections.postgres, database)) {
    connection = connections.postgres[database]
    if (!connection) {
      throw new Error(`Connection[${database}] isn't existed`)
    }
    argments = args.slice(1)
  } else {
    connection = connections.postgres.default
    if (!connection) {
      throw new Error('Connection.default does not existed')
    }
  }
  let client = null
  try {
    client = pgAsPromised.Client(connection)
    return await client.query(...argments)
  } catch (err) {
    throw err
  } finally {
    if (client) client.end()
  }
}

const transaction = async (database, actions) => {
  let newActions = actions
  let connection = null
  if (typeof database === 'function') {
    newActions = database
    connection = connections.postgres.default
  } else {
    connection = connections.postgres[database]
  }
  let client = null
  try {
    client = pgAsPromised.Client(connection)
    await client.query('BEGIN')
    const result = await newActions(client)
    await client.query('COMMIT')
    return result
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    if (client) client.end()
  }
}

export default {
  configure,
  query,
  transaction,
}

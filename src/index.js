import db from './database'
import errors from './errors'

export const configure = async (options) => {
  global.db = db
  const res = await db.configure(options)
  return res
}

export * from './model'
export { errors }

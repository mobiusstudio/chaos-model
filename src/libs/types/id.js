/* eslint-disable quotes */
import joi from 'joi'
import { Sql, Jot, Joi, Swt, Swg } from './base'

export const id = {
  default: {
    sql: ({ req, def }) => new Sql('bigint').tostring({ req, def }),
    jot: ({ req, def }) => new Jot('joi.number().integer().greater(100000000000000)').tostring({ req, def }),
    joi: ({ req, def }) => new Joi(joi.number().integer().greater(100000000000000)).torule({ req, def }),
    swt: ({ req, def }) => new Swt(`type: 'integer',\nformat: 'int64'`).tostring({ req, def }),
    swg: obj => new Swg({ type: 'integer', format: 'int64' }).toinstance(obj),
  },

  'id-auto': {
    sql: schemaName => Sql.autoId(schemaName),
    jot: ({ req, def }) => new Jot('joi.number().integer().greater(100000000000000)').tostring({ req, def }),
    joi: ({ req, def }) => new Joi(joi.number().integer().greater(100000000000000)).torule({ req, def }),
    swt: ({ req, def }) => new Swt(`type: 'integer',\nformat: 'int64'`).tostring({ req, def }),
    swg: obj => new Swg({ type: 'integer', format: 'int64' }).toinstance(obj),
  },

  'id-seq': {
    sql: () => Sql.seqId(),
    jot: ({ req, def }) => new Jot('joi.number().integer()').tostring({ req, def }),
    joi: ({ req, def }) => new Joi(joi.number().integer()).torule({ req, def }),
    swt: ({ req, def }) => new Swt(`type: 'integer',\nformat: 'int32'`).tostring({ req, def }),
    swg: obj => new Swg({ type: 'integer', format: 'int32' }).toinstance(obj),
  },
}

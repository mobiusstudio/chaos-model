/* eslint-disable quotes */
import joi from 'joi'
import { Sql, Jot, Joi, Swt, Swg } from './base'

export const boolean = {
  default: {
    sql: ({ req, def }) => new Sql('boolean').tostring({ req, def }),
    jot: ({ req, def }) => new Jot('joi.boolean()').tostring({ req, def }),
    joi: ({ req, def }) => new Joi(joi.boolean()).torule({ req, def }),
    swt: ({ req, def }) => new Swt(`type: 'boolean'`).tostring({ req, def }),
    swg: obj => new Swg({ type: 'boolean' }).toinstance(obj),
  },
}

/* eslint-disable quotes */
import joi from 'joi'
import { Sql, Jot, Joi, Swt, Swg } from './base'

export const string = {
  default: {
    sql: ({ req, def }) => new Sql('varchar').tostring({ req, def }),
    jot: ({ req, def }) => new Jot('joi.string()').tostring({ req, def }),
    joi: ({ req, def }) => new Joi(joi.string()).torule({ req, def }),
    swt: ({ req, def }) => new Swt(`type: 'string'`).tostring({ req, def }),
    swg: obj => new Swg({ type: 'string' }).toinstance(obj),
  },

  // maxmin: {
  //   sql: ({ req, def, max }) => new Sql(`varchar(${max})`).tostring({ req, def }),
  //   jot: ({ req, def, max, min }) => new Jot(`joi.string().max(${max}).min(${min})`).tostring({ req, def }),
  //   joi: ({ req, def, max, min }) => new Joi(joi.string().max(max).min(min)).torule({ req, def }),
  //   swt: ({ req, def, max, min }) => new Swt(`type: 'string',\nmaxLength: ${max},\nminLength: ${min}`).tostring({ req, def }),
  //   swg: (max, min) => obj => new Swg({ type: 'string', maxLength: max, minLength: min }).toinstance(obj),
  // },

  // pattern: {
  //   sql: ({ req, def }) => new Sql('varchar').tostring({ req, def }),
  //   jot: ({ req, def, pattern }) => new Jot(`joi.string().regex(/${pattern}/)`).tostring({ req, def }),
  //   joi: ({ req, def, pattern }) => new Joi(joi.string().regex(pattern)).torule({ req, def }),
  //   swt: ({ req, def, pattern }) => new Swt(`type: 'string',\npattern: '${pattern}'`).tostring({ req, def }),
  //   swg: pattern => obj => new Swg({ type: 'string', pattern }).toinstance(obj),
  // },

  password: {
    sql: ({ req, def }) => new Sql('varchar').tostring({ req, def }),
    jot: ({ req, def }) => new Jot('joi.string().min(6)').tostring({ req, def }),
    joi: ({ req, def }) => new Joi(joi.string().min(6)).torule({ req, def }),
    swt: ({ req, def }) => new Swt(`type: 'string',\nminLength: 6`).tostring({ req, def }),
    swg: obj => new Swg({ type: 'string', minLength: 6 }).toinstance(obj),
  },

  email: {
    sql: ({ req, def }) => new Sql('varchar').tostring({ req, def }),
    jot: ({ req, def }) => new Jot('joi.string().email()').tostring({ req, def }),
    joi: ({ req, def }) => new Joi(joi.string().email()).torule({ req, def }),
    swt: ({ req, def }) => new Swt(`type: 'string',\nformat: 'email'`).tostring({ req, def }),
    swg: obj => new Swg({ type: 'string', format: 'email' }).toinstance(obj),
  },
}

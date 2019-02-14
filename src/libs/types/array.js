/* eslint-disable quotes */
import joi from 'joi'
import { Jot, Joi, Swt, Swg } from './base'

export const array = {
  default: {
    jot: ({ req, def }) => new Jot('joi.array()').tostring({ req, def }),
    joi: ({ req, def }) => new Joi(joi.array()).torule({ req, def }),
    swt: ({ req, def, items }) => new Swt(`type: 'array'\n items: ${items}`).tostring({ req, def }),
    swg: obj => new Swg({ type: 'array' }).toinstance(obj),
  },
}

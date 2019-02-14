/* eslint-disable quotes */
import joi from 'joi'
import { Jot, Joi, Swt, Swg } from './base'

export const object = {
  default: {
    jot: ({ req, def }) => new Jot('joi.object()').tostring({ req, def }),
    joi: ({ req, def }) => new Joi(joi.object()).torule({ req, def }),
    swt: ({ req, def, properties }) => new Swt(`type: 'object'\n properties: ${properties}`).tostring({ req, def }),
    swg: obj => new Swg({ type: 'object' }).toinstance(obj),
  },
}

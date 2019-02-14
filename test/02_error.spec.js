import { errors } from '../lib'

describe('========== Errors ==========', () => {
  it('error references', () => {
    errors.should.be.an('object')
  })
})
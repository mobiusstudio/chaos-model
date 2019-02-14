import '@babel/polyfill/noConflict'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { connect } from '../lib'

chai.use(chaiAsPromised)
chai.should()

before(async () => {
  const str = 'postgresql://mobiusor@localhost:5432/test'
  await connect(str)
})

after((done) => {
  done()
})

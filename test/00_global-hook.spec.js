import '@babel/polyfill/noConflict'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)
chai.should()

after((done) => {
  done()
})

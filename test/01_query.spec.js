/* eslint-disable quotes */
import { ColumnArray } from '../lib'
import { Question, Answer } from './mock/models/qa'

describe('========== SELECT / JOIN / GROUP BY ==========', () => {
  it('select all', () => {
    const question = new Question()
    const table = question.from().select()
    const { query } = table.state
    query.text.should.equal('select "library".question.id _question_id_, "library".question.content _content_, "library".question.answer_id _answer_id_ from "library".question')
    query.args.length.should.equal(0)
  })

  it('select equal(=)', () => {
    const question = new Question()
    const key = '资料'
    const table = question.from().where({ content: key }).select()
    const { query } = table.state
    query.text.should.equal('select "library".question.id _question_id_, "library".question.content _content_, "library".question.answer_id _answer_id_ from "library".question where (content = $1)')
    query.args[0].should.equal('资料')
  })

  it('select like', () => {
    const question = new Question()
    const key = '%资料%'
    const table = question.from().where`content LIKE ${key}`.select()
    const { query } = table.state
    query.text.should.equal('select "library".question.id _question_id_, "library".question.content _content_, "library".question.answer_id _answer_id_ from "library".question where (content LIKE $1)')
    query.args[0].should.equal('%资料%')
  })

  it('ljoin', () => {
    const question = new Question()
    const answer = new Answer()
    const key = '%资料%'
    const table = question.from().where`content LIKE ${key}`.ljoin(answer)
    const selected = table.columns.filter(['question.id', 'content', 'answer.id', 'description'])
    const { query } = table.select(selected).state
    query.text.should.equal('select "library".question.id _question_id_, "library".question.content _content_, "library".answer.id _answer_id_, "library".answer.description _description_ from "library".question left join "library".answer on (answer_id = "library".answer.id) where (content LIKE $1)')
    query.args[0].should.equal('%资料%')
  })

  it('group by', () => {
    const question = new Question()
    const answer = new Answer()
    const key = '%资料%'
    const table = question.from().where`content LIKE ${key}`.ljoin(answer)
    const aggrs = new ColumnArray([
      table.columns.first('id').aggr('array', 'aggr_id'),
      table.columns.first('content').aggr('array', 'aggr_content'),
    ])
    const { query } = table.groupBy(table.columns.filter(['answerId']), aggrs).state
    query.text.should.equal('select "library".question.answer_id _answer_id_, array_agg("library".question.id) _aggr_id_, array_agg("library".question.content) _aggr_content_ from "library".question left join "library".answer on (answer_id = "library".answer.id) where (content LIKE $1) group by ("library".question.answer_id)')
    query.args[0].should.equal('%资料%')
  })

  it('paging', () => {
    const question = new Question()
    const params = {
      page: 10,
      pagesize: 20,
      next: 15,
      nextKey: 'id',
      filters: [
        { key: 'id', symbol: '>', value: 1000 },
        { key: 'content', symbol: 'LIKE', value: '%资料%' },
        { key: 'tag', symbol: '@>', value: ['a', 'b', 'c'] },
      ],
      orderBy: [
        { by: 'key_1', sort: 'desc' },
        { by: 'key_2', sort: 'asc' },
        { by: 'key_3' },
      ],
    }
    const query = question.from().paging(params).sql
    query.text.should.equal('select * from "library".question where (id > $1) and (content LIKE $2) and (tag @> $3) order by key_1 desc, key_2 asc, key_3 limit $4 offset $5')
    query.args[0].should.equal(1000)
    query.args[1].should.equal('%资料%')
    query.args[2][0].should.equal('a')
    query.args[2][1].should.equal('b')
    query.args[2][2].should.equal('c')
    query.args[3].should.equal(20)
    query.args[4].should.equal(200)
  })
})

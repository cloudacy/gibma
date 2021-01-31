import {request} from '../src/main'
import test from 'ava'

test('runs a basic get request', async (t) => {
  const res = await request('https://www.cloudacy.com')
  t.is(res.statusCode, 200)
})

test('runs a basic POST request', async (t) => {
  const res = await request('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST'
  })

  t.is(res.statusCode, 201)
})

import {request} from '../src/main'
import test from 'ava'

test('runs a basic get request', async (t) => {
  const res = await request('https://www.cloudacy.com')
  t.is(res.statusCode, 200)
})

test('runs a basic get request over http', async (t) => {
  const res = await request('http://reqres.in/api/users')
  t.is(res.statusCode, 301)
})

test('runs a basic POST request', async (t) => {
  const res = await request('https://reqres.in/api/users', {
    method: 'POST',
    data: {
      name: 'morpheus',
      job: 'leader',
    },
  })

  const data = res.json()

  t.is(res.statusCode, 201)
  t.true(data?.name === 'morpheus')
})

test('json parse', async (t) => {
  const res = await request('https://reqres.in/api/users?page=2')

  t.true(res.json() !== undefined)
})

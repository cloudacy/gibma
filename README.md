# gibma

A very lightweight http promise wrapper based on typescript.

## Background

As a lot of other users I had to do http requests on our server, but had no library for that. So I tried several packages until I found out that node ships with the exact same functions I needed for sending my requests.
This library is just a simple promise wrapper to the http module of node.

## Installation

```bash
npm install gibma
```

## Usage

Simply import the package and use the `request` function.

```ts
import {request} from 'gibma'

async function doMyGetRequest() {
  const response = await request('https://reqres.in/api/users', {method: 'GET'})
  const raw = response.data // this returns a string
  const json = response.json() // this returns the parsed json object
}

async function doMyPostRequest() {
  const response = await request('https://reqres.in/api/users', {
    method: 'POST', data: {name: 'gibma', job: 'best-job-ever'}
  })
  const raw = response.data // this returns a string
  const json = response.json() // this returns the parsed json object
}
```

This returns a customized `IncomingMessage` response which carries the raw data in `data` attribute.
You can easily get the parsed json (if available) with the `json` function of the `response`.

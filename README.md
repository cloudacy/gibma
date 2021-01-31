# gibma

A very lightweight http promise wrapper based on typescript.

## Background

As a lot of other users I had to do http requests on our server, but had no library for that. So I tried several packages until I found out that node ships with the exact same functions I needed for sending my requests.
This library is just a simple promise wrapper to the http module of node.

## Instalation

```bash
npm install gibma
```

## Usage

Simply import the package and use the `request` function.

```ts
import {request} from 'gibma'

async function doMyRequest() {
  const response = await request('https://www.cloudacy.com', {method: 'GET'})
}
```

This returns a customized `IncomingMessage` response which carries the raw data in `data` attribute and the parsed json (if available) in `json` property.
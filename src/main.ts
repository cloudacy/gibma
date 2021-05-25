import {URL} from 'url'
import {IncomingMessage, RequestOptions as HttpRequestOptions} from 'http'
import {request as httpRequest} from 'http'
import {request as httpsRequest} from 'https'
import {parse as parseContentType} from 'content-type'

interface Response<Data> extends IncomingMessage {
  data?: Buffer
  json: () => Data | null
}

export interface RequestOptions extends HttpRequestOptions {
  /** Request data written to POST and PUT requests */
  data?: unknown
}

export async function request<Data = Record<string, unknown>>(url: string | URL, options?: RequestOptions) {
  // Always parse to a url object because nodejs will do it later instead
  if (!(url instanceof URL)) {
    url = new URL(url)
  }

  return new Promise<Response<Data>>((resolve, reject) => {
    options = options || {}
    options.headers = options.headers || {}

    // Support only 'User-Agent' (only with this case style) header
    // See https://developer.mozilla.org/de/docs/Web/HTTP/Headers/User-Agent
    if (!options.headers['User-Agent']) {
      options.headers['User-Agent'] = `NodeJS/${process.version}`
    }

    const requestFn = (url as URL).protocol === 'http:' ? httpRequest : httpsRequest
    const req = requestFn(url, options || {})

    req.on('response', (res: Response<Data>) => {
      let chunk: Buffer = Buffer.from('')
      res.on('data', (data: Buffer) => {
        chunk = Buffer.concat([chunk, data])
      })

      res.on('end', () => {
        res.data = chunk

        resolve(res)
      })

      res.json = () => {
        if (res.data === undefined) {
          return null
        }

        try {
          const contentType = parseContentType(res)

          if (contentType.type === 'application/json') {
            try {
              return JSON.parse(res.data.toString())
            } catch (e) {
              throw new Error(`JSON could not be parsed (${e}). Original data: ${res.data}`)
            }
          }
        } catch (e) {
          console.info(`Content type is missing in response. (${url})`, e)
        }
      }
    })

    req.on('error', (err) => {
      reject(err)
    })

    if (options?.data) {
      if (typeof options.data === 'object') {
        req.setHeader('content-type', 'application/json')
        req.write(JSON.stringify(options.data))
      } else {
        req.write(options.data)
      }
    }

    req.end()
  })
}

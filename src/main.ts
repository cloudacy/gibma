import {URL} from 'url'
import {IncomingMessage} from 'http'
import {request as httpsRequest, RequestOptions as HttpsRequestOptions} from 'https'
import {parse as parseContentType} from 'content-type'

interface Response<Data> extends IncomingMessage {
  data?: string
  json?: Data
}

export interface RequestOptions extends HttpsRequestOptions {
  /** Request data written to POST and PUT requests */
  data?: unknown
}

export async function request<Data extends Record<string, unknown>>(url: string | URL, options?: RequestOptions) {
  return new Promise<Response<Data>>((resolve, reject) => {
    const req = httpsRequest(url, options || {})
  
    req.on('response', (res: Response<Data>) => {
      let chunk = ''
      res.on('data', (data: string) => {
        chunk += data
      })

      res.on('end', () => {
        res.data = chunk

        try {
          const contentType = parseContentType(res)

          if (contentType.type === 'application/json') {
            try {
              res.json = JSON.parse(res.data)
              resolve(res)
              return
            } catch (e) {
              reject(e)
            }
          }
        } catch (e) {
          console.info(`Content type is missing in response. (${url})`, e)
        }

        resolve(res)
      })
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
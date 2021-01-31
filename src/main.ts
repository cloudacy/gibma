import {URL} from 'url'
import {IncomingMessage} from 'http'
import {request as httpsRequest, RequestOptions} from 'https'

export async function request(url: string | URL, options?: RequestOptions) {
  return new Promise<IncomingMessage>((resolve, reject) => {
    const req = httpsRequest(url, options || {})
  
    req.on('response', (res) => {
      resolve(res)
    })

    req.on('error', (err) => {
      reject(err)
    })

    req.end()
  })
}
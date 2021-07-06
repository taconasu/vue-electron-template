import axios, { AxiosRequestConfig, AxiosError, AxiosInstance } from 'axios'

export default class BaseModel {
  static getHeaders = (headers = {}) => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    ...headers
  })

  protected axios: AxiosInstance

  private autoCaptureError = true

  protected constructor(baseURL: string = 'https://sample.com', autoCaptureError = true) {
    this.axios = axios.create({
      baseURL,
      headers: BaseModel.getHeaders()
    })
    this.autoCaptureError = autoCaptureError
  }

  // APIリクエスト成功時の処理
  protected postFetch(response = {data: {}}) {
    return Promise.resolve(Object.assign(response, {
      data: this.deserialize(response.data)
    }))
  }

  // APIリクエスト失敗時の処理
  protected postError(error: AxiosError) {
    if (!!error.response) {
      return Promise.reject(error)
    }

    const data = {code: '990', message: '予期せぬエラーが発生しました', errors: []}
    if ('ECONNABORTED' === error.code) {
      Object.assign(data, {code: '910', message: '接続タイムアウト'})
    } else if (!error.response) {
      Object.assign(data, {code: '900', message: 'ネットワークエラー'})
    }
    return Promise.reject(Object.assign({
      response: {data},
      error
    }))
  }

  // デフォルトのシリアライズ実装
  protected deserialize(part = {}): any {
    return Object.assign({}, part)
  }
}

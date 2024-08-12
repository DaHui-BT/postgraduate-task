import axios, { Axios, AxiosHeaders, type AxiosRequestConfig, type AxiosResponse, type CreateAxiosDefaults } from "axios"

class Request {
  instance: Axios

  constructor(config: CreateAxiosDefaults) {
    config.baseURL = 'http://localhost:3000/api/get_task_list'
    config.timeout = 3000
    this.instance = axios.create(config)
  }

  request(url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE',
          data: any, params: any): Promise<AxiosResponse<any, any>> {
    return this.instance.request({url, method, data, params})
  }

  get(url: string, params: any): Promise<AxiosResponse<any, any>> {
    return this.request(url, 'GET', null, params)
  }
 
  post(url: string, data: any): Promise<AxiosResponse<any, any>> {
    return this.request(url, 'POST', data, null)
  }

  put(url: string, data: any): Promise<AxiosResponse<any, any>> {
    return this.request(url, 'PUT', data, null)
  }

  delete(url: string, params: any): Promise<AxiosResponse<any, any>> {
    return this.request(url, 'DELETE', null, params)
  }
}



export { Request }

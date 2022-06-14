import { axios } from '@/utils/request'

/**
 * @description: 获取用户信息
 */
export function getUserInfo() {
  return axios.request({
    url: '/users/me',
    method: 'get'
  })
}

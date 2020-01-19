/*
 * Author: jinhui
 * Description: 服务地址配置
 * Date: 2019-06-24 15:05:18
 * LastEditors: jinhui
 * LastEditTime: 2019-08-01 10:38:18
 */
import { cacheManager } from '@/utils'
const ip = window.boeBookAPI;

export const requestUrl = {
  url: ip + '/rest/api/service',
  upLoadTemH5: ip + '/rest/upload/temH5',
  upLoadUrl: ip + '/rest/upload/avatar',
  upFileUrl: ip + '/rest/upload/document',
  upLoadTeachUrl: ip + '/rest/upload',
  upLoadVideoUrl: ip + '/rest/upload',
}

export const dataString = () => {
  return '&uid=' + cacheManager.get('uid') + '&token=' + cacheManager.get('token');
}


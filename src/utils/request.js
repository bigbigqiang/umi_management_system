import { fetch } from 'dva';
import { router } from 'umi';
import { notification, Message } from 'antd';
import { cacheManager } from '@/utils';


const codeMessage = {
    200: '服务器成功返回请求的数据',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据,的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器',
    502: '网关错误',
    503: '服务不可用，服务器暂时过载或维护',
    504: '网关超时',
};
function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }
    const errortext = codeMessage[response.status] || response.statusText;
    notification.error({
        message: `请求错误 ${response.status}: ${response.url}`,
        description: errortext,
    });
    const error = new Error(errortext);
    error.name = response.status;
    error.response = response;
    throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * param  {string} url       The URL we want to request
 * param  {object} [options] The options we want to pass to "fetch"
 * return {object}           An object containing either "data" or "err"
 */
export function request(url, options) {
    if(cacheManager.get() && !(cacheManager.get('uid') && cacheManager.get('token'))){
        cacheManager.clear()
        router.push('/login')
        Message.error('登录信息已失效，请重新登录！')
        return
    }
    const defaultOptions = {
        mode: 'cors',
        method: 'POST',
        uid: cacheManager.get('uid'),
        token: cacheManager.get('token')
    };
    options.body = options.body ? options.body + '&uid=' + cacheManager.get('uid') + '&token=' + cacheManager.get('token') : null
    const newOptions = { ...defaultOptions, ...options };
    if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
        newOptions.headers = {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            ...newOptions.headers,
        };
    }

    return new Promise((resolve, reject) => {
        fetch(url, newOptions)
            .then(checkStatus)
            .then((response) => {
                if (newOptions.method === 'DELETE' || response.status === 204) {
                    return response.text();
                }
                return response.json();
            }).then((data) => {
                // 统一处理动画绘本管 业务报错
                // 如果有很多不同错误情况，就单独写一个函数处理
                // if (data.status !== '1') {
                //     data && data.message && Message.error(data.message);
                // } else {
                //     resolve(data)
                // }
                // 获取图书包列表正常返回时接口status给的是0
                if (data.status !== '1') {
                    data && data.message && Message.error(data.message);
                }
                resolve(data)
            }).catch(err => {
                Message.error('服务器异常');
                console.log(err)
            });
    })
}
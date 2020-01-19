
import { AES, enc } from 'crypto-js'

export { request } from './request';
export { Enum } from './enum';
export { requestUrl, dataString } from './config';

export const cacheManager = {
    name: 'c1n8490285bv-2314n-21vn3-4',
    preDec: 'Ellabook',
    get(key) {
        let preData;
        try {
            preData = JSON.parse(AES.decrypt(localStorage.getItem(this.name), this.preDec + new Date().getTime().toString().substr(0, 5)).toString(enc.Utf8));
            if (key) {
                return preData[key]
            }
        } catch (err) {
            return null;
        }
        return preData
    },
    set(obj) {
        let preData = this.get();
        let newData
        try {
            newData = AES.encrypt(JSON.stringify({ ...preData, ...obj }), this.preDec + new Date().getTime().toString().substr(0, 5))
        } catch (err) {
            throw err;
        }
        localStorage.setItem(this.name, newData)
    },
    clear() {
        localStorage.clear()
    }
}

export function getAuthorityCheck(type) {
    const operationType = cacheManager.get('operationType');
    if (operationType) {
        const list = operationType.split(',');
        if (list.indexOf(type) !== -1) {
            return true;
        } else {
            return false;
        }
    }
}

export const getUrlParams = (url, name) => {
    if(!!url && typeof url === 'string'){
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)")
        let r = url.split('?')[1] ? url.split('?')[1].match(reg) : null
        if (r !== null) return r[2]
        return ''
    } else {
        return ''
    }
    
}

export const getDate = (number) => { // 建议去掉，改使用moment
    var date = new Date(parseInt(number));
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
    var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours() + ':';
    var m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return (Y + M + D + h + m + s)
}

/*
* 判断是否是中文字符
* parameter str: string
* return: string
*/

export const isChinese = (str) => {
    if (escape(str).indexOf("%u") < 0) return false
    return true
}

/*
* 数字格式化 小于10 前面加 0
* parameter n：number|string
* return: string
*/

export const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

/*
* 校验手机号
* parameter phone: string; 
* return:  Boolean
*/

export const checkPhone = (phone) => {
    return /^1[0-9]{1}[0-9]{9}$/.test(phone.trim())
}

/*
* 校验邮箱
* parameter email: string; 
* return:  Boolean
*/

export const checkEmail = (email) => {
    return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(email.trim())
}

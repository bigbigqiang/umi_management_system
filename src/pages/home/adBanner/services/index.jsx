import { requestUrl, request } from '@/utils';

export async function getOperationAdList(content) {
    return request(requestUrl.url, {
        body: "method=ella.operation.getOperationAdList" + "&content=" + JSON.stringify(content)
    })
}

export async function delOperationAd(content) {
    return request(requestUrl.url, {
        body: "method=ella.operation.delOperationAd" + "&content=" + JSON.stringify(content)
    })
}

export async function getOperationAdInfo(content) {
    return request(requestUrl.url, {
        body: "method=ella.operation.getOperationAdInfo" + "&content=" + JSON.stringify(content)
    })
}


export async function boxSearchList(content) {
    return request(requestUrl.url, {
        body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify(content)
    })
}

export async function goodsManageList(content) {
    return request(requestUrl.url, {
        body: "method=ella.operation.goodsManageList" + "&content=" + JSON.stringify(content)
    })
}

export async function getBookCourseList(content) {
    return request(requestUrl.url, {
        body: "method=ella.operation.getBookCourseList" + "&content=" + JSON.stringify(content)
    })
}


export async function saveOperationAd(content) {
    return request(requestUrl.url, {
        body: "method=ella.operation.saveOperationAd" + "&content=" + JSON.stringify(content)
    })
}


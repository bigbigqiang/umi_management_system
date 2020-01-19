import { requestUrl, request } from '@/utils';

export async function listDailyBook(content) {
    return request(requestUrl.url, {
        body: "method=ella.operation.listDailyBook" + "&content=" + JSON.stringify(content)
    })
}

export async function deleteDailyByCode(content) {
    return request(requestUrl.url, {
        body: "method=ella.operation.deleteDailyByCode" + "&content=" + JSON.stringify(content)
    })
}

export async function updateDailyPublishFlag(content) {
    return request(requestUrl.url, {
        body: "method=ella.operation.updateDailyPublishFlag" + "&content=" + JSON.stringify(content)
    })
}
export async function getDailyTitleConfigList(content) {
    return request(requestUrl.url, {
        body: "method=ella.operation.getDailyTitleConfigList" + "&content=" + JSON.stringify(content)
    })
}

export async function boxSearchList(content) {
    return request(requestUrl.url, {
        body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify(content)
    })
}
export async function updateDailyTitleConfigList(content) {
    return request(requestUrl.url, {
        body: "method=ella.operation.updateDailyTitleConfigList" + "&content=" + JSON.stringify(content)
    })
}
export async function getBookListByIdOrName(content) {
    return request(requestUrl.url, {
        body: "method=ella.operation.getBookListByIdOrName" + "&content=" + JSON.stringify(content)
    })
}
export async function goodsManageList(content) {
    return request(requestUrl.url, {
        body: "method=ella.operation.goodsManageList" + "&content=" + JSON.stringify(content)
    })
}
export async function getDailyInfo(content) {
    return request(requestUrl.url, {
        body: "method=ella.operation.getDailyInfo" + "&content=" + JSON.stringify(content)
    })
}
export async function saveOrUpdateDaily(content) {
    return request(requestUrl.url, {
        body: "method=ella.operation.saveOrUpdateDaily" + "&content=" + JSON.stringify(content)
    })
}



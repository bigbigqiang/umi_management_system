import { requestUrl, request } from '@/utils';

export async function getPopularSearchList(content) {
    return request(requestUrl.url, {
        body: "method=ella.operation.getPopularSearchList" + "&content=" + JSON.stringify(content)
    })
}

export async function topPopularSearch(content) {
    return request(requestUrl.url, {
        body: "method=ella.operation.topPopularSearch" + "&content=" + JSON.stringify(content)
    })
}

export async function delPopularSearch(content) {
    return request(requestUrl.url, {
        body: "method=ella.operation.delPopularSearch" + "&content=" + JSON.stringify(content)
    })
}

export async function shelvesFlagPopularSearch(content) {
    return request(requestUrl.url, {
        body: "method=ella.operation.shelvesFlagPopularSearch" + "&content=" + JSON.stringify(content)
    })
}

export async function movePopularSearch(content) {
    return request(requestUrl.url, {
        body: "method=ella.operation.movePopularSearch" + "&content=" + JSON.stringify(content)
    })
}

export async function insertAndUpdatePopularSearch(content) {
    return request(requestUrl.url, {
        body: "method=ella.operation.insertAndUpdatePopularSearch" + "&content=" + JSON.stringify(content)
    })
}

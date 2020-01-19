import { requestUrl, request } from '@/utils';

export async function listOperationSubject(content) {
    return request(requestUrl.url, {
        body: "method=ella.book.listOperationSubject" + "&content=" + JSON.stringify(content)
    })
}

export async function delOperationSubject(content) {
    return request(requestUrl.url, {
        body: "method=ella.book.delOperationSubject" + "&content=" + JSON.stringify(content)
    })
}

export async function updateBannerShelves(content) {
    return request(requestUrl.url, {
        body: "method=ella.operation.updateBannerShelves" + "&content=" + JSON.stringify(content)
    })
}

export async function homePageObjectMove(content) {
    return request(requestUrl.url, {
        body: "method=ella.operation.homePageObjectMove" + "&content=" + JSON.stringify(content)
    })
}

export async function publish(content) {
    return request(requestUrl.url, {
        body: "method=ella.operation.publishTaskWall" + "&content=" + JSON.stringify(content)
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

export async function getOperationSubjectInfo(content) {
    return request(requestUrl.url, {
        body: "method=ella.book.getOperationSubjectInfo" + "&content=" + JSON.stringify(content)
    })
}

export async function saveOperationSubject(content) {
    return request(requestUrl.url, {
        body: "method=ella.book.saveOperationSubject" + "&content=" + JSON.stringify(content)
    })
}

export async function getBookList(content) {
    return request(requestUrl.url, {
        body: "method=ella.operation.getBookListByIdOrName" + "&content=" + JSON.stringify(content)
    })
}

export async function getGroupList(method, content) {
    return request(requestUrl.url, {
        body: "method=" + method + "&content=" + JSON.stringify(content)
    })
}

export async function upLoader(body) {
    return request(requestUrl.upLoadUrl, {
        body,
        headers: {}
    })
}
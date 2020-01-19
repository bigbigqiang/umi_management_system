import { requestUrl, request } from '@/utils';

export async function getOperationPartList(content) {
    return request(requestUrl.url, {
        body: "method=ella.operation.getOperationPartList" + "&content=" + JSON.stringify(content)
    })
}

export async function boxSearchList(content) {
    return request(requestUrl.url, {
        body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify(content)
    })
}
export async function delOperationPart(content) {
    return request(requestUrl.url, {
        body: "method=ella.operation.delOperationPart" + "&content=" + JSON.stringify(content)
    })
}
/*--------获取书籍或者课程 begin-----*/ 
export async function getLatestBookList(content) {
    return request(requestUrl.url, {
        body: "method=ella.operation.getLatestBookList" + "&content=" + JSON.stringify(content)
    })
}
export async function getNewCourseList(content) {
    return request(requestUrl.url, {
        body: "method=ella.operation.getNewCourseList" + "&content=" + JSON.stringify(content)
    })
}
export async function getHottestBookList(content) {
    return request(requestUrl.url, {
        body: "method=ella.operation.getHottestBookList" + "&content=" + JSON.stringify(content)
    })
}
export async function getCommentBookList(content) {
    return request(requestUrl.url, {
        body: "method=ella.operation.getCommentBookList" + "&content=" + JSON.stringify(content)
    })
}
export async function getShareBookList(content) {
    return request(requestUrl.url, {
        body: "method=ella.operation.getShareBookList" + "&content=" + JSON.stringify(content)
    })
}
export async function getSvipLatestBookList(content) {
    return request(requestUrl.url, {
        body: "method=ella.operation.getSvipLatestBookList" + "&content=" + JSON.stringify(content)
    })
}
/*--------获取书籍或者课程 end-----*/ 

export async function saveOperationPartInfo(content) {
    return request(requestUrl.url, {
        body: "method=ella.operation.saveOperationPartInfo" + "&content=" + JSON.stringify(content)
    })
}
export async function saveOperationPartCourseInfo(content) {
    return request(requestUrl.url, {
        body: "method=ella.operation.saveOperationPartCourseInfo" + "&content=" + JSON.stringify(content)
    })
}
export async function getOperationPartInfo(content) {
    return request(requestUrl.url, {
        body: "method=ella.operation.getOperationPartInfo" + "&content=" + JSON.stringify(content)
    })
}
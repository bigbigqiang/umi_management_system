import { requestUrl, request } from '@/utils';

export async function bookSubjectList(content) {
    return request(requestUrl.url, {
        body: "method=ella.operation.bookSubjectList" + "&content=" + JSON.stringify(content)
    })
}

export async function deleteBanner(content) {
    return request(requestUrl.url, {
        body: "method=ella.book.delOperationBanner" + "&content=" + JSON.stringify(content)
    })
}

export async function updateBookSubjectShelves(content) {
    return request(requestUrl.url, {
        body: "method=ella.operation.updateBookSubjectShelves" + "&content=" + JSON.stringify(content)
    })
}

export async function homePageObjectMove(content) {
    return request(requestUrl.url, {
        body: "method=ella.operation.homePageObjectMove" + "&content=" + JSON.stringify(content)
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

export async function getBookSubjectInfo(content) {
    return request(requestUrl.url, {
        body: "method=ella.operation.getBookSubjectInfo" + "&content=" + JSON.stringify(content)
    })
}

export async function saveBookSubject(content) {
    return request(requestUrl.url, {
        body: "method=ella.operation.saveBookSubject" + "&content=" + JSON.stringify(content)
    })
}

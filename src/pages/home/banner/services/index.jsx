import { requestUrl, request } from '@/utils';

export async function getBannerList(content) {
    return request(requestUrl.url, {
        body: "method=ella.book.listOperationBanner" + "&content=" + JSON.stringify(content)
    })
}

export async function deleteBanner(content) {
    return request(requestUrl.url, {
        body: "method=ella.book.delOperationBanner" + "&content=" + JSON.stringify(content)
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

export async function getBannerInfo(content) {
    return request(requestUrl.url, {
        body: "method=ella.book.getOperationBannerInfo" + "&content=" + JSON.stringify(content)
    })
}

export async function saveBanner(content) {
    return request(requestUrl.url, {
        body: "method=ella.book.saveOperationBanner" + "&content=" + JSON.stringify(content)
    })
}

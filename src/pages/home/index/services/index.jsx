import { requestUrl, request } from '@/utils';

export async function findHomePageList(content) {
  return request(requestUrl.url, {
    body: "method=ella.operation.findHomePageList" + "&content=" + JSON.stringify(content)
  })
}

export async function deleteHomePageModule(content) {
  return request(requestUrl.url, {
    body: "method=ella.operation.deleteHomePageModule" + "&content=" + JSON.stringify(content)
  })
}

export async function homePageObjectMove(content) {
  return request(requestUrl.url, {
    body: "method=ella.operation.homePageObjectMove" + "&content=" + JSON.stringify(content)
  })
}

export async function homePageObjectTop(content) {
  return request(requestUrl.url, {
    body: "method=ella.operation.homePageObjectTop" + "&content=" + JSON.stringify(content)
  })
}

// 发布首页模块

export async function publishHomePage(content) {
  return request(requestUrl.url, {
    body: "method=ella.operation.publishHomePage" + "&content=" + JSON.stringify(content)
  })
}

export async function findShow(body) {
  return request(requestUrl.url, {
    body: body.body
  })
}

export async function addHomePageModule(content) {
  return request(requestUrl.url, {
    body: "method=ella.operation.addHomePageModule" + "&content=" + JSON.stringify(content)
  })
}

export async function updateHomePageNextPublishTime(content) {
  return request(requestUrl.url, {
    body: "method=ella.operation.updateHomePageNextPublishTime" + "&content=" + JSON.stringify(content)
  })
}

// 获取推荐模块列表

export async function findNotShowPart(content) {
  return request(requestUrl.url, {
    body: "method=ella.operation.findNotShowPart" + "&content=" + JSON.stringify(content)
  })
}
// 获取单广告横幅列表

export async function findNotShowAd(content) {
  return request(requestUrl.url, {
    body: "method=ella.operation.findNotShowAd" + "&content=" + JSON.stringify(content)
  })
}
// 添加专栏模块

export async function addHomePageBookSubject(content) {
  return request(requestUrl.url, {
    body: "method=ella.operation.addHomePageBookSubject" + "&content=" + JSON.stringify(content)
  })
}

import {
    findHomePageList,
    deleteHomePageModule,
    homePageObjectMove,
    homePageObjectTop,
    publishHomePage,
    updateHomePageNextPublishTime,
    findNotShowPart,
    findNotShowAd,
    addHomePageModule,
    addHomePageBookSubject,
} from '../services';
import { message } from 'antd';
export default {
    namespace: "homeIndex",
    state: {
        homePageData: {
            list: [],
            nextPublishTime: '',
            publishTime: '',
        },
        selectList: [],
        columnCode: '',
        moduleTitle: '',
    },

    effects: {
        *findHomePageList({ payload }, { call, put }) {
            const res = yield call(findHomePageList, payload);
            if (res) {
                yield put({
                    type: 'save',
                    payload: {
                        homePageData: res.data
                    },
                });
                return res.data
            }
        },
        *findNotShowPart({ payload }, { call, put }) {
            const res = yield call(findNotShowPart, payload);
            if (res) {
                yield put({
                    type: 'save',
                    payload: {
                        selectList: res.data,
                        columnCode: (res.data && res.data.length) ? res.data[0].columnCode : '',
                        moduleTitle: (res.data && res.data.length) ? res.data[0].moduleTitle : '',
                    },
                });
            }
        },
        *findNotShowAd({ payload }, { call, put }) {
            const res = yield call(findNotShowAd, payload);
            if (res) {
                yield put({
                    type: 'save',
                    payload: {
                        selectList: res.data,
                        columnCode: (res.data && res.data.length) ? res.data[0].columnCode : '',
                        moduleTitle: (res.data && res.data.length) ? res.data[0].moduleTitle : '',
                    },
                });
            }
        },
        *updateHomePageNextPublishTime({ payload }, { call, put }) {
            const res = yield call(updateHomePageNextPublishTime, payload);
            if (res) {
                message.success('设置成功!');
            }
        },
        *deleteHomePageModule({ payload }, { call, put }) {
            const res = yield call(deleteHomePageModule, payload);
            if (res) {
                message.success('删除成功！');
                yield put({
                    type: 'findHomePageList',
                    payload: {
                        platformCode: payload.platformCode
                    },
                });
            }
        },
        *addHomePageModule({ payload }, { call, put }) {
            const res = yield call(addHomePageModule, payload);
            if (res) {
                message.success('操作成功！');
                yield put({
                    type: 'findHomePageList',
                    payload: {
                        platformCode: payload.platformCode
                    },
                });
            }
        },
        *addHomePageBookSubject({ payload }, { call, put }) {
            const res = yield call(addHomePageBookSubject, payload);
            if (res) {
                message.success('操作成功！');
                yield put({
                    type: 'findHomePageList',
                    payload: {
                        platformCode: payload.platformCode
                    },
                });
            }
        },
        *homePageObjectMove({ payload }, { call, put }) {
            const res = yield call(homePageObjectMove, payload);
            if (res) {
                yield put({
                    type: 'findHomePageList',
                    payload: {
                        platformCode: payload.platformCode
                    },
                });
            }
        },
        *homePageObjectTop({ payload }, { call, put }) {
            const res = yield call(homePageObjectTop, payload);
            if (res) {
                yield put({
                    type: 'findHomePageList',
                    payload: {
                        platformCode: payload.platformCode
                    },
                });
            }

        },
        *publishHomePage({ payload }, { call, put }) {
            const res = yield call(publishHomePage, payload);
            if (res) {
                message.success('发布成功！');
            } else {
                message.fail('发布失败啦！');
            }

        },
    },
    reducers: {
        save(state, { payload }) {
            return {
                ...state,
                ...payload
            }
        },
        clear(state) {
            return {
                homePageData: {
                    list: [],
                    nextPublishTime: '',
                    publishTime: '',
                },
                selectList: [],
            };
        }
    }
}

import {
    boxSearchList,
    goodsManageList,
    getBookCourseList,
    saveOperationAd,
    getOperationAdInfo,
} from '../services';
import router from 'umi/router';
import { message } from 'antd';
export default {
    namespace: "editAdBanner",
    state: {
        searchList: [],
        adPartList: [],
        PlatFromList: [],
        bookPackageList: [],
        courseList: [],
        bannerInfo: {}
    },

    effects: {
        *boxSearchList({ payload }, { call, put, select }) {
            const res = yield call(boxSearchList, payload);
            if (res) {
                yield put({
                    type: 'save',
                    payload: {
                        searchList: res.data || []
                    },
                });
            }
        },
        *getAdPart({ payload }, { call, put, select }) {
            const { adPartList } = yield select(state => state.editAdBanner);
            if (!adPartList.length) {
                const res = yield call(boxSearchList, payload);
                if (res) {
                    yield put({
                        type: 'save',
                        payload: {
                            adPartList: res.data || []
                        },
                    });
                }
            }
        },
        *getPlatFrom({ payload }, { call, put, select }) {
            const res = yield call(boxSearchList, payload);
            if (res) {
                let resList = res.data || []
                let PlatFromList = []
                resList.map((item) => {
                    item.searchCode !== 'GUSHIJI' && PlatFromList.push({ label: item.searchName, value: item.searchCode })
                })
                yield put({
                    type: 'save',
                    payload: {
                        PlatFromList
                    },
                });
            }

        },
        *goodsManageList({ payload }, { call, put, select }) {
            const { bookPackageList } = yield select(state => state.editAdBanner);
            if (!bookPackageList.length) {
                const res = yield call(goodsManageList, payload);
                if (res) {
                    yield put({
                        type: 'save',
                        payload: {
                            bookPackageList: !!res.data ? (!!res.data.list ? res.data.list : []) : []
                        },
                    });
                }
            }
        },
        *getBookCourseList({ payload }, { call, put, select }) {
            const { courseList } = yield select(state => state.editAdBanner);
            if (!courseList.length) {
                const res = yield call(getBookCourseList, payload);
                if (res) {
                    yield put({
                        type: 'save',
                        payload: {
                            courseList: !!res.data ? (!!res.data.list ? res.data.list : []) : []
                        },
                    });
                }
            }
        },
        *saveOperationAd({ payload }, { call, put, select }) {
            const res = yield call(saveOperationAd, payload);
            if (res) {
                message.success('操作成功')
                router.push('/home/adBanner')
            }
        },
        *getOperationAdInfo({ payload }, { call, put, select }) {
            const res = yield call(getOperationAdInfo, payload);
            if (res) {
                yield put({
                    type: 'save',
                    payload: {
                        bannerInfo: res.data || {}
                    },
                });
                return res.data
            }
        },
        *asyncUpdate({ payload }, { call, put }) {
            yield put({
                type: 'save',
                payload,
            });
        },

    },
    reducers: {
        save(state, { payload }) {
            return {
                ...state,
                ...payload
            }
        },
    }
}

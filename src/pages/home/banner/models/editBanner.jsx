import {
    boxSearchList,
    goodsManageList,
    getBookCourseList,
    saveBanner,
    getBannerInfo,
} from '../services';
import { message } from 'antd';
export default {
    namespace: "editBanner",
    state: {
        searchList: [],
        chanelList: [],
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
        *getChanelList({ payload }, { call, put, select }) {
            const res = yield call(boxSearchList, payload);
            if (res) {
                let chanelList = (res.data || []).map((item) => {
                    return { label: item.name, value: item.code }
                })
                yield put({
                    type: 'save',
                    payload: {
                        chanelList
                    },
                });
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
            const { bookPackageList } = yield select(state => state.editBanner);
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
            const { courseList } = yield select(state => state.editBanner);
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
        *saveBanner({ payload }, { call, put, select }) {
            const res = yield call(saveBanner, payload);
            if (res) {
                message.success('操作成功')
            }
        },
        *getBannerInfo({ payload }, { call, put, select }) {
            const res = yield call(getBannerInfo, payload);
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

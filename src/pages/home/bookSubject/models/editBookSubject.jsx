import {
    boxSearchList,
    goodsManageList,
    getBookCourseList,
    saveBookSubject,
    getBookSubjectInfo,
} from '../services';
import { message } from 'antd';
export default {
    namespace: "editBookSubject",
    state: {
        searchList: [],
        chanelList: [],
        PlatFromList: [],
        bookPackageList: [],
        courseList: [],
        bookSubjectInfo: {}
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
                    PlatFromList.push({ label: item.searchName, value: item.searchCode })
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
            const { bookPackageList } = yield select(state => state.editBookSubject);
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
            const { courseList } = yield select(state => state.editBookSubject);
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
        *saveBookSubject({ payload }, { call, put, select }) {
            const res = yield call(saveBookSubject, payload);
            if (res) {
                message.success('操作成功')
            }
        },
        *getBookSubjectInfo({ payload }, { call, put, select }) {
            const res = yield call(getBookSubjectInfo, payload);
            if (res) {
                yield put({
                    type: 'save',
                    payload: {
                        bookSubjectInfo: res.data || {}
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

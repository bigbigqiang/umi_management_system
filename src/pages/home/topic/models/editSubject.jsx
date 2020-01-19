import {
    boxSearchList,
    goodsManageList,
    getBookCourseList,
    saveOperationSubject,
    getOperationSubjectInfo,
} from '../services';
import { message } from 'antd';
export default {
    namespace: "editSubject",
    state: {
        searchList: [],
        styleList: [],
        chanelList: [],
        PlatFromList: [],
        bookPackageList: [],
        courseList: [],
        subjectInfo: {}
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
        *getStyleList({ payload }, { call, put, select }){
            const res = yield call(boxSearchList, payload);
            if (res) {
                yield put({
                    type: 'save',
                    payload: {
                        styleList: res.data || []
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
            const { bookPackageList } = yield select(state => state.editSubject);
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
            const { courseList } = yield select(state => state.editSubject);
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
        *saveOperationSubject({ payload }, { call, put, select }) {
            const res = yield call(saveOperationSubject, payload);
            if (res) {
                message.success('操作成功')
            }
        },
        *getOperationSubjectInfo({ payload }, { call, put, select }) {
            const res = yield call(getOperationSubjectInfo, payload);
            if (res) {
                yield put({
                    type: 'save',
                    payload: {
                        subjectInfo: res.data || {}
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

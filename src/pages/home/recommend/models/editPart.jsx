import {
    boxSearchList,
    getLatestBookList,
    getNewCourseList,
    getHottestBookList,
    getCommentBookList,
    getShareBookList,
    getSvipLatestBookList,
    saveOperationPartInfo,
    saveOperationPartCourseInfo,
    getOperationPartInfo,
} from '../services';
import { message } from 'antd';
export default {
    namespace: "editPart",
    state: {
        chanelList: [],
        PlatFromList: [],
        partInfo: {},
        bookOrCourseList: []
    },

    effects: {
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
        *getBookOrCourseList({ payload }, { call, put, select }) {
            let { getRule, recommendType, getNum } = payload
            let res
            switch (getRule) {
                case 'LIST_LATEST_BOOK':
                    res = recommendType === 'book' ? yield call(getLatestBookList, { num: getNum }) : yield call(getNewCourseList, { num: getNum })
                    break;
                case 'LIST_HOTTEST_BOOK':
                    res = yield call(getHottestBookList, { num: getNum })
                    break;
                case 'LIST_REMARK_BOOK':
                    res = yield call(getCommentBookList, { num: getNum })
                    break;
                case 'LIST_SHARE_BOOK':
                    res = yield call(getShareBookList, { num: getNum })
                    break;
                case 'NEW_VIP':
                    res = yield call(getSvipLatestBookList, { num: getNum })
                    break;
                default:
                    break;
            }
            if (res) {
                yield put({
                    type: 'save',
                    payload: {
                        bookOrCourseList: res.data || []
                    },
                });
            }

        },
        *saveOperationPartInfo({ payload }, { call, put, select }) {
            const res = yield call(saveOperationPartInfo, payload);
            if (res) {
                message.success('操作成功')
            }
        },
        *saveOperationPartCourseInfo({ payload }, { call, put, select }) {
            const res = yield call(saveOperationPartCourseInfo, payload);
            if (res) {
                message.success('操作成功')
            }
        },
        *getOperationPartInfo({ payload }, { call, put, select }) {
            const res = yield call(getOperationPartInfo, payload);
            if (res) {

                yield put({
                    type: 'save',
                    payload: {
                        partInfo: res.data || {},
                        bookOrCourseList: res.data ? (res.data.bookList || []) : []
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

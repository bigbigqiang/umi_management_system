import {
    boxSearchList,
    goodsManageList,
    getBookListByIdOrName,
    saveOrUpdateDaily,
    getDailyInfo,
} from '../services';
import router from 'umi/router';
import { message } from 'antd';
export default {
    namespace: "editDaily",
    state: {
        searchList: [],
        bookList: [],
        bookPackageList: [],
        dailyInfo: {}
    },

    effects: {
        *boxSearchList({ payload }, { call, put, select }) {
            const res = yield call(boxSearchList, payload);
            if (res) {
                let _data = {}
                let searchList = [];
                (res.data || []).map((item) => {
                    _data[item.searchId] = item
                })
                for (let key in _data) {
                    searchList.push(_data[key])
                }
                yield put({
                    type: 'save',
                    payload: {
                        searchList
                    },
                });
                return searchList
            }
        },
        *goodsManageList({ payload }, { call, put, select }) {
            const { bookPackageList } = yield select(state => state.editDaily);
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
        *getBookListByIdOrName({ payload }, { call, put, select }) {
            const res = yield call(getBookListByIdOrName, payload);
            if (res) {
                yield put({
                    type: 'save',
                    payload: {
                        bookList: !!res.data ? (!!res.data.bookList ? res.data.bookList : []) : []
                    },
                });
            }
        },
        *saveOrUpdateDaily({ payload }, { call, put, select }) {
            const res = yield call(saveOrUpdateDaily, payload);
            if (res) {
                message.success('操作成功')
                router.push('/home/remittance')
            }
        },
        *getDailyInfo({ payload }, { call, put, select }) {
            const res = yield call(getDailyInfo, payload);
            if (res) {
                yield put({
                    type: 'save',
                    payload: {
                        dailyInfo: res.data || {}
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

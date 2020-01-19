import {
    getPopularSearchList,
    delPopularSearch,
    shelvesFlagPopularSearch,
    movePopularSearch,
    topPopularSearch,
    insertAndUpdatePopularSearch,
} from '../services';
import { message } from 'antd';
export default {
    namespace: "popularsearch",
    state: {
        popularSearchData: {
            popularSearchList: [],
        },
        searchName: '',
        activeKey: 'SHELVES_ON',
    },

    effects: {
        *getPopularSearchList({ payload }, { call, put, select }) {
            const { searchName, activeKey } = yield select(state => state.popularsearch);
            const content = {
                searchName,
                type: activeKey,
            };
            const res = yield call(getPopularSearchList, content);
            if (res) {
                yield put({
                    type: 'save',
                    payload: {
                        popularSearchData: res.data || { popularSearchList: [] }
                    },
                });
            }

        },
        *topPopularSearch({ payload }, { call, put }) {
            const res = yield call(topPopularSearch, payload);
            if (res) {
                message.success('操作成功！');
                yield put({
                    type: 'getPopularSearchList',
                });
            }
        },
        *shelvesFlagPopularSearch({ payload }, { call, put }) {
            const res = yield call(shelvesFlagPopularSearch, payload);
            if (res) {
                message.success('操作成功！');
                yield put({
                    type: 'getPopularSearchList',
                });
            }
        },
        *delPopularSearch({ payload }, { call, put }) {
            const res = yield call(delPopularSearch, payload);
            if (res) {
                message.success('删除成功！');
                yield put({
                    type: 'getPopularSearchList',
                });
            }
        },
        *insertAndUpdatePopularSearch({ payload }, { call, put }) {
            const res = yield call(insertAndUpdatePopularSearch, payload);
            if (res) {
                message.success('操作成功！');
                yield put({
                    type: 'getPopularSearchList',
                });
                return res
            }
        },
        *movePopularSearch({ payload }, { call, put }) {
            const res = yield call(movePopularSearch, payload);
            if (res) {
                message.success('操作成功！');
                yield put({
                    type: 'getPopularSearchList',
                });
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
        clear(state) {
            return {
                popularSearchData: {
                    list: [],
                    total: 0,
                    currentPage: 0,
                    totalPage: 0
                },
            };
        }
    }
}

import {
    bookSubjectList,
    deleteBanner,
    updateBookSubjectShelves,
    homePageObjectMove,
} from '../services';
import { message } from 'antd';
export default {
    namespace: "bookSubject",
    state: {
        bookSubjectData: {
            list: [],
            total: 0,
            currentPage: 0,
            totalPage: 0
        },
        page: 0,
        pageSize: 20,
        current: 1,
        subjectName: '',
        activeKey: 'SHELVES_ON',
    },

    effects: {
        *bookSubjectList({ payload }, { call, put, select }) {
            const { page, pageSize, subjectName, activeKey } = yield select(state => state.bookSubject);
            const content = {
                ...payload,
                subjectName,
                shelvesFlag: activeKey === 'SHELVES_ON' ? 'SHELVES_ON' : '',
                pageVo: {
                    page: activeKey === 'SHELVES_ON' ? 0 : page,
                    pageSize: activeKey === 'SHELVES_ON' ? 100 : pageSize,
                }
            };
            const res = yield call(bookSubjectList, content);
            if (res) {
                yield put({
                    type: 'save',
                    payload: {
                        bookSubjectData: res.data
                    },
                });
            }

        },
        *updateBookSubjectShelves({ payload }, { call, put }) {
            const res = yield call(updateBookSubjectShelves, payload);
            if (res) {
                message.success('操作成功！');
                yield put({
                    type: 'bookSubjectList',
                });
            }
        },
        *deleteBanner({ payload }, { call, put }) {
            const res = yield call(deleteBanner, payload);
            if (res) {
                message.success('删除成功！');
                yield put({
                    type: 'bookSubjectList',
                });
            }
        },
        *homePageObjectMove({ payload }, { call, put }) {
            const res = yield call(homePageObjectMove, payload);
            if (res) {
                message.success('操作成功！');
                yield put({
                    type: 'bookSubjectList',
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
                bookSubjectData: {
                    list: [],
                    total: 0,
                    currentPage: 0,
                    totalPage: 0
                },
            };
        }
    }
}

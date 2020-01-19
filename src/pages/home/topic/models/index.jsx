import {
    listOperationSubject,
    delOperationSubject,
    updateBannerShelves,
    homePageObjectMove,
} from '../services';
import { message } from 'antd';
export default {
    namespace: "topic",
    state: {
        topicData: {
            list: [],
            total: 0,
            currentPage: 0,
            totalPage: 0
        },
        page: 0,
        pageSize: 20,
        current: 1,
        subjectTitle: '',
    },

    effects: {
        *listOperationSubject({ payload }, { call, put, select }) {
            const { page, pageSize, subjectTitle } = yield select(state => state.topic);
            const content = {
                subjectTitle,
                pageVo: {
                    page,
                    pageSize,
                }
            };
            const res = yield call(listOperationSubject, content);
            if (res) {
                yield put({
                    type: 'save',
                    payload: {
                        topicData: res.data
                    },
                });
            }

        },
        *updateBannerShelves({ payload }, { call, put }) {
            const res = yield call(updateBannerShelves, payload);
            if (res) {
                message.success('操作成功！');
                yield put({
                    type: 'getBannerList',
                });
            }
        },
        *delOperationSubject({ payload }, { call, put }) {
            const res = yield call(delOperationSubject, payload);
            if (res) {
                message.success('删除成功！');
                yield put({
                    type: 'listOperationSubject',
                });
            }
        },
        *homePageObjectMove({ payload }, { call, put }) {
            const res = yield call(homePageObjectMove, payload);
            if (res) {
                message.success('操作成功！');
                yield put({
                    type: 'listOperationSubject',
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
                topicData: {
                    list: [],
                    total: 0,
                    currentPage: 0,
                    totalPage: 0
                },
            };
        }
    }
}

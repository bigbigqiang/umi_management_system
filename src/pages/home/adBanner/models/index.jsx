import {
    getOperationAdList,
    delOperationAd,
} from '../services';
import { message } from 'antd';
export default {
    namespace: "adBanner",
    state: {
        bannerData: {
            list: [],
            total: 0,
            currentPage: 0,
            totalPage: 0
        },
        page: 0,
        pageSize: 20,
        current: 1,
        bannerTitle: '',
    },

    effects: {
        *getOperationAdList({ payload }, { call, put, select }) {
            const { page, pageSize, bannerTitle } = yield select(state => state.adBanner);
            const content = {
                bannerTitle,
                pageVo: {
                    "page": page,
                    "pageSize": pageSize,
                }
            };
            const res = yield call(getOperationAdList, content);
            if (res) {
                yield put({
                    type: 'save',
                    payload: {
                        bannerData: res.data || {
                            list: [],
                            total: 0,
                            currentPage: 0,
                            totalPage: 0
                        }
                    },
                });
            }

        },
        *delOperationAd({ payload }, { call, put }) {
            const res = yield call(delOperationAd, payload);
            if (res) {
                message.success('删除成功！');
                yield put({
                    type: 'getOperationAdList',
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
                bannerData: {
                    list: [],
                    total: 0,
                    currentPage: 0,
                    totalPage: 0
                },
            };
        }
    }
}

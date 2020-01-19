import {
    getOperationPartList,
    boxSearchList,
    delOperationPart,
} from '../services';
import { message } from 'antd';
export default {
    namespace: "orderPage",
    state: {
        partData: {
            partList: [],
            total: 0,
            currentPage: 0,
            totalPage: 0
        },
        goodsTypeList: [],
        goodsStateList: [],
        page: 0,
        pageSize: 20,
        current: 1,
        partTitle: '',
    },

    effects: {
        *boxSearchList({ payload }, { call, put, select }) {
            const res = yield call(boxSearchList, payload);
            if (res.status === '1') {
                let data = res.data || []
                let goodsStateList = data.filter(item => item.remark === '展示状态')
                let goodsTypeList = data.filter(item => item.remark === '推荐类型')
                yield put({
                    type: 'save',
                    payload: {
                        goodsStateList,
                        goodsTypeList,
                    },
                });
            }
        },
        *getOperationPartList({ payload }, { call, put, select }) {
            const { page, pageSize, partTitle } = yield select(state => state.orderPage);

            const content = {
                partTitle,
                pageVo: {
                    page,
                    pageSize,
                },
                ...payload,
            };
            const res = yield call(getOperationPartList, content);
            if (res) {
                yield put({
                    type: 'save',
                    payload: {
                        partData: res.data || { partList: [] }
                    },
                });
            }
        },
        *delOperationPart({ payload }, { call, put }) {
            const res = yield call(delOperationPart, payload);
            if (res) {
                message.success('删除成功！');
                yield put({
                    type: 'getOperationPartList',
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
    }
}

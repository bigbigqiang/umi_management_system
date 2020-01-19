import {
    boxSearchList,
    listDailyBook,
    deleteDailyByCode,
    updateDailyPublishFlag,
    getDailyTitleConfigList,
    updateDailyTitleConfigList,
} from '../services';
import { message } from 'antd';
export default {
    namespace: "remittance",
    state: {
        dailyData: {
            list: [],
            total: 0,
            currentPage: 0,
            totalPage: 0
        },
        page: 0,
        pageSize: 10,
        current: 1,
        dailyTitle: '',
        pictureBookStatus: [],
        publishFlag: null,
        titleToday: {},
        titleTomorrow: {},
    },

    effects: {
        *boxSearchList({ payload }, { call, put, select }) {
            const res = yield call(boxSearchList, payload);
            if (res) {
                yield put({
                    type: 'save',
                    payload: {
                        pictureBookStatus: res.data || []
                    },
                });
            }
        },
        *listDailyBook({ payload }, { call, put, select }) {
            const { page, pageSize, dailyTitle, publishFlag } = yield select(state => state.remittance);
            const content = {
                dailyTitle,
                publishFlag,
                pageVo: {
                    page,
                    pageSize,
                }
            };
            const res = yield call(listDailyBook, content);
            if (res) {
                yield put({
                    type: 'save',
                    payload: {
                        dailyData: res.data
                    },
                });
            }

        },
        *updateDailyPublishFlag({ payload }, { call, put }) {
            const res = yield call(updateDailyPublishFlag, payload);
            if (res) {
                message.success('操作成功！');
                yield put({
                    type: 'listDailyBook',
                });
            }
        },
        *updateDailyTitleConfigList({ payload }, { call, put }) {
            const res = yield call(updateDailyTitleConfigList, payload);
            if (res) {
                message.success('恭喜修改成功啦!');
                return res
            }
        },
        *getDailyTitleConfigList({ payload }, { call, put }) {
            const res = yield call(getDailyTitleConfigList, payload);
            if (res) {
                let title_data = res.data || []
                let titleToday = title_data.find(n => n.showType === "TODAY_SUBJECT") || {};
                let titleTomorrow = title_data.find(n => n.showType === "TOMORROW_SUBJECT") || {};
                yield put({
                    type: 'save',
                    payload: {
                        titleToday,
                        titleTomorrow,
                    },
                });
            }
        },
        *deleteDailyByCode({ payload }, { call, put }) {
            const res = yield call(deleteDailyByCode, payload);
            if (res) {
                message.success('删除成功！');
                yield put({
                    type: 'listDailyBook',
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
                dailyData: {
                    list: [],
                    total: 0,
                    currentPage: 0,
                    totalPage: 0
                },
            };
        }
    }
}

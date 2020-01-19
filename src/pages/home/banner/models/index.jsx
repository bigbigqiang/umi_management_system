import {
    getBannerList,
    deleteBanner,
    updateBannerShelves,
    homePageObjectMove,
} from '../services';
import { message } from 'antd';
export default {
    namespace: "banner",
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
        activeKey: 'SHELVES_ON',
    },

    effects: {
        *getBannerList({ payload }, { call, put, select }) {
            const { page, pageSize, bannerTitle, activeKey } = yield select(state => state.banner);
            const content = {
                bannerTitle,
                shelvesFlag: activeKey === 'SHELVES_ON' ? 'SHELVES_ON' : '',
                pageVo: {
                    page: activeKey === 'SHELVES_ON' ? 0 : page,
                    pageSize: activeKey === 'SHELVES_ON' ? 100 : pageSize,
                }
            };
            const res = yield call(getBannerList, content);
            if (res) {
                yield put({
                    type: 'save',
                    payload: {
                        bannerData: res.data
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
        *deleteBanner({ payload }, { call, put }) {
            const res = yield call(deleteBanner, payload);
            if (res) {
                message.success('删除成功！');
                yield put({
                    type: 'getBannerList',
                });
            }
        },
        *homePageObjectMove({ payload }, { call, put }) {
            const res = yield call(homePageObjectMove, payload);
            if (res) {
                message.success('操作成功！');
                yield put({
                    type: 'getBannerList',
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

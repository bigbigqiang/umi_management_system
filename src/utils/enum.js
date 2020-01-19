/*
 * Author: liuyaqian
 * Date: 2019-07-02 11:46:25
 * Description: 公用枚举类型
 * Last Modified by: liuyaqian
 * Last Modified time: 2019-07-31 10:36:21
 */

export const Enum = {
  dictionary: {
    // 订单支付状态
    PAY_WAITING: '待支付',
    PAY_SUCCESS: '已支付',
    PAY_EXPIRED: '已失效',
    PAY_CANCELED: '已取消',

    // 订单支付方式
    ALIPAY: '支付宝',
    WXPAY: '微信',
    APPLE_IAP: '苹果',
    // ELLA_COIN: '咿啦币',
    HUAWEIPAY: '华为',
    INTEGRAL: '积分',
    ELLA_POINT: '积分',
    CORPORATE: '对公支付',

    // 订单商品类型
    ELLA_COIN: '咿啦币',
    ELLA_VIP: '咿啦会员',
    BOOK: '图书',
    BOOK_PACKAGE: '图书包',
    LIBRARY: '图书馆',
    LISTEN_CARD: '听书卡',
    ELLA_COURSE: '课程',

    // 订单购买类型
    BOOK_BUY: '购书',
    BALANCE_MEMBER_BUY: '余额购买会员',
    MEMBER_BUY: '现金购买会员',
    BOOK_RENT: '租书',
    ONE_CLICK_RENT_BOOKS: '一键租书',
    ELLA_COIN_BUY: '咿啦币充值',
    BOOK_PACKAGE_BUY: '图书包购买',
    COURSE_BUY: '课程购买',
    ONE_CLICK_BUY: '一键购买',
    POINTS_MEMBER_BUY: '积分兑换会员',
    POINTS_MEMBER_BUY_LISTEN_CARD: '积分兑换听书卡',
    BOOK_SUBJECT_BUY: '买图书专题',
    BOOK_SUBJECT_RENT: '租图书专题',
    CASH_BUY_BOOK: '现金买书',

    // 会员类型
    ELLA_ZH_VIP: '中文会员',
    ELLA_EN_VIP: '英文会员',

    // 设备类型
    SN: '设备',
    SOFTWARE: '软件',
    AFTER_SALE: '售后',

    // 问题反馈处理状态
    UNDISPOSED: '未处理',
    IN_HAND: '处理中',
    HANDLED: '已处理',

  },
  TargetType: {
    BOOK_DETAIL: '图书详情',
    H5: 'H5页面',
    SYSTEM_INTERFACE: '系统界面',
    COURSE_DETAIL: '课程详情',
    COURSE_LIST: '课程列表',
    BOOK_LIST: '推荐模块',
    BOOK_PACKAGE_DETAIL: '图书包详情'
  },
  BookStatus: {
    SHELVES_WAIT: '待上架',
    SHELVES_ON: '已上架',
    SHELVES_OFF: '已下架',
    PRE_SALE: '预售'
  }
}
export default Enum;

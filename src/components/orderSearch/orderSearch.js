/*
 * Author: liuyaqian
 * Date: 2019-07-01 17:16:45
 * Last Modified by: liuyaqian
 * Last Modified time: 2019-07-26 11:40:51
 */

import React from 'react'
import { DatePicker, Select, Icon, Button, Input, Modal, Row, Col, InputNumber, Checkbox, message } from 'antd'
import { connect } from 'dva';
import moment from 'moment';
import { getBoxSearchList, getOrderManageList, getListOrderExcel } from '../../pages/order/orderList/services/index'
const Search = Input.Search;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;

class OrderSearcher extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      expand: false,
      exportModalVisible: false,
      exportData: {
        dateType: 'orderFinishedTime',
        startTime: '',
        endTime: '',
        channelCode: null,
        orderPayType: null,
        goodsType: null,
        buyType: null,
        pageSize: null,
        page: 0,
        orderInfoVoList: []
      },
      exportDataLength: 0,
      exportDataLengthShow: false,
      exportLoading: false,

      searchInfo: {
        startTimeStr: '',
        endTimeStr: '',
        dateType: null,
        orderStatus: null,
        orderPayType: null,
        goodsType: null,
        buyType: null,
        searchType: null,
        orderManageSearchType: 'orderCode',
        searchContent: '',
        pageVo: {
          page: 0,
          pageSize: 20,
        },
      }
    };
    this.query = this.query.bind(this);
    this.clearSelect = this.clearSelect.bind(this);
  }

  componentDidMount() {
    // console.log(this.props)
  }

  getList = (values) => {
    // console.log(values)
    this.props.dispatch({
      type: 'OrderPage/fetchOrderList',
      payload: {
        ...values
      }
    })
  }

  searchsetState = (str, value) => {
    this.setState({
      searchInfo: {
        ...this.state.searchInfo,
        [str]: value
      }
    })
  }

  getStartOrEndData(value, dateString, str) {
    this.setState({
      searchInfo: {
        ...this.state.searchInfo,
        [str]: dateString
      }
    })
  }

  clearSelect() {
    this.setState({
      searchInfo: {
        startTimeStr: '',
        endTimeStr: '',
        dateType: null,
        orderStatus: null,
        orderPayType: null,
        goodsType: null,
        buyType: null,
        searchType: null,
        orderManageSearchType: 'orderCode',
        searchContent: '',
        pageVo: {
          page: 0,
          pageSize: 20,
        },
      }
    })
  }


  toggle() {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  }

  cancelExportModal() {
    this.setState({
      exportModalVisible: false,
      exportData: {
        dateType: 'orderFinishedTime',
        startTime: '',
        endTime: '',
        channelCode: null,
        orderPayType: null,
        goodsType: null,
        buyType: null,
        pageSize: null,
        page: 0,
        orderInfoVoList: []
      }
    })
  }
  visibleExportModal() {
    this.setState({
      exportModalVisible: true,
      exportDataLengthShow: false,
      exportData: {
        dateType: 'orderFinishedTime',
        startTime: '',
        endTime: '',
        channelCode: null,
        orderPayType: null,
        goodsType: null,
        buyType: null,
        pageSize: null,
        page: 0,
        orderInfoVoList: []
      }
    })
  }

  // 导出所选订单
  exportModal() {
    if (!(this.state.exportData.startTime && this.state.exportData.endTime)) {
      message.error('订单完成时间未填写');
      return;
    }
    if (!this.state.exportData.pageSize) {
      message.error('订单数量未填写');
      return;
    }
    if (!this.state.exportData.orderInfoVoList.length) {
      message.error('导出字段未选择');
      return;
    }
    if (this.state.exportData.pageSize > 5000) {
      message.error('最多可导出5000条数据，请重新填写订单数量');
      return;
    }
    let overArray = [];
    let orderInfoVoList = [];
    this.state.exportData.orderInfoVoList.map((ele) => {
      overArray.push(this.state.plainOptions.filter((item) => item.value === ele)[0])
    })
    function compare(prop) {
      return function (obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        if (val1 < val2) {
          return -1;
        } else if (val1 > val2) {
          return 1;
        } else {
          return 0;
        }
      }
    }
    overArray.sort(compare("index")).map((item) => {
      orderInfoVoList.push(item.value)
    })
    this.setState({
      exportLoading: true
    })
    let params = {
      ...this.state.exportData,
      orderStatus: 'PAY_SUCCESS',
      searchType: 'categorySearch',
      orderInfoVoList: 'orderInfoVoList',
    }

    this.props.dispatch({
      type: 'orderPage/fetchExport',
      payload: params
    })
    this.setState({
      exportLoading: false,
      exportModalVisible: false
    })
  }

  checkDataLength() {
    if (!(this.state.exportData.startTime && this.state.exportData.endTime)) {
      message.error('订单完成时间未填写');
      return;
    }
    let params = { ...this.state.exportData }
    params.pageSize = 1
    params.orderStatus = 'PAY_SUCCESS'
    params.searchType = 'categorySearch'

    this.orderManageList(params)
  }

  orderManageList = async (params) => {

    let data = await getOrderManageList(params);
    if (data.status == '1') {
      let exportDataLength = data.data.total > 5000 ? 5000 : data.data.total
      this.setState({
        exportDataLength: exportDataLength,
        exportDataLengthShow: true
      })
    } else {
      message.error(data.message)
    }
  }

  setStartOrEndData(date, dateString, str) {
    this.setState({
      exportData: {
        ...this.state.exportData,
        [str]: dateString
      }
    })
  }

  setStateExportData(str, value) {
    this.setState({
      exportData: {
        ...this.state.exportData,
        [str]: value
      }
    })
  }

  // 简单搜索
  getSearchContentData(str, value) {
    // console.log(str, value);
    this.setState({
      searchInfo: {
        ...this.state.searchInfo,
        [str]: value,
        pageVo: {
          page: 0,
          pageSize: 20
        }
      },
      // searchType: 'accurateSearch',
    }, () => {
      if (this.state.searchInfo.orderManageSearchType == null) {
        message.error('请选择查询类型');
      } else {
        this.getList(this.state.searchInfo)
      }
    })
  }

  // 更多搜索
  query() {
    console.log(this.state)
    if (this.state.searchInfo.startTimeStr == "") {
      this.setState({
        searchInfo: {
          ...this.state.searchInfo,
          startTime: ''
        }
      })
    }
    if (this.state.searchInfo.endTimeStr == "") {
      this.setState({
        searchInfo: {
          ...this.state.searchInfo,
          endTimeStr: ''
        }
      })
    }
    this.setState({
      searchType: 'categorySearch',
      page: 0,
      current: 1
    }, () => {
      // if ((this.state.searchInfo.startTimeStr != '' || this.state.searchInfo.endTimeStr != '') && this.state.searchInfo.dateType == '') {
      //   message.error('请选择时间类型');
      // } else {
      this.getList(this.state.searchInfo)
      // }
    });
  }
  render() {

    const { searchInfo } = this.props.OrderPage;
    const { dateType, orderStatus, orderPayType, goodsType, buyType, searchType, searchContent } = this.state.searchInfo;
    console.log(this.state)
    

    const plainOptions = [
      {
        index: 0,
        name: '订单编号',
        value: 'orderNo'
      },
      {
        index: 1,
        name: '用户ID',
        value: 'uid'
      },

      {
        index: 2,
        name: '用户账号',
        value: 'userNick'
      },
      {
        index: 3,
        name: '商品类型',
        value: 'goodsType'
      },
      {
        index: 4,
        name: '商品名称',
        value: 'goodsName'
      },
      {
        index: 5,
        name: '订单金额',
        value: 'orderAmount'
      },
      {
        index: 6,
        name: '实付金额',
        value: 'payAmount'
      },
      {
        index: 7,
        name: '渠道',
        value: 'channelName'
      },
      {
        index: 8,
        name: '支付方式',
        value: 'paymentPlantform'
      },
      {
        index: 9,
        name: '订单类型',
        value: 'orderType'
      },
      {
        index: 10,
        name: '完成日期',
        value: 'finishedTime'
      },
      {
        index: 11,
        name: '订单状态',
        value: 'orderStatus'
      }];

    return (
      <div>
        <div className="m-order-bd">
          <div className="m-accurate">
            <div>
              <Select defaultValue="orderCode" className="selectWidth intervalRight" onChange={(value) => this.searchsetState("orderManageSearchType", value)}>
                <Option value="orderCode">订单编码</Option>
                <Option value="userMobile">用户账号</Option>
                <Option value="goodsName">商品名称</Option>
              </Select>
              <Search placeholder="输入检索内容" enterButton className="searchWidth intervalRight" onSearch={(value) => { this.getSearchContentData("searchContent", value) }} />
              <Button className="u-btn inline-block" onClick={() => { this.toggle() }}>更多条件<Icon type={this.state.expand ? 'up' : 'down'} /></Button>
              {/* <Button className="u-btn" style={{ marginLeft: '30px' }} onClick={this.visibleExportModal}>导出订单列表</Button> */}
            </div>
          </div>
          <div className="m-expand-box" style={{ display: this.state.expand ? 'block' : 'none', 'marginLeft': '20px', 'marginTop': '20px' }}>
            <div className="part">
              <span className="u-txt">时间筛选:</span>
              <Select value={dateType} className="selectWidth" onChange={(value) => this.searchsetState("dateType", value)}>
                <Option value="orderCreateTime">生成时间</Option>
                <Option value="orderFinishedTime">支付时间</Option>
              </Select>
            </div>

            <div className="part">
              <DatePicker
                style={{ marginLeft: 10, width: 150 }}
                className="intervalBottom"
                placeholder={['开始时间']}
                onChange={(value, dateString) => { this.getStartOrEndData(value, dateString, "startTimeStr") }}
                value={this.state.searchInfo.startTimeStr != '' ? moment(this.state.searchInfo.startTimeStr, 'YYYY-MM-DD') : null}
              />
              <i> — </i>
              <DatePicker
                style={{ marginLeft: 10, width: 150 }}
                className="intervalBottom"
                placeholder={['结束时间']}
                onChange={(value, dateString) => { this.getStartOrEndData(value, dateString, "endTimeStr") }}
                value={this.state.searchInfo.endTimeStr != '' ? moment(this.state.searchInfo.endTimeStr, 'YYYY-MM-DD') : null}
              />
            </div>

            <div className="part">
              <span className="u-txt">支付方式:</span>
              <Select value={orderPayType} className="selectWidth" onChange={(value) => this.searchsetState("orderPayType", value)}>
                <Option value={null}>全部</Option>
                <Option value="WXPAY">微信</Option>
                <Option value="ALIPAY">支付宝</Option>
              </Select>
            </div>
            <div className="part">
              <span className="u-txt">商品类型:</span>
              <Select value={goodsType} className="selectWidth" onChange={(value) => this.searchsetState("goodsType", value)}>
                <Option value={null}>全部</Option>
                <Option value="BOOK">图书</Option>
                <Option value="BOOK_PACKAGE">图书包</Option>
                <Option value="ELLA_VIP">会员</Option>
                <Option value="userMobile">英语图书</Option>
              </Select>
            </div>
            <div className="part">
              <span className="u-txt">订单状态:</span>
              <Select value={orderStatus} className="selectWidth" onChange={(value) => this.searchsetState("orderStatus", value)}>
                <Option value={null}>全部</Option>
                <Option value="PAY_SUCCESS">已支付</Option>
                <Option value="PAY_WAITING">待支付</Option>
                <Option value="PAY_CANCELED">支付失败</Option>
              </Select>
            </div>
            <div className="part">
              <span className="u-txt">订单类型:</span>
              <Select value={buyType} className="selectWidth" onChange={(value) => this.searchsetState("buyType", value)}>
                <Option value={null}>全部</Option>
                <Option value="BOOK_BUY">买书</Option>
                <Option value="BOOK_PACKAGE_BUY">买图书包</Option>
                <Option value="MEMBER_BUY">买会员</Option>
                <Option value="BOOK_RENT">租书</Option>
              </Select>
            </div>
            <div>
              <Button className="u-btn block buttonWidth intervalRight" onClick={this.query}>查询</Button>
              <Button className="u-btn block buttonWidth" onClick={this.clearSelect}>恢复默认</Button>
            </div>
          </div>
        </div>

        {/* <Modal
          title="订单列表导出"
          width={740}
          visible={this.state.exportModalVisible}
          onOk={this.exportModal}
          onCancel={this.cancelExportModal}
          okText="导出"
          cancelText="取消"
          footer={[
            <Button key="back" onClick={this.cancelExportModal}>取消</Button>,
            <Button key="submit" type="primary" loading={this.state.exportLoading} onClick={this.exportModal}>
              导出
                        </Button>,
          ]}
        >
          <Row className="rowPart" style={{ marginBottom: 10 }}>
            <span className="colTitle">订单完成时间:</span>
            <DatePicker
              style={{ marginLeft: 10, width: 150 }}
              className="intervalBottom"
              placeholder={'开始时间'}
              onChange={(value, dateString) => { this.setStartOrEndData(value, dateString, "startTime") }}
              value={this.state.exportData.startTime != '' ? (this.state.exportData.startTime, 'YYYY-MM-DD') : null}
            // value={this.state.exportData.startTime != '' ? moment(this.state.exportData.startTime, 'YYYY-MM-DD') : null}
            />
            <span className="line"> — </span>
            <DatePicker
              className="intervalRight intervalBottom"
              style={{ width: 150 }}
              placeholder={'结束时间'}
              onChange={(value, dateString) => { this.setStartOrEndData(value, dateString, "endTime") }}
              value={this.state.exportData.endTime != '' ? (this.state.exportData.endTime, 'YYYY-MM-DD') : null}
            // value={this.state.exportData.endTime != '' ? moment(this.state.exportData.endTime, 'YYYY-MM-DD') : null}
            />
          </Row>
          <Row className="rowPart" style={{ marginBottom: 10 }}>
            <span className="colTitle">渠道:</span>
            <Select value={this.state.exportData.channelCode} className="intervalRight intervalBottom" style={{ marginLeft: 37, width: 130 }} onChange={(value) => this.setStateExportData("channelCode", value)}>
              <Option value={null}>全部</Option>
              {
                this.state.defaultData.channel.map((item, i) => {
                  return <Option value={item.code} key={i}>{item.name}</Option>
                })
              }
            </Select>
            <span className="colTitle">支付平台:</span>
            <Select value={this.state.exportData.orderPayType} className="intervalRight intervalBottom" style={{ marginLeft: 10, width: 130 }} onChange={(value) => this.setStateExportData("orderPayType", value)}>
              <Option value={null}>全部</Option>
              {
                this.state.defaultData.payTypeList.map((item, i) => {
                  return <Option value={item.searchCode} key={i}>{item.searchName}</Option>
                })
              }
            </Select>
            <span className="colTitle">商品类型:</span>
            <Select value={this.state.exportData.goodsType} className="intervalRight intervalBottom" style={{ marginLeft: 10, width: 130 }} onChange={(value) => this.setStateExportData("goodsType", value)}>
              <Option value={null}>全部</Option>
              {
                this.state.defaultData.goodsTypeList.map((item, i) => {
                  return <Option value={item.searchCode} key={i}>{item.searchName}</Option>
                })
              }
            </Select>
          </Row>
          <Row className="rowPart" style={{ marginBottom: 10 }}>
            <span className="colTitle">订单类型:</span>
            <Select value={this.state.exportData.buyType} className="intervalRight intervalBottom" style={{ marginLeft: 10, width: 130 }} onChange={(value) => this.setStateExportData("buyType", value)}>
              <Option value={null}>全部</Option>
              {
                this.state.defaultData.buyTypeList.map((item, i) => {
                  return <Option value={item.searchCode} key={i}>{item.searchName}</Option>
                })
              }
            </Select>
            <span className="colTitle">订单数量:</span>
            <InputNumber min={1} style={{ marginLeft: 10 }} value={this.state.exportData.pageSize} onChange={(value) => this.setStateExportData("pageSize", value)} />
            <Button type='primary' style={{ marginLeft: '30px' }} onClick={this.checkDataLength}>查询</Button>
            {this.state.exportDataLengthShow && <span style={{ marginLeft: '10px', color: '#faad14' }}>最多导出{this.state.exportDataLength}条订单数据</span>}
          </Row>
          <Row className="rowPart" style={{ marginBottom: 10, display: 'flex' }}>
            <span className="colTitle">导出字段:</span>
            <CheckboxGroup value={this.state.exportData.orderInfoVoList} onChange={(value) => { this.setStateExportData("orderInfoVoList", value) }} style={{ display: 'inline' }}>
              <Row style={{ paddingTop: 6 }}>
                {
                  this.state.plainOptions.map((item, i) => {
                    return <Col span={6} key={i} style={{ marginBottom: 10 }}><Checkbox value={item.value}>{item.name}</Checkbox></Col>
                  })
                }
              </Row>
            </CheckboxGroup>
          </Row>
        </Modal> */}

      </div>
    )
  }
}

export default connect(({ OrderPage }) => ({ OrderPage }))(OrderSearcher)

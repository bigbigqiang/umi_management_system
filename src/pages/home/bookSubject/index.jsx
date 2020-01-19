/*
 * Author: jinhui
 * Description: banner页
 * Date: 2019-06-17 18:26:42
 * LastEditors: jinhui
 * LastEditTime: 2019-09-05 16:29:24
 */

import React from 'react';
import { connect } from 'dva';
import { Table, Button, Popconfirm, message, Input, Tabs, Icon, Drawer, DatePicker, Select, } from 'antd';
import Link from 'umi/link';
import moment from 'moment';

const Search = Input.Search;
const TabPane = Tabs.TabPane;
const ButtonGroup = Button.Group;

const { Option } = Select;

function range(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}


class BookSubject extends React.Component {

  state = {
    moreConditions: false,
    publishStatus: '',
    beginUpdateTime: null,
    endUpdateTime: null,
  }

  componentDidMount() {
    this.bookSubjectList()
  }

  bookSubjectList = () => {
    const { publishStatus, beginUpdateTime, endUpdateTime } = this.state
    if (beginUpdateTime && endUpdateTime) {
      if (!endUpdateTime.isAfter(beginUpdateTime)) {
        message.error('开始时间不能大于结束时间！')
        return
      }
    }
    this.props.dispatch({
      type: 'bookSubject/bookSubjectList',
      payload: { publishStatus, beginUpdateTime: beginUpdateTime ? beginUpdateTime.format('YYYY-MM-DD hh:mm:ss') : '', endUpdateTime: endUpdateTime ? endUpdateTime.format('YYYY-MM-DD hh:mm:ss') : '' }
    }).then(() => {
      this.setState({
        moreConditions: false,
      })
    })
  }

  pageChangeFun = ({ pageVo }) => {
    let { page, pageSize, current } = pageVo
    this.props.dispatch({
      type: 'bookSubject/asyncUpdate',
      payload: {
        page,
        current,
        pageSize,
      }
    }).then(this.bookSubjectList)
  }


  deleteFn = (subjectCode) => {
    this.props.dispatch({
      type: 'bookSubject/delete',
      payload: {
        subjectCode: subjectCode,
      }
    })

  }
  deleteBanner = (subjectCode, shelvesFlag) => {
    if (shelvesFlag === "SHELVES_ON") {
      message.error('该banner图已上架，请下架后重新操作！');
      return
    }
    this.props.dispatch({
      type: 'bookSubject/deleteBanner',
      payload: {
        subjectCode: subjectCode,
      }
    })
  }
  updateBookSubjectShelves = (subjectCode, shelvesFlag, showFlag) => {
    this.props.dispatch({
      type: 'bookSubject/updateBookSubjectShelves',
      payload: {
        subjectCode: subjectCode,
        shelvesFlag: shelvesFlag,
      }
    })

  }
  //搜索框
  bannerSearch(value) {
    this.props.dispatch({
      type: 'bookSubject/asyncUpdate',
      payload: {
        subjectName: value
      }
    }).then(this.bookSubjectList)
  }

  disabledDate(current) {
    // Can not select days before today and today
    return current && current < moment().endOf('day');
  }

  disabledRangeTime(_, type) {
    if (type === 'start') {
      return {
        disabledHours: () => range(0, 60).splice(4, 20),
        disabledMinutes: () => range(30, 60),
        disabledSeconds: () => [55, 56],
      };
    }
    return {
      disabledHours: () => range(0, 60).splice(20, 4),
      disabledMinutes: () => range(0, 31),
      disabledSeconds: () => [55, 56],
    };
  }


  arrowFetchFn = async (content) => {
    this.props.dispatch({
      type: 'bookSubject/move',
      payload: {
        ...content
      }
    })
  }

  changeTabs = (activeKey) => {
    this.props.dispatch({
      type: 'bookSubject/asyncUpdate',
      payload: {
        activeKey
      }
    }).then(this.bookSubjectList)
  }

  arrowDown = (index) => {
    const { bookSubject: { bookSubjectData } } = this.props;
    const { list = [] } = bookSubjectData
    if (index === list.length - 1) {
      message.error(`不可向下移！`);
    } else {
      this.props.dispatch({
        type: 'bookSubject/homePageObjectMove',
        payload: {
          moveInModuleCode: list[index].subjectCode,
          moveInResult: list[index + 1].idx,
          moveOutModuleCode: list[index + 1].subjectCode,
          moveOutResult: list[index].idx,
          moveType: 'eb_operation_book_subject',
        }
      })
    }
  }

  arrowUp = (index) => {
    if (index === 0) {
      message.error(`不可向上移！`);
    } else {
      const { bookSubject: { bookSubjectData } } = this.props;
      const { list } = bookSubjectData
      this.props.dispatch({
        type: 'bookSubject/homePageObjectMove',
        payload: {
          moveInModuleCode: list[index - 1].subjectCode,
          moveInResult: list[index].idx,
          moveOutModuleCode: list[index].subjectCode,
          moveOutResult: list[index - 1].idx,
          moveType: 'eb_operation_book_subject',
        }
      })
    }
  }

  reset = () => {
    this.props.dispatch({
      type: 'bookSubject/asyncUpdate',
      payload: {
        subjectName: ''
      }
    }).then(() => {
      this.setState({
        moreConditions: false,
        publishStatus: '',
        beginUpdateTime: null,
        endUpdateTime: null,
      }, this.bookSubjectList)
    })

  }

  render() {
    const { loading, bookSubject: { bookSubjectData, pageSize, subjectName, activeKey } } = this.props;
    const { list = [], total = 0, currentPage = 0 } = bookSubjectData
    const { publishStatus, beginUpdateTime, endUpdateTime } = this.state
    const columns = [{
      title: '专栏标题',
      width: '15%',
      dataIndex: 'subjectName',
      render: (text) => !!text ? text : "-"
    }, {
      title: '修改时间',
      width: '15%',
      dataIndex: 'updateTime',
      render: (text) => !!text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : "-"
    },
    {
      title: '平台',
      width: 100,
      className: 'td_hide',
      render: (text, record) => {
        let _platformCode
        if (!record.platformCode) {
          _platformCode = '-';
        } else {
          let curCode = record.platformCode;

          let curCode2 = ((curCode.replace("APP", "移动客户端")).replace("HD", "HD客户端")).replace("GUSHIJI", "故事机");

          let curCode3 = curCode2.split(",");

          if (curCode3.length > 3) {
            _platformCode = curCode3.slice(0, 3).join("/") + "..."
          } else {
            _platformCode = curCode3.join("/");
          }
        }
        return (
          <span title={_platformCode}>{_platformCode}</span>
        )
      }
    },
    {
      title: '关联图书包',
      width: '10%',
      dataIndex: 'packageName'
    },
    {
      title: '图书包状态',
      width: '10%',
      dataIndex: 'packageStatus',
      render: (text) => text === "SHELVES_WAIT" ? "待上架" : text === "SHELVES_ON" ? "已上架" : text === "SHELVES_OFF" ? "已下架" : text === "PRE_SALE" ? "预售" : "-"
    },
    {
      title: '专栏标签',
      width: '10%',
      dataIndex: 'tags',
      render: (text) => !!text ? text : "-"
    },
    {
      title: '专栏状态',
      width: '10%',
      dataIndex: 'publishStatus',
      render: (text) => text === "PUBLISH_ON" ? "已发布" : text === "PUBLISH_OFF" ? "未发布" : text === "PUBLISH_OFF_UPDATE" ? "修改未发布" : "-"
    },
    {
      title: '操作',
      width: '20%',
      render: (text, record, index) => {
        if (activeKey === 'SHELVES_ON') {
          return (
            <ButtonGroup>
              <Button size='small' type="primary" icon="form" onClick={() => { this.props.history.push(`/home/bookSubject/${record.subjectCode}`) }}></Button>
              <Button size='small' type="primary" icon="arrow-up" onClick={() => {
                if (record.shelvesFlag === 'SHELVES_OFF') {
                  message.warning('不可做排序操作！')
                } else {
                  this.arrowUp(index)
                }
              }}></Button>
              <Button size='small' type="primary" icon="arrow-down" onClick={() => {
                if (record.shelvesFlag === 'SHELVES_OFF') {
                  message.warning('不可做排序操作！')
                } else {
                  this.arrowDown(index)
                }
              }}></Button>
            </ButtonGroup>

          )
        } else {
          return (
            <Button size='small' type="primary" icon="form" onClick={() => { this.props.history.push(`/home/bookSubject/${record.subjectCode}`) }}></Button>
          )
        }

      }
    }, {
      title: '状态操作',
      width: '10%',
      render: (text, record) => {
        return (
          <Popconfirm title={record.shelvesFlag === 'SHELVES_ON' ? '确定下架吗?' : '确定上架吗?'} onConfirm={() => { this.updateBookSubjectShelves(record.subjectCode, record.shelvesFlag === 'SHELVES_ON' ? 'SHELVES_OFF' : 'SHELVES_ON') }}>
            <span style={{ "color": "#40a9ff", "cursor": "pointer", "fontWeight": "bold" }}>{record.shelvesFlag === 'SHELVES_ON' ? '下架' : '上架'}</span>
          </Popconfirm>
        )
      }
    }
    ];

    return (
      <div>
        <p className="m-title">专栏管理</p>
        <div className='m-condition-options'>
          <Button className='m-condition-options-item' type="primary" icon="plus"> <Link to='/home/bookSubject/0' >添加新的专栏</Link></Button>
          <Button className='m-condition-options-item' type="primary"> 专栏模块编辑</Button>
          <Search className='m-condition-options-item' placeholder="搜索" value={subjectName} onChange={(e) => {
            this.props.dispatch({
              type: 'bookSubject/asyncUpdate',
              payload: {
                subjectName: e.target.value
              }
            })
          }} enterButton style={{ width: 320 }} onSearch={value => this.bannerSearch(value)} />
          <Button className='m-condition-options-item' type="primary" onClick={() => { this.setState({ moreConditions: true }) }}>
            更多搜索条件
            <Icon type="right" />
          </Button>
        </div>
        <Tabs activeKey={activeKey} onChange={this.changeTabs} style={{ width: "100%", textAlign: 'center' }}>
          <TabPane tab='上架专栏' key='SHELVES_ON'>
            <Table
              rowKey={(record, index) => index}
              size="small"
              loading={loading}
              columns={columns}
              dataSource={list}
              bordered
              scroll={{ y: 570 }}
              pagination={false}
            />
          </TabPane>
          <TabPane tab='全部专栏' key='ALL'>
            <Table
              rowKey={(record, index) => index}
              size="small"
              loading={loading}
              columns={columns}
              dataSource={list}
              bordered
              scroll={{ y: 570 }}
              onChange={(pagination, filter, sorter) => {
                this.pageChangeFun({
                  pageVo: {
                    page: pagination.current - 1,
                    pageSize: pagination.pageSize,
                    current: pagination.current
                  }
                })
              }}

              pagination={{
                total: total,
                size: "small",
                current: currentPage,
                pageSize,
                showSizeChanger: true,
                showQuickJumper: true
              }}
            />
          </TabPane>
        </Tabs>
        <Drawer
          title="更多搜索条件"
          placement="right"
          width={400}
          closable={false}
          onClose={() => { this.setState({ moreConditions: false }) }}
          visible={this.state.moreConditions}
        >
          <div className='ant-form-item'>
            <div className='ant-form-item-label'>
              推荐名称
            </div>
            <div className='ant-form-item-control-wrapper'>
              <Input style={{ width: '100%' }} placeholder='请输入推荐名称' value={subjectName} onChange={(e) => {
                this.props.dispatch({
                  type: 'bookSubject/asyncUpdate',
                  payload: {
                    subjectName: e.target.value
                  }
                })
              }} />
            </div>
          </div>
          <div className='ant-form-item'>
            <div className='ant-form-item-label'>
              创建时间
            </div>
            <div className='ant-form-item-control-wrapper'>
              <DatePicker.RangePicker
                showTime={{
                  hideDisabledOptions: true,
                  defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                }}
                value={[beginUpdateTime, endUpdateTime]}
                format="YYYY-MM-DD HH:mm:ss"
                onChange={(value) => {
                  this.setState({
                    beginUpdateTime: value[0],
                    endUpdateTime: value[1],
                  })
                }}
              />
            </div>
          </div>
          <div className='ant-form-item'>
            <div className='ant-form-item-label'>
              展示状态
            </div>
            <div className='ant-form-item-control-wrapper'>
              <Select style={{ width: '100%' }} value={publishStatus} onChange={(value) => { this.setState({ publishStatus: value }) }}>
                <Option value="">全部</Option>
                <Option value="PUBLISH_ON">已发布</Option>
                <Option value="PUBLISH_OFF">未发布</Option>
                <Option value="PUBLISH_OFF_UPDATE">修改未发布</Option>

              </Select>
            </div>
          </div>
          <div className='ant-form-item'>
            <Button type="primary" block onClick={this.bookSubjectList}>
              查询
            </Button>
          </div>
          <div className='ant-form-item'>
            <Button type="danger" block onClick={this.reset}>
              恢复默认
            </Button>
          </div>
        </Drawer>
      </div>
    )
  }
}
export default connect(({ bookSubject, loading }) => ({
  loading: loading.effects['bookSubject/bookSubjectList'],
  bookSubject
}))(BookSubject);

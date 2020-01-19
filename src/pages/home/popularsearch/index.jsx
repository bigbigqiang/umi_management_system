/*
 * Author: zhangsongqiang
 * Description: Popularsearch页
 * Date: 2020/1/8 下午1:34:18
 * LastEditors: zhangsongqiang
 * LastEditTime: 2020/1/8 下午1:34:18
 */

import React from 'react';
import { connect } from 'dva';
import { Table, Button, Popconfirm, message, Input, Tabs, Modal } from 'antd';

const Search = Input.Search;
const TabPane = Tabs.TabPane;
const ButtonGroup = Button.Group;

class Popularsearch extends React.Component {

  state = {
    visible: false,
    searchCode: '',
    searchName: '',
    currentPopularsearch: {},
  }

  componentDidMount() {
    this.getPopularSearchList()
  }

  getPopularSearchList = () => {
    this.props.dispatch({
      type: 'popularsearch/getPopularSearchList',
    })
  }

  delPopularSearch = (searchCode, shelvesFlag) => {
    if (shelvesFlag === "SHELVES_ON") {
      message.error('该热门搜索已上线，请下线后重新操作！');
      return
    }
    this.props.dispatch({
      type: 'popularsearch/delPopularSearch',
      payload: {
        searchCode,
      }
    })
  }
  shelvesFlagPopularSearch = (searchCode, shelvesFlag, searchStatus) => {
    this.props.dispatch({
      type: 'popularsearch/shelvesFlagPopularSearch',
      payload: {
        searchCode,
        shelvesFlag,
        searchStatus
      }
    })

  }
  //搜索框
  popularSearchSearch(value) {
    this.props.dispatch({
      type: 'popularsearch/asyncUpdate',
      payload: {
        searchName: value
      }
    }).then(this.getPopularSearchList)
  }


  changeTabs = (activeKey) => {
    this.props.dispatch({
      type: 'popularsearch/asyncUpdate',
      payload: {
        activeKey
      }
    }).then(this.getPopularSearchList)
  }

  topPopularSearch(moveTopModuleCode, moveTopModuleIdx) {
    this.props.dispatch({
      type: 'popularsearch/topPopularSearch',
      payload: {
        moveTopModuleCode, moveTopModuleIdx
      }
    })
  }

  movePopularSearch = (index, moveCode, moveIdx, moveType) => {
    const { popularsearch: { popularSearchData } } = this.props;
    const { popularSearchList } = popularSearchData
    if (index === popularSearchList.length - 1) {
      message.error(`不可向下移！`);
    } else if (index === 0) {
      message.error(`不可向上移！`);
    } else {
      this.props.dispatch({
        type: 'popularsearch/movePopularSearch',
        payload: {
          moveCode, moveIdx, moveType
        }
      })
    }
  }

  cheackSearchName = (searchName) => {
    searchName = searchName.trim()
    if (!searchName.length) {
      message.error('热门搜索名称未填写!');
      return false
    }
    if (searchName.length > 10) {
      message.error('字符限制为十个中文字符以内!');
      return false
    }
    return true
  }

  handleOk() {
    let { searchName, searchCode } = this.state
    if (this.cheackSearchName(searchName)) {
      this.props.dispatch({
        type: 'popularsearch/insertAndUpdatePopularSearch',
        payload: {
          searchCode,
          searchName,
          shelvesFlag: 'SHELVES_ON',
          type: 'SHELVES_ON',
        }
      }).then((res) => {
        if (res) {
          this.setState({ visible: false })
        }
      })
    }
  }

  render() {
    const { loading, popularsearch: { popularSearchData, searchName, activeKey } } = this.props;
    const { popularSearchList = [] } = popularSearchData
    const columns = [{
      title: '序号',
      width: '10%',
      dataIndex: 'index',
      render: (text, record, index) => {
        return index + 1
      }
    }, {
      title: '名称',
      width: '10%',
      dataIndex: 'searchName'
    }, {
      title: '添加时间',
      width: '20%',
      dataIndex: 'createTime'
    },
    {
      title: '展示状态',
      width: '10%',
      dataIndex: 'searchStatus',
      render: (text, record) => {
        let txt = ''
        switch (text) {
          case 'EXCEPTION':
            txt = '未发布';
            break;
          case 'NORMAL':
            txt = '已发布';
            break;
          case 'SHOW_OFF':
            txt = '修改未发布';
            break;
          case 'SHOW_OFF_DOWN':
            txt = '下线未发布';
            break;
          case 'SHOW_OFF_UP':
            txt = '上线未发布';
            break;
          default:
            txt = '-';
        }
        return txt;
      }
    },
    {
      title: '操作',
      width: '20%',
      render: (text, record, index) => {
        if (activeKey === 'SHELVES_ON') {
          return (
            <ButtonGroup>
              <Button size='small' type="primary" icon="form" onClick={() => { this.setState({ visible: true, currentPopularsearch: record, searchName: record.searchName, searchCode: record.searchCode }) }}></Button>
              {index > 0 && <Button size='small' type="primary" icon="vertical-align-top" onClick={() => {
                if (record.shelvesFlag === 'SHELVES_OFF') {
                  message.warning('不可做排序操作！')
                } else {
                  this.topPopularSearch(record.searchCode, record.idx)
                }
              }}></Button>}
              <Button size='small' type="primary" icon="arrow-up" onClick={() => {
                if (record.shelvesFlag === 'SHELVES_OFF') {
                  message.warning('不可做排序操作！')
                } else {
                  this.movePopularSearch(index, record.searchCode, record.idx, "UP")
                }
              }}></Button>
              <Button size='small' type="primary" icon="arrow-down" onClick={() => {
                if (record.shelvesFlag === 'SHELVES_OFF') {
                  message.warning('不可做排序操作！')
                } else {
                  this.movePopularSearch(index, record.searchCode, record.idx, "DOWN")
                }
              }}></Button>
            </ButtonGroup>

          )
        } else {
          return (
            <ButtonGroup>
              <Button size='small' type="primary" icon="form" onClick={() => { this.setState({ visible: true, currentPopularsearch: record, searchName: record.searchName, searchCode: record.searchCode }) }}></Button>
              <Popconfirm title="确定要删除吗?" onConfirm={() => this.delPopularSearch(record.searchCode, record.shelvesFlag)}>
                <Button size='small' type="primary" icon="delete"></Button>
              </Popconfirm>
            </ButtonGroup>
          )
        }
      }
    }, {
      title: '状态操作',
      width: '10%',
      render: (text, record) => {
        return (
          <Popconfirm title={record.shelvesFlag === 'SHELVES_ON' ? '确定下线吗?' : '确定上线吗?'} onConfirm={() => { this.shelvesFlagPopularSearch(record.searchCode, record.shelvesFlag === 'SHELVES_ON' ? 'SHELVES_OFF' : 'SHELVES_ON', record.searchStatus) }}>
            <span style={{ "color": "#40a9ff", "cursor": "pointer", "fontWeight": "bold" }}>{record.shelvesFlag === 'SHELVES_ON' ? '下线' : '上线'}</span>
          </Popconfirm>
        )
      }
    }
    ];

    return (
      <div>
        <p className="m-title">热门搜索管理</p>
        <div className='m-condition-options'>
          <Button className='m-condition-options-item' type="primary" icon="plus" onClick={() => { this.setState({ visible: true, searchCode: '', searchName: '', currentPopularsearch: {} }) }}> 添加新热门搜索</Button>
          <Search className='m-condition-options-item' placeholder="搜索" value={searchName} onChange={(e) => {
            this.props.dispatch({
              type: 'popularsearch/asyncUpdate',
              payload: {
                searchName: e.target.value
              }
            })
          }} enterButton style={{ width: 320 }} onSearch={value => this.popularSearchSearch(value)} />
        </div>
        <Tabs activeKey={activeKey} onChange={this.changeTabs} style={{ width: "100%", textAlign: 'center' }}>
          <TabPane tab='已上线热门搜索' key='SHELVES_ON'>
          </TabPane>
          <TabPane tab='全部热门搜索' key='ALL'>
          </TabPane>
        </Tabs>
        <Table
          rowKey={(record, index) => record.searchCode}
          size="small"
          loading={loading}
          columns={columns}
          dataSource={popularSearchList}
          bordered
          scroll={{ y: 570 }}
          pagination={false}
        />
        <Modal
          title="添加新热门搜索"
          visible={this.state.visible}
          cancelText='保存'
          okText='保存并上线'
          cancelButtonProps={{ type: 'primary' }}
          onOk={this.handleOk.bind(this)}
          onCancel={(e) => {
            if (e.target.nodeName === 'BUTTON') {
              let { searchName, searchCode, currentPopularsearch } = this.state
              let shelvesFlag = currentPopularsearch.shelvesFlag === 'SHELVES_ON' ? 'SHELVES_ON' : 'SHELVES_OFF';
              if (this.cheackSearchName(searchName)) {
                this.props.dispatch({
                  type: 'popularsearch/insertAndUpdatePopularSearch',
                  payload: {
                    searchCode,
                    searchName,
                    shelvesFlag,
                    type: shelvesFlag,
                  }
                }).then((res) => {
                  if (res) {
                    this.setState({ visible: false })
                  }
                })
              }
            } else {
              this.setState({ visible: false })
            }
          }}
        >
          <Input placeholder="请输入搜索字段" value={this.state.searchName} onChange={(e) => { this.setState({ searchName: e.target.value }) }} />
        </Modal>

      </div>
    )
  }
}
export default connect(({ popularsearch, loading }) => ({
  loading: loading.effects['popularsearch/getPopularSearchList'],
  popularsearch
}))(Popularsearch);

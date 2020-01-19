/*
 * Author: jinhui
 * Description: banner页
 * Date: 2019-06-17 18:26:42
 * LastEditors: jinhui
 * LastEditTime: 2019-09-05 16:29:24
 */

import React from 'react';
import { connect } from 'dva';
import { Table, Button, Popconfirm, message, Input, Tabs, Popover } from 'antd';
import Link from 'umi/link';
import { Enum, cacheManager } from "@/utils";

const Search = Input.Search;
const TabPane = Tabs.TabPane;
const ButtonGroup = Button.Group;

const targetStatus = [
  {
    key: 'SHOW_OFF',
    value: '未发布'
  },
  {
    key: 'SHOW_ON',
    value: '已发布'
  },
  {
    key: 'SHOW_OFF_UPDATE',
    value: '修改未发布'
  },
  {
    key: 'SHOW_OFF_DOWN',
    value: '下线未发布'
  },
];

class Banner extends React.Component {

  componentDidMount() {
    this.getBannerList()
  }

  getBannerList = () => {
    this.props.dispatch({
      type: 'banner/getBannerList',
    })
  }

  pageChangeFun = ({ pageVo }) => {
    let { page, pageSize, current } = pageVo
    this.props.dispatch({
      type: 'banner/asyncUpdate',
      payload: {
        page,
        current,
        pageSize,
      }
    }).then(this.getBannerList)
  }


  deleteFn = (bannerCode) => {
    this.props.dispatch({
      type: 'banner/delete',
      payload: {
        bannerCode: bannerCode,
      }
    })

  }
  deleteBanner = (bannerCode, shelvesFlag) => {
    if (shelvesFlag === "SHELVES_ON") {
      message.error('该banner图已上线，请下线后重新操作！');
      return
    }
    this.props.dispatch({
      type: 'banner/deleteBanner',
      payload: {
        bannerCode: bannerCode,
      }
    })
  }
  updateBannerShelves = (bannerCode, shelvesFlag, showFlag) => {
    this.props.dispatch({
      type: 'banner/updateBannerShelves',
      payload: {
        bannerCode: bannerCode,
        shelvesFlag: shelvesFlag,
        showFlag
      }
    })

  }
  //搜索框
  bannerSearch(value) {
    this.props.dispatch({
      type: 'banner/asyncUpdate',
      payload: {
        bannerTitle: value
      }
    }).then(this.getBannerList)
  }


  arrowFetchFn = async (content) => {
    this.props.dispatch({
      type: 'banner/move',
      payload: {
        ...content
      }
    })
  }

  changeTabs = (activeKey) => {
    this.props.dispatch({
      type: 'banner/asyncUpdate',
      payload: {
        activeKey
      }
    }).then(this.getBannerList)
  }

  arrowDown = (index) => {
    if (index === this.state.bannerOnlineList_SHELVES_ON.length - 1) {
      message.error(`不可向下移！`);
    } else {
      const { banner: { bannerData } } = this.props;
      const { list } = bannerData
      this.props.dispatch({
        type: 'banner/homePageObjectMove',
        payload: {
          moveInModuleCode: list[index].bannerCode,
          moveInResult: list[index + 1].idx,
          moveOutModuleCode: list[index + 1].bannerCode,
          moveOutResult: list[index].idx,
          moveType: 'eb_operation_banner',
          uid: cacheManager.get('uid'),
          token: cacheManager.get('token')
        }
      })
    }
  }

  arrowUp = (index) => {
    if (index === 0) {
      message.error(`不可向上移！`);
    } else {
      const { banner: { bannerData } } = this.props;
      const { list } = bannerData
      this.props.dispatch({
        type: 'banner/homePageObjectMove',
        payload: {
          moveInModuleCode: list[index - 1].bannerCode,
          moveInResult: list[index].idx,
          moveOutModuleCode: list[index].bannerCode,
          moveOutResult: list[index - 1].idx,
          moveType: 'eb_operation_banner',
          uid: cacheManager.get('uid'),
          token: cacheManager.get('token')
        }
      })
    }
  }
  render() {
    const { loading, banner: { bannerData, pageSize, bannerTitle, activeKey } } = this.props;
    const { list = [], total = 0, currentPage = 0 } = bannerData
    const columns = [{
      title: '图片标题',
      width: '10%',
      dataIndex: 'bannerTitle',
      className: 'td_hide',
      render: (text, record) => {
        return (
          <Popover
            placement="top"
            title={null}
            content={
              record.bannerTitle
            }
          >
            <span>{record.bannerTitle}</span>
          </Popover>
        )
      }
    }, {
      title: '修改时间',
      width: '20%',
      dataIndex: 'updateTime',
      render: (text, record) => {
        return <span>{record.updateTime || record.createTime}</span>
      }
    }, {
      title: '目标类型',
      width: '10%',
      render: (text, record) =>
        <span>{Enum.TargetType[record.targetType]}</span>
    }, {
      title: '目标链接',
      width: '20%',
      render: (text, record) => <span>{record.searchPageName ? record.searchPageName : record.targetPage}</span>

    },
    {
      title: '展示状态',
      width: '10%',
      dataIndex: 'showFlag',
      render: (text) => <span>{targetStatus.filter(e => e.key === text).length > 0 ? targetStatus.filter(e => e.key === text)[0].value : '未发布'}</span>
    },
    {
      title: '操作',
      width: '20%',
      render: (text, record, index) => {
        // let url = 'banner/' + record.bannerCode;
        if (activeKey === 'SHELVES_ON') {
          return (
            <ButtonGroup>
              <Button size='small' type="primary" icon="form" onClick={()=>{this.props.history.push(`/home/banner/${record.bannerCode}`)}}></Button>
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
            <ButtonGroup>
              <Button size='small' type="primary" icon="form" onClick={()=>{this.props.history.push(`/home/banner/${record.bannerCode}`)}}></Button>
              <Popconfirm title="确定要删除吗?" onConfirm={() => this.deleteBanner(record.bannerCode, record.shelvesFlag)}>
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
          <Popconfirm title={record.shelvesFlag === 'SHELVES_ON' ? '确定下线吗?' : '确定上线吗?'} onConfirm={() => { this.updateBannerShelves(record.bannerCode, record.shelvesFlag === 'SHELVES_ON' ? 'SHELVES_OFF' : 'SHELVES_ON', record.showFlag) }}>
            <span style={{ "color": "#40a9ff", "cursor": "pointer", "fontWeight": "bold" }}>下线</span>
          </Popconfirm>
        )
      }
    }
    ];

    return (
      <div>
        <p className="m-title">banner管理</p>
        <div className='m-condition-options'>
          <Button className='m-condition-options-item' type="primary" icon="plus"> <Link to='/home/banner/0' >添加新banner</Link></Button>
          <Search className='m-condition-options-item' placeholder="搜索" value={bannerTitle} onChange={(e) => {
            this.props.dispatch({
              type: 'banner/asyncUpdate',
              payload: {
                bannerTitle: e.target.value
              }
            })
          }} enterButton style={{ width: 320 }} onSearch={value => this.bannerSearch(value)} />
        </div>
        <Tabs activeKey={activeKey} onChange={this.changeTabs} style={{ width: "100%", textAlign: 'center' }}>
          <TabPane tab='已上线banner' key='SHELVES_ON'>
            <Table
              rowKey={(record, index) => index}
              size="small"
              loading={loading}
              columns={columns}
              dataSource={list}
              bordered
              rowClassName={(record, index) => {
                if (record.shelvesFlag === 'SHELVES_OFF') {
                  return 'el-tr-gary'
                }
              }}
              scroll={{ y: 570 }}
              pagination={false}
            />
          </TabPane>
          <TabPane tab='全部banner' key='ALL'>
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
      </div>
    )
  }
}
export default connect(({ banner, loading }) => ({
  loading: loading.effects['banner/getBannerList'],
  banner
}))(Banner);

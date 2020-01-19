/*
 * Author: jinhui
 * Description: banner页
 * Date: 2019-06-17 18:26:42
 * LastEditors: jinhui
 * LastEditTime: 2019-09-05 16:29:24
 */

import React from 'react';
import { connect } from 'dva';
import { Table, Button, Popconfirm, Input, Popover } from 'antd';
import Link from 'umi/link';
import { Enum } from "@/utils";

const Search = Input.Search;
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

class ADBanner extends React.Component {

  componentDidMount() {
    this.getOperationAdList()
  }

  getOperationAdList = () => {
    this.props.dispatch({
      type: 'adBanner/getOperationAdList',
    })
  }

  pageChangeFun = ({ pageVo }) => {
    let { page, pageSize, current } = pageVo
    this.props.dispatch({
      type: 'adBanner/asyncUpdate',
      payload: {
        page,
        current,
        pageSize,
      }
    }).then(this.getOperationAdList)
  }


  delOperationAd = (bannerCode) => {
    this.props.dispatch({
      type: 'adBanner/delOperationAd',
      payload: {
        bannerCode: bannerCode,
      }
    })

  }
  //搜索框
  bannerSearch(value) {
    this.props.dispatch({
      type: 'adBanner/asyncUpdate',
      payload: {
        bannerTitle: value
      }
    }).then(this.getOperationAdList)
  }

  render() {
    const { loading, adBanner: { bannerData, pageSize, bannerTitle } } = this.props;
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
      title: '平台',
      width: '15%',
      render: (text, record) => {
        let _platformCode = '-'
        if (!!record.platformCode) {
          let curCode = record.platformCode;
          let curCode2 = (curCode.replace("APP", "移动客户端")).replace("HD", "HD客户端");
          let curCode3 = curCode2.split(",");
          if (curCode3.length > 3) {
            _platformCode = curCode3.slice(0, 3).join("/") + "..."
          } else {
            _platformCode = curCode3.join("/");
          }
        }
        return _platformCode
      }
    },
    {
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
      title: '类型',
      width: '10%',
      render: (text, record) => {
        return record.adStyle === 'AD_PART' ? '模块广告' : '单广告'
      }
    },

    {
      title: '展示状态',
      width: '10%',
      dataIndex: 'showFlag',
      render: (text) => <span>{targetStatus.filter(e => e.key === text).length > 0 ? targetStatus.filter(e => e.key === text)[0].value : '未发布'}</span>
    },
    {
      title: '模块名称',
      width: '10%',
      render: (text, record) => {
        return record.partTitle || '-'
      }
    },

    {
      title: '操作',
      width: '20%',
      render: (text, record, index) => {
        return <ButtonGroup>
          <Button size='small' type="primary" icon="form" onClick={() => { this.props.history.push(`/home/adBanner/${record.bannerCode}`) }}></Button>
          <Popconfirm title="确定要删除吗?" onConfirm={() => this.delOperationAd(record.bannerCode)}>
            <Button size='small' type="primary" icon="delete"></Button>
          </Popconfirm>
        </ButtonGroup>

      }
    }];

    return (
      <div>
        <p className="m-title">横幅广告管理</p>
        <div className='m-condition-options'>
          <Button className='m-condition-options-item' type="primary" icon="plus"> <Link to='/home/adBanner/0' >添加新横幅广告</Link></Button>
          <Search className='m-condition-options-item' placeholder="搜索" value={bannerTitle} onChange={(e) => {
            this.props.dispatch({
              type: 'adBanner/asyncUpdate',
              payload: {
                bannerTitle: e.target.value
              }
            })
          }} enterButton style={{ width: 320 }} onSearch={value => this.bannerSearch(value)} />
        </div>
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
      </div>
    )
  }
}
export default connect(({ adBanner, loading }) => ({
  loading: loading.effects['adBanner/getOperationAdList'],
  adBanner
}))(ADBanner);

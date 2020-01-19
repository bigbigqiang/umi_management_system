/*
 * Author: zhangsongqiang
 * Description: topic页
 * Date: 2019/12/23 下午1:36:57
 * LastEditors: zhangsongqiang
 * LastEditTime: 2019/12/23 下午1:36:57
 */

import React from 'react';
import { connect } from 'dva';
import { Table, Button, Popconfirm, message, Input, Popover } from 'antd';
import Link from 'umi/link';
import { cacheManager } from "@/utils";

const Search = Input.Search;
const ButtonGroup = Button.Group;

class Topic extends React.Component {

  componentDidMount() {
    this.listOperationSubject()
  }

  listOperationSubject = () => {
    this.props.dispatch({
      type: 'topic/listOperationSubject',
    })
  }

  pageChangeFun = ({ pageVo }) => {
    let { page, pageSize, current } = pageVo
    this.props.dispatch({
      type: 'topic/asyncUpdate',
      payload: {
        page,
        current,
        pageSize,
      }
    }).then(this.listOperationSubject)
  }

  delOperationSubject = (subjectCode) => {
    this.props.dispatch({
      type: 'topic/delOperationSubject',
      payload: {
        subjectCode: subjectCode,
      }
    })
  }
  //搜索框
  bannerSearch(value) {
    this.props.dispatch({
      type: 'topic/asyncUpdate',
      payload: {
        subjectTitle: value
      }
    }).then(this.listOperationSubject)
  }


  arrowDown = (index) => {
    const { topic: { topicData } } = this.props;
    const { list } = topicData
    this.props.dispatch({
      type: 'topic/homePageObjectMove',
      payload: {
        moveInModuleCode: list[index].subjectCode,
        moveInResult: list[index + 1].idx,
        moveOutModuleCode: list[index + 1].subjectCode,
        moveOutResult: list[index].idx,
        moveType: 'eb_operation_subject',
        uid: cacheManager.get('uid'),
        token: cacheManager.get('token')
      }
    })
  }

  arrowUp = (index) => {
    const { topic: { topicData } } = this.props;
    const { list } = topicData
    this.props.dispatch({
      type: 'topic/homePageObjectMove',
      payload: {
        moveInModuleCode: list[index - 1].subjectCode,
        moveInResult: list[index].idx,
        moveOutModuleCode: list[index].subjectCode,
        moveOutResult: list[index - 1].idx,
        moveType: 'eb_operation_subject',
        uid: cacheManager.get('uid'),
        token: cacheManager.get('token')
      }
    })
  }
  render() {
    const { loading, topic: { topicData, subjectTitle, pageSize } } = this.props;
    const { list = [], total = 0, currentPage = 0 } = topicData
    const columns = [{
      title: '专题名称',
      width: '10%',
      dataIndex: 'subjectTitle',
      className: 'td_hide',
      render: (text, record) => {
        return (
          <Popover
            placement="top"
            title={null}
            content={
              record.subjectTitle
            }
          >
            <span>{record.subjectTitle}</span>
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
      title: '平台',
      width: '10%',
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
          <span title={record.platformCode}>{_platformCode}</span>
        )

      }
    }, {
      title: '目标类型',
      width: '20%',
      render: (text, record) => {
        let cell
        switch (record.targetType) {
          case 'BOOK_LIST':
            cell = (<span>推荐专栏</span>)
            break;
          case 'SYSTEM_INTERFACE':
            cell = (<span>系统界面</span>)
            break;
          case 'H5':
            cell = (<span>H5页面</span>)
            break;
          case 'COURSE_DETAIL':
            cell = (<span>课程详情</span>)
            break;
          default:
            return (<span>图书详情</span>)
        }
        return cell
      }

    },
    {
      title: '目标链接',
      width: '10%',
      dataIndex: 'searchPageName'
    },
    {
      title: '操作',
      width: '20%',
      render: (text, record, index) => {
        return (
          <ButtonGroup>
            <Button size='small' type="primary" icon="form" onClick={() => { this.props.history.push(`/home/topic/${record.subjectCode}`) }}></Button>
            <Button size='small' type="primary" icon="arrow-up" onClick={() => {
              if (index === 0) {
                message.warning('不可上移！')
              } else {
                this.arrowUp(index)
              }
            }}></Button>
            <Button size='small' type="primary" icon="arrow-down" onClick={() => {
              if (index === list.length - 1) {
                message.warning('不可下移！')
              } else {
                this.arrowDown(index)
              }
            }}></Button>
            <Popconfirm title="确定要删除吗?" onConfirm={() => this.delOperationSubject(record.subjectCode)}>
              <Button size='small' type="primary" icon="delete"></Button>
            </Popconfirm>
          </ButtonGroup>

        )
      }
    }
    ];

    return (
      <div>
        <p className="m-title">专题管理</p>
        <div className='m-condition-options'>
          <Button className='m-condition-options-item' type="primary" icon="plus"> <Link to='/home/topic/0' >添加新专题</Link></Button>
          <Search className='m-condition-options-item' placeholder="搜索" value={subjectTitle} onChange={(e) => {
            this.props.dispatch({
              type: 'topic/asyncUpdate',
              payload: {
                subjectTitle: e.target.value
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
export default connect(({ topic, loading }) => ({
  loading: loading.effects['topic/listOperationSubject'],
  topic
}))(Topic);

/*
 * Author: zhangsongqiang
 * Description: remittance页
 * Date: 2020/1/2 下午2:43:57
 * LastEditors: zhangsongqiang
 * LastEditTime: 2020/1/2 下午2:43:57
 */

import React from 'react';
import { connect } from 'dva';
import { Table, Button, Popconfirm, message, Input, Popover, Select, notification, Modal, Form, Checkbox, Row, Col } from 'antd';
import Link from 'umi/link';
import copy from "copy-to-clipboard";

const Search = Input.Search;
const ButtonGroup = Button.Group;
const Option = Select.Option;

const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form, titleToday, titleTomorrow } = this.props;
      const { getFieldDecorator, getFieldValue } = form;
      return (
        <Modal
          visible={visible}
          title="编辑专栏文字"
          width={700}
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form >
            <Row gutter={24}>
              <Col span={11}>
                <Form.Item label="当前专栏标题">
                  {getFieldDecorator('today_defaultName', {
                    initialValue: titleToday.defaultName || '',
                    rules: [{ required: true, message: '请输入专栏标题!' }],
                  })(<Input style={{ width: 160 }} />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="跳转文字">
                  {getFieldDecorator('today_defaultTargetDesc', {
                    initialValue: titleToday.defaultTargetDesc || '',
                    rules: [{ required: true, message: '请输入跳转文字!' }],
                  })(<Input style={{ width: 80 }} />)}
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item>
                  {getFieldDecorator('showType', {
                  })(<Checkbox >立刻生效</Checkbox>)}
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item label="明日专栏标题">
                  {getFieldDecorator('tomorrow_defaultName', {
                    initialValue: titleTomorrow.defaultName || '',
                    rules: [{ required: true, message: '请输入专栏标题!' }],
                  })(<Input style={{ width: 160 }} />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="跳转文字">
                  {getFieldDecorator('tomorrow_defaultTargetDesc', {
                    initialValue: titleTomorrow.defaultTargetDesc || '',
                    rules: [{ required: true, message: '请输入跳转文字!' }],
                  })(<Input style={{ width: 80 }} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <div style={{ margin: '0 auto', border: '1px solid #999', width: 600, padding: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between',fontWeight: 'bold' }}>
                  <span>{getFieldValue('today_defaultName')}</span>
                  <span>{getFieldValue('today_defaultTargetDesc')}</span>
                </div>
                <div style={{ textAlign: 'center', fontSize: '24px', paddingTop: '10px', lineHeight: '20px' }}>***********************************************************************************************************</div>
              </div>
            </Row>
          </Form>
        </Modal>
      );
    }
  },
);

class Remittance extends React.Component {
  state = {
    visible: false
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'remittance/boxSearchList',
      payload: { "groupId": "DAILY_MANAGE_LIST" }
    })
    this.props.dispatch({
      type: 'remittance/getDailyTitleConfigList',
      payload: { "titleType": "DAILY_LOOP_WEEK" }
    })
    this.listDailyBook()
  }

  listDailyBook = () => {
    this.props.dispatch({
      type: 'remittance/listDailyBook',
    })
  }

  pageChangeFun = ({ pageVo }) => {
    let { page, pageSize, current } = pageVo
    this.props.dispatch({
      type: 'remittance/asyncUpdate',
      payload: {
        page,
        current,
        pageSize,
      }
    }).then(this.listDailyBook)
  }

  deleteDailyByCode = (dailyCode) => {
    this.props.dispatch({
      type: 'remittance/deleteDailyByCode',
      payload: {
        dailyCode: dailyCode,
      }
    })
  }
  //搜索框
  dailySearch(value) {
    this.props.dispatch({
      type: 'remittance/asyncUpdate',
      payload: {
        dailyTitle: value
      }
    }).then(this.listDailyBook)
  }

  handleCancel = () => {
    const { form } = this.formRef.props;
    this.setState({ visible: false });
    form.resetFields()
  };

  handleCreate = () => {
    const { form } = this.formRef.props;
    const { remittance: { titleToday, titleTomorrow } } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      console.log('Received values of form: ', values);
      this.props.dispatch({
        type: 'remittance/updateDailyTitleConfigList',
        payload: [
          {
            titleCode: titleToday.titleCode,
            targetName: values.today_defaultName,
            targetDesc: values.today_defaultTargetDesc,
            showType: values.showType ? 'SHOW_ON' : 'SHOW_WAIT',
          }, {
            titleCode: titleTomorrow.titleCode,
            targetName: values.tomorrow_defaultName,
            targetDesc: values.tomorrow_defaultTargetDesc,
            showType: "SHOW_WAIT",
          }
        ]
      }).then((data)=>{
        if(data){
          form.resetFields();
          this.setState({ visible: false });
        }
      })
      
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {
    const { loading, remittance: { dailyData, dailyTitle, pictureBookStatus, publishFlag, pageSize, titleToday, titleTomorrow } } = this.props;
    const { list = [], total = 0, currentPage = 0 } = dailyData
    const { visible } = this.state
    const columns = [
      {
        title: '文章标题',
        dataIndex: 'dailyTitle',
        key: 'dailyTitle',
        className: 'td_hide',
        render: (text, record) => {
          return (
            <Popover
              placement="top"
              title={null}
              content={
                record.dailyTitle
              }
            >
              <span>{record.dailyTitle}</span>
            </Popover>
          )
        }
      }, {
        title: '推送时间',
        dataIndex: 'effectDate',
        key: 'effectDate',
        width: '20%',
      }, {
        title: '状态',
        dataIndex: 'publishFlag',
        key: 'publishFlag',
        width: '20%',
        render: (text) => {
          let publishFlag = ''
          switch (text) {
            case 'PUSH_NO':
              publishFlag = '未推送'
              break;
            case 'PUSH_YES':
              publishFlag = '已推送'
              break;
            case 'PUBLISH_YES':
              publishFlag = '已发布'
              break;
            case 'OFF_LINE':
              publishFlag = '已下线'
              break;
            default:
              publishFlag = '未知状态'
              break;
          }
          return publishFlag
        }
      }, {
        title: '活动链接',
        dataIndex: 'targetPage',
        width: '10%',
        render: (text, record) => (
          <Popover
            placement="top"
            title="活动链接"
            content={
              <div>
                <Input style={{ marginTop: '5px' }} readOnly value={record.targetPage} />
                <Button
                  style={{ marginTop: '5px' }}
                  onClick={() => {
                    copy(record.targetPage);
                    message.success("复制成功");
                  }}
                  type="primary"
                >一键复制</Button>
              </div>
            }
            trigger="hover" >
            <Button icon='link'></Button>
          </Popover>
        )
      }, {
        title: '操作',
        dataIndex: 'operation',
        width: '20%',
        render: (text, record, index) => {
          return <ButtonGroup>
            <Button size='small' type="primary" icon="form" onClick={() => { this.props.history.push(`/home/remittance/${record.dailyCode}`) }}></Button>
            <Popconfirm
              placement="top"
              title='确定要改成发布状态吗?'
              onConfirm={() => {
                if (record.publishFlag === "PUSH_YES" || record.publishFlag === "PUBLISH_YES") {
                  notification.error({
                    message: '对不起这一条不能推送',
                    description: '因为这一条已经是已推送或者已发布',
                  })
                } else {
                  this.props.dispatch({
                    type: 'remittance/updateDailyPublishFlag',
                    payload: {
                      dailyCode: record.dailyCode,
                      publishFlag: 'PUSH_YES',
                    }
                  })
                }
              }
              }
              okText="确定"
              cancelText="取消">
              <Button size='small' title="点击更改状态为发布" type="primary" icon="upload" ></Button>
            </Popconfirm>
            <Popconfirm
              placement="top"
              title={'确定要改成已下线状态吗?'}
              onConfirm={
                () => {
                  if (record.publishFlag === "PUSH_NO" || record.publishFlag === "OFF_LINE") {
                    notification.error({
                      message: '对不起这一条不能下线',
                      description: '因为这一条已经是未推送或者已下线',
                    })
                  } else {
                    this.props.dispatch({
                      type: 'remittance/updateDailyPublishFlag',
                      payload: {
                        dailyCode: record.dailyCode,
                        publishFlag: 'OFF_LINE',
                      }
                    })
                  }
                }
              }
              okText="确定"
              cancelText="取消">
              <Button size='small' title="点击更改状态为已下线" type="primary" icon="download"></Button>
            </Popconfirm>

            <Popconfirm title="确定要删除吗?" onConfirm={() => this.deleteDailyByCode(record.dailyCode)}>
              <Button size='small' type="primary" icon="delete"></Button>
            </Popconfirm>
          </ButtonGroup>
        }
      }
    ];


    return (
      <div style={{width: '100%'}}>
        <p className="m-title">每日绘本</p>
        <div className='m-condition-options'>
          <Button className='m-condition-options-item' type="primary" icon="plus"> <Link to='/home/remittance/0' >添加新绘本</Link></Button>
          <Button className='m-condition-options-item' type="primary" icon="reload" onClick={() => { this.setState({ visible: true }) }}> 更新专栏</Button>
          <Search className='m-condition-options-item' placeholder="搜索" value={dailyTitle} onChange={(e) => {
            this.props.dispatch({
              type: 'remittance/asyncUpdate',
              payload: {
                dailyTitle: e.target.value
              }
            })
          }} enterButton style={{ width: 320 }} onSearch={value => this.dailySearch(value)} />
          <div className='m-condition-options-item'>
            <Select style={{ width: 120 }} value={publishFlag} onChange={(value) => {
              this.props.dispatch({
                type: 'remittance/asyncUpdate',
                payload: {
                  publishFlag: value,
                  page: 0,
                  pageSize: 20,
                }
              }).then(this.listDailyBook)
            }}>
              <Option value={null}>全部</Option>
              {
                pictureBookStatus.map((item) => <Option value={item.searchCode} key={item.searchCode}>{item.searchName}</Option>)
              }

            </Select>
          </div>
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
        <CollectionCreateForm
          titleToday={titleToday}
          titleTomorrow={titleTomorrow}
          wrappedComponentRef={this.saveFormRef}
          visible={visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />
      </div>
    )
  }
}
export default connect(({ remittance, loading }) => ({
  loading: loading.effects['remittance/listDailyBook'],
  remittance
}))(Remittance);

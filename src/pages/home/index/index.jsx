/*
 * Author: jinhui
 * Description: 首页管理
 * Date: 2019-07-04 13:52:38
 * LastEditors: jinhui
 * LastEditTime: 2019-09-11 16:35:22
 */

import React from 'react';
import { connect } from 'dva';
import { Icon, Button, Popconfirm, message, Modal, Select, Checkbox, DatePicker, Popover, Table, Tabs } from 'antd';
import Link from 'umi/link';
import moment from 'moment';
import { moduleType } from './config';
import { cacheManager } from '@/utils'
import PreviewAPP from '../../../components/homeIndex/previewAPP'
import PreviewGUSHIJI from '../../../components/homeIndex/PreviewGUSHIJI'
import PreviewHD from '../../../components/homeIndex/PreviewHD'
import style from './index.less';

const confirm = Modal.confirm;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const ButtonGroup = Button.Group;

class Index extends React.Component {
  state = {
    visible: false,
    visibleAPP: false,
    visibleGUSHIJI: false,
    visibleHD: false,
    checked: false,
    activeKey: 'APP',
    nextPublishDate: null,
    // operationType: cacheManager.get('operationType'), // 权限估计用不上，后面再确认
    times: '00:00',
    type: 'PART'
  }

  componentDidMount() {
    this.findHomePageList();
  }

  disabledDate = (current) => {
    return current < moment().subtract(1, 'days');
  }

  findHomePageList = () => {
    let { activeKey } = this.state
    this.props.dispatch({
      type: 'homeIndex/findHomePageList',
      payload: {
        platformCode: activeKey
      }
    }).then((data) => {
      let { nextPublishTime } = data
      this.setState({
        checked: !!nextPublishTime,
        nextPublishDate: !!nextPublishTime ? moment(nextPublishTime.split(" ")[0]) : null,
        times: !!nextPublishTime ? nextPublishTime.split(" ")[1] : '00:00'
      })
    })
  }

  deleteHomePageModule = (moduleCode, columnCode, moduleType, status) => {
    let { activeKey } = this.state
    this.props.dispatch({
      type: 'homeIndex/deleteHomePageModule',
      payload: {
        moduleCode,
        columnCode,
        moduleType,
        platformCode: activeKey
      }
    })
  }

  homePageObjectMove = (id_index) => {
    let { homePageData: { list } } = this.props.homeIndex
    let { activeKey } = this.state
    if (id_index === 0) {
      message.error('不可向上移！');
    } else {
      this.props.dispatch({
        type: 'homeIndex/homePageObjectMove',
        payload: {
          moveInModuleCode: list[id_index - 1].moduleCode,
          moveInResult: list[id_index].idx,
          moveOutModuleCode: list[id_index].moduleCode,
          moveOutResult: list[id_index - 1].idx,
          moveType: 'eb_home_page',
          platformCode: activeKey
        }
      })
    }
  }

  homePageObjectTop = (moveTopModuleCode, moveTopModuleIdx) => {
    let { activeKey } = this.state
    this.props.dispatch({
      type: 'homeIndex/homePageObjectTop',
      payload: {
        moveTopModuleCode,
        moveTopModuleIdx,
        platformCode: activeKey
      }
    })
  }

  arrowDown = (id_index) => {
    let { homePageData: { list } } = this.props.homeIndex
    let { activeKey } = this.state
    if (id_index === list.length - 1) {
      message.error('不可向下移！');
    } else {
      this.props.dispatch({
        type: 'homeIndex/homePageObjectMove',
        payload: {
          moveInModuleCode: list[id_index].moduleCode,
          moveInResult: list[id_index + 1].idx,
          moveOutModuleCode: list[id_index + 1].moduleCode,
          moveOutResult: list[id_index].idx,
          moveType: 'eb_home_page',
          uid: cacheManager.get('uid'),
          token: cacheManager.get('token'),
          platformCode: activeKey
        }
      })
    }
  }

  publishHomePage = () => {
    let { homePageData: { list } } = this.props.homeIndex
    let { activeKey } = this.state
    confirm({
      title: '请确认是否发布该首页模块?',
      okType: 'primary',
      cancelText: '继续编辑',
      onOk: () => {
        for (var i = 0; i < list.length; i++) {
          if (i + 1 < list.length) {
            if (list[i].moduleType === list[i + 1].moduleType && list[i].moduleType === "AD_SINGLE") {
              message.error("不能发布相邻的广告横幅，请手动移开。");
              return;
            }
          }
        }
        this.props.dispatch({
          type: 'homeIndex/publishHomePage',
          payload: {
            platformCode: activeKey
          }
        })
      },
      onCancel() { },
    });
  }

  changeTabs(key) {
    this.setState({ activeKey: key }, this.findHomePageList)
  }

  handleSelectChange = (value) => {
    this.props.dispatch({
      type: 'homeIndex/save',
      payload: {
        columnCode: value.key,
        moduleTitle: value.label,
      }
    })
  }

  addNewMoudle = (type) => {
    let { activeKey } = this.state
    this.props.dispatch({
      type: type === 'PART' ? 'homeIndex/findNotShowPart' : 'homeIndex/findNotShowAd',
      payload: {
        platformCode: activeKey
      }
    }).then(() => {
      this.setState({
        visible: true,
        type,
      })
    })
  }

  addSubjectMoudle() {
    let { activeKey } = this.state
    confirm({
      title: '请确认是否添加该模块?',
      content: '',
      onOk: () => {
        this.props.dispatch({
          type: 'homeIndex/addHomePageBookSubject',
          payload: {
            platformCode: activeKey
          }
        })
      },
      onCancel() { },
    });
  }


  handleOk() {
    const { homeIndex: { columnCode, moduleTitle } } = this.props;
    let { type, activeKey } = this.state
    if (!!columnCode && !!moduleTitle) {
      let content = {
        columnCode,
        moduleTitle,
        moduleType: type,
        platformCode: activeKey
      }
      this.props.dispatch({
        type: 'homeIndex/addHomePageModule',
        payload: content
      }).then(() => {
        this.setState({
          visible: false
        })
      })
    }


  }

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }

  getAnnuounceDate = (value, dateString, str) => {
    this.setState({
      [str]: value,
    });
  }

  announceOnTime = (e) => {
    this.setState({
      checked: e.target.checked
    })
  }

  preview() {
    let { activeKey } = this.state
    this.setState({
      visibleAPP: activeKey === 'APP',
      visibleGUSHIJI: activeKey === 'GUSHIJI',
      visibleHD: activeKey === 'HD',
    })
  }

  setAnnounceOnTime = () => {
    const { nextPublishDate, times, activeKey } = this.state;
    if (!nextPublishDate) {
      message.error("请选择定时发布日期！")
      return;
    }
    const content = {
      nextPublishTime: nextPublishDate.format('YYYY-MM-DD') + ' ' + times,
      platformCode: activeKey
    }
    this.props.dispatch({
      type: 'homeIndex/updateHomePageNextPublishTime',
      payload: content
    })
  }

  render() {
    const { visible, type, activeKey, checked, nextPublishDate, times, visibleAPP, visibleGUSHIJI, visibleHD } = this.state;
    const { loading, confirmLoading, homeIndex: { selectList, homePageData, columnCode = '' } } = this.props;
    const { list = [], publishTime = '' } = homePageData

    const POPCONFIRM = (props) => (
      <Popconfirm title="确定要删除吗?" onConfirm={() => this.deleteHomePageModule(props.record.moduleCode, props.record.columnCode, props.record.moduleType, props.record.status)}>
        <Button size='small' type="primary" icon="delete"></Button>
      </Popconfirm>
    )

    const OperateTypeOne = (props) => (
      <ButtonGroup>
        <Button size='small' type="primary"><Link to={props.record.moduleType === 'PART' ? `/home/recommend/${props.record.partSource === 'ella.book.listCourse' ? 'course' : 'book'}/${props.record.columnCode}` : '/home/bookSubject'} ><Icon type='form'></Icon></Link></Button>
        {((props.record.id > 4 && activeKey !== "GUSHIJI") || (activeKey === "GUSHIJI" && props.record.id > 1)) && <Button size='small' type="primary" icon="vertical-align-top" onClick={() => this.homePageObjectTop(props.record.moduleCode, props.record.idx)}></Button>}
        {((props.record.id > 4 && activeKey !== "GUSHIJI") || (activeKey === "GUSHIJI" && props.record.id > 1)) && <Button size='small' type="primary" icon="arrow-up" onClick={() => this.homePageObjectMove(props.record.id - 1)}></Button>}
        <Button size='small' type="primary" icon="arrow-down" onClick={() => this.arrowDown(props.record.id - 1)}></Button>
        <POPCONFIRM record={props.record} />
      </ButtonGroup>
    )

    const OperateTypeTwo = (props) => (
      <ButtonGroup>
        <Button size='small' type="primary"><Link to={`/home/adBanner/${props.record.columnCode}`} ><Icon type='form'></Icon></Link></Button>
        {props.record.id > 4 && <Button size='small' type="primary" icon="vertical-align-top" onClick={() => this.homePageObjectTop(props.record.moduleCode, props.record.idx)}></Button>}
        {props.record.id > 4 && <Button size='small' type="primary" icon="arrow-up" onClick={() => this.homePageObjectMove(props.record.id - 1)}></Button>}
        <Button size='small' type="primary" icon="arrow-down" onClick={() => this.arrowDown(props.record.id - 1)}></Button>
        <POPCONFIRM record={props.record} />
      </ButtonGroup>
    )

    const OperateTypeThree = (props) => (
      <ButtonGroup>
        <Button size='small' type="primary"><Link to={'/home/remittance'} ><Icon type='form'></Icon> </Link></Button>
        {props.record.id > 4 && <Button size='small' type="primary" icon="vertical-align-top" onClick={() => this.homePageObjectTop(props.record.moduleCode, props.record.idx)}></Button>}
      </ButtonGroup>
    )

    const OperateTypeFour = (props) => (
      <ButtonGroup>
        <Button size='small' type="primary"><Link to={props.record.moduleType === 'BANNER' ? '/home/banner' : '/home/topic'} ><Icon type='form'></Icon></Link></Button>
        {props.record.id > 4 && <Button size='small' type="primary" icon="vertical-align-top" onClick={() => this.homePageObjectTop(props.record.moduleCode, props.record.idx)}></Button>}
      </ButtonGroup>
    )

    const columns = [{
      title: '序号',
      width: '10%',
      key: 'id',
      dataIndex: 'id'
    }, {
      title: '修改时间',
      width: '15%',
      key: 'updateTime',
      dataIndex: 'updateTime'
    }, {
      title: '模块标题',
      width: '15%',
      key: 'moduleTitle',
      dataIndex: 'moduleTitle',
      className: 'td_hide',
      render: (text, record) => {
        return (
          <Popover
            placement="top"
            title={null}
            content={
              record.moduleTitle
            }
          >
            <span>{record.moduleTitle}</span>
          </Popover>
        )
      }
    }, {
      title: '状态',
      width: '15%',
      key: 'status',
      dataIndex: 'status',
      render: (text, record) => {
        if (record.status === '已删除') {
          return (
            <span style={{ color: 'red' }}>{record.status}</span>
          )
        } else {
          return (
            <span>{record.status}</span>
          )
        }
      }
    },
    {
      title: '类型',
      width: '15%',
      key: 'moduleType',
      dataIndex: 'moduleType',
      render: (text, record) => {
        if (!!record.isAdPart) {
          return (
            <span>{moduleType[record.moduleType]}({record.isAdPart})</span>
          )
        } else {
          return (
            <span>{moduleType[record.moduleType]}</span>
          )
        }
      }
    },
    {
      title: '操作',
      key: 'operate',
      dataIndex: 'operate',
      render: (text, record) => {
        if (record.moduleType === 'PART' || record.moduleType === 'BOOK_SUBJECT') {
          return <OperateTypeOne record={record} />
        } else if (record.moduleType === 'AD_SINGLE') {
          return <OperateTypeTwo record={record} />
        } else if (record.moduleType === 'DAILY_BOOK') {
          return <OperateTypeThree record={record} />
        } else if (record.moduleType === 'BANNER' || record.moduleType === 'SUBJECT') {
          return <OperateTypeFour record={record} />
        }
      }
    }
    ]


    return (
      <div>
        <div className="m-title">首页管理</div>
        <div>
          <div className='m-condition-options'>
            <Button className='m-condition-options-item' type="primary" onClick={() => this.addNewMoudle("PART")}><Icon type="plus" />添加推荐模块</Button>
            {activeKey !== 'GUSHIJI' && <Button className='m-condition-options-item' type="primary" onClick={() => this.addNewMoudle("AD_SINGLE")}><Icon type="plus" />添加单广告横幅</Button>}
            <Button className='m-condition-options-item' type="primary" onClick={() => this.addSubjectMoudle()}><Icon type="plus" />添加专栏模块</Button>
          </div>
          <Tabs activeKey={activeKey} onChange={this.changeTabs.bind(this)} style={{ width: "100%", textAlign: 'center' }}>
            <TabPane tab='移动客户端' key='APP'>
              <Table size="small" loading={loading} bordered columns={columns} rowKey={"id"} dataSource={list} pagination={false} scroll={{ y: 510 }} />
            </TabPane>
            <TabPane tab='故事机平台' key='GUSHIJI'>
              <Table size="small" loading={loading} bordered columns={columns} rowKey={"id"} dataSource={list} pagination={false} scroll={{ y: 510 }} />
            </TabPane>
            <TabPane tab='HD客户端' key='HD'>
              <Table size="small" loading={loading} bordered columns={columns} rowKey={"id"} dataSource={list} pagination={false} scroll={{ y: 510 }} />
            </TabPane>
          </Tabs>
          <div className={style.textStyle}>上次发布：{publishTime}</div>
          <div className={style.textStyle}>
            <Button type="primary" onClick={this.publishHomePage.bind(this)} style={{ marginRight: 30 }}>发布</Button>
            <Button type="primary" onClick={this.preview.bind(this)}>预览</Button>
          </div>
          <div className={style.textStyle}>
            <Checkbox onChange={this.announceOnTime} checked={checked}>定时发布</Checkbox>
            {checked && <span className="setTimePublish">
              <DatePicker
                format="YYYY-MM-DD"
                className={style.selectBox}
                placeholder="请选择发布日期"
                value={nextPublishDate}
                disabledDate={this.disabledDate}
                onChange={(value, dateString) => { this.getAnnuounceDate(value, dateString, "nextPublishDate") }}
              />
              <Select className={style.selectBox} value={times} onChange={(value) => this.setState({ times: value })}>
                <Option value="00:00">00:00</Option>
                <Option value="12:00">12:00</Option>
              </Select>
              <Button className="ant-btn-blue" type="primary" onClick={this.setAnnounceOnTime.bind(this)}>确定</Button>
            </span>
            }
          </div>
        </div>
        <Modal
          title="添加新模块"
          visible={visible}
          onOk={this.handleOk.bind(this)}
          onCancel={this.handleCancel}
          confirmLoading={confirmLoading}
        >
          <span>{type === 'PART' ? '推荐模块：' : '广告横幅：'}</span>
          <Select className={style.selectBox} labelInValue value={{ key: columnCode }} onChange={(value) => this.handleSelectChange(value)}>
            {
              selectList.map((item) => {
                return <Option value={item.columnCode} key={item.columnCode}>{item.moduleTitle}</Option>
              })
            }
          </Select>
        </Modal>
        <Modal
          title="APP首页预览"
          visible={visibleAPP}
          onOk={() => { this.setState({ visibleAPP: false }) }}
          onCancel={() => { this.setState({ visibleAPP: false }) }}
          // TODO:让Modal里面的内容关闭时销毁,就是重新加载
          destroyOnClose={true}
        >
          <PreviewAPP platformCode={activeKey}></PreviewAPP>

        </Modal>
        <Modal
          width={800}
          title="故事机首页预览"
          visible={visibleGUSHIJI}
          onOk={() => { this.setState({ visibleGUSHIJI: false }) }}
          onCancel={() => { this.setState({ visibleGUSHIJI: false }) }}
          // TODO:让Modal里面的内容关闭时销毁,就是重新加载
          destroyOnClose={true}

        >

          <PreviewGUSHIJI platformCode={activeKey}></PreviewGUSHIJI>

        </Modal>
        <Modal
          title="HD首页预览"
          visible={visibleHD}
          width={1300}
          onOk={() => { this.setState({ visibleHD: false }) }}
          onCancel={() => { this.setState({ visibleHD: false }) }}
          // TODO:让Modal里面的内容关闭时销毁,就是重新加载
          destroyOnClose={true}
        >

          <PreviewHD platformCode={activeKey}></PreviewHD>
        </Modal>

      </div>
    )
  }
}
export default connect(({ homeIndex, loading }) => ({
  loading: loading.effects['homeIndex/findHomePageList'],
  confirmLoading: loading.effects['homeIndex/addHomePageModule'],
  homeIndex
}))(Index);

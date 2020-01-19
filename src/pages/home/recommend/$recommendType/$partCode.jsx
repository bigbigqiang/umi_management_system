/*
 * Author: zhangsongqiang
 * Description: 添加banner图
 * Date: 2019/12/27 下午3:12:00
 * LastEditors: zhangsongqiang
 * LastEditTime: 2019/12/27 下午3:12:00
 */
import React from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import { Input, Button, message, Form, Radio, Row, Col, Select, Checkbox, InputNumber, Table, Icon } from 'antd';
import { EllaUploader } from '@/components/EllaUploader';
import MultiSelectBooks from '@/components/EllaResourcePicker/MultiSelectBooks';
import styles from "./partCode.less";

const RadioGroup = Radio.Group
const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;
const ButtonGroup = Button.Group;

class EditPart extends React.Component {
  state = {
    targetType: 'BOOK_LIST',
    modalShow: false,
    iconType: 'default',
    channel: '',
    partStyle: '',
    radioPlatformCode: 'APP',
    getRule: 'LIST_LATEST_BOOK',
    getNum: 1
  }

  partCode = ''
  recommendType = ''
  searchId = ''
  type = ''

  componentDidMount() {
    let { partCode, recommendType } = this.props.computedMatch.params
    this.partCode = partCode
    this.recommendType = recommendType

    this.getBoxSearchList('BOOK_LIST')
    this.setRadioPlatformCode()

    this.props.dispatch({
      type: 'editPart/getChanelList',
      payload: { type: 'AUTO_BOX', groupId: 'operation.box.chanelList' }
    })

    this.type = this.recommendType === 'book' ? 'BOOK_LIST' : 'COURSE_LIST'

    this.props.dispatch({
      type: 'editPart/getPlatFrom',
      payload: { groupId: 'SYSTEM_PLATFORM' }
    })
    this.partCode !== '0' && this.props.dispatch({
      type: 'editPart/getOperationPartInfo',
      payload: { partCode: this.partCode, partSource: recommendType === 'book' ? 'ella.book.listBookCommons' : 'ella.book.listCourse' }
    }).then((data) => {
      this.setState({
        channel: (data.channelCodes && data.channelCodes.split(',').length > 1) ? 'custom' : data.channelCodes,
        partStyle: data.partStyle,
        radioPlatformCode: data.platformCode,
        getRule: data.partStyle === 'SVIP' ? 'NEW_VIP' : 'LIST_LATEST_BOOK'
      })
      this.searchId = data.searchId
    })
  }

  setRadioPlatformCode() {
    let radioPlatformCode = 'APP';
    if (this.partCode === '0') {
      radioPlatformCode = this.props.location.query.svipExist === 'APP' ? 'HD' : 'APP';
    }
    this.setState({ radioPlatformCode })
  }

  getBoxSearchList(groupId) {
    this.props.dispatch({
      type: 'editPart/boxSearchList',
      payload: { groupId }
    })
  }

  beforeUpload = (file) => {
    if (!/\/(?:jpeg|png|jpg)/i.test(file.type)) {
      message.error('不支持png/jpg以外的格式，请重新上传！')
      return false
    }
    return true
  }

  handleSubmit = () => {
    const { form, editPart: { bookOrCourseList } } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      let { channelCodes, channel } = values
      let bookCodeList = []
      let jumpType = 'JUMP_CURRENT'
      let targetType = ''
      let targetPage = ''
      let partType = 'LIST_HAND'
      let searchId = this.searchId
      let platformCode = values.partStyle === 'SVIP' ? this.state.radioPlatformCode : values.platformCode.join()
      if (this.recommendType === "book") {
        targetType = "BOOK_LIST";
        targetPage = 'ella.book.listBookCommons';
      } else {
        targetType = "COURSE_LIST";
        targetPage = 'ella.book.listCourse';
      }
      bookOrCourseList.map((item) => {
        bookCodeList.push(item.bookCode)
      })
      
      channelCodes = channel === 'custom' ? channelCodes.join(',') : channel
      
      if (values.platformCode.indexOf("GUSHIJI") > -1 && values.partTitle.length > 5) {
        message.error("平台选择有故事机，标题字数限制为5个中文字符以内");
        return;
      }

      if (bookOrCourseList.length === 0) {
        message.error("请添加图书或课程");
        return;
      }

      this.props.dispatch({
        type: this.recommendType === 'book' ? 'editPart/saveOperationPartInfo' : 'editPart/saveOperationPartCourseInfo',
        payload: {
          ...values,
          partCode: this.partCode === '0' ? '' : this.partCode,
          jumpType,
          targetType,
          targetPage,
          partType,
          searchId,
          type: this.type,
          platformCode,
          channelCodes,
          bookCodeList
        }
      })
    });
  };

  showModal() {
    this.setState({
      modalShow: true
    })
  }

  getBookOrCourse() {
    let { getRule, getNum } = this.state
    this.props.dispatch({
      type: 'editPart/getBookOrCourseList',
      payload: {
        getRule, getNum, recommendType: this.recommendType
      }
    })
  }

  clearList() {
    this.props.dispatch({
      type: 'editPart/save',
      payload: {
        bookOrCourseList: []
      }
    })
  }

  componentWillUnmount() {
    let { resetFields } = this.props.form;
    resetFields()
    this.props.dispatch({
      type: 'editPart/save',
      payload: {
        partInfo: {}
      }
    })
  }

  render() {
    const { getFieldDecorator, setFieldsValue } = this.props.form;
    const { editPart: { PlatFromList, partInfo, chanelList, bookOrCourseList }, loading } = this.props
    const { modalShow, channel, partStyle, radioPlatformCode, getRule, getNum } = this.state
    const { svipExist } = this.props.location.query
    const columns = [{
      title: '序号',
      width: "25%",
      key: 'id',
      render: (text, record, index) => {
        return index + 1
      }
    }, {
      title: '图书ID',
      width: "25%",
      dataIndex: 'bookCode',
      key: 'bookCode',
    }, {
      title: '图书名称',
      width: "25%",
      dataIndex: 'bookName',
      key: 'bookName',
    },
    {
      title: '操作',
      width: '20%',
      render: (text, record, index) => {
        return (
          <ButtonGroup>
            {index !== 0 && <Button size='small' type="primary" icon="vertical-align-top" onClick={() => {
              let _bookOrCourseList = [...bookOrCourseList]
              _bookOrCourseList.unshift(_bookOrCourseList.splice(index, 1)[0])
              this.props.dispatch({
                type: 'editPart/save',
                payload: {
                  bookOrCourseList: _bookOrCourseList
                }
              })
            }}></Button>}
            {index !== 0 && <Button size='small' type="primary" icon="arrow-up" onClick={() => {
              let _bookOrCourseList = [...bookOrCourseList]
              _bookOrCourseList[index] = _bookOrCourseList.splice(index - 1, 1, _bookOrCourseList[index])[0];
              this.props.dispatch({
                type: 'editPart/save',
                payload: {
                  bookOrCourseList: _bookOrCourseList
                }
              })
            }}></Button>}

            {index !== bookOrCourseList.length - 1 && <Button size='small' type="primary" icon="arrow-down" onClick={() => {
              let _bookOrCourseList = [...bookOrCourseList]
              _bookOrCourseList[index] = _bookOrCourseList.splice(index + 1, 1, _bookOrCourseList[index])[0];
              this.props.dispatch({
                type: 'editPart/save',
                payload: {
                  bookOrCourseList: _bookOrCourseList
                }
              })
            }}></Button>}
            <Button size='small' type="primary" icon="delete" onClick={() => {
              let _bookOrCourseList = [...bookOrCourseList]
              _bookOrCourseList.splice(index, 1);
              this.props.dispatch({
                type: 'editPart/save',
                payload: {
                  bookOrCourseList: _bookOrCourseList
                }
              })
            }}></Button>
          </ButtonGroup>

        )
      }
    }
    ]

    return (<div>
      <p className="m-title"><Link to={'/home/recommend'}> <Icon type='left'></Icon>添加新推荐</Link></p>
      <Form className={styles.formContent} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} onSubmit={this.handleSubmit}>
        <div style={{ width: 500 }}>
          <Form.Item label="推荐标题">
            {getFieldDecorator('partTitle', {
              initialValue: partInfo.partTitle || '',
              rules: [
                { required: true, message: '请输入推荐标题！' },
                { max: 20, message: '支持最大长度20！' },
              ],
            })(<Input placeholder='输入推荐标题' />)}
          </Form.Item>
          {(partStyle === 'SVIP' && this.partCode !== '0') ? null : <Form.Item label="展示样式">
            {getFieldDecorator('partStyle', {
              initialValue: partInfo.partStyle || '',
              rules: [
                { required: true, message: '请选择样式！' },
              ],
            })(this.recommendType === 'book' ? <Select style={{ width: '100%' }} onChange={(value) => {
              if (value === 'SVIP') {
                this.setState({ partStyle: value, getRule: 'NEW_VIP' }, this.setRadioPlatformCode)
                setFieldsValue({ 'subjectTitle': '高级会员专区', })
              } else {
                this.setState({ partStyle: value, getRule: 'LIST_LATEST_BOOK' }, this.setRadioPlatformCode)
              }
            }}>
              <Option value="SLIDE_HORIZONTAL">横向滑动</Option>
              <Option value="SLIDE_PORTRAIT">纵向滑动</Option>
              <Option value="IMAGE_TEXT">图文</Option>
              {
                (svipExist !== 'YES' && this.partCode === '0') && <Option value="SVIP">高级会员</Option>
              }
            </Select> :
              <Select style={{ width: '100%' }} >
                <Option value="SLIDE_HORIZONTAL">横向滑动</Option>
                <Option value="SLIDE_PORTRAIT">纵向滑动</Option>
              </Select>
            )}
          </Form.Item>}

          {this.recommendType === 'book' && <Form.Item label="一键购买">
            {getFieldDecorator('oneClickBuyStatus', {
              initialValue: partInfo.oneClickBuyStatus || 'YES',
            })(<RadioGroup>
              <Radio value="YES">支持</Radio>
              <Radio value="NO">不支持</Radio>
            </RadioGroup>
            )}
          </Form.Item>}


          {partStyle === 'SVIP' ? <Form.Item label="平台选择">
            {getFieldDecorator('platformCode', {
              initialValue: partInfo.platformCode || radioPlatformCode,
              rules: [
                { required: true, message: '请选择平台！' },
              ],
            })(<RadioGroup onChange={(e) => { this.setState({ radioPlatformCode: e.target.value }) }} >
              <Radio disabled={(this.partCode !== "0" && partInfo.platformCode === 'HD') || (this.partCode === "0" && this.props.location.query.svipExist === 'APP')} value='APP'>移动客户端</Radio>
              <Radio disabled={(this.partCode !== "0" && partInfo.platformCode === 'APP') || (this.partCode === "0" && this.props.location.query.svipExist === 'HD')} value='HD'>HD客户端</Radio>
            </RadioGroup>
            )}
          </Form.Item> : <Form.Item label="平台选择">
              {getFieldDecorator('platformCode', {
                initialValue: partInfo.platformCode ? partInfo.platformCode.split(',') : [],
                rules: [
                  { required: true, message: '请选择平台！' },
                ],
              })(<CheckboxGroup options={PlatFromList} />)}
            </Form.Item>}
          {this.recommendType === 'book' && partStyle === 'SVIP' && (
            <div>
              <Form.Item label="背景素材">
                {getFieldDecorator('bgImageUpUrl', {
                  initialValue: partInfo.bgImageUpUrl || '',
                  rules: [
                    { required: true, message: '请上传背景素材！' },
                  ],
                })(<EllaUploader
                  width={55}
                  height={45}
                  beforeUpload={this.beforeUpload}
                  initialValue={partInfo.bgImageUpUrl || ''}
                />)}
                <span style={{ marginLeft: '10px', color: 'rgb(250, 173, 20)' }}>367*300</span>
              </Form.Item>
              {partStyle === 'SVIP' && radioPlatformCode === 'APP' && <Form.Item label="背景底图">
                {getFieldDecorator('bgImageUrl', {
                  initialValue: partInfo.bgImageUrl || '',
                  rules: [
                    { required: true, message: '请上传背景底图！' },
                  ],
                })(<EllaUploader
                  width={310}
                  height={45}
                  beforeUpload={this.beforeUpload}
                  initialValue={partInfo.bgImageUpUrl || ''}
                />)}
                <span style={{ marginLeft: '10px', color: 'rgb(250, 173, 20)' }}>716*100</span>
              </Form.Item>}
              <Form.Item label="运营文案">
                {getFieldDecorator('operateCopy', {
                  initialValue: partInfo.operateCopy || '',
                  rules: [
                    { required: true, message: '请输入运营文案' },
                  ],
                })(<Input placeholder='请输入运营文案' style={{ width: '100%' }} />)}
              </Form.Item>

            </div>
          )}
          <Form.Item label="展示数量">
            {getFieldDecorator('partSourceNum', {
              initialValue: partInfo.partSourceNum || 1,
              rules: [
                { required: true, message: '请填写数量' },
              ],
            })(<InputNumber min={1} max={10} placeholder="请填写数量" style={{ width: '100%' }} />
            )}
          </Form.Item>
          <Form.Item label="跳转链接文字">
            {getFieldDecorator('targetDesc', {
              initialValue: partInfo.targetDesc || '',
              rules: [
                { required: true, message: '请输入跳转链接文字' },
              ],
            })(<Input style={{ width: '100%' }} />
            )}
          </Form.Item>
          <Form.Item label="链接目标">
            {getFieldDecorator('targetDesc', {
              initialValue: 'JUMP_CURRENT',
              rules: [
                { required: true, message: '请选择链接目标' },
              ],
            })(<RadioGroup disabled>
              <Radio value="JUMP_CURRENT">跳转到当前列表</Radio>
              <Radio value="JUMP_OTHER">跳转到其他</Radio>
            </RadioGroup>
            )}
          </Form.Item>
          {partStyle !== 'SVIP' && <Row >
            <Col span={6} className='ant-form-item-label'>
              <label className="ant-form-item-required" title="渠道选择">渠道选择</label>
            </Col>
            <Col span={18}>
              <Form.Item wrapperCol={{ span: 24 }}>
                {getFieldDecorator('channel', {
                  initialValue: partInfo.channelCodes ? (partInfo.channelCodes.split(',').length > 1 ? 'custom' : partInfo.channelCodes) : '',
                  rules: [
                    { required: true, message: '请选择渠道!' },
                  ],
                })(<RadioGroup
                  onChange={(e) => {
                    this.setState({
                      channel: e.target.value
                    })
                  }}
                >
                  <Radio value="all">全部渠道</Radio>
                  <Radio value="ios">仅IOS</Radio>
                  <Radio value="android">仅Android</Radio>
                  <Radio value="custom">自定义</Radio>
                </RadioGroup>
                )}
              </Form.Item>
              {channel === 'custom' && <div>
                <p>请选择需要的渠道名称(可多选):</p>
                <Form.Item wrapperCol={{ span: 24 }}>
                  {getFieldDecorator('channelCodes', {
                    initialValue: partInfo.channelCodes ? partInfo.channelCodes.split(',') : [],
                    rules: [
                      { required: true, message: '请选择需要的渠道名称(可多选)' },
                    ],
                  })(<CheckboxGroup
                    options={chanelList}
                  />)}
                </Form.Item>
              </div>}
            </Col>
          </Row>}
          <Row >
            <Col span={6} className='ant-form-item-label'>
              <label className="ant-form-item-required" title="获取规则">获取规则</label>
            </Col>
            <Col span={18}>
              <Row >
                <Col span={8}>
                  {this.recommendType === 'book' && partStyle === 'SVIP' && <Select value={getRule}>
                    <Option value="NEW_VIP">最新会员限定</Option>
                  </Select>}
                  {this.recommendType === 'book' && partStyle !== 'SVIP' && <Select value={getRule} style={{ width: '100%' }} onChange={(value) => { this.setState({ getRule: value }) }}>
                    <Option value="LIST_LATEST_BOOK">最新</Option>
                    <Option value="LIST_HOTTEST_BOOK">最热</Option>
                    <Option value="LIST_REMARK_BOOK">评论</Option>
                    <Option value="LIST_SHARE_BOOK">分享</Option>
                  </Select>}
                  {this.recommendType !== 'book' && <Select value={getRule}>
                    <Option value="LIST_LATEST_BOOK">最新</Option>
                  </Select>}
                </Col>
                <Col span={8}>
                  <InputNumber min={1} placeholder='获取数量' value={getNum} onChange={(value) => { this.setState({ getNum: value }) }} />
                </Col>
                <Col span={8}><Button type='primary' onClick={this.getBookOrCourse.bind(this)}>获取</Button></Col>
              </Row>
            </Col>
          </Row>
        </div>
        <div style={{ width: 800, paddingLeft: '124px' }}>
          <Table
            rowKey='bookCode'
            size="small"
            loading={loading}
            title={() => <ButtonGroup style={{ textAlign: 'right', display: 'block' }}><Button icon="plus" type="primary" onClick={this.showModal.bind(this)}>添加图书</Button><Button type="danger" icon="delete" onClick={this.clearList.bind(this)}>清空列表</Button></ButtonGroup>}
            columns={columns}
            dataSource={bookOrCourseList}
            bordered
            scroll={{ y: 500 }}
            pagination={false}
          />
          <div style={{ textAlign: 'right', marginTop: '20px', width: '100%' }}>
            <Button type="primary" htmlType="submit" >
              保存
            </Button>
          </div>
        </div>

      </Form>

      <MultiSelectBooks
        visible={modalShow}
        type='checkbox'
        onCancel={() => { this.setState({ modalShow: false }) }}
        onChange={(value) => {
          let _bookOrCourseList = [...bookOrCourseList]
          value.map((item) => {
            let flag = false
            bookOrCourseList.map((el) => {
              if (el.bookCode === item.bookCode) {
                flag = true
              }
            })
            if (!flag) { _bookOrCourseList.push(item) }
            this.props.dispatch({
              type: 'editPart/save',
              payload: {
                bookOrCourseList: _bookOrCourseList
              }
            })
          })

        }}
      />
    </div>)
  }
}

export default connect(({ editPart, loading }) => ({
  editPart,
  loading: loading.effects['editPart/getBookOrCourseList'],
}))(Form.create()(EditPart));

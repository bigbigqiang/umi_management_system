/*
 * Author: jinhui
 * Description: 添加banner图
 * Date: 2019-06-20 16:16:30
 * LastEditors: jinhui
 * LastEditTime: 2019-09-11 17:53:31
 */
import React from 'react';
import { connect } from 'dva';
import { Input, Button, message, Radio, Form, Row, Col, Select, Checkbox } from 'antd';
import { EllaUploader } from '@/components/EllaUploader';
import EllaResourcePicker from '@/components/EllaResourcePicker/EllaResourcePicker';
import styles from "./editBanner.less";
import { getUrlParams } from "@/utils";
const RadioGroup = Radio.Group
const CheckboxGroup = Checkbox.Group;
const { Search } = Input;

// const FormItem = Form.Item
const Option = Select.Option;
// const { TextArea } = Input;

const targetTypeData = [
  {
    key: 'BOOK_LIST',
    value: '推荐专栏'
  },
  {
    key: 'SYSTEM_INTERFACE',
    value: '系统界面'
  },
  {
    key: 'H5',
    value: 'H5页面'
  },
  {
    key: 'BOOK_DETAIL',
    value: '图书详情'
  },
  {
    key: 'BOOK_PACKAGE_DETAIL',
    value: '图书包'
  },

  {
    key: 'COURSE_DETAIL',
    value: '课程详情'
  }
];

class AddBannerPic extends React.Component {
  state = {
    targetType: 'BOOK_LIST',
    channel: '',
    modalShow: false,

  }

  bannerCode = ''

  componentDidMount() {
    let { bannerCode } = this.props.computedMatch.params
    this.bannerCode = bannerCode === '0' ? '' : bannerCode
    this.getBoxSearchList('BOOK_LIST')
    this.props.dispatch({
      type: 'editBanner/getChanelList',
      payload: { type: 'AUTO_BOX', groupId: 'operation.box.chanelList' }
    })
    this.props.dispatch({
      type: 'editBanner/getPlatFrom',
      payload: { groupId: 'SYSTEM_PLATFORM' }
    })
    !!this.bannerCode && this.props.dispatch({
      type: 'editBanner/getBannerInfo',
      payload: { bannerCode: this.bannerCode }
    }).then((data) => {
      this.targetTypeChange(data.targetType)
      this.setFormInitialValue(data)
      if (data.channelCodes && data.channelCodes.split(',').length > 1) {
        this.setState({
          channel: 'custom'
        })
      }
    })

  }

  setFormInitialValue = (data) => {
    const { setFieldsValue } = this.props.form;
    switch (data.targetType) {
      case 'BOOK_LIST':
        setFieldsValue({ targetPage_SearchList: { key: data.targetPage } })
        break;
      case 'SYSTEM_INTERFACE':
        setFieldsValue({ targetPage_SearchList: { key: data.targetPage } })
        break;
      case 'H5':
        let isShare = getUrlParams(data.targetPage, 'isShare')
        setFieldsValue({ targetPage_H5: decodeURIComponent(data.targetPage), isShare: (isShare === '' || isShare === '0') ? false : true })
        break;
      case 'BOOK_DETAIL':
        setFieldsValue({ targetPage_BOOK_DETAIL: data.searchPageName })
        break;
      case 'BOOK_PACKAGE_DETAIL':
        setFieldsValue({ targetPage_BOOK_PACKAGE_DETAIL: { key: getUrlParams(data.targetPage || '', 'packageCode') || '' } })
        break;
      case 'COURSE_CODE':
        setFieldsValue({ targetPage_BOOK_COURSE_CODE: { key: getUrlParams(data.targetPage || '', 'courseCode') || '' } })
        break;
      default:
        return;
    }
  }

  getBoxSearchList(groupId) {
    this.props.dispatch({
      type: 'editBanner/boxSearchList',
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

  handleCreate = (currentShelvesFlag, shelvesFlag) => {
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      let { bannerTitle, bannerDesc, targetType, bannerImageUrl, targetPage, searchId, channelCodes, platformCode, channel, searchPageName, isShare } = values
      channelCodes = channel === 'custom' ? channelCodes.join(',') : channel
      if (targetType === 'H5') {
        targetType = targetType.trim()
        if (getUrlParams(targetPage, 'isShare')) {
          targetPage = targetPage.replace(/isShare\=[0|1]{1}/, `isShare=${isShare ? '1' : '0'}`)
        } else {
          if (targetPage.indexOf('?') !== -1 && targetPage.split('').pop() !== '?') {
            targetPage = targetPage + `&isShare=${isShare ? '1' : '0'}`
          } else if (targetPage.indexOf('?') === -1) {
            targetPage = targetPage + `?isShare=${isShare ? '1' : '0'}`
          } else if (targetPage.split('').pop() === '?') {
            targetPage = targetPage + `isShare=${isShare ? '1' : '0'}`
          }
        }
      }
      this.props.dispatch({
        type: 'editBanner/saveBanner',
        payload: {
          bannerCode: this.bannerCode,
          searchPageName,
          bannerTitle,
          bannerDesc,
          bannerImageUrl,
          targetPage: encodeURIComponent(targetPage),
          channelCodes,
          searchId,
          platformCode: platformCode.join(','),
          shelvesFlag: this.bannerCode ? (shelvesFlag === 'SHELVES_ON' ? shelvesFlag : currentShelvesFlag) : shelvesFlag,
          targetType,
        }
      })
    });
  };

  targetTypeChange(value) {
    let { setFieldsValue } = this.props.form;
    this.setState({
      targetType: value
    })
    if (value === 'BOOK_LIST' || value === 'SYSTEM_INTERFACE') {
      this.getBoxSearchList(value)
      setFieldsValue({ targetPage_SearchList: { key: '' } })
    } else if (value === 'BOOK_PACKAGE_DETAIL') {
      this.props.dispatch({
        type: 'editBanner/goodsManageList',
        payload: { "goodsManageSearchType": "goodsName", "searchContent": "", "goodsState": "SHELVES_ON", "goodsType": "BOOK_PACKAGE", "availableBookPackage": "YES", "page": 0, "pageSize": 1000 }
      })
    } else if (value === 'COURSE_DETAIL') {
      this.props.dispatch({
        type: 'editBanner/getBookCourseList',
        payload: { "courseName": "", "goodsState": "SHELVES_ON" }
      })
    }
  }

  showModal(modalShow) {
    this.setState({
      modalShow
    })
  }

  componentWillUnmount() {
    let { resetFields } = this.props.form;
    resetFields()
    this.props.dispatch({
      type: 'editBanner/save',
      payload: {
        bannerInfo: {}
      }
    })
  }

  render() {
    const { getFieldDecorator, setFieldsValue } = this.props.form;
    const { editBanner: { searchList, chanelList, PlatFromList, bookPackageList, courseList, bannerInfo } } = this.props
    const { targetType, channel, modalShow } = this.state
    return (<div>
      <Form className={styles.formContent} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <div style={{ paddingLeft: 30 }}>
          <p>banner图尺寸:750*320</p>
          <Form.Item>
            {getFieldDecorator('bannerImageUrl', {
              initialValue: bannerInfo.bannerImageUrl || '',
              rules: [
                { required: true, message: '请上传图片！' },
              ],
            })(<EllaUploader
              width={380}
              height={180}
              beforeUpload={this.beforeUpload}
              initialValue = {bannerInfo.bannerImageUrl || ''}
            />)}
          </Form.Item>
        </div>
        <div style={{ width: 500 }}>
          <Form.Item label="图片标题">
            {getFieldDecorator('bannerTitle', {
              initialValue: bannerInfo.bannerTitle || '',
              rules: [
                { required: true, message: '请输入图片标题！' },
                { max: 20, message: '支持最大长度20！' },
              ],
            })(<Input placeholder='输入图片标题' />)}
          </Form.Item>
          <Form.Item label="图片简介">
            {getFieldDecorator('bannerDesc', {
              initialValue: bannerInfo.bannerDesc || '',
              rules: [
                { required: true, message: '请输入图片简介！' },
                { max: 50, message: '支持最大长度50！' },
              ],
            })(<Input placeholder='输入图片简介' />)}
          </Form.Item>


          <Row >
            <Col span={6} className='ant-form-item-label'>
              <label className="ant-form-item-required" title="图片简介">链接目标</label>
            </Col>
            <Col span={18}>
              <Row>
                <Col span={8}>
                  <Form.Item>
                    {getFieldDecorator('targetType', {
                      initialValue: bannerInfo.targetType || targetType,
                      rules: [
                        { required: true, message: '' },
                      ],
                    })(<Select style={{ width: 120 }} onChange={this.targetTypeChange.bind(this)}>
                      {
                        targetTypeData.map((item, index) => {
                          return <Option value={item.key} key={item.key}>{item.value}</Option>
                        })
                      }
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col span={16}>
                  {getFieldDecorator('targetPage', {
                    initialValue: bannerInfo.targetPage || '',
                  })(<Input style={{ display: 'none' }} />)}
                  {getFieldDecorator('searchId', {
                    initialValue: bannerInfo.searchId || '',
                  })(<Input style={{ display: 'none' }} />)}
                  {getFieldDecorator('searchPageName', {
                    initialValue: bannerInfo.searchPageName || '',
                  })(<Input style={{ display: 'none' }} />)}

                  {(targetType === 'BOOK_LIST' || targetType === 'SYSTEM_INTERFACE') && <Form.Item>
                    {getFieldDecorator('targetPage_SearchList', {
                      initialValue: { key: '' },
                      rules: [
                        { required: true, message: '请选择链接目标', transform(value) { return value.key } },
                      ],
                    })(<Select labelInValue style={{ width: 120, marginLeft: '20px' }} onChange={(value) => { setFieldsValue({ targetPage: value.key, searchPageName: value.label, searchId: searchList.find((item) => item.searchCode === value.key).searchId }) }}>
                      {
                        searchList.map((item, index) => {
                          return <Option value={item.searchCode} key={item.searchCode}>{item.searchName}</Option>
                        })
                      }
                    </Select>)}
                  </Form.Item>}
                  {targetType === 'H5' && <Form.Item>
                    {getFieldDecorator('targetPage_H5', {
                      initialValue: '',
                      rules: [
                        { required: true, message: '请输入连接目标' },
                        { pattern: /http\:\/\/|https\:\/\/|ellabook\:\/\/|ellabook2\:\/\//, message: '链接地址格式不正确！' },
                      ],
                    })(<Input placeholder='输入连接目标' style={{ width: 250 }} onBlur={(e) => { setFieldsValue({ targetPage: e.target.value, searchPageName: 'H5页面' }) }} />)}
                  </Form.Item>}
                  {targetType === 'H5' && <Form.Item>
                    {getFieldDecorator('isShare', {
                      valuePropName: 'checked',
                      initialValue: false,
                    })(<Checkbox >支持分享</Checkbox>)}
                  </Form.Item>}
                  {targetType === 'BOOK_DETAIL' && <Form.Item>
                    {getFieldDecorator('targetPage_BOOK_DETAIL', {
                      initialValue: '',
                      rules: [
                        { required: true, message: '请选择图书!' },
                      ],
                    })(<Search
                      placeholder="请选择图书"
                      onSearch={this.showModal.bind(this, true)}
                      style={{ width: 250 }}
                      enterButton
                    />)}
                  </Form.Item>}
                  {targetType === 'BOOK_PACKAGE_DETAIL' && <Form.Item>
                    {getFieldDecorator('targetPage_BOOK_PACKAGE_DETAIL', {
                      initialValue: { key: '' },
                      rules: [
                        { required: true, message: '请选择图书包！', transform(value) { return value.key } },
                      ],
                    })(<Select
                      showSearch
                      labelInValue
                      style={{ width: 250 }}
                      placeholder="搜索图书包"
                      optionFilterProp="children"
                      onChange={(value) => { setFieldsValue({ targetPage: `ellabook2://package.book?packageCode=${value.key}&method=ella.book.getBookPackageBookListInfo`, searchPageName: value.label }) }}
                    >
                      {
                        bookPackageList.map(item => {
                          return <Option value={item.thirdCode} key={item.thirdCode}>{item.goodsName}</Option>
                        })
                      }
                    </Select>
                    )}
                  </Form.Item>}

                  {targetType === 'COURSE_DETAIL' && <Form.Item>
                    {getFieldDecorator('targetPage_BOOK_COURSE_CODE', {
                      initialValue: { key: '' },
                      rules: [
                        { required: true, message: '请选择课程' , transform(value) { return value.key }},
                      ],
                    })(<Select
                      showSearch
                      labelInValue
                      style={{ width: 250 }}
                      placeholder="搜索课程"
                      optionFilterProp="children"
                      onChange={(value) => { setFieldsValue({ targetPage: `ellabook2://detail.course?courseCode=${value.key}`, searchPageName: value.label }) }}
                    >
                      {
                        courseList.map(item => {
                          return <Option value={item.courseCode} key={item.courseCode}>{item.courseName}</Option>
                        })
                      }
                    </Select>
                    )}
                  </Form.Item>}

                </Col>
              </Row>
            </Col>
          </Row>
          <Form.Item label="平台选择">
            {getFieldDecorator('platformCode', {
              initialValue: bannerInfo.platformCode ? bannerInfo.platformCode.split(',') : [],
              rules: [
                { required: true, message: '请选择平台！' },
              ],
            })(<CheckboxGroup options={PlatFromList} />)}
          </Form.Item>
          <Row >
            <Col span={6} className='ant-form-item-label'>
              <label className="ant-form-item-required" title="渠道选择">渠道选择</label>
            </Col>
            <Col span={18}>
              <Form.Item wrapperCol={{ span: 24 }}>
                {getFieldDecorator('channel', {
                  initialValue: bannerInfo.channelCodes ? (bannerInfo.channelCodes.split(',').length > 1 ? 'custom' : bannerInfo.channelCodes) : '',
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
              <Form.Item wrapperCol={{ span: 24 }}>
                {channel === 'custom' && getFieldDecorator('channelCodes', {
                  initialValue: bannerInfo.channelCodes.split(','),
                  rules: [
                    { required: true, message: '请选择需要的渠道名称(可多选)' },
                  ],
                })(<CheckboxGroup
                  options={chanelList}
                />
                )}
              </Form.Item>
            </Col>
          </Row>

          <div style={{ textAlign: 'right', width: '100%' }}>
            <Button.Group>
              <Button type="primary" onClick={() => { this.handleCreate(bannerInfo.shelvesFlag, 'SHELVES_OFF') }}>
                保存
                </Button>
              <Button type="primary" onClick={() => { this.handleCreate(bannerInfo.shelvesFlag, 'SHELVES_ON') }}>
                保存并上线
                </Button>
            </Button.Group>
          </div>
        </div>
      </Form>
      <EllaResourcePicker
        // type="checkbox"
        modalShow={modalShow}
        showModal={this.showModal.bind(this)}
        title="选择图书"
        api="ella.operation.getBookListByIdOrName"
        dataPath="data.bookList"
        meta={{ text: '', goodsState: "SHELVES_ON" }}
        columns={[
          {
            title: '图书标题',
            dataIndex: 'bookName',
            key: 'bookName',
          },
          {
            title: '图书编码',
            dataIndex: 'bookCode',
            key: 'bookCode',
          },
          {
            title: '出版时间',
            dataIndex: 'publishTime',
            key: 'publishTime',
          },
          {
            title: '图书状态',
            dataIndex: 'createTime',
            key: 'createTime',
            render: text => '已上架',
          },
        ]}
        formatter={{
          bookCode: 'bookCode',
          bookName: 'bookName',
        }}
        searchName="text"
        placeHolder="图书名称"
        onChange={(value) => { value && setFieldsValue({ targetPage_BOOK_DETAIL: value[0].bookName, searchPageName: value[0].bookName, targetPage: `ellabook://detail.book?bookCode=${value[0].bookCode}&method=ella.book.getBookByCode` }) }}
      />
    </div>)
  }
}

export default connect(({ editBanner }) => ({
  editBanner
}))(Form.create()(AddBannerPic));

/*
 * Author: zhangsongqiang
 * Description: 添加banner图
 * Date: 2019/12/23 下午3:12:00
 * LastEditors: zhangsongqiang
 * LastEditTime: 2019/12/23 下午3:12:00
 */
import React from 'react';
import { connect } from 'dva';
import { Input, Button, message, Radio, Form, Row, Col, Select, Checkbox } from 'antd';
import { EllaUploader } from '@/components/EllaUploader';
import EllaResourcePicker from '@/components/EllaResourcePicker/EllaResourcePicker';
import styles from "./editSubject.less";
import { getUrlParams } from "@/utils";
const RadioGroup = Radio.Group
const CheckboxGroup = Checkbox.Group;
const { Search } = Input;

const Option = Select.Option;

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

class EditSubject extends React.Component {
  state = {
    targetType: 'BOOK_LIST',
    modalShow: false,
    iconType: 'default'
  }

  subjectCode = ''

  componentDidMount() {
    let { subjectCode } = this.props.computedMatch.params
    this.subjectCode = subjectCode === '0' ? '' : subjectCode
    this.getBoxSearchList('BOOK_LIST')
    this.props.dispatch({
      type: 'editSubject/getStyleList',
      payload: { groupId: 'SUBJECT_BG_IMAGE_UP' }
    })
    this.props.dispatch({
      type: 'editSubject/getChanelList',
      payload: { type: 'AUTO_BOX', groupId: 'operation.box.chanelList' }
    })
    this.props.dispatch({
      type: 'editSubject/getPlatFrom',
      payload: { groupId: 'SYSTEM_PLATFORM' }
    })
    !!this.subjectCode && this.props.dispatch({
      type: 'editSubject/getOperationSubjectInfo',
      payload: { subjectCode: this.subjectCode }
    }).then((data) => {
      this.targetTypeChange(data.targetType)
      this.setFormInitialValue(data)
      this.setState({
        iconType: !!data.imageUpSearchId ? 'default' : 'local'
      })
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
      type: 'editSubject/boxSearchList',
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
    const { form, editSubject: { styleList } } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      let { subjectTitle, targetType, bgImageUpUrl, targetPage, searchId, platformCode, searchPageName, isShare, iconType, iconStyle } = values
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
      let _bgImageUpUrl = bgImageUpUrl
      if (iconType === 'default') {
        let item = styleList.find(item => item.searchId === iconStyle)
        if (item) {
          _bgImageUpUrl = item.searchCode
        }
      }
      this.props.dispatch({
        type: 'editSubject/saveOperationSubject',
        payload: {
          subjectCode: this.subjectCode,
          bgImageUrl: '',
          searchPageName,
          subjectTitle,
          bgImageUpUrl: _bgImageUpUrl,
          imageUpSearchId: iconType === 'default' ? iconStyle : '',
          targetPage: encodeURIComponent(targetPage),
          searchId,
          platformCode: platformCode.join(','),
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
        type: 'editSubject/goodsManageList',
        payload: { "goodsManageSearchType": "goodsName", "searchContent": "", "goodsState": "SHELVES_ON", "goodsType": "BOOK_PACKAGE", "availableBookPackage": "YES", "page": 0, "pageSize": 1000 }
      })
    } else if (value === 'COURSE_DETAIL') {
      this.props.dispatch({
        type: 'editSubject/getBookCourseList',
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
      type: 'editSubject/save',
      payload: {
        subjectInfo: {}
      }
    })
  }

  render() {
    const { getFieldDecorator, setFieldsValue } = this.props.form;
    const { editSubject: { styleList, searchList, PlatFromList, bookPackageList, courseList, subjectInfo } } = this.props
    const { targetType, modalShow, iconType } = this.state
    return (<div>
      <Form className={styles.formContent} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} onSubmit={this.handleSubmit}>
        <div style={{ paddingLeft: 30 }}>
          <Form.Item>
            {getFieldDecorator('bgImageUpUrl', {
              initialValue: subjectInfo.bgImageUpUrl || '',
              rules: [
                { required: true, message: '请上传图片！' },
              ],
            })(<EllaUploader
              width={90}
              height={90}
              beforeUpload={this.beforeUpload}
              initialValue={subjectInfo.bgImageUpUrl || ''}
            />)}
          </Form.Item>
        </div>
        <div style={{ width: 500 }}>
          <Form.Item label="平台选择" onSubmit={this.handleCreate}>
            {getFieldDecorator('platformCode', {
              initialValue: subjectInfo.platformCode ? subjectInfo.platformCode.split(',') : [],
              rules: [
                { required: true, message: '请选择平台！' },
              ],
            })(<CheckboxGroup options={PlatFromList} />)}
          </Form.Item>

          <Form.Item label="专题标题">
            {getFieldDecorator('subjectTitle', {
              initialValue: subjectInfo.subjectTitle || '',
              rules: [
                { required: true, message: '请输入图片标题！' },
                { max: 20, message: '支持最大长度20！' },
              ],
            })(<Input placeholder='输入图片标题' />)}
          </Form.Item>
          <Row >
            <Col span={6} className='ant-form-item-label'>
              <label title="渠道选择">专题图标</label>
            </Col>
            <Col span={18}>
              <Form.Item wrapperCol={{ span: 24 }}>
                {getFieldDecorator('iconType', {
                  initialValue: !!subjectInfo.imageUpSearchId ? 'local' : 'default',
                  rules: [
                    { required: true, message: '请专题图标!' },
                  ],
                })(<RadioGroup
                  onChange={(e) => {
                    this.setState({
                      iconType: e.target.value
                    })
                  }}
                >
                  <Radio value="default">默认样式</Radio>
                  <Radio value="local">本地上传</Radio>
                </RadioGroup>
                )}
              </Form.Item>
              {iconType === 'default' && <Form.Item wrapperCol={{ span: 24 }}>
                {getFieldDecorator('iconStyle', {
                  initialValue: !!subjectInfo.imageUpSearchId ? subjectInfo.imageUpSearchId : (styleList[0] ? styleList[0].searchId : ''),
                  rules: [
                    { required: true, message: '请选择样式！' },
                  ],
                })(<Select style={{ width: 120 }}>
                  {
                    styleList.map((item, index) => {
                      return <Option value={item.searchId} key={index}>{item.searchName}</Option>
                    })
                  }
                </Select>
                )}
              </Form.Item>}
            </Col>
          </Row>
          <Row >
            <Col span={6} className='ant-form-item-label'>
              <label className="ant-form-item-required" title="图片简介">链接目标</label>
            </Col>
            <Col span={18}>
              <Row>
                <Col span={8}>
                  <Form.Item>
                    {getFieldDecorator('targetType', {
                      initialValue: subjectInfo.targetType || targetType,
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
                    initialValue: subjectInfo.targetPage || '',
                  })(<Input style={{ display: 'none' }} />)}
                  {getFieldDecorator('searchId', {
                    initialValue: subjectInfo.searchId || '',
                  })(<Input style={{ display: 'none' }} />)}
                  {getFieldDecorator('searchPageName', {
                    initialValue: subjectInfo.searchPageName || '',
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
                        { required: true, message: '请选择课程', transform(value) { return value.key } },
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


          <div style={{ textAlign: 'right', width: '100%' }}>
            <Button type="primary" htmlType="submit" >
              保存
                </Button>
          </div>
        </div>
      </Form>
      <EllaResourcePicker
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

export default connect(({ editSubject }) => ({
  editSubject
}))(Form.create()(EditSubject));

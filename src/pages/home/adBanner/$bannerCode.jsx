/*
 * Author: zhangsongqiang
 * Description: 添加banner图
 * Date: 2020/1/7 下午1:50:31
 * LastEditors: zhangsongqiang
 * LastEditTime: 2020/1/7 下午1:50:31
 */
import React from 'react';
import { connect } from 'dva';
import { Input, Button, message, Form, Row, Col, Select, Checkbox } from 'antd';
import { EllaUploader } from '@/components/EllaUploader';
import EllaResourcePicker from '@/components/EllaResourcePicker/EllaResourcePicker';
import styles from "./editAdBanner.less";
import { getUrlParams } from "@/utils";
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

const adStyleData = [
  {
    key: 'AD_PART',
    value: '模块广告'
  },
  {
    key: 'AD_SINGLE',
    value: '单广告'
  }
];


class AddBannerPic extends React.Component {
  state = {
    targetType: 'BOOK_LIST',
    channel: '',
    modalShow: false,
    adStyle: 'AD_SINGLE'

  }

  bannerCode = ''

  componentDidMount() {
    let { bannerCode } = this.props.computedMatch.params
    this.bannerCode = bannerCode === '0' ? '' : bannerCode
    this.getBoxSearchList('BOOK_LIST')
    this.props.dispatch({
      type: 'editAdBanner/getPlatFrom',
      payload: { groupId: 'SYSTEM_PLATFORM' }
    })
    !!this.bannerCode && this.props.dispatch({
      type: 'editAdBanner/getOperationAdInfo',
      payload: { bannerCode: this.bannerCode }
    }).then((data) => {
      this.targetTypeChange(data.targetType)
      this.setFormInitialValue(data)
      this.setState({
        adStyle: data.adStyle
      })
      if(data.adStyle === 'AD_PART'){
        this.getAdPart()
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
      type: 'editAdBanner/boxSearchList',
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

  handleCreate = () => {
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      let { bannerTitle, bannerDesc, targetType, bannerImageUrl, targetPage, searchId, channelCodes, platformCode, channel, searchPageName, isShare, hdImageUrl, partCode, adStyle } = values
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
        type: 'editAdBanner/saveOperationAd',
        payload: {
          bannerCode: this.bannerCode,
          searchPageName,
          bannerTitle,
          bannerDesc,
          bannerImageUrl,
          hdImageUrl,
          targetPage: encodeURIComponent(targetPage),
          channelCodes,
          searchId,
          adStyle,
          partCode: adStyle === 'AD_PART' ? partCode : null,
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
        type: 'editAdBanner/goodsManageList',
        payload: { "goodsManageSearchType": "goodsName", "searchContent": "", "goodsState": "SHELVES_ON", "goodsType": "BOOK_PACKAGE", "availableBookPackage": "YES", "page": 0, "pageSize": 1000 }
      })
    } else if (value === 'COURSE_DETAIL') {
      this.props.dispatch({
        type: 'editAdBanner/getBookCourseList',
        payload: { "courseName": "", "goodsState": "SHELVES_ON" }
      })
    }
  }

  getAdPart = ()=>{
    this.props.dispatch({
      type: 'editAdBanner/getAdPart',
      payload: { "groupId": "BOOK_LIST", "type": "AD_PART", "partCode": "" }
    })
  }

  adStyleChange(value) {
    if (value === 'AD_PART') {
      this.getAdPart()
    }
    this.setState({
      adStyle: value
    })
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
      type: 'editAdBanner/save',
      payload: {
        bannerInfo: {}
      }
    })
  }

  render() {
    const { getFieldDecorator, setFieldsValue } = this.props.form;
    const { editAdBanner: { searchList, PlatFromList, bookPackageList, courseList, bannerInfo, adPartList } } = this.props
    const { targetType, modalShow, adStyle } = this.state
    return (<div>
      <Form className={styles.formContent} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} onSubmit={this.handleCreate}>
        <div style={{ paddingLeft: 30 }}>
          <p>移动客户端690*230</p>
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
              initialValue={bannerInfo.bannerImageUrl || ''}
            />)}
          </Form.Item>
          <p>HD客户端1720*320</p>
          <Form.Item>
            {getFieldDecorator('hdImageUrl', {
              initialValue: bannerInfo.hdImageUrl || '',
              rules: [
                { required: true, message: '请上传图片！' },
              ],
            })(<EllaUploader
              width={380}
              height={180}
              beforeUpload={this.beforeUpload}
              initialValue={bannerInfo.bannerImageUrl || ''}
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
              <label className="ant-form-item-required" title="样式选择">样式选择</label>
            </Col>
            <Col span={18}>
              <Row>
                <Col span={8}>
                  <Form.Item>
                    {getFieldDecorator('adStyle', {
                      initialValue: bannerInfo.adStyle || adStyle,
                      rules: [
                        { required: true, message: '' },
                      ],
                    })(<Select style={{ width: 120 }} onChange={this.adStyleChange.bind(this)}>
                      {
                        adStyleData.map((item, index) => {
                          return <Option value={item.key} key={item.key}>{item.value}</Option>
                        })
                      }
                    </Select>)}
                  </Form.Item>
                </Col>
                {adStyle === 'AD_PART' && <Col span={16}>
                  <Form.Item>
                    {getFieldDecorator('partCode', {
                      initialValue: bannerInfo.partCode || '',
                      rules: [
                        { required: true, message: '' },
                      ],
                    })(<Select style={{ width: '100%' }}>
                      {
                        adPartList.map((item, index) => {
                          return <Option value={item.searchId} key={item.searchId}>{item.searchName}</Option>
                        })
                      }
                    </Select>)}
                  </Form.Item>
                </Col>}
              </Row>
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

          <Row >
            <Col span={18} offset={6}>
              <Button type="primary" htmlType="submit" >保存</Button>
            </Col>
          </Row>
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

export default connect(({ editAdBanner }) => ({
  editAdBanner
}))(Form.create()(AddBannerPic));

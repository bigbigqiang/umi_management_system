/*
 * Author: zhangsongqiang
 * Description: 专栏管理
 * Date: 2020/1/9 下午4:26:51
 * LastEditors: zhangsongqiang
 * LastEditTime: 2020/1/9 下午4:26:51
 */
import React from 'react';
import { connect } from 'dva';
import { Input, Button, message, Form, Checkbox, Divider, Select, Icon, Table, Modal, Popover } from 'antd';
import { EllaUploader } from '@/components/EllaUploader';
import styles from "./editBookSubject.less";
import Link from 'umi/link';

const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;
const ButtonGroup = Button.Group;

class EditBookSubject extends React.Component {
  state = {
    introductionList: [],
    textVisible: false,
    text: '',
    imageVisible: false,
    imageSrc: '',
    index: -1
  }

  subjectCode = ''

  componentDidMount() {
    let { subjectCode } = this.props.computedMatch.params
    this.subjectCode = subjectCode === '0' ? '' : subjectCode
    this.getBoxSearchList('BOOK_LIST')
    this.props.dispatch({
      type: 'editBookSubject/getPlatFrom',
      payload: { groupId: 'SYSTEM_PLATFORM' }
    })
    this.props.dispatch({
      type: 'editBookSubject/goodsManageList',
      payload: { "goodsManageSearchType": "goodsName", "searchContent": "", "goodsState": "SHELVES_ON", "goodsType": "BOOK_PACKAGE", "availableBookPackage": "YES", "page": 0, "pageSize": 2000 }
    })
    !!this.subjectCode && this.props.dispatch({
      type: 'editBookSubject/getBookSubjectInfo',
      payload: { subjectCode: this.subjectCode }
    }).then((data) => {
      this.setState({
        introductionList: data.introductionList || []
      })
    })

  }

  getBoxSearchList(groupId) {
    this.props.dispatch({
      type: 'editBookSubject/boxSearchList',
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
      let { subjectName, subjectDesc, packageCode, coverImageUrl, tags, platformCode } = values
      let { introductionList } = this.state
      platformCode = platformCode.join(',')
      this.props.dispatch({
        type: 'editBookSubject/saveBookSubject',
        payload: {
          subjectName,
          subjectDesc,
          coverImageUrl,
          tags,
          platformCode,
          introductionList: introductionList,
          subjectCode: this.subjectCode,
          packageCode
        }
      })

    });
  };


  showModal(modalShow) {
    this.setState({
      modalShow
    })
  }

  componentWillUnmount() {
    let { resetFields } = this.props.form;
    resetFields()
    this.props.dispatch({
      type: 'editBookSubject/save',
      payload: {
        bookSubjectInfo: {}
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { editBookSubject: { PlatFromList, bookSubjectInfo, bookPackageList } } = this.props
    const { introductionList, textVisible, text, imageVisible, imageSrc } = this.state
    const columns = [
      {
        title: '类型',
        width: '15%',
        dataIndex: 'introductionType',
        render: text => text === 'image' ? '图片' : '文字'
      }, {
        title: '内容',
        dataIndex: 'introductionContent',
        className: 'td_hide',
        render: (text, record) => {
          return record.introductionType === 'image' ? <EllaUploader
            width={90}
            height={54}
            beforeUpload={this.beforeUpload}
            initialValue={record.introductionContent}
            onChange={() => { }}
          /> : <Popover
            placement="top"
            title={null}
            content={
              text
            }
          >
              <span>{text}</span>
            </Popover>
        }
      }, {
        title: '操作',
        width: '10%',
        render: (record, index) => {
          return (
            <ButtonGroup>
              <Button size='small' type="primary" icon="form" onClick={() => {
                this.setState({
                  index: index,
                  [record.introductionType === 'text' ? 'text' : 'imageSrc']: record.introductionContent,
                  [record.introductionType === 'text' ? 'textVisible' : 'imageVisible']: true
                })
              }}></Button>
              <Button size='small' type="primary" icon="delete" onClick={() => {
                let { introductionList } = this.state
                introductionList.splice(index, 1)
                this.setState({
                  introductionList
                })
              }}></Button>
            </ButtonGroup>
          )
        }
      },
    ]
    return (<div>
      <p className="m-title"><Link to={'/home/bookSubject'}> <Icon type='left'></Icon>编辑新的专栏</Link></p>
      <Form className={styles.formContent}>
        <div style={{ paddingLeft: 20, width: 200 }}>
          <p>基础信息</p>
          <Form.Item label="专栏标题">
            {getFieldDecorator('subjectName', {
              initialValue: bookSubjectInfo.subjectName || '',
              rules: [
                { required: true, message: '请输入专栏标题！' },
                { max: 20, message: '支持最大长度20！' },
              ],
            })(<Input placeholder='输入专栏标题' />)}
          </Form.Item>
          <Form.Item label="专栏简介">
            {getFieldDecorator('subjectDesc', {
              initialValue: bookSubjectInfo.subjectDesc || '',
              rules: [
                { required: true, message: '请输入专栏简介！' },
                { max: 50, message: '支持最大长度50！' },
              ],
            })(<Input placeholder='输入专栏简介' />)}
          </Form.Item>
          <Form.Item label="推荐商品">
            {getFieldDecorator('packageCode', {
              initialValue: bookSubjectInfo.packageCode || '',
              rules: [
                { required: true, message: '请选择图书包！' },
              ],
            })(<Select style={{ width: '100%' }}>
              {bookPackageList.map((item) => <Option key={item.thirdCode} value={item.thirdCode}>{item.goodsName}</Option>)}
            </Select>)}

          </Form.Item>
          <Form.Item label="专栏封面">
            {getFieldDecorator('coverImageUrl', {
              initialValue: bookSubjectInfo.coverImageUrl || '',
              rules: [
                { required: true, message: '请上传图片！' },
              ],
            })(<EllaUploader
              width={180}
              height={109}
              beforeUpload={this.beforeUpload}
              initialValue={bookSubjectInfo.coverImageUrl || ''}
            />)}
          </Form.Item>
          <Form.Item label="专栏标签">
            {getFieldDecorator('tags', {
              initialValue: bookSubjectInfo.tags || '',
              rules: [
                { max: 50, message: '支持最大长度50！' },
              ],
            })(<Input placeholder='输入专栏简介' />)}
          </Form.Item>
          <Form.Item label="平台选择">
            {getFieldDecorator('platformCode', {
              initialValue: bookSubjectInfo.platformCode ? bookSubjectInfo.platformCode.split(',') : [],
              rules: [
                { required: true, message: '请选择平台！' },
              ],
            })(<CheckboxGroup options={PlatFromList} />)}
          </Form.Item>

        </div>
        <Divider type="vertical" style={{ height: 'auto' }} />
        <div style={{ flex: '1' }}>
          <Table
            title={() => <ButtonGroup style={{ textAlign: 'right', display: 'block' }}>
              <Button icon="plus" type="primary" onClick={() => {
                this.setState({
                  imageVisible: true,
                  imageSrc: '',
                  index: -1
                })
              }}>添加图片</Button>
              <Button type="primary" icon="plus" onClick={() => {
                this.setState({
                  textVisible: true,
                  text: '',
                  index: -1
                })
              }}>添加文字</Button>
            </ButtonGroup>}
            rowKey={(record, index) => index}
            size="small"
            columns={columns}
            dataSource={introductionList}
            bordered
            scroll={{ y: 570 }}
            pagination={false}
          />
        </div>
        <div style={{ textAlign: 'right', width: '100%' }}>
          <Button type="primary" onClick={() => { this.handleCreate(bookSubjectInfo.shelvesFlag, 'SHELVES_ON') }}>
            保存为专栏模块
                </Button>
        </div>
      </Form>
      <Modal
        title="添加文字"
        visible={textVisible}
        onOk={() => {
          let { index, introductionList, text } = this.state
          if (index === -1) {
            introductionList.push({
              introductionType: 'text',
              introductionContent: text,
            })
          } else {
            introductionList[index] = {
              introductionType: 'text',
              introductionContent: text,
            }
          }
          this.setState({
            introductionList,
            textVisible: false
          })
        }}
        onCancel={(e) => {
          this.setState({
            textVisible: false
          })
        }}
      >
        <Input placeholder="请输入搜索字段" value={text} onChange={(e) => { this.setState({ text: e.target.value }) }} />
      </Modal>
      <Modal
        title="添加图片"
        visible={imageVisible}
        style={{ textAlign: 'center' }}
        onOk={() => {
          let { index, introductionList, imageSrc } = this.state
          if (index === -1) {
            introductionList.push({
              introductionType: 'image',
              introductionContent: imageSrc,
            })
          } else {
            introductionList[index] = {
              introductionType: 'image',
              introductionContent: imageSrc,
            }
          }
          this.setState({
            introductionList,
            imageVisible: false
          })
        }}
        onCancel={(e) => {
          this.setState({
            imageVisible: false
          })
        }}
      >
        <EllaUploader
          width={220}
          height={108}
          beforeUpload={this.beforeUpload}
          initialValue={imageSrc}
          onChange={(src, flag) => {
            if (!flag) {
              this.setState({
                imageSrc: src
              })
            }
          }}
        />
      </Modal>
    </div>)
  }
}

export default connect(({ editBookSubject }) => ({
  editBookSubject
}))(Form.create()(EditBookSubject));

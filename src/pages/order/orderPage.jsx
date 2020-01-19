/*
 * Author: zhangsongqiang
 * Description: topic页
 * Date: 2019/12/23 下午1:36:57
 * LastEditors: zhangsongqiang
 * LastEditTime: 2019/12/23 下午1:36:57
 */

import React from 'react';
import { connect } from 'dva';
import { Table, Button, Popconfirm, message, Input, Popover, Icon, Drawer, DatePicker, Select, Modal } from 'antd';
import moment from 'moment';

const Search = Input.Search;
const ButtonGroup = Button.Group;
const { Option } = Select;

function range(start, end) {
    const result = [];
    for (let i = start; i < end; i++) {
        result.push(i);
    }
    return result;
}

class OrderPage extends React.Component {
    state = {
        moreConditions: false,
        targetType: '',
        showStatus: '',
        createPartTime: null,
        endPartTime: null,
    }

    componentDidMount() {
        this.getOperationPartList()
        this.props.dispatch({
            type: 'orderPage/boxSearchList',
            payload: { groupId: 'PART_MANAGE_LIST' }
        })
    }

    getOperationPartList = () => {
        const { targetType, showStatus, createPartTime, endPartTime } = this.state
        if (createPartTime && endPartTime) {
            if (!endPartTime.isAfter(createPartTime)) {
                message.error('开始时间不能大于结束时间！')
                return
            }
        }
        this.props.dispatch({
            type: 'orderPage/getOperationPartList',
            payload: { targetType, showStatus, createPartTime: createPartTime ? createPartTime.format('YYYY-MM-DD hh:mm:ss') : '', endPartTime: endPartTime ? endPartTime.format('YYYY-MM-DD hh:mm:ss') : '' }
        }).then(() => {
            this.setState({
                moreConditions: false,
            })
        })
    }

    reset = () => {
        this.props.dispatch({
            type: 'orderPage/asyncUpdate',
            payload: {
                partTitle: ''
            }
        }).then(() => {
            this.setState({
                moreConditions: false,
                targetType: '',
                showStatus: '',
                createPartTime: null,
                endPartTime: null,
            }, this.getOperationPartList)
        })

    }

    pageChangeFun = ({ pageVo }) => {
        let { page, pageSize, current } = pageVo
        this.props.dispatch({
            type: 'orderPage/asyncUpdate',
            payload: {
                page,
                current,
                pageSize,
            }
        }).then(this.getOperationPartList)
    }

    delOperationPart = (partCode) => {
        this.props.dispatch({
            type: 'orderPage/delOperationPart',
            payload: {
                partCode: partCode,
            }
        })
    }
    //搜索框
    bannerSearch(value) {
        this.props.dispatch({
            type: 'orderPage/asyncUpdate',
            payload: {
                partTitle: value
            }
        }).then(this.getOperationPartList)
    }

    disabledDate(current) {
        // Can not select days before today and today
        return current && current < moment().endOf('day');
    }

    disabledRangeTime(_, type) {
        if (type === 'start') {
            return {
                disabledHours: () => range(0, 60).splice(4, 20),
                disabledMinutes: () => range(30, 60),
                disabledSeconds: () => [55, 56],
            };
        }
        return {
            disabledHours: () => range(0, 60).splice(20, 4),
            disabledMinutes: () => range(0, 31),
            disabledSeconds: () => [55, 56],
        };
    }

    addNewOne = () => {
        let { orderPage: { partData } } = this.props;
        let { partList = [] } = partData
        let SVIP_APP = false;
        let SVIP_HD = false;
        let svipExist = ''
        for (let i = 0; i < partList.length; i++) {
            if (partList[i].partStyle === 'SVIP') {
                partList[i].platformCode === 'APP' && (SVIP_APP = true)
                partList[i].platformCode === 'HD' && (SVIP_HD = true)
            }
        }

        if (SVIP_APP && SVIP_HD) {
            svipExist = 'YES'
        } else if (!SVIP_APP && SVIP_HD) {
            svipExist = 'HD'
        } else if (SVIP_APP && !SVIP_HD) {
            svipExist = 'APP'
        } else if (!SVIP_APP && !SVIP_HD) {
            svipExist = 'NO'
        }

        Modal.confirm({
            content: '选择推荐类型',
            okText: '图书',
            cancelButtonProps: { type: 'primary' },
            cancelText: '课程',
            onOk: () => {
                this.props.history.push(`/home/orderPage/book/0?svipExist=${svipExist}`)
            },
            onCancel: () => {
                this.props.history.push(`/home/orderPage/course/0?svipExist=${svipExist}`)
            },
        });
    }

    render() {
        const { loading, orderPage: { partData, partTitle, goodsTypeList, goodsStateList } } = this.props;
        const { partList = [], total = 0, currentPage = 0, pageSize } = partData
        const { targetType, showStatus, createPartTime, endPartTime } = this.state
        const columns = [{
            title: '推荐名称',
            width: 100,
            dataIndex: 'partTitle',
            key: 'partTitle',
            className: 'td_hide',
            render: (text, record) => {
                return (
                    <Popover
                        placement="top"
                        title={null}
                        content={
                            record.partTitle
                        }
                    >
                        <span>{record.partTitle}</span>
                    </Popover>
                )
            }
        }, {
            title: '推荐类型',
            width: 100,
            dataIndex: 'targetType',
            render: (text, record) => {
                return (
                    <div>
                        {record.targetType === "BOOK_DETAIL" ? "图书详情" :
                            (record.targetType === "H5" ? "H5页面" :
                                (record.targetType === "SYSTEM_INTERFACE" ? "系统界面" :
                                    (record.targetType === "COURSE_DETAIL" ? "课程详情" :
                                        (record.targetType === "COURSE_LIST" ? "课程列表" :
                                            (record.targetType === "BOOK_LIST" ? '图书列表页' : '')))))
                        }
                    </div>
                )
            }
        },
        {
            title: '平台',
            width: 100,
            className: 'td_hide',
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
                    <span title={_platformCode}>{_platformCode}</span>
                )
            }
        },
        {
            title: '渠道',
            width: 100,
            render: (text, record) => {
                let curCode = record.channelCodes.split("/");
                let _channelCodes = curCode.length > 3 ? curCode.slice(0, 3).join("/") + "..." : record.channelCodes;
                return (
                    <span title={record.channelCodes}>{_channelCodes}</span>
                )
            }
        },
        {
            title: '修改时间',
            width: 150,
            dataIndex: 'updateTime',
            key: 'updateTime'
        }, {
            title: '图书数量',
            width: 100,
            dataIndex: 'partSourceNum',
            key: 'partSourceNum'
        }, {
            title: '链接文字',
            width: 100,
            dataIndex: 'targetDesc',
            render: (text, record) => {
                return (
                    <div>
                        {record.targetDesc}
                    </div>

                )
            }
        },
        {
            title: '状态',
            width: 100,
            dataIndex: 'showStatus',
            render: (showStatus) => {
                return <div>
                    {showStatus === "SHOW_ON" ? <span>已上线</span> : <span>未上线</span>}
                </div>
            }
        },

        {
            title: '操作',
            width: 100,
            render: (text, record, index) => {
                let recommendType = record.partSource === 'ella.book.listCourse' ? 'course' : 'book';
                return (
                    <ButtonGroup>
                        <Button size='small' type="primary" icon="form" onClick={() => { this.props.history.push(`/home/orderPage/${recommendType}/${record.partCode}`) }}></Button>
                        {record.partStyle !== 'SVIP' && <Popconfirm title="确定要删除吗?" onConfirm={() => { record.showStatus === 'SHOW_ON' ? message.warning('该模块已展示，不能被删除') : this.delOperationPart(record.partCode) }}>
                            <Button title={record.showStatus === 'SHOW_ON' ? '需要首先在「首页管理」中将对应条目内容删除，才能对内容进行删除操作' : null} size='small' type="primary" icon="delete"></Button>
                        </Popconfirm>}
                    </ButtonGroup>

                )
            }
        }
        ];

        return (
            <div>
                <p className="m-title">推荐管理</p>
                <div className='m-condition-options'>
                    <Button className='m-condition-options-item' type="primary" icon="plus" onClick={this.addNewOne}>添加新推荐</Button>
                    <Search className='m-condition-options-item' placeholder="搜索" value={partTitle} onChange={(e) => {
                        this.props.dispatch({
                            type: 'orderPage/asyncUpdate',
                            payload: {
                                partTitle: e.target.value
                            }
                        })
                    }} enterButton style={{ width: 320 }} onSearch={value => this.bannerSearch(value)} />
                    <Button className='m-condition-options-item' type="primary" onClick={() => { this.setState({ moreConditions: true }) }}>
                        更多搜索条件
                    <Icon type="right" />
                    </Button>
                </div>
                <Table
                    rowKey={(record, index) => index}
                    size="small"
                    loading={loading}
                    columns={columns}
                    dataSource={partList}
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
                <Drawer
                    title="更多搜索条件"
                    placement="right"
                    width={400}
                    closable={false}
                    onClose={() => { this.setState({ moreConditions: false }) }}
                    visible={this.state.moreConditions}
                >
                    <div className='ant-form-item'>
                        <div className='ant-form-item-label'>
                            推荐名称
            </div>
                        <div className='ant-form-item-control-wrapper'>
                            <Input style={{ width: '100%' }} placeholder='请输入推荐名称' value={partTitle} onChange={(e) => {
                                this.props.dispatch({
                                    type: 'orderPage/asyncUpdate',
                                    payload: {
                                        partTitle: e.target.value
                                    }
                                })
                            }} />
                        </div>
                    </div>
                    <div className='ant-form-item'>
                        <div className='ant-form-item-label'>
                            创建时间
            </div>
                        <div className='ant-form-item-control-wrapper'>
                            <DatePicker.RangePicker
                                showTime={{
                                    hideDisabledOptions: true,
                                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                                }}
                                value={[createPartTime, endPartTime]}
                                format="YYYY-MM-DD HH:mm:ss"
                                onChange={(value) => {
                                    this.setState({
                                        createPartTime: value[0],
                                        endPartTime: value[1],
                                    })
                                }}
                            />
                        </div>
                    </div>
                    <div className='ant-form-item'>
                        <div className='ant-form-item-label'>
                            推荐类型
            </div>
                        <div className='ant-form-item-control-wrapper'>
                            <Select style={{ width: '100%' }} value={targetType} onChange={(value) => { this.setState({ targetType: value }) }}>
                                <Option value="">全部</Option>
                                {goodsTypeList.map(item => {
                                    return <Option value={item.searchCode} key={item.searchCode}>{item.searchName}</Option>
                                })}
                            </Select>
                        </div>
                    </div>
                    <div className='ant-form-item'>
                        <div className='ant-form-item-label'>
                            展示状态
            </div>
                        <div className='ant-form-item-control-wrapper'>
                            <Select style={{ width: '100%' }} value={showStatus} onChange={(value) => { this.setState({ showStatus: value }) }}>
                                <Option value="">全部</Option>
                                {goodsStateList.map(item => {
                                    return <Option value={item.searchCode} key={item.searchCode}>{item.searchName}</Option>
                                })}
                            </Select>
                        </div>
                    </div>
                    <div className='ant-form-item'>
                        <Button type="primary" block onClick={this.getOperationPartList}>
                            查询
            </Button>
                    </div>
                    <div className='ant-form-item'>
                        <Button type="danger" block onClick={this.reset}>
                            恢复默认
            </Button>
                    </div>
                </Drawer>
            </div>
        )
    }
}
export default connect(({ orderPage, loading }) => ({
    loading: loading.effects['orderPage/getOperationPartList'],
    orderPage
}))(OrderPage);

/*
* Author: zhangsongqiang
* Description: 左侧滑栏
* Date: 2019/12/27 下午1:31:27
* LastEditors: zhangsongqiang
* LastEditTime: 2019/12/27 下午1:31:27
*/

import React, { useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { Modal, Row, Col, DatePicker, Select, Button, Table, Input } from 'antd';
import { requestUrl, request, cacheManager } from '@/utils';

const { Search } = Input;
const Option = Select.Option;

const searchBookByConditions = function (args) {
    let { createBeginTime, createEndTime, bookPublish, authorCode, goodsSrcPrice, domainCode, goodsState, bookName, page, pageSize } = args
    return request(requestUrl.url, {
        body: "method=ella.operation.searchBookByConditions&content=" + JSON.stringify({
            "book": { "bookPublish": bookPublish || '', "bookName": bookName || '' },
            "goods": { "goodsSrcPrice": goodsSrcPrice || '', "goodsState": goodsState || 'SHELVES_ON' },
            "bookAuthorRelation": { "authorCode": authorCode || '' },
            "bookDomainRelation": { "domainCode": domainCode || '' },
            "createBeginTime": createBeginTime ? createBeginTime.format('YYYY-MM-DD hh:mm:ss') : "",
            "createEndTime": createEndTime ? createEndTime.format('YYYY-MM-DD hh:mm:ss') : "",
            "searchBoxType": "BOOK_NAME",
            "pageVo": { "page": page, "pageSize": pageSize },
        }) + '&uid=' + cacheManager.get('uid') + '&token=' + cacheManager.get('token'),
    })
}

const boxSearchList = function (args) {
    return request(requestUrl.url, {
        body: "method=ella.operation.boxSearchList&content=" + JSON.stringify({
            ...args
        }),
    })
}

const columns = [
    {
        title: '图书名称',
        width: 150,
        dataIndex: 'bookName',
    },
    {
        title: '上传时间',
        dataIndex: 'createTime',
    },
    {
        title: '价格',
        dataIndex: 'goodsSrcPrice',
        width: 100,
    },
    {
        title: '状态',
        width: 100,
        dataIndex: 'goodsState',
        render: (text, record) => {
            return <div>
                {text === 'SHELVES_WAIT' ? <span>待上架</span> : (
                    text === 'SHELVES_ON' ? <span>已上架</span> : <span>已下架</span>
                )}
            </div>
        }
    }
]



function MultiSelectBooks(props) {
    const [createBeginTime, setCreateBeginTime] = useState(null);
    const [createEndTime, setCreateEndTime] = useState(null);
    const [publishList, setPublishList] = useState([]);
    const [authorList, setAuthorList] = useState([]);
    const [goodsStateList, setGoodsStateList] = useState([]);
    const [goodsPriceList, setGoodsPriceList] = useState([]);
    const [bookDomainClassList, setBookDomainClassList] = useState([]);
    const [bookPublish, setBookPublish] = useState('');
    const [authorCode, setAuthorCode] = useState('');
    const [goodsState, setGoodsState] = useState('SHELVES_ON');
    const [goodsSrcPrice, setGoodsSrcPrice] = useState('');
    const [domainCode, setDomainCode] = useState('');
    const [bookName, setBookName] = useState('');
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(20);
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [bookData, setBookData] = useState({
        bookList: [],
        total: 0,
    });

    const selectedRowData = useRef([])

    const disabledStartDate = createBeginTime => {
        if (!createBeginTime || !createEndTime) {
            return false;
        }
        return createBeginTime.valueOf() > createEndTime.valueOf();
    };

    const disabledEndDate = createEndTime => {
        if (!createEndTime || !createBeginTime) {
            return false;
        }
        return createEndTime.valueOf() <= createBeginTime.valueOf();
    };

    const getPublishList = async function () {
        let result = await boxSearchList({
            "groupId": "operation.box.publishList", "type": "AUTO_BOX"
        })
        setPublishList(result.data || [])
    }

    const getOriginalAuthorList = async function () {
        let result = await boxSearchList({
            "groupId": "operation.box.getOriginalAuthorList", "type": "AUTO_BOX"
        })
        setAuthorList(result.data || [])
    }

    const getGoodsStateList = async function () {
        let result = await boxSearchList({
            "groupId": "GOODS_STATE", "type": "HAND_BOX"
        })
        setGoodsStateList(result.data || [])
    }

    const getGoodsPriceList = async function () {
        let result = await boxSearchList({
            "groupId": "GOODS_SRC_PRICE", "type": "HAND_BOX"
        })
        setGoodsPriceList(result.data || [])
    }

    const getBookDomainClassList = async function () {
        let result = await boxSearchList({
            "groupId": "operation.box.bookDomainClassList", "type": "AUTO_BOX"
        })
        setBookDomainClassList(result.data || [])
    }

    const getBookList = async function () {
        setLoading(true)
        let result = await searchBookByConditions({ createBeginTime, createEndTime, bookPublish, authorCode, goodsSrcPrice, domainCode, goodsState, bookName, page, pageSize })
        setBookData(result.data || {
            bookList: [],
            total: 0,
        })
        setLoading(false)
    }

    const reset = () => {
        setCreateBeginTime(null)
        setCreateEndTime(null)
        setBookPublish('')
        setAuthorCode('')
        setGoodsSrcPrice('')
        setDomainCode('')
        setGoodsState('SHELVES_ON')
    }

    useEffect(() => {
        getBookList()
    }, [page, pageSize, bookName]);

    return (
        <Modal
            title="添加图书"
            visible={props.visible}
            width={860}
            closable={false}
            onOk={() => {props.onChange(selectedRowData.current);setSelectedRowKeys([]);selectedRowData.current = [];props.onCancel() }}
            onCancel={props.onCancel}
        >
            <Row>
                <Col span={5}>
                    <div>
                        <div className='ant-form-item-label'>
                            上传时间
                        </div>
                        <div className='ant-form-item-control-wrapper' style={{ padding: '8px 0' }}>
                            <DatePicker
                                disabledDate={disabledStartDate}
                                format="YYYY-MM-DD"
                                value={createBeginTime}
                                placeholder="开始时间"
                                onChange={(value) => {
                                    setCreateBeginTime(value)
                                }}
                            />
                        </div>
                        <div className='ant-form-item-control-wrapper' style={{ padding: '8px 0' }}>
                            <DatePicker
                                disabledDate={disabledEndDate}
                                format="YYYY-MM-DD"
                                value={createEndTime}
                                placeholder="结束时间"
                                onChange={(value) => {
                                    setCreateEndTime(value)
                                }}
                            />
                        </div>
                    </div>
                    <div>
                        <div className='ant-form-item-label'>
                            出版社
                        </div>
                        <div className='ant-form-item-control-wrapper'>
                            <Select style={{ width: '100%' }} value={bookPublish} onFocus={() => { !publishList.length && getPublishList() }} onChange={(value) => { setBookPublish(value) }}>
                                <Option value=''>全部</Option>
                                {
                                    publishList.map(function (item) {
                                        return <Option value={item.uid} key={item.uid}>{item.businessTruename}</Option>
                                    })
                                }
                            </Select>

                        </div>
                    </div>
                    <div>
                        <div className='ant-form-item-label'>
                            作者
                        </div>
                        <div className='ant-form-item-control-wrapper'>
                            <Select style={{ width: '100%' }} value={authorCode} onFocus={() => { !authorList.length && getOriginalAuthorList() }} onChange={(value) => { setAuthorCode(value) }}>
                                <Option value=''>全部</Option>
                                {
                                    authorList.map(function (item) {
                                        return <Option value={item.authorCode} key={item.authorCode}>{item.authorName}</Option>
                                    })
                                }
                            </Select>

                        </div>
                    </div>
                    <div>
                        <div className='ant-form-item-label'>
                            状态
                        </div>
                        <div className='ant-form-item-control-wrapper'>
                            <Select style={{ width: '100%' }} value={goodsState} onFocus={() => { !goodsStateList.length && getGoodsStateList() }} onChange={(value) => { setGoodsState(value) }}>
                                <Option value='SHELVES_ON'>已上架</Option>
                                <Option value=''>全部</Option>
                                {
                                    goodsStateList.map(function (item) {
                                        if (item.searchCode !== "SHELVES_ON") {
                                            return <Option value={item.searchCode} key={item.searchCode}>{item.searchName}</Option>
                                        }
                                    })
                                }
                            </Select>

                        </div>
                    </div>
                    <div>
                        <div className='ant-form-item-label'>
                            价格
                        </div>
                        <div className='ant-form-item-control-wrapper'>
                            <Select style={{ width: '100%' }} value={goodsSrcPrice} onFocus={() => { !goodsPriceList.length && getGoodsPriceList() }} onChange={(value) => { setGoodsSrcPrice(value) }}>
                                <Option value=''>全部</Option>
                                {
                                    goodsPriceList.map(function (item, index) {
                                        return <Option value={item.searchName} key={index}>{item.searchName === '0.01' ? '免费' : item.searchName === '-1' ? '其他' : item.searchName}</Option>
                                    })
                                }
                            </Select>

                        </div>
                    </div>
                    <div>
                        <div className='ant-form-item-label'>
                            领域
                        </div>
                        <div className='ant-form-item-control-wrapper'>

                            <Select style={{ width: '100%' }} value={domainCode} onFocus={() => { !bookDomainClassList.length && getBookDomainClassList() }} onChange={(value) => { setDomainCode(value) }}>
                                <Option value=''>全部</Option>
                                {
                                    bookDomainClassList.map(function (item) {
                                        return <Option value={item.domainCode} key={item.domainCode}>{item.domainName}</Option>
                                    })
                                }
                            </Select>

                        </div>
                    </div>
                    <div className='ant-form-item' style={{ marginTop: '20px' }}>
                        <Button type="primary" block onClick={getBookList}>
                            查询
                        </Button>
                    </div>
                    <div className='ant-form-item'>
                        <Button type="danger" block onClick={reset}>
                            恢复默认
                        </Button>
                    </div>
                </Col>
                <Col span={18} offset={1}>
                    <Search
                        style={{ marginBottom: '20px' }}
                        placeholder='搜索'
                        enterButton
                        onSearch={text => {
                            setBookName(text)
                            setPage(0)
                            setPageSize(20)
                        }}
                    />
                    <Table
                        rowKey='bookCode'
                        size="small"
                        rowSelection={{
                            selectedRowKeys: selectedRowKeys,
                            onChange: (selectedRowKeys) => {
                                setSelectedRowKeys(selectedRowKeys)
                            },
                            onSelect: (record, selected) => {
                                if (selected) {
                                    props.type === 'radio' ? selectedRowData.current[0] = record : selectedRowData.current.push(record)
                                } else {
                                    let selectedRowData_current = selectedRowData.current
                                    selectedRowData_current.map((item, index) => {
                                        item.bookCode === record.bookCode && selectedRowData.current.splice(index, 1)
                                    })
                                }
                            },
                            onSelectAll: (selected, selectedRows, changeRows) => {
                                if (selected) {
                                    selectedRowData.current.push(...changeRows)
                                } else {
                                    selectedRowData.current = selectedRowData.current.reduce((total, current) => {
                                        let flag = false
                                        for (let i = 0; i < changeRows.length; i++) {
                                            if (current.bookCode === changeRows[i].bookCode) {
                                                flag = true
                                            }
                                        }
                                        if (!flag) {
                                            total.push(current)
                                        }
                                        return total;
                                    }, [])
                                }
                            },

                            type: props.type || 'checkbox'
                        }}
                        loading={loading}
                        columns={columns}
                        dataSource={bookData.bookList || []}
                        bordered
                        scroll={{ y: 500 }}
                        onChange={(pagination) => {
                            setPage(pagination.current - 1)
                            setPageSize(pagination.pageSize)
                        }}

                        pagination={{
                            total: bookData.total,
                            size: "small",
                            current: page + 1,
                            pageSize,
                            showSizeChanger: true,
                            showQuickJumper: true
                        }}
                    />
                </Col>
            </Row>

        </Modal>
    )
}

export default withRouter(MultiSelectBooks)

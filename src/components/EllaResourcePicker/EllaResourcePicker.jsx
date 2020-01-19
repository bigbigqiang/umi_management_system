import React, { PureComponent } from 'react';
import { Input, Modal, Table } from 'antd';
import { requestUrl, request } from '@/utils';
import _ from 'lodash';
const { Search } = Input;

export default class EllaResourcePicker extends PureComponent {
    state = {
        modalShow: false,
        selectedResult: null,
        selectedRowKeys: null,
        selectedRow: [],
        dataSource: [],
        total: 10,
        loading: false
    };

    componentDidMount() {
        const { value, onChange } = this.props;
        if (_.get(value, '[0].id') === undefined) {
            onChange(null);
        }
    }

    componentWillReceiveProps(nextProps) {
        nextProps.modalShow && this.getList({
            page: 0,
            pageSize: 10,
        })
    }

    getList = args => {
        let { meta, dataPath, api } = this.props
        this.setState({
            loading: true
        })
        request(requestUrl.url, {
            body: `method=${api}&content=${JSON.stringify({
                ...meta,
                ...args,
            })}`
        }).then(res => {
            this.setState({
                dataSource: _.get(res, dataPath),
                total: _.get(res, 'data.total', 10),
                loading: false
            });
        });
    };

    render() {
        const {
            // value, // 默认值
            type, // checkbox or radio
            onChange, // 在Form中默认有onChange，此外情况，需要自己提供onChange方法，获取资源选择器的回调
            // api, // 资源接口地址
            // meta, // 接口附带数据
            // dataPath, // 返回数据，取参格式
            columns, // 选择器列表
            formatter, // 选择器结果过滤，{result},这个结果主要是为了提供给表单值
            searchName, // 搜索使用字段,单条件用字符串，多条件用数组['name','bookName']
            title, // 显示用
            placeHolder,
            modalShow, //是否显示modal
        } = this.props;

        let pickerOnChange = onChange;

        const { loading } = this.state

        // rowSelection object indicates the need for row selection
        const rowSelection = {
            type: type || 'radio',
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                let selectedResult = selectedRows.map(item => {
                    let result = {};
                    for (let key in formatter) {
                        result[key] = item[formatter[key]];
                    }
                    return result;
                });

                this.setState({
                    selectedRowKeys: selectedRowKeys,
                    selectedRows: selectedRows,
                    selectedResult,
                });

            },
        };

        return (
            <Modal
                title={title}
                width={800}
                destroyOnClose={true}
                visible={modalShow}
                onCancel={() => {
                    this.props.showModal(false)
                }}
                onOk={() => {
                    pickerOnChange(this.state.selectedResult, this.state.selectedRows);
                    this.setState({
                        selectedResult: null,
                        selectedRowKeys: [],
                        selectedRow: [],
                    });
                    this.props.showModal(false)
                }}
            >
                <Search
                    placeholder={placeHolder}
                    onSearch={text => {
                        let args = {
                            page: 1,
                            pageSize: 10,
                        };

                        if (typeof searchName === 'string') {
                            args[searchName] = text;
                        } else {
                            searchName.map(item => {
                                args[item] = text;
                            });
                        }

                        this.getList(args);
                    }}
                />
                <Table
                    size="small"
                    rowKey="id"
                    loading={loading}
                    columns={columns || []}
                    dataSource={this.state.dataSource}
                    rowSelection={rowSelection}
                    pagination={{
                        total: this.state.total,
                        onChange: (page, pageSize) => {
                            // this.getList({ page, pageSize });
                        },
                        onShowSizeChange: (page, pageSize) => {
                            // this.getList({ page, pageSize });
                        },
                    }}
                />
            </Modal>
        );
    }
}

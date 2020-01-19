/* 
* Author: zhangsongqiang
* Description: 登录页
* Date: 2019-11-25 13:55:15
* LastEditors: zhangsongqiang
* LastEditTime: 2019-11-25 13:55:15
*/

import React from 'react';
import { router } from 'umi';
import { Form, Icon, Input, Button, message } from 'antd';
import md5 from 'md5';
import { requestUrl, request } from '@/utils';
import { cacheManager } from '@/utils';

import style from "./resetPassword.less";


function resetPassword_service(args) {
    return request(requestUrl.url, {
        body: "method=ella.user.resetPassword&content=" + JSON.stringify({
            ...args
        }),
    })
}

function ResetPassword(props) {
    const { getFieldDecorator } = props.form;

    const handleSubmit = e => {
        e.preventDefault();
        props.form.validateFields((err, values) => {
            if (!err) {
                if (values.new_password !== values.password_again) {
                    message.error('新密码输入不同，请重新输入!');
                    return
                }
                resetPassword(values)
            }
        });
    };

    let resetPassword = async function (values) {
        let { new_password, password } = values

        let result = await resetPassword_service({
            password: md5(password),
            newPassword: md5(new_password),
            uid: cacheManager.get('uid'),
            channelCode: "BSS"
        })

        if (result) {
            message.success('密码修改成功!')
            router.push('/');
        }
    }

    return (
        <div className={style.container} >
            <div className={style.main} style={{ textAlign: 'center' }}>
                <Form onSubmit={handleSubmit} className="login-form">
                    <h1 style={{ color: '#fff' }}>修改密码</h1>
                    <Form.Item>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: '旧密码不能为空！' }],
                        })(
                            <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="输入旧密码"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('new_password', {
                            rules: [{ required: true, message: '新密码不能为空！' }],
                        })(
                            <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="输入新密码"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('password_again', {
                            rules: [{ required: true, message: '新密码不能为空！' }],
                        })(
                            <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="再次输入新密码"
                            />,
                        )}
                    </Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: 300 }}>
                        确定
                    </Button>
                </Form>
            </div>

        </div>
    )
}

export default Form.create({ name: 'ResetPassword' })(ResetPassword)
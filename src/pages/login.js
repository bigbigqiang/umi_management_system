/* 
* Author: zhangsongqiang
* Description: 登录页
* Date: 2019-11-25 13:55:15
* LastEditors: zhangsongqiang
* LastEditTime: 2019-11-25 13:55:15
*/

import React, { useState, useEffect, useRef } from 'react';
import { router } from 'umi';
import { message } from 'antd';
import md5 from 'md5';
import { requestUrl, request } from '@/utils';
import { cacheManager } from '@/utils';

import style from "./login.less";


function login_service(args) {
    return request(requestUrl.url, {
        body: "method=ella.user.login&content=" + JSON.stringify({
            ...args
        }),
    })
}

export default function () {
    const [userName, setUserName] = useState('');
    const [passWord, setPassWord] = useState('');
    const [showTuFlag, useShowTuFlag] = useState(false);

    const login_btn = useRef(null)

    useEffect(() => {
        setTimeout(() => {
            useShowTuFlag(true)
        }, 1000);
    });

    let login = async function () {
        login_btn.current.style.cssText = 'background-color: #23AD43;color: #03300D';
        setTimeout(function () {
            login_btn.current.style.cssText = 'background-color: #26C14B;color: white';
        }, 200)
        if (!userName) {
            message.error('手机号不能为空');
            return
        }
        if (!/^1[3|4|5|6|7|8|9][0-9]{9}$/.test(userName)) {
            message.error('手机号格式不正确');
            return
        }
        if (!passWord) {
            message.error('密码不能为空');
            return
        }

        let result = await login_service({
            customerName: userName,
            password: md5(passWord),
            channelCode: "BSS"
        })

        if (result) {
            let timestampNow = new Date().getTime();
            cacheManager.set({
                flag: '1',
                uid: result.data.uid,
                name: result.data.name,
                loginTime: timestampNow,
                token: result.data.token,
            })
            message.success('登陆成功!')
            router.push('/');
        }
    }

    let keyup = (e) => {
        let keyNum = window.event ? e.keyCode : e.which;
        if (keyNum === 13) {
            login();
        }
    }

    return (
        <div className={style.loginContainer} onKeyUp={(e) => { keyup(e) }}>
            {showTuFlag ? <div className={style.main}>
                <div className={style.logo} ></div>
                <div className={style.inputOut} >
                    <input type="text" value={userName} className={style.userName} placeholder="账号" autoComplete="phone" maxLength="11" onChange={(e) => { setUserName(e.target.value) }} />
                </div>
                <div className={style.inputOut} >
                    <input type="password" value={passWord} className={style.passWord} placeholder="密码" autoComplete="new-password" onChange={(e) => { setPassWord(e.target.value) }} />
                </div>
                <button className={style.loginBtn} ref={login_btn} onClick={login}>登录</button>
            </div> : <div className={style['m-wrap-loading']}>
                    <div className={style.rect1}></div>
                    <div className={style.rect2}></div>
                    <div className={style.rect3}></div>
                    <div className={style.rect4}></div>
                    <div className={style.rect5}></div>
                </div>}
        </div>
    )
}
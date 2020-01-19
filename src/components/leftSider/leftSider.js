/*
* Author: jinhui
* Description: 左侧滑栏
* Date: 2019-06-14 14:58:15
* LastEditors: zhangsongqiang
* LastEditTime: 2019-11-25 11:25:32
*/

import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Menu, Icon } from 'antd';
import Link from 'umi/link';
import { requestUrl, cacheManager, request } from '@/utils';

const SubMenu = Menu.SubMenu;

const RedirectRouter = {
  '/adBanner': '/home/adBanner',
  '/index': '/home/index',
  '/recommend': '/home/recommend',
  '/remittance': '/home/remittance',
  '/popularsearch': '/home/popularsearch',
  '/bookSubject': '/home/bookSubject',
  '/orderPage': '/order/orderPage',
}

const getLeftMenu = function (args) {
  return request(requestUrl.url, {
    body: "method=ella.operation.findUserLeftMenu&content=" + JSON.stringify({
      ...args
    }),
  })
}

function LeftSider(props) {
  const [current_menu_code, setCurrent_menu_code] = useState(null);
  const [subMenu, setSubMenu] = useState([]);

  useEffect(() => {
    cacheManager.get('uid') && findUserLeftMenu()
  }, []);

  let findUserLeftMenu = async function () {
    let result = await getLeftMenu({
      uid: cacheManager.get('uid')
    })
    if (result) {
      let _openKeys = [];
      let _current_menu_code = null;

      let _subMenu = result.data.filter((item) => {
        return item.menuLevel === '1';
      });
      let secondMenuList = result.data.filter((item) => {
        return (item.menuLevel === '2' && item.menuName !== '勋章管理');
      });
      _subMenu.forEach(element => {
        element.children = secondMenuList.filter(Item => Item.parentCode === element.menuCode);
      })
      if (props.location.pathname === '/') {
        _openKeys = []
      } else {
        if (cacheManager.get('current_menu_code')) {
          let currentKeys = secondMenuList.filter(Item => Item.menuCode === cacheManager.get('current_menu_code'))
          if (currentKeys.length) {
            _openKeys = [currentKeys[0].parentCode];
            _current_menu_code = currentKeys[0].menuCode;
          } else {
            _openKeys = [];
            _current_menu_code = null
          }
        }
      }
      setCurrent_menu_code(_current_menu_code)
      setSubMenu(_subMenu)
      props.setOpenKey(_openKeys)
    }
  }

  function setOperationType(operationType, key) {
    setCurrent_menu_code(key)
    cacheManager.set({ current_menu_code: key, operationType: operationType })
  }

  function onOpenChange(openKeys) {
    const latestOpenKey = openKeys.find(key => props.openKeys.indexOf(key) === -1);
    let flag = true;
    for (let i = 0; i < subMenu.length; i++) {
      if (subMenu[i].menuCode === latestOpenKey) {
        flag = false
        break;
      }
    }
    if (flag) {
      props.setOpenKey(openKeys)
    } else {
      props.setOpenKey(latestOpenKey ? [latestOpenKey] : [])
    }
  }

  function redirect(menuAddress) {
    return menuAddress in RedirectRouter ? RedirectRouter[menuAddress] : menuAddress
  }

  return (
    <Menu theme="dark"
      openKeys={props.openKeys}
      onOpenChange={onOpenChange}
      selectedKeys={[current_menu_code]}
      mode="inline" >
      {
        subMenu.map(item =>
          <SubMenu key={item.menuCode} title={<span><Icon type={item.menuIcon} /><span>{item.menuName}</span></span>}>
            {
              item.children.map(element =>
                <Menu.Item key={element.menuCode} >
                  <Link to={redirect(element.menuAddress)}
                    onClick={(e) => { setOperationType(element.operationType, element.menuCode) }}>{element.menuName}</Link></Menu.Item>)
            }
          </SubMenu>
        )
      }
    </Menu>
  )
}

export default withRouter(LeftSider)

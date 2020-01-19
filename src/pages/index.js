// /*
//  * Author: jinhui
//  * Description:
//  * Date: 2019-08-13 11:33:20
//  * LastEditors: jinhui
//  * LastEditTime: 2019-09-11 09:56:59
//  */
// import React from 'react';
// import { Menu, Icon, Layout, LocaleProvider } from 'antd';
// import zhCN from 'antd/lib/locale-provider/zh_CN';
// import LeftSider from '@/components/leftSider/leftSider';
// import ResetPassword from '@/components/resetPassword';
// import style from './index.less';
// const { Header, Sider, Content } = Layout;
// const SubMenu = Menu.SubMenu;

// export default class Home extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       collapsed: false,
//       current: '',
//       username: '',
//       userUid: "",
//       resetpwdFlag: false,
//       resetpwdHtml: "",
//       loginFlag: true,
//       openKeys: []
//     }
//     //解决绑定事件，指针指向元素而无法调组件this
//     this.onClick = this.onClick.bind(this);
//     this.toggle = this.toggle.bind(this);
//     this.setOpenKey = this.setOpenKey.bind(this);
//   }
//   componentDidMount() {
//     if (localStorage.getItem("name") != null && localStorage.getItem("name") != "" && localStorage.getItem("name") != undefined) {
//       this.setState({
//         username: localStorage.getItem("name"),
//         userUid: localStorage.getItem("uid"),
//       })
//     }
//   }
//   onClick(key) {
//     if (key.key == "psd" && this.state.resetpwdFlag == false) {
//       this.setState({
//         resetpwdFlag: true
//       })
//     } else if (key.key == "quit") {
//       localStorage.clear();
//       window.location.href = window.location.origin + window.dirPath + 'FunBook'
//     } else if (key.key = 'changePro') {
//       window.location.href = window.location.origin + window.dirPath + 'FunBook'
//     }
//   }

//   toggle() {
//     this.setState({
//       collapsed: !this.state.collapsed,
//       openKeys: this.state.collapsed ? this.state.openKeys : []
//     });
//   }
//   setOpenKey(value) {
//     this.setState({
//       openKeys: value
//     });
//   }

//   ziChange(num) {
//     if (num == 0) {
//       this.setState({
//         resetpwdFlag: false
//       })
//     }
//   }
//   render() {
//     return (
//       <LocaleProvider locale={zhCN}>
//         <div style={{ width: '100%', height: '100%' }}>
//           {this.state.resetpwdFlag && <ResetPassword ziChange={num => this.ziChange(num)} />}
//           {this.state.loginFlag && <Layout className={style.layoutTrigger} style={{ minHeight: '100%' }}>
//             <Sider
//               trigger={null}
//               collapsible
//               style={{ backgroundColor: '#373d41' }}
//               collapsed={this.state.collapsed}
//             >
//               <div className={this.state.collapsed ? style.logoSmall : style.logo} />
//               <LeftSider openKeys={this.state.openKeys} setOpenKey={this.setOpenKey} />
//             </Sider>
//             <Layout>
//               <Header style={{ padding: 0, backgroundColor: '#373d41' }}>
//                 <Icon
//                   className='trigger'
//                   type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
//                   onClick={this.toggle}
//                 />
//                 <Menu theme="dark" mode="horizontal" onClick={this.onClick} style={{ height: '48px', lineHeight: '48px', float: 'right', width: '160px', backgroundColor: '#373d41' }}>
//                   <SubMenu title={<span style={{ color: "#fff" }} ><Icon type="setting" />{this.state.username}</span>}>
//                     <Menu.Item key="changePro">切换产品</Menu.Item>
//                     {/* <Menu.Item key="psd">修改密码</Menu.Item> */}
//                     <Menu.Item key="quit">退出</Menu.Item>
//                   </SubMenu>
//                 </Menu>
//               </Header>
//               <Content>
//                 {this.props.children}
//               </Content>
//             </Layout>
//           </Layout>}
//         </div>
//       </LocaleProvider>
//     )
//   }
// }

/*
 * Author: jinhui
 * Description: 欢迎页
 * Date: 2019-06-14 15:13:03
 * LastEditors: jinhui
 * LastEditTime: 2019-08-01 14:42:49
 */

const Free = () => {
  return (
      <div style={{ padding: 50 }}>
          欢迎进入运营系统！
    </div>
  );
}
export default Free;



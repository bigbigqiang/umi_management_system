import React from 'react';
import { router } from 'umi';
import zhCN from 'antd/es/locale/zh_CN';
import { Layout, Icon, ConfigProvider, Menu } from 'antd';
import LeftSider from '@/components/leftSider/leftSider';
import styles from './index.less';
import { cacheManager } from '@/utils';

const { Header, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;
class BasicLayout extends React.Component {
  state = {
    collapsed: false,
    broken: false,
    username: '',
    openKeys: [],
  };

  currentOpenKeys = [] // 解决展开情况下，变成小菜单，展开菜单跳出容器外的问题

  componentWillMount(){
    if(this.props.location.pathname !== 'login' && !(cacheManager.get('uid') && cacheManager.get('token'))){
      router.push('/login')
    }
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
      openKeys: !this.state.collapsed ? [] : this.currentOpenKeys,
    });
  };

  setOpenKey(value) {
    this.setState({
      openKeys: value, 
    });
    this.currentOpenKeys = value
  }

  headerMenuChange(key) {
    if (key.key === "psd") {
      console.log("psd")
      router.push('/resetPassword')
    } else if (key.key === "quit") {
      cacheManager.clear();
      router.push('/login')
    }
  }

  render() {
    if (this.props.location.pathname === '/login' || this.props.location.pathname === '/resetPassword') {
      return <div>{this.props.children}</div>
    }
    return (
      <ConfigProvider locale={zhCN}>
        <Layout style={{ height: '100%' }}>
          <Sider
            breakpoint="lg"
            collapsedWidth={this.state.broken ? '0' : '80'}
            trigger={null}
            collapsible
            collapsed={this.state.collapsed}
            onBreakpoint={broken => {
              console.log('broken', broken);
              this.setState({
                broken: broken,
              });
            }}
            onCollapse={(collapsed, type) => {
              console.log(collapsed, type);
              this.setState({
                collapsed: collapsed,
              });
            }}
          >
            <div className={this.state.collapsed ? styles.logo_small : styles.logo} />
            <LeftSider openKeys={this.state.openKeys} setOpenKey={this.setOpenKey.bind(this)} />
          </Sider>
          <Layout>
            <Header style={{ background: '#fff', padding: 0, boxShadow: '0 1px 4px rgba(0, 21, 41, 0.08)',position: 'relative'}}>
              <Icon
                className={styles.trigger}
                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={this.toggle}
              />
              <Menu mode="horizontal" onClick={this.headerMenuChange} style={{ marginTop: '8px', float: 'right', }}>
                <SubMenu title={<span ><Icon type="setting" />{ cacheManager.get('name')}</span>}>
                  <Menu.Item key="psd">修改密码</Menu.Item>
                  <Menu.Item key="quit">退出</Menu.Item>
                </SubMenu>
              </Menu>
            </Header>
            <Content style={{ background: '#fff'}}>
              <div style={{ padding: 12, background: '#fff', minHeight: 360 }}>{this.props.children}</div>
            </Content>
            
          </Layout>
        </Layout>
      </ConfigProvider>

    );
  }
}

export default BasicLayout;




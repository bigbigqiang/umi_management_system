/*
 * Author: zhangsongqiang
 * Description: 添加banner图
 * Date: 2019/12/23 下午3:12:00
 * LastEditors: zhangsongqiang
 * LastEditTime: 2019/12/23 下午3:12:00
 */
import React from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import { Input, Button, message, Form, Select, Checkbox, Icon, Divider, DatePicker, Modal } from 'antd';
import { EllaUploader } from '@/components/EllaUploader';
import ReactUeditor from '@/components/ueditor';
import { fetch } from 'dva';
import { requestUrl, dataString } from '@/utils';
import styles from "./editDaily.less";
import moment from 'moment'
const { TextArea } = Input;
const ButtonGroup = Button.Group;

const Option = Select.Option;

class EditDaily extends React.Component {
  state = {
    goodsType: 'BOOK',
    previewSrc: '',
    dailyContent: '',
    visible: false
  }

  dailyCode = ''
  dailyContent = ''

  componentDidMount() {
    let { dailyCode } = this.props.computedMatch.params
    this.dailyCode = dailyCode === '0' ? '' : dailyCode
    this.getBookList()
    !!this.dailyCode && this.props.dispatch({
      type: 'editDaily/getDailyInfo',
      payload: { dailyCode: this.dailyCode }
    }).then((data) => {
      let dailyContent = data.dailyContent ? decodeURIComponent(data.dailyContent) : ''
      this.setState({
        dailyContent,
        goodsType: data.goodsType || 'BOOK'
      })
      this.dailyContent = dailyContent
    })
  }

  getBookPackageList = () => {
    this.props.dispatch({
      type: 'editDaily/goodsManageList',
      payload: { "goodsManageSearchType": "goodsName", "searchContent": "", "goodsState": "SHELVES_ON", "goodsType": "BOOK_PACKAGE", "availableBookPackage": "YES", "page": 0, "pageSize": 2000 }
    })
  }

  getBookList = () => {
    this.props.dispatch({
      type: 'editDaily/getBookListByIdOrName',
      payload: { "text": '', "pageSize": 2000, "type": "SEARCH_ALL" }
    })
  }

  getBoxSearchList(groupId) {
    this.props.dispatch({
      type: 'editDaily/boxSearchList',
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

  preview() {
    const { form, editDaily: { bookList, bookPackageList } } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.getTargetPage(values, bookList, bookPackageList).then(previewSrc => {
        this.setState({
          previewSrc,
          visible: true
        })
      })
    });
  }

  async getTargetPage(values, bookList, bookPackageList) {
    let { dailyTitle, bookCode, dailyImg, authorName, effectDate, isShowDailyImg } = values
    let { goodsType, } = this.state
    let bookSelectList = []
    bookCode.map((item) => {
      let bookItem
      if (goodsType === 'BOOK') {
        bookItem = bookList.find(el => el.bookCode === item)
        if (bookItem && bookItem.bookIntroduction) {
          bookItem.bookIntroduction = encodeURI(bookItem.bookIntroduction.replace(/'/g, '&apos;'))
        }
        if (bookItem && bookItem.tags) {
          bookItem.tags = encodeURI(bookItem.tags.replace(/'/g, '&apos;'))
        }
      } else {
        bookItem = bookPackageList.find(el => el.bookCode === item)
      }
      bookItem && bookSelectList.push(bookItem)
    })
    let sHtmlCode = ''
    let titleImgSrc = isShowDailyImg ? "<img class='coverImg' src=" + dailyImg + " alt='推荐图书' />" : "";
    if (goodsType === 'BOOK') {
      sHtmlCode = "<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><meta name='format-detection' content='telephone=no'><meta name='apple-mobile-web-app-capable' content='yes'><meta name='apple-mobile-web-app-status-bar-style' content='black'><meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0,minimum-scale=1.0'><title>每日读绘本</title><script src='https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js'></script><style type='text/css'>    html {      font-family: 'Helvetica Neue', Helvetica, sans-serif;      -webkit-text-size-adjust: 100%;      -webkit-tap-hightlight-color: transparent;      -webkit-user-select: none;      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);    }    body {      overflow-x: hidden;      -webkit-overflow-scrolling: touch;      font-size: 0.3rem;      background-color: #f6f6f6;    }    * {      margin: 0;      padding: 0;      -webkit-box-sizing: border-box;      box-sizing: border-box;    }    ul,    li {      list-style: none;    }    a {      display: block;      width: 100%;      text-decoration: none;      color: #666;    }    .clearfix {      position: relative;    }    .clearfix:after {      content: '';      display: block;      width: 100%;      height: 0;      clear: both;    }    #wrapper {      width: 100%;     max-width:729px;   margin: 0 auto;      padding: 24px;      color: #434345;    }    #wrapper .info {      padding: 5px 0;      font-size: 12px;    }    #wrapper .title {            font-size: 24px;      padding-bottom: 5px;      font-weight: bold;    }    #wrapper .time,    #wrapper .author {      padding-left: 5px;      color: #999;    }    #wrapper .author {      color: #6a95c1;    }    #wrapper .content {      color: #676769;      padding-top: 0.5rem;      font-size: 14px;    }    #wrapper .content img {      max-width: 100%;    }    #wrapper .cover .coverImg {      display: block;      max-width: 100%;      margin: 5px auto 0;    }    #wrapper .recommend {      padding-top: 10px;    }    #wrapper .recommend .item {      margin-top: 20px;      padding: 12px 12px 6px 11px;      position: relative;      background-color: white;      box-shadow: 1px 2px 3px #eee;    }    #wrapper .recommend .item .label {            overflow: hidden;      height: 27px;      font-size: 13px;    }    #wrapper .recommend .item .label>i {      color: #AAAAAA;      border: 1px solid #D8D8D8;      border-radius: 20px;      padding: 2px 5px;      margin-right: 2px;      font-style: normal;      display: inline-block;      margin-bottom: 50px;            font-size: 12px;    }    #wrapper .recommend .bookCover {      float: left;      width: 35%;      display: block;          }    #wrapper .recommend .bookRight {      float: right;      width: 65%;      padding: 0 0 0 15px;    }    #wrapper .recommend .bookRight .titleH3 {      font-size: 16px;      font-weight: normal;      margin-bottom: 2px;            font-weight: normal;      margin-bottom: 5px;      text-overflow: ellipsis;      white-space: nowrap;      overflow: hidden;      color: #333333;    }    #wrapper .recommend .bookRight .synopsis {                  font-size: 12px;            display: -webkit-box;      -webkit-box-orient: vertical;      -webkit-line-clamp: 3;      overflow: hidden;      color: #888;    }    #wrapper .recommend .bookRight .details {           width:98px; float:right;margin-top:15px;      background:#40D8B1;      padding: 5px 20px;      border-radius: 20px;      color: #fff;      font-size: 14px;      display: block;    }    .btn_share_Wrap {      width: 100%;      text-align: center;      padding: 80px 0px 120px 0px;    }    #btn_share {      border: 0px solid #40d8b0;      color: #40d8b0;      background-color: rgba(0, 0, 0, 0);      background-image: url(http://download.ellabook.cn/btn.png); background-repeat:no-repeat;     background-size: 100%;      width:267px;      height: 73px;      text-align: center;      line-height: 40px;      border-radius: 5px; outline: none;   }</style><script type='text/javascript'>    // document.documentElement.style.fontSize = document.documentElement.clientWidth / 10 + 'px';    document.title = '每日读绘本';</script></head><body><div id='wrapper'><header class='title'>" +
        dailyTitle + "</header><figure class='info'><span class='time'>" +
        effectDate.format('YYYY-MM-DD HH:mm:ss').split(" ")[0] + "</span><span class='author'>" +
        authorName.replace(/"/g, '&quot;') + "</span></figure><article><section class='cover'>        " +
        titleImgSrc + "</section><section class='content'>        " +
        decodeURIComponent(this.dailyContent) +
        "</section><section class='recommend'><ul id='itemContent'></ul></section></article><div class='btn_share_Wrap'><button id='btn_share'></button></div></div><script type='text/javascript'>    $(function () {      var list = " +
        JSON.stringify(bookSelectList).replace(/\"/g, '\'') + ";      for (var i = 0; i< list.length; i++) {        var obj = list[i];        var li = $('<li></li>'),          a = $('<a></a>'),          img = $('<img src=' + list[i].bookResourceList[0].ossUrl + ' />'),          div = $('<div></div>'),          h3 = $('<h3>' + list[i].bookName + '</h3>'),          ul = $('<ul></ul>'),          p = $('<p>' + decodeURI(list[i].bookIntroduction) + '</p>'),          span = $('<span>查看详情</span>');        $(h3).appendTo($(div));        $(ul).appendTo($(div));        $(p).appendTo($(div));        $(span).appendTo($(div));        $(div).appendTo($(a));        $(img).appendTo($(a));        $(a).appendTo($(li));        $('#itemContent').append($(li));        $('#itemContent li').addClass('item');        $('#itemContent li a').addClass('clearfix');        $('#itemContent li a').eq(i).attr({          id: 'Link',          href: 'ellabook2://detail.book?bookCode=' + obj.bookCode + '&method=ella.book.getBookByCode'        });        $('#itemContent li a img').addClass('bookCover');        $('#itemContent li a div').addClass('bookRight');        $('#itemContent li a div h3').addClass('titleH3');        $('#itemContent li a div ul').addClass('label');        $('#itemContent li a div p').addClass('synopsis');        $('#itemContent li a div span').addClass('details');        if(obj.tags!=''){var tagsH = obj.tags.split(',');        for (var j = 0; j< tagsH.length; j++) {          var tagHtml = $('<i>' + decodeURI(tagsH[j]) + '</i>');          $('.label').eq(i).append($(tagHtml));      }  }      }      $('.clearfix').bind('click', function () {        routeToTargetPage(this)      });      $('#btn_share').bind('click', function () {        routeToTargetPage2();      });      function routeToTargetPage2() {        var u = navigator.userAgent;        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;        if (isAndroid) {          window.WebView.showSharePop(decodeURIComponent(decodeURIComponent(window.location.href)));        } else {          window.webkit.messageHandlers.showSharePop.postMessage(decodeURIComponent(decodeURIComponent(window.location.href)));        }      }      function routeToTargetPage(_this) {        var href = _this.href;        console.log(href);        var u = navigator.userAgent;        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;        if (isAndroid) {          window.WebView.routeToTargetPage(href);          _this.href = 'javascript:void(0)';          setTimeout(function () {            _this.href = href;          }, 50)        }      }    })</script></body></html>"
    } else {
      sHtmlCode = "<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><meta name='format-detection' content='telephone=no'><meta name='apple-mobile-web-app-capable' content='yes'><meta name='apple-mobile-web-app-status-bar-style' content='black'><meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0,minimum-scale=1.0'><title>每日读绘本</title><script src='https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js'></script><style type='text/css'>        html {            font-family: 'Helvetica Neue', Helvetica, sans-serif;            -webkit-text-size-adjust: 100%;            -webkit-tap-hightlight-color: transparent;            -webkit-user-select: none;            -webkit-tap-highlight-color: rgba(0, 0, 0, 0);        }        body {            overflow-x: hidden;            -webkit-overflow-scrolling: touch;            font-size: 0.3rem;            background-color: #f6f6f6;        }        * {            margin: 0;            padding: 0;            -webkit-box-sizing: border-box;            box-sizing: border-box;        }        ul,        li {            list-style: none;        }        a {            display: block;            width: 100%;            text-decoration: none;            color: #666;        }        .clearfix {            position: relative;            min-height: 146px;        }        .clearfix:after {            content: '';            display: block;            width: 100%;            height: 0;            clear: both;        }        #wrapper {            width: 100%;           margin: 0 auto; max-width:729px;           padding: 24px;            color: #434345;        }        #wrapper .info {            padding: 5px 0;            font-size: 12px;        }        #wrapper .title {            font-size: 24px;            padding-bottom: 5px;            font-weight: bold;        }        #wrapper .time,        #wrapper .author {            padding-left: 5px;            color: #999;        }        #wrapper .author {            color: #6a95c1;        }        #wrapper .content {            color: #676769;            padding-top: 0.5rem;            font-size: 14px;        }        #wrapper .content img {            max-width: 100%;        }        #wrapper .cover .coverImg {            display: block;            max-width: 100%;            margin: 5px auto 0;        }        #wrapper .recommend {            padding-top: 10px;        }        #wrapper .recommend .item {            margin-top: 20px;            padding: 12px 12px 6px 11px;            position: relative;            background-color: white;            box-shadow: 1px 2px 3px #eee;        }        #wrapper .recommend .item .label {            overflow: hidden;            height: 27px;            font-size: 13px;        }        #wrapper .recommend .item .label>i {            color: #AAAAAA;            border: 1px solid #D8D8D8;            border-radius: 20px;            padding: 2px 5px;            margin-right: 2px;            font-style: normal;            display: inline-block;            margin-bottom: 50px;            font-size: 12px;        }        #wrapper .recommend .bookCover {            float: left;            width: 35%;            display: block;        }        #wrapper .recommend .bookRight {            float: right;            width: 65%;            padding: 0 0 0 15px;        }        #wrapper .recommend .bookRight .titleH3 {            font-size: 16px;            font-weight: normal;            margin-bottom: 2px;            font-weight: normal;            margin-bottom: 5px;            text-overflow: ellipsis;            white-space: nowrap;            overflow: hidden;            color: #333333;        }        #wrapper .recommend .bookRight .synopsis {            font-size: 12px;            display: -webkit-box;            -webkit-box-orient: vertical;            -webkit-line-clamp: 3;            overflow: hidden;            color: #888;        }                #wrapper .recommend .bookRight .bookNum {            font-size: 12px;            display: -webkit-box;            -webkit-box-orient: vertical;            -webkit-line-clamp: 3;            overflow: hidden;            color: #888;            margin-top: 1rem        }                #wrapper .recommend .bookRight .priceBox {            position: absolute;            bottom: 6px;        }        #wrapper .recommend .bookRight .details {            position: absolute;            bottom: -1px;            right: 0.2rem;            background:#40D8B1;            padding: 5px 20px;            border-radius: 20px;            color: #fff;            font-size: 14px;            display: block;        }        #wrapper .recommend .bookRight .priceTxt {            display: inline-block;            color: #40d8b0;            font-size: 18px;            font-weight: bold;        }        #wrapper .recommend .bookRight .invalidTxt {            display: inline-block;            text-decoration: line-through;            color: #ddd;            margin-left: 6px;font-size:12px;        }        .btn_share_Wrap {            width: 100%;            text-align: center;            padding: 80px 0px 120px 0px;        }        #btn_share {            border: 0px solid #40d8b0;            color: #40d8b0;            background-color: rgba(0, 0, 0, 0);            background-image: url(http://download.ellabook.cn/btn.png); background-repeat:no-repeat;           background-size: 100%;             width:267px;            height: 73px;            text-align: center;            line-height: 40px;            border-radius: 5px;   outline: none;     }</style><script type='text/javascript'>    // document.documentElement.style.fontSize = document.documentElement.clientWidth / 10 + 'px';    document.title = '每日读绘本';</script></head><body><div id='wrapper'><header class='title'>"
        + dailyTitle + "</header><figure class='info'><span class='time'>" +
        effectDate.format('YYYY-MM-DD HH:mm:ss').split(" ")[0] + "</span><span class='author'>" +
        authorName + "</span></figure><article><section class='cover'> " +
        titleImgSrc + "</section><section class='content'> " + decodeURIComponent(this.dailyContent) +
        "</section><section class='recommend'><ul id='itemContent'></ul></section></article><div class='btn_share_Wrap'><button id='btn_share'></button></div></div><script type='text/javascript'>        $(function () {         var list = " +
        JSON.stringify(bookSelectList).replace(/\"/g, '\'') + ";         for (var i = 0; i< list.length; i++) {             var obj = list[i];            var li = $('<li></li>'),            a = $('<a></a>'),            img = $('<img src=' + list[i].firstBookImageUrl + ' />'),            div = $('<div></div>'), h3 = $('<h3>' + list[i].bookName + '</h3>'),            p = $('<p>全系列（共' + list[i].bookNum + '本）</p>'),            span = $('<label><h4>' + list[i].goodsPrice + '咿啦币</h4><h5>' + list[i].goodsSrcPrice + '咿啦币</h5></label>');             $(h3).appendTo($(div));            $(p).appendTo($(div));            $(span).appendTo($(div));             $(div).appendTo($(a));            $(img).appendTo($(a));             $(a).appendTo($(li));            $('#itemContent').append($(li));            $('#itemContent li').addClass('item');            $('#itemContent li a').addClass('clearfix');            $('#itemContent li a').eq(i).attr({                 id: 'Link',                 href: 'ellabook2://package.book?packageCode=' + obj.bookCode + '&method=ella.book.getBookPackageBookListInfo'             });            $('#itemContent li a img').addClass('bookCover');             $('#itemContent li a div').addClass('bookRight');            $('#itemContent li a div h3').addClass('titleH3');             $('#itemContent li a div p').addClass('bookNum');             $('#itemContent li a div label').addClass('priceBox');             $('#itemContent li a div h4').addClass('priceTxt');            $('#itemContent li a div h5').addClass('invalidTxt');        }         $('.clearfix').bind('click', function () { routeToTargetPage(this) });        $('#btn_share').bind('click', function () { routeToTargetPage2(); });        function routeToTargetPage2() {            var u = navigator.userAgent;            var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;            if (isAndroid) {                window.WebView.showSharePop(decodeURIComponent(decodeURIComponent(window.location.href)));            } else {                window.webkit.messageHandlers.showSharePop.postMessage(decodeURIComponent(decodeURIComponent(window.location.href)));            }         }         function routeToTargetPage(_this) {             var href = _this.href;            console.log(href);            var u = navigator.userAgent;            var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;            if (isAndroid) {                 window.WebView.routeToTargetPage(href);                _this.href = 'javascript:void(0)';                setTimeout(function () { _this.href = href; }, 50)             }         }     })</script></body></html>"
    }
    let previewSrc = await fetch(requestUrl.upFileUrl, {
      method: 'POST',
      headers: {
        "Content-type": "application/x-www-form-urlencoded"
      },
      mode: 'cors',
      body: "content=" + JSON.stringify({ fileContent: encodeURIComponent(sHtmlCode) }) + dataString()
    }).then((res) => {
      return res.json();
    }).then(res => {
      return res.data || ''
    }).catch(err => {
      message.error('系统错误！')
      console.log(err)
    });
    return previewSrc
  }

  handleSubmit = (publishFlag) => {
    const { form, editDaily: { bookList, bookPackageList } } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      let { dailyTitle, bookCode, dailyImg, authorName, effectDate, dailyDesc } = values
      let { goodsType, } = this.state
      let bookSelectList = []
      bookCode.map((item) => {
        let bookItem
        if (goodsType === 'BOOK') {
          bookItem = bookList.find(el => el.bookCode === item)
          if (bookItem && bookItem.bookIntroduction) {
            bookItem.bookIntroduction = encodeURI(bookItem.bookIntroduction.replace(/'/g, '&apos;'))
          }
          if (bookItem && bookItem.tags) {
            bookItem.tags = encodeURI(bookItem.tags.replace(/'/g, '&apos;'))
          }
        } else {
          bookItem = bookPackageList.find(el => el.bookCode === item)
        }
        bookItem && bookSelectList.push(bookItem)
      })
      this.getTargetPage(values, bookList, bookPackageList).then(previewSrc => {
        this.props.dispatch({
          type: 'editDaily/saveOrUpdateDaily',
          payload: {
            dailyCode: this.dailyCode,
            dailyTitle,
            dailyContent: encodeURIComponent(this.dailyContent),
            bookCode: goodsType === 'BOOK' ? bookCode.join(',') : bookCode,
            effectDate: effectDate.format('YYYY-MM-DD HH:mm:ss'),
            targetPage: encodeURIComponent(previewSrc + '?shareUrl=' + previewSrc + '&shareType=SS201805211029598152&isShare=1&shareTitle=' + dailyTitle),
            dailyImg,
            authorName,
            publishFlag,
            goodsType,
            dailyDesc
          }
        })
      })
    });
  };


  componentWillUnmount() {
    let { resetFields } = this.props.form;
    resetFields()
    this.props.dispatch({
      type: 'editDaily/save',
      payload: {
        dailyInfo: {}
      }
    })
  }

  updateEditorContent = content => {
    this.dailyContent = encodeURIComponent(content.replace(/\"/g, '\''))
  }

  uploadMedia(e) {
    return new Promise(function (resolve, reject) {
      let formData = new FormData();
      formData.append('pictureStream', e.target.files[0]);
      fetch(requestUrl.upLoadUrl, {
        method: 'POST',
        mode: 'cors',
        body: formData,
      }).then(res => {
        return res.json();
      }).then(res => {
        resolve(res.data)
      }).catch(err => {
        message.error('系统错误！')
        console.log(err)
      });
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { editDaily: { dailyInfo, bookList, bookPackageList } } = this.props
    const { goodsType, visible, previewSrc } = this.state
    return (<div >
      <p className="m-title"><Link to={'/home/remittance'}> <Icon type='left'></Icon>添加每日绘本</Link></p>
      <Form className={styles.formContent} onSubmit={this.handleSubmit}>
        <div style={{ paddingLeft: 20, width: '250px' }}>
          <Form.Item label="标题">
            {getFieldDecorator('dailyTitle', {
              initialValue: dailyInfo.dailyTitle || '',
              rules: [
                { required: true, message: '请输入标题！' },
              ],
            })(<Input placeholder='输入标题' />)}
          </Form.Item>
          <Form.Item label="作者">
            {getFieldDecorator('authorName', {
              initialValue: dailyInfo.authorName || '',
              rules: [
                { max: 20, message: '支持最大长度20！' },
              ],
            })(<Input placeholder='输入作者' />)}
          </Form.Item>
          <Form.Item label="封面">
            {getFieldDecorator('dailyImg', {
              initialValue: dailyInfo.dailyImg || '',
              rules: [
                { required: true, message: '请上传封面！' },
              ],
            })(<EllaUploader
              width={216}
              height={110}
              beforeUpload={this.beforeUpload}
              initialValue={dailyInfo.dailyImg || ''}
            />)}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('isShowDailyImg', {
              valuePropName: 'checked',
              initialValue: false,
            })(<Checkbox>插入正文</Checkbox>)}
          </Form.Item>
          <Form.Item label="简介">
            {getFieldDecorator('dailyDesc', {
              initialValue: dailyInfo.dailyDesc || '',
              rules: [
                { required: true, message: '请输入简介！' },
                { max: 20, message: '支持最大长度20！' },
              ],
            })(<TextArea rows={3} />)}
          </Form.Item>
          <Form.Item label="推荐商品">
            <Select style={{ width: '40%' }} value={goodsType} onChange={(value) => { this.setState({ goodsType: value }); value === 'BOOK_PACKAGE' && this.getBookPackageList() }}>
              <Option value='BOOK'>图书</Option>
              <Option value='BOOK_PACKAGE'>图书包</Option>
            </Select>

            {goodsType === 'BOOK' ? getFieldDecorator('bookCode', {
              initialValue: dailyInfo.bookCode ? dailyInfo.bookCode.split(',') : [],
              rules: [
                { required: true, message: '请选择图书！' },
              ],
            })(<Select
              mode="multiple"
              placeholder="请选择图书"
              style={{ width: '60%' }}
              notFoundContent={null}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {bookList.map((item) => <Option key={item.bookCode} value={item.bookCode}>{item.bookName}</Option>)}
            </Select>) : getFieldDecorator('thirdCode', {
              initialValue: '',
              rules: [
                { required: true, message: '请选择图书包！' },
              ],
            })(<Select style={{ width: '60%' }}>
              {bookPackageList.map((item) => <Option key={item.thirdCode} value={item.thirdCode}>{item.goodsName}</Option>)}
            </Select>)}

          </Form.Item>
          <Form.Item label="定时发布">
            {getFieldDecorator('effectDate', {
              initialValue: dailyInfo.effectDate ? moment(dailyInfo.effectDate) : null,
              rules: [
                { required: true, message: '请输入发布时间' },
              ],
            })(<DatePicker
              style={{ width: "100%" }}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              placeholder='请输入发布时间'
            />
            )}
          </Form.Item>


        </div>
        <Divider type="vertical" style={{ height: 'auto' }} />
        <div style={{ flex: '1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '10px 0' }}>
            <ButtonGroup>
              <Button type="primary" onClick={this.preview.bind(this)}>
                预览
                </Button>
              <Button type="primary" onClick={() => { this.handleSubmit('PUSH_NO') }}>
                保存草稿
                </Button>
            </ButtonGroup>

            <Button type="primary" onClick={() => { this.handleSubmit('PUSH_YES') }}>
              保存并推送
                </Button>

          </div>
          <ReactUeditor
            ueditorPath='./vendor/ueditor'
            plugins={['uploadImage', 'insertCode', 'uploadVideo', 'insertLink']}
            uploadImage={this.uploadMedia}
            uploadVideo={this.uploadMedia}
            onChange={this.updateEditorContent}
            multipleImagesUpload={false}
            value={this.state.dailyContent}
          />
        </div>
      </Form>
      <Modal
        style={{ top: '10px' }}
        className="showHtml"
        title="预览效果图,以手机上为准"
        visible={visible}
        footer={null}
        onCancel={() => { this.setState({ visible: false }) }}
      >
        <div className={styles.previewWrap}>
          <iframe title='预览效果图,以手机上为准' src={previewSrc}></iframe>
        </div>
      </Modal>

    </div>)
  }
}

export default connect(({ editDaily }) => ({
  editDaily
}))(Form.create()(EditDaily));

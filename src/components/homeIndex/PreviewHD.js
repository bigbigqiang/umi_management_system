import React from 'react';
import { Icon, Spin } from 'antd';
import styles from './PreviewHD.css';
import { requestUrl, request } from '@/utils';
import AwesomeSwiper from 'react-awesome-swiper';
import './swiper.min.css'
import star1 from '../../assets/images/star1.png';
import star2 from '../../assets/images/star2.png';
const config = {
  autoplay: false,
  speed: 1000,
  autoplayDisableOnInteraction: false,
  loop: true,
  centeredSlides: true,
  slidesPerView: 2,
  pagination: '.swiper-pagination',
  paginationClickable: true,
  prevButton: '.swiper-button-prev',
  nextButton: '.swiper-button-next',
  onInit: function (swiper) {
    swiper.slides[2].className = "swiper-slide swiper-slide-active";
  },
  breakpoints: {
    668: {
      slidesPerView: 1,
    }
  }
};

export default class PriceSet extends React.PureComponent {

  constructor() {
    super()
    this.state = {
      spinning: true,
      isFirst: true,
      carouselData: [],
      subjectData: [],
      remittanceData: [
        {
          week: '周三看什么',
          more: '更多',
          title: '的的大块大块',
          text: '幼儿园社会交往互动故事[托马斯和许愿星] ,源自英国的学前超级品牌,让孩子学会更好地与别人相处幼儿园社会交往互动故事[托马斯和许愿星] ,源自英国的学前超级品牌,让孩子学会更好地与别人相处幼儿园社会交往互动故事[托马斯和许愿星] ,源自英国的学前超级品牌,让孩子学会更好地与别人相处幼儿园社会交往互动故事[托马斯和许愿星] ,源自英国的学前超级品牌,让孩子学会更好地与别人相处幼儿园社会交往互动故事[托马斯和许愿星] ,源自英国的学前超级品牌,让孩子学会更好地与别人相处幼儿园社会交往互动故事[托马斯和许愿星] ,源自英国的学前超级品牌,让孩子学会更好地与别人相处幼儿园社会交往互动故事[托马斯和许愿星] ,源自英国的学前超级品牌,让孩子学会更好地与别人相处',
          img: 'http://book.ellabook.cn/B201801190002.png'
        },
        {

          title: '得到空空导弹看',
          text: '幼儿园社会交往互动故事[托马斯和许愿星] ,源自英国的学前超级品牌,让孩子学会更好地与别人相处',
          img: 'http://book.ellabook.cn/B201801190002.png'
        },
        {
          title: '扣分扣分罚款看',
          text: '幼儿园社会交往互动故事[托马斯和许愿星] ,源自英国的学前超级品牌,让孩子学会更好地与别人相处',
          img: 'http://book.ellabook.cn/B201801190002.png'
        }
      ],
      partData: [
        {
          type: 'LIST_HAND',
          more: '更多',
          title: '新书抢先看',
          ads: [],
          data: [
            {
              img: 'http://book.ellabook.cn/c33cf360871e4507bf023a531a892f1b',
              title: '也许的样子(上)',
              text: '文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字'
            },
            {
              img: 'http://book.ellabook.cn/B201801190002.png',
              title: '我喜欢美好',
              text: '文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字'
            },
            {
              img: 'http://book.ellabook.cn/4f8e5cc88d2d4a0eaa781d30b523f398',
              title: '这样的伦敦(上)',
              text: '文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字'
            }
          ]
        },
        {
          type: 'SLIDE_PORTRAIT',
          more: '更多',
          title: '新书抢先看',
          data: [
            {
              img: 'http://book.ellabook.cn/c33cf360871e4507bf023a531a892f1b',
              title: '也许的样子(上)',
            },
            {
              img: 'http://book.ellabook.cn/B201801190002.png',
              title: '我喜欢美好',
            },
            {
              img: 'http://book.ellabook.cn/4f8e5cc88d2d4a0eaa781d30b523f398',
              title: '这样的伦敦(上)',
            },
            {
              img: 'http://book.ellabook.cn/c33cf360871e4507bf023a531a892f1b',
              title: '也许的样子(上)',
            },
            {
              img: 'http://book.ellabook.cn/B201801190002.png',
              title: '我喜欢美好',
            },
            {
              img: 'http://book.ellabook.cn/4f8e5cc88d2d4a0eaa781d30b523f398',
              title: '这样的伦敦(上)',
            }
          ]
        },
        {
          type: 'SLIDE_HORIZONTAL',
          more: '更多',
          title: '新书抢先看',
          data: [
            {
              img: 'http://book.ellabook.cn/c33cf360871e4507bf023a531a892f1b',
              title: '也许的样子(上)',
            },
            {
              img: 'http://book.ellabook.cn/B201801190002.png',
              title: '我喜欢美好',
            },
            {
              img: 'http://book.ellabook.cn/4f8e5cc88d2d4a0eaa781d30b523f398',
              title: '这样的伦敦(上)',
            },
            {
              img: 'http://book.ellabook.cn/c33cf360871e4507bf023a531a892f1b',
              title: '也许的样子(上)',
            },
            {
              img: 'http://book.ellabook.cn/B201801190002.png',
              title: '我喜欢美好',
            },
            {
              img: 'http://book.ellabook.cn/4f8e5cc88d2d4a0eaa781d30b523f398',
              title: '这样的伦敦(上)',
            },
            {
              img: 'http://book.ellabook.cn/c33cf360871e4507bf023a531a892f1b',
              title: '也许的样子(上)',
            },
            {
              img: 'http://book.ellabook.cn/B201801190002.png',
              title: '我喜欢美好',
            },
            {
              img: 'http://book.ellabook.cn/4f8e5cc88d2d4a0eaa781d30b523f398',
              title: '这样的伦敦(上)',
            }
          ]
        },
      ]
    }
  }
  setOneKV(k, v) {
    this.setState({
      [k]: v
    })
  }
  componentDidMount() {
    this.fetchDefaultData();
  }
  async fetchDefaultData() {
    let data = await request(requestUrl.url, {
      body: "method=ella.operation.HomePagePreview" + "&content=" + JSON.stringify({ "platformCode": this.props.platformCode })
    })
    this.setState({
      carouselData: data.data.banner.map(item => {
        return {
          img: item.bannerImageUrl
        }
      }),
      subjectData: data.data.subject.map(item => {
        return {
          bgImageUpUrl: item.bgImageUpUrl,
          subjectTitle: item.subjectTitle
        }
      }),
      remittanceData: data.data.daily.map((item, index) => {
        return {
          dailyTitle: item.dailyTitle,
          dailyImg: item.dailyImg,
          dailyDesc: item.dailyDesc.length > 80 ? item.dailyDesc.substring(0, 80) : item.dailyDesc,
          week: index === 0 ? data.data.part.find(item => item.partStyle === "DAILY_BOOK").partTitle : '',
          more: index === 0 ? data.data.part.find(item => item.partStyle === "DAILY_BOOK").targetDesc : '',

        }
      }),
      partData: data.data.part.map(item => {
        return {
          partStyle: item.partStyle,
          targetDesc: item.targetDesc,
          partTitle: item.partTitle,
          bannerImageUrl: item.bannerImageUrl,
          ads: item.ads,
          operateCopy: item.operateCopy,
          bgImageUpUrl: item.bgImageUpUrl,
          books: item.books.map(_item => {
            return {
              ossUrl: _item.ossUrl,
              bookName: _item.bookName,
              bookIntroduction: _item.bookIntroduction.length > 43 ? _item.bookIntroduction.substring(0, 43) + '...' : _item.bookIntroduction,
              bookScore: _item.bookScore,
              coreTags: _item.coreTags,
              authorName: _item.authorName
            }
          }),
          courses: item.courses.map(_item => {
            return {
              ossUrl: _item.ossUrl,
              bookName: _item.bookName,
              bookIntroduction: _item.bookIntroduction.length > 43 ? _item.bookIntroduction.substring(0, 43) + '...' : _item.bookIntroduction,
              classHour: _item.classHour
            }
          })
        };
      }),
      spinning: false
    })
  }
  render() {
    const { remittanceData } = this.state;
    return <Spin spinning={this.state.spinning}>
      <div className={styles.box3}>
        <div className={styles.inner} >
          <AwesomeSwiper ref={ref => (this.swiperRef = ref)} config={config} className="your-classname">
            <div className='swiper-wrapper'>
              {
                this.state.carouselData.map((item, index) => {

                  return <div className={index === 0 ? "swiper-slide swiper-slide-center none-effect" : "swiper-slide"}>
                    <img alt='' src={item.img} style={{ width: 422, height: 180 }} />
                    <div className='layer-mask'></div>
                  </div>

                })
              }
            </div>
            <div className="swiper-pagination"></div>
          </AwesomeSwiper>
          <div className={styles.inner_title}>
            <div style={{ width: 999999 }}>
              {
                this.state.subjectData.map(item =>
                  <div className={styles.itempart}>
                    <img alt='' src={item.bgImageUpUrl} />
                    <span>{item.subjectTitle}</span>
                  </div>
                )
              }
            </div>
          </div>
          <div className={styles.remittance}>
            <div className={styles.remittance_title}>
              <span className={styles.week}>{remittanceData[0].week}</span>
              <span className={styles.more}>{remittanceData[0].more}<Icon type="right" /></span>
            </div>
            <div className={styles.remittanceAll}>

              <div className={styles.remittanceItem}>

                <div className={styles.remittRightWrap}>
                  <span className={styles.todayRecommend}>今日推荐</span>
                  <div className={styles.remittRight}>
                    <h5>{remittanceData[0].dailyTitle}</h5>
                    <p>{remittanceData[0].dailyDesc}</p>
                  </div>
                  <div className={styles.imgWrap}>
                    <img alt='' src={remittanceData[0].dailyImg} />
                  </div>
                </div>
              </div>
              <div className={styles.remittanceItem}>
                <div className={styles.remittRightWrap}>
                  <div className={styles.remittRight}>
                    <h5>{this.state.remittanceData[1].dailyTitle}</h5>
                    <p>{this.state.remittanceData[1].dailyDesc}</p>
                  </div>
                  <div className={styles.imgWrap}>
                    <img alt='' src={this.state.remittanceData[1].dailyImg} />
                  </div>
                </div>
              </div>
              <div className={styles.remittanceItem}>
                <div className={styles.remittRightWrap}>
                  <div className={styles.remittRight}>
                    <h5>{this.state.remittanceData[2].dailyTitle}</h5>
                    <p>{this.state.remittanceData[2].dailyDesc}</p>
                  </div>
                  <div className={styles.imgWrap}>
                    <img alt='' src={this.state.remittanceData[2].dailyImg} />
                  </div>
                </div>

              </div>

            </div>
          </div>
          <div className={styles.partData}>
            {
              this.state.partData.map((item, index) => {
                switch (item.partStyle) {
                  case 'IMAGE_TEXT':
                    return (
                      <div className={styles.partItem}>
                        <div className={styles.partItem_title}>
                          <span className={styles.partTitle}>{item.partTitle}</span>
                          <span className={styles.more}>{item.targetDesc}<Icon type="right" style={{ color: "#ccc" }} /></span>
                        </div>

                        <div className={styles.book_image_text}>
                          <div style={{ width: 999999 }}>
                            {
                              item.books.map(item2 => {
                                //创造一个长度为n值为下标的数组
                                const curscore = [...Array(Math.floor(item2.bookScore)).keys()];
                                const curscore2 = [...Array(Math.ceil(item2.bookScore) - Math.floor(item2.bookScore)).keys()];
                                console.log(curscore)
                                console.log(curscore2)
                                return <div className={styles.bookItem}>
                                  <img alt='' src={item2.ossUrl} className={styles.bookImgCover} />
                                  <div className={styles.bookItemRight}>
                                    <h5>{item2.bookName}</h5>
                                    <div className={styles.grade}>
                                      {
                                        curscore.map(item => {
                                          console.log(1)
                                          return <img alt='' className={styles.star} src={star1} />
                                        })

                                      }
                                      {
                                        curscore2.map(item => {
                                          return <img alt='' className={styles.star} src={star2} />
                                        })
                                      }
                                      <div className={styles.score}>{item2.bookScore}</div>
                                    </div>
                                    <p>{item2.bookIntroduction}</p>
                                  </div>
                                </div>
                              })

                            }
                          </div>
                        </div>
                        {
                          item.ads.length !== 0 ? <div className={styles.ad_banner}>
                            <img alt='' src={item.ads[0].hdImageUrl} className={styles.ad_bannerImg} />
                          </div> : null
                        }
                      </div>
                    );
                  case 'SVIP':
                    return (
                      <div className={styles.partItem}>
                        <div className={styles.partItem_title}>
                          <span className={styles.partTitle}>{item.partTitle}</span>
                          <span style={{ "color": "#999" }}>&nbsp;&nbsp;&nbsp;{item.operateCopy}</span>
                          <span className={styles.more}>{item.targetDesc}<Icon type="right" style={{ color: "#ccc" }} /></span>
                        </div>

                        <div className={styles.book_image_text}>

                          <div className={styles.bookItem}>
                            <img alt='' src={item.bgImageUpUrl} style={{ "width": "329px", "height": "246px", "marginRight": "20px" }} />
                          </div>
                          {
                            item.books.map(item2 => {
                              //创造一个长度为n值为下标的数组
                              return <div className={styles.bookItem}>
                                <img alt='' src={item2.ossUrl} className={styles.bookImgCover} />
                                <div className={styles.bookItemRight}>
                                  <h5>{item2.bookName}</h5>
                                  <p>{item2.bookIntroduction}</p>
                                  <button className={styles.freeRead}>免费看</button>
                                </div>
                              </div>
                            })

                          }

                        </div>
                        {
                          item.ads.length !== 0 ? <div className={styles.ad_banner}>
                            <img alt='' src={item.ads[0].hdImageUrl} className={styles.ad_bannerImg} />
                          </div> : null
                        }
                      </div>
                    );
                  case 'SLIDE_PORTRAIT':
                    return (
                      <div className={styles.partItem}>
                        <div className={styles.partItem_title}>
                          <span className={styles.partTitle}>{item.partTitle}</span>
                          <span className={styles.more}>{item.targetDesc}<Icon type="right" style={{ color: "#ccc" }} /></span>
                        </div>
                        {item.courses.length !== 0 ? <div className={styles.course_vertical}>
                          <div style={{ width: 999999 }}>
                            {
                              item.courses.map(item2 => {

                                return <div className={styles.courseItem}>
                                  <img alt='' src={item2.ossUrl} className={styles.courseImgCover} />
                                  <h5>{item2.bookName}</h5>
                                  <span>{item2.classHour}课时</span>
                                  <p>{item2.bookIntroduction}</p>

                                </div>
                              })

                            }
                          </div>
                        </div> : null
                        }
                        {item.books.length !== 0 ? <div className={styles.book_vertical}>

                          {
                            item.books.map(item2 => {

                              return <div className={styles.bookItem}>
                                <img alt='' src={item2.ossUrl} className={styles.bookImgCover} />
                                <h5>{item2.bookName}</h5>
                              </div>
                            })

                          }

                        </div> : null
                        }
                        {
                          item.ads.length !== 0 ? <div className={styles.ad_banner}>
                            <img alt='' src={item.ads[0].hdImageUrl} className={styles.ad_bannerImg} />
                          </div> : null
                        }
                      </div>

                    );
                  case 'SLIDE_HORIZONTAL':
                    return (
                      <div className={styles.partItem}>
                        <div className={styles.partItem_title}>
                          <span className={styles.partTitle}>{item.partTitle}</span>
                          <span className={styles.more}>{item.targetDesc}<Icon type="right" style={{ color: "#ccc" }} /></span>
                        </div>
                        {item.courses.length !== 0 ? <div className={styles.course_horizontal}>
                          <div style={{ width: 999999 }}>
                            {
                              item.courses.map(item2 => {

                                return <div className={styles.courseItemHori}>
                                  <div style={{ "height": "185px", "overflow": "hidden" }}>
                                    <img alt='' src={item2.ossUrl} className={styles.courseImgCover} />
                                  </div>
                                  <h5>{item2.bookName}</h5>
                                  <span>{item2.classHour}课时</span>
                                  <p>{item2.bookIntroduction}</p>

                                </div>
                              })

                            }
                          </div>
                        </div>
                          : null
                        }
                        {item.books.length !== 0 ? <div className={styles.book_horizontal}>

                          {
                            item.books.map(item2 => {

                              const coreTags = item2.coreTags !== null ? item2.coreTags.split(",") : [];
                              return <div className={styles.bookItemHori}>

                                <img alt='' src={item2.ossUrl} className={styles.bookImgCover} />
                                <div className={styles.bookHoriRight}>
                                  <h5>{item2.bookName}</h5>
                                  <p className={styles.authorName}>{item2.authorName}</p>
                                  <p>{item2.bookIntroduction}</p>
                                  <div className={styles.coreTags}>
                                    {
                                      coreTags.map((item3, index) => {
                                        if (index > 2) {
                                          return;
                                        }
                                        return <div className={styles.itemTag}>{item3}</div>
                                      })
                                    }
                                  </div>
                                  <button>立即阅读</button>
                                  <span>会员免费借阅</span>
                                </div>
                              </div>
                            })

                          }

                        </div>
                          : null
                        }
                        {
                          item.ads.length !== 0 ? <div className={styles.ad_banner}>
                            <img alt='' src={item.ads[0].hdImageUrl} className={styles.ad_bannerImg} />
                          </div> : null
                        }

                      </div>
                    );
                  case 'AD_SINGLE':
                    return (
                      !!item.bannerImageUrl ? <div className={styles.partItem}>
                        <div className={styles.ad_banner}>
                          <img alt='' src={item.bannerImageUrl} className={styles.ad_bannerImg} />
                        </div>
                      </div> : null

                    )
                  default:
                    return '-'
                }
              })
            }
          </div>
        </div>
      </div>
    </Spin >
  }
}
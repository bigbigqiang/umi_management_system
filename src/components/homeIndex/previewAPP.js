import React from 'react';
import { Icon, Carousel, Spin } from 'antd';
import styles from './previewAPP.css';
import { requestUrl, request } from '@/utils';
import Part1 from './part1.js';
import Part2 from './part2.js';
import Part3 from './part3.js';
import Part4 from './part4.js';
import Part5 from './part5.js';

export default class previewAPP extends React.PureComponent {

    constructor() {
        super()
        this.state = {
            spinning: true,
            isFirst: true,
            carouselData: [
                // {
                //     img: 'http://member.ellabook.cn/612a0e326e1b49b7a06c1f30ef4810bd',
                // },
                // {
                //     img: 'http://member.ellabook.cn/47cfaf50f65f4d20aedf5c98cbc1c112',
                // },
                // {
                //     img: 'http://member.ellabook.cn/2502b25295374987a0823e904b34ce41',
                // },
                // {
                //     img: 'http://member.ellabook.cn/68725b70cc1645e68f30fb1800b71482',
                // }
            ],
            titleData: [
                // {
                //     img: 'http://member.ellabook.cn/4956d1ec0ecf4363a81a74117b8476fe',
                //     title: '全部分类'
                // },
                // {
                //     img: 'http://member.ellabook.cn/4956d1ec0ecf4363a81a74117b8476fe',
                //     title: '全部分类'
                // },
                // {
                //     img: 'http://member.ellabook.cn/4956d1ec0ecf4363a81a74117b8476fe',
                //     title: '全部分类'
                // },
                // {
                //     img: 'http://member.ellabook.cn/4956d1ec0ecf4363a81a74117b8476fe',
                //     title: '全部分类'
                // }
            ],
            remittanceData: {
                // week: '周三看什么',
                // more: '更多',
                // text: '幼儿园社会交往互动故事[托马斯和许愿星] ,源自英国的学前超级品牌,让孩子学会更好地与别人相处',
                // img: img1
            },
            partData: [
                // {
                //     type: 'LIST_HAND',
                //     more: '更多',
                //     title: '新书抢先看',
                //     data: [
                //         {
                //             img: 'http://book.ellabook.cn/c33cf360871e4507bf023a531a892f1b',
                //             title: '也许的样子(上)',
                //             text: '文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字'
                //         },
                //         {
                //             img: 'http://book.ellabook.cn/B201801190002.png',
                //             title: '我喜欢美好',
                //             text: '文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字'
                //         },
                //         {
                //             img: 'http://book.ellabook.cn/4f8e5cc88d2d4a0eaa781d30b523f398',
                //             title: '这样的伦敦(上)',
                //             text: '文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字'
                //         }
                //     ]
                // },
                // {
                //     type: 'SLIDE_PORTRAIT',
                //     more: '更多',
                //     title: '新书抢先看',
                //     data: [
                //         {
                //             img: 'http://book.ellabook.cn/c33cf360871e4507bf023a531a892f1b',
                //             title: '也许的样子(上)',
                //         },
                //         {
                //             img: 'http://book.ellabook.cn/B201801190002.png',
                //             title: '我喜欢美好',
                //         },
                //         {
                //             img: 'http://book.ellabook.cn/4f8e5cc88d2d4a0eaa781d30b523f398',
                //             title: '这样的伦敦(上)',
                //         },
                //         {
                //             img: 'http://book.ellabook.cn/c33cf360871e4507bf023a531a892f1b',
                //             title: '也许的样子(上)',
                //         },
                //         {
                //             img: 'http://book.ellabook.cn/B201801190002.png',
                //             title: '我喜欢美好',
                //         },
                //         {
                //             img: 'http://book.ellabook.cn/4f8e5cc88d2d4a0eaa781d30b523f398',
                //             title: '这样的伦敦(上)',
                //         }
                //     ]
                // },
                // {
                //     type: 'SLIDE_HORIZONTAL',
                //     more: '更多',
                //     title: '新书抢先看',
                //     data: [
                //         {
                //             img: 'http://book.ellabook.cn/c33cf360871e4507bf023a531a892f1b',
                //             title: '也许的样子(上)',
                //         },
                //         {
                //             img: 'http://book.ellabook.cn/B201801190002.png',
                //             title: '我喜欢美好',
                //         },
                //         {
                //             img: 'http://book.ellabook.cn/4f8e5cc88d2d4a0eaa781d30b523f398',
                //             title: '这样的伦敦(上)',
                //         },
                //         {
                //             img: 'http://book.ellabook.cn/c33cf360871e4507bf023a531a892f1b',
                //             title: '也许的样子(上)',
                //         },
                //         {
                //             img: 'http://book.ellabook.cn/B201801190002.png',
                //             title: '我喜欢美好',
                //         },
                //         {
                //             img: 'http://book.ellabook.cn/4f8e5cc88d2d4a0eaa781d30b523f398',
                //             title: '这样的伦敦(上)',
                //         },
                //         {
                //             img: 'http://book.ellabook.cn/c33cf360871e4507bf023a531a892f1b',
                //             title: '也许的样子(上)',
                //         },
                //         {
                //             img: 'http://book.ellabook.cn/B201801190002.png',
                //             title: '我喜欢美好',
                //         },
                //         {
                //             img: 'http://book.ellabook.cn/4f8e5cc88d2d4a0eaa781d30b523f398',
                //             title: '这样的伦敦(上)',
                //         }
                //     ]
                // },
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
            titleData: data.data.subject.map(item => {
                return {
                    img: item.bgImageUpUrl,
                    title: item.subjectTitle
                }
            }),
            remittanceData: {
                week: !!data.data.part.find(item => item.partStyle === "DAILY_BOOK") ? data.data.part.find(item => item.partStyle === "DAILY_BOOK").partTitle : '',
                more: !!data.data.part.find(item => item.partStyle === "DAILY_BOOK") ? data.data.part.find(item => item.partStyle === "DAILY_BOOK").targetDesc : '',
                text: data.data.daily[0].dailyTitle,
                img: data.data.daily[0].dailyImg
            },
            partData: data.data.part.map(item => {
                return {
                    type: item.partStyle,
                    more: item.targetDesc,
                    title: item.partTitle,
                    ads: item.ads,
                    bgImageUrl: item.partStyle === "SVIP" ? item.bgImageUrl : '',
                    bgImageUpUrl: item.partStyle === "SVIP" ? item.bgImageUpUrl : '',
                    operateCopy: item.partStyle === "SVIP" ? item.operateCopy : '',
                    moduleImg: item.bannerImageUrl,
                    data: item.books.length !== 0 ? item.books.map(_item => {
                        return {
                            img: _item.ossUrl,
                            title: _item.bookName,
                            text: _item.bookIntroduction

                        }
                    }) : item.courses.map(_item => {
                        return {
                            img: _item.ossUrl,
                            title: _item.bookName,
                            text: _item.bookIntroduction

                        }
                    })
                };
            }),
            spinning: false
        })
    }
    render() {
        return <Spin spinning={this.state.spinning}>
            <div className={styles.box}>
                <div className={styles.top} >
                    <div className={styles.train}></div>
                    <div className={styles.search}>
                        <span><Icon type="search" />搜索绘本</span>
                    </div>
                </div>
                <div className={styles.inner}>
                    <Carousel className={styles.carousel} autoplay>
                        {
                            this.state.carouselData.map(item =>
                                <div key={item.bannerCode}>
                                    <img alt='' src={item.img} />
                                </div>
                            )
                        }
                    </Carousel>
                    <div className={styles.inner_title}>
                        <div style={{ "width": "999999px" }}>
                            {
                                this.state.titleData.map(item =>
                                    <div className={styles.itempart} key={item.subjectCode}>
                                        <img alt='' src={item.img} />
                                        <p>{item.title}</p>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    {
                        this.state.partData.map(item => {
                            switch (item.type) {
                                case 'IMAGE_TEXT':
                                    return <Part1 key={item.partCode} parentData={item}></Part1>;
                                case 'SLIDE_PORTRAIT':
                                    return <Part2 key={item.partCode} parentData={item}></Part2>;
                                case 'SLIDE_HORIZONTAL':
                                    return <Part3 key={item.partCode} parentData={item}></Part3>;
                                case 'AD_SINGLE':
                                    return <Part4 key={item.partCode} parentData={item}></Part4>;
                                case 'SVIP':
                                    return <Part5 key={item.partCode} parentData={item}></Part5>;
                                case 'DAILY_BOOK':
                                    return (
                                        <div key={item.partCode} className={styles.remittance}>
                                            <div className={styles.remittance_title}>
                                                <span className={styles.week}>{this.state.remittanceData.week}</span>
                                                <span className={styles.more}>{this.state.remittanceData.more}<Icon type="right" /></span>
                                            </div>
                                            <p>{this.state.remittanceData.text}</p>
                                            <div className={styles.imgWrap}>
                                                <img alt='' src={this.state.remittanceData.img} />
                                            </div>
                                            <div className={styles.bottomAdvert}>
                                                {
                                                    item.ads.map(item2 => {
                                                        return (
                                                            <div className={styles.imgWrap}>
                                                                <img alt='' src={item2.bannerImageUrl} />
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                    );
                                default:
                                    return '-'
                            }
                        })
                    }
                </div>
                <div className={styles.footer}>
                    <div className={styles.itempart}>
                        <p><Icon type="home" /></p>
                        <p className={styles.font}>精选</p>
                    </div>
                    <div className={styles.itempart}>
                        <p><Icon type="book" /></p>
                        <p className={styles.font}>书房</p>
                    </div>
                    <div className={styles.itempart}>
                        <p><Icon type="user" /></p>
                        <p className={styles.font}>我的</p>
                    </div>
                </div>
            </div>
        </Spin>
    }
}
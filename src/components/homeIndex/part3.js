import React from 'react';
import { Icon } from 'antd';
import styles from './part3.css';

export default class PriceSet extends React.PureComponent {
    constructor() {
        super()
        this.state = {
            // title: '新书抢先看',
            // more: `更多`,
            // data: [
            //     {
            //         img: 'http://book.ellabook.cn/c33cf360871e4507bf023a531a892f1b',
            //         title: '也许的样子(上)',
            //     },
            //     {
            //         img: 'http://book.ellabook.cn/B201801190002.png',
            //         title: '我喜欢美好',
            //     },
            //     {
            //         img: 'http://book.ellabook.cn/4f8e5cc88d2d4a0eaa781d30b523f398',
            //         title: '这样的伦敦(上)',
            //     },
            //     {
            //         img: 'http://book.ellabook.cn/c33cf360871e4507bf023a531a892f1b',
            //         title: '也许的样子(上)',
            //     },
            //     {
            //         img: 'http://book.ellabook.cn/B201801190002.png',
            //         title: '我喜欢美好',
            //     },
            //     {
            //         img: 'http://book.ellabook.cn/4f8e5cc88d2d4a0eaa781d30b523f398',
            //         title: '这样的伦敦(上)',
            //     },
            //     {
            //         img: 'http://book.ellabook.cn/c33cf360871e4507bf023a531a892f1b',
            //         title: '也许的样子(上)',
            //     },
            //     {
            //         img: 'http://book.ellabook.cn/B201801190002.png',
            //         title: '我喜欢美好',
            //     },
            //     {
            //         img: 'http://book.ellabook.cn/4f8e5cc88d2d4a0eaa781d30b523f398',
            //         title: '这样的伦敦(上)',
            //     }
            // ]
            title: '',
            more: '',
            data: [],
            ads:[]
        }
    }
    componentDidMount() {
        // TODO:这里接收父级数据
        this.setState({
            title: this.props.parentData.title,
            more: this.props.parentData.more,
            data: this.props.parentData.data,
            ads:this.props.parentData.ads
        })
    }
    setOneKV(k, v) {
        this.setState({
            [k]: v
        })
    }
    render() {
        return <div className={styles.part3}>
            <div className={styles.part3_top}>
                <span className={styles.title}>{this.state.title}</span>
                <span className={styles.more}>{this.state.more}<Icon type="right" /></span>
            </div>
            <div className={styles.showBoxWrap}>
                <div className={styles.showBox}>
                    {
                        this.state.data.map(item =>
                            <div className={styles.part3_part}>
                                <img alt=''  src={item.img} />
                                <p style={{ webkitBoxOrient: 'vertical' }}>{item.title}</p>
                                
                            </div>
                        )
                    }
                </div>
            </div>
			<div className={styles.bottomAdvert}>
            	{
            		this.state.ads.map(item=> {
            			return (
            				<div className={styles.imgWrap}>
            					<img alt=''  src={item.bannerImageUrl} />
            				</div>
            			)
            		})
            	}
            </div>
        </div>
    }
}
import React from 'react';
import { Icon } from 'antd';
import styles from './part1.css';


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
            //         text: '文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字'
            //     },
            //     {
            //         img: 'http://book.ellabook.cn/B201801190002.png',
            //         title: '我喜欢美好',
            //         text: '文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字'
            //     },
            //     {
            //         img: 'http://book.ellabook.cn/4f8e5cc88d2d4a0eaa781d30b523f398',
            //         title: '这样的伦敦(上)',
            //         text: '文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字'
            //     }
            // ]
            title: '',
            more: '',
            data: [],
            ads:[]
        }
    }
    componentDidMount() {
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
        return <div className={styles.part1}>
            <div className={styles.part1_top}>
                <span className={styles.title}>{this.state.title}</span>
                <span className={styles.more}>{this.state.more}<Icon type="right"/></span>
            </div>
            <div className={styles.showBoxWrap}>
                <div className={styles.showBox}>
                    {
                        this.state.data.map(item => {
                            return <div className={styles.item} style={{}}>
                                <div className={styles.item_inner}>
                                    <img alt=''  src={item.img} />
                                    <div className={styles.item_right}>
                                        <span style={{ webkitBoxOrient: 'vertical' }} className={styles.item_title}>{item.title}</span>
                                        <div className={styles.item_textWrap}>
                                            <span style={{ webkitBoxOrient: 'vertical' }} className={styles.item_text}>{item.text}</span>
                                        </div>
                                        <button>立即阅读</button>
                                    </div>
                                </div>
                                
                            </div>
                        })
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
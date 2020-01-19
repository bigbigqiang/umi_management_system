import React from 'react';
import { Icon } from 'antd';
import styles from './part2.css';


export default class PriceSet extends React.PureComponent {

    constructor() {
        super()
        this.state = {
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
        return <div className={styles.part2}>
            <div className={styles.part2_top}>
                <span className={styles.title}>{this.state.title}</span>
                <span className={styles.more}>{this.state.more}<Icon type="right" /></span>
            </div>
            <div className={styles.part2_box}>
                {
                    this.state.data.map(item =>
                        <div className={styles.part2_item}>
                            <img alt=''  src={item.img} />
                            <div className={styles.pWrap}>
                                <p style={{ webkitBoxOrient: 'vertical' }}>{item.title}</p>
                            </div>
                            
                        </div>
                    )
                }
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
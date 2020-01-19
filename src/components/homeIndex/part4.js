import React from 'react';
import styles from './part4.css';


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
        // TODO:这里接收父级数据
        this.setState({
            title: this.props.parentData.title,
            more: this.props.parentData.more,
            data: this.props.parentData.data,
            ads:this.props.parentData.ads,
            moduleImg:this.props.parentData.moduleImg
        })
    }
    setOneKV(k, v) {
        this.setState({
            [k]: v
        })
    }
    render() {
    	
        return <div className={styles.part4}>
            <div className={styles.part4_top}>
                <span className={styles.title}>{this.state.title}</span>
                
            </div>
			<div className={styles.bottomAdvert}>
    			
				<div className={styles.imgWrap}>
					<img alt=''  src={this.state.moduleImg} />
				</div>
    		
            </div>
        </div>
    }
}
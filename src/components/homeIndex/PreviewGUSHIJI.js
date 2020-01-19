import React from 'react';
import {Spin } from 'antd';
import styles from './PreviewGUSHIJI.css';
import { requestUrl, request } from '@/utils';

export default class PriceSet extends React.PureComponent {

    constructor() {
        super()
        this.state = {
            spinning: true,
            storyData:[]
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
            storyData:data.data.part,
            spinning: false
        })
    }
    render() {
        return <Spin spinning={this.state.spinning}>
            <div className={styles.preview2}>
                <div className={styles.imgWrap}>
                    <div style={{"width":"9999px"}}>
                        <div className={styles.storyItem}>
                            <img alt=''  src={ require('../../assets/images/trainHead.png') } className={styles.imgItem + ' ' + styles.img1}/>
                        </div>
                        <div className={styles.storyItem}>
                            <img alt=''  src={ require('../../assets/images/trainSecond.png') } className={styles.imgItem + ' ' + styles.img2}/>
                        </div>
                        {
                            this.state.storyData.map((item,index)=>{
                                if(item.partSource !== "ella.book.listBookCommons" && item.partSource !== "ella.book.listBookNewest"){
                                    return;
                                }
                                if(index%3===0){
                                    return <div className={styles.storyItem}>
                                        <img alt=''  src={ require('../../assets/images/trainOne.png') } className={styles.imgItem + ' ' + styles.img3}/>
                                        <span className={styles.t1}>{item.partTitle}</span>
                                    </div>
                                }else if(index%3===1){
                                    return <div className={styles.storyItem}>
                                        <img alt=''  src={ require('../../assets/images/trainTwo.png') } className={styles.imgItem + ' ' + styles.img4}/>
                                        <span className={styles.t2}>{item.partTitle}</span>
                                    </div>
                                }else{
                                    return <div className={styles.storyItem}>
                                        <img alt=''  src={ require('../../assets/images/trainThree.png') } className={styles.imgItem + ' ' + styles.img5}/>
                                        <span className={styles.t3}>{item.partTitle}</span>
                                    </div>
                                }
                                
                            })
                        }
                    </div>
                </div>
            </div>
        </Spin>
    }
}
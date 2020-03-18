import React from 'react';
import PropTypes from 'prop-types';
import { message, Select, Spin } from 'antd';
import * as HTTP from 'units/Axios';
import PicturesWall from 'components/ImgUpload';
import SamplePersonnelTable from 'common/samplePersonnelTable';
const Option = Select.Option;
class ViewingSample extends React.Component {
    static propTypes = {
        assetBaseId: PropTypes.string,
    };

    static defaultProps = {
        assetBaseId: '',
    };

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            lookSampleInfo: [],
            assetBaseId: '',
            cur_viewTime: '',
            lookSampleTimes: [], 
            samplePersonnelList: '',
            sampleCustomerList: [],
            localeImage: [],
            postImage: [],
            lookSampleSummary: '',
            imgDefaultData: [],
            imgUploadArray: [
                {
                    label: '现场场景',
                    fieldName: 'localeImage',
                    businessType: 'X01'
                },
                {
                    label: '材料公告',
                    fieldName: 'postImage',
                    businessType: 'X02'
                },
            ],
        }
    }
    
    componentWillMount(){ //预加载数据
        this.propsGet(this.props);
    }
    componentWillReceiveProps(nextProps){ //组件接收到新的props时调用
        this.propsGet(nextProps);
    }

    propsGet = (props) => {
        if (props.assetBaseId !== this.state.assetBaseId) {
            this.setState({
                assetBaseId: props.assetBaseId
            },function(){
                this._lookSampleTimesGet(props.assetBaseId);
            })
        } else {
            this.setState({
                loading: false
            })
        }
    }
    _lookSampleTimesGet = async (id) => { //请求数据函数
        console.log(id)
        try {
            const result = await HTTP.lookSampleTimes({
                assetBaseId: id,
            });
            console.log('lookSampleTimesGet', result);
            this.setState({
                loading: false
            })
            if (result.success) {
                this.setState({
                    lookSampleTimes: result.data,
                    cur_viewTime: result.data && result.data[0] ? result.data[0].id: ''
                },function(){
                    console.log('cur_viewTime',this.state.cur_viewTime)
                    this.state.cur_viewTime ? this._lookSampleInfoGet(id,this.state.cur_viewTime) : null
                })
            } else {
                message.error(result.message);
            }
        } catch (e) {
            this.setState({
                loading: false
            })
            // message.error(e.message);
        }
    }

    _lookSampleInfoGet = async (id,inquestId) => { //请求数据函数
        console.log(id)
        try {
            const result = await HTTP.lookSampleDetail({
                assetBaseId: id,
                inquestId: inquestId
            });
            console.log('lookSampleInfo', result);           
            if (result.success) {
                let data = result.data;
                const assetHouse = data.assetHouse;
                data.assetHouse =  '';
                data = {...data,...assetHouse};
                console.log('data:',data) 
                this.setState({
                    lookSampleSummary: data.remark ? data.remark: '',
                    samplePersonnelList: result.data3 ? result.data3.join('、'): ''
                })
                this.getSampleCustomerList(inquestId);
                this.imgDataDo(result.data2 ? result.data2 : {});
            } else {
                this.setState({
                    loading: false
                })
                message.error(result.message);
            }
        } catch (e) {
            this.setState({
                loading: false
            })
        }
    }
    getSampleCustomerList  = async (id) => { //看样客户列表
        try {
            const result = await HTTP.assetBookList({
                inquestId: id
            });
            this.setState({
                loading: false
            })
            if (result.success) {
                this.setState({
                    sampleCustomerList: result.data ? result.data: [],
                })
            } else {
                message.error(result.message);
            }
        } catch (e) {
            this.setState({
                loading: false
            })
        }
    }
    imgDataDo = (data) => {
        for (let value of this.state.imgUploadArray) {
            let imgDefaultDataBoxs = [];
            if (data[value.fieldName] && data[value.fieldName].length > 0) {
                for (let item of data[value.fieldName]) {
                    let imgDefaultDataBox = {};
                    imgDefaultDataBox['bigUrl'] = item['waterMarkImage'] ? item['waterMarkImage']: ''
                    imgDefaultDataBox['url'] = item['pathThumb2FileName'] ? item['pathThumb2FileName']: ''
                    imgDefaultDataBox['uid'] = `${value.fileName}${Math.random()}`
                    imgDefaultDataBox['status'] = 'done'
                    imgDefaultDataBox['fileName'] = item['fileName'] ? item['fileName']: ''
                    imgDefaultDataBoxs.push(imgDefaultDataBox)
                }
            } 
            this.setState({
                imgDefaultData: [...this.state.imgDefaultData,imgDefaultDataBoxs],
            },function(){
            })
        }
    }
    viewTimeChange = (e) => {
        this.setState({
            cur_viewTime: e,
            loading: true
        },function(){
            this._lookSampleInfoGet(this.state.assetBaseId,this.state.cur_viewTime)
        })
    }
    
    render() {
        const { imgDefaultData, imgUploadArray, cur_viewTime, loading, sampleCustomerList, lookSampleTimes, samplePersonnelList, localeImage, postImage, lookSampleSummary } = this.state;
        return (
            <Spin spinning={loading}>
                <div style={{margin: '20px'}}>
                    <span>看样时间：</span>
                    <Select className="no_clear" allowClear={true} onChange={this.viewTimeChange.bind(this)} placeholder="请选择看样时间" style={{width: '30%',marginLeft: '10px',marginRight: '15%',marginBottom: '30px'}} value={cur_viewTime ? cur_viewTime:undefined}>
                        {
                            lookSampleTimes.map((val,index)=>
                            <Option value={val.id} key={index}>{val.inquestDate}</Option>
                        )
                        }
                    </Select>
                    <div className="show_input_box">
                        <span>看样人员：</span>
                        <span className="show_input">
                            {samplePersonnelList}
                        </span>
                    </div>
                </div>
                {imgUploadArray.map((item,index)=>
                    <div className="flex img_box" key={index}>
                        <span className="upload_label">{item.label}</span>
                        <PicturesWall businessId={this.state.cur_viewTime} businessType={item.businessType ? item.businessType: ''} disabled={true} isD={true} componentsStyle={item.fieldName} defaultFileList={imgDefaultData[index]? imgDefaultData[index] : []} />
                    </div>
                )}
                <div className="flex img_box">
                    <span className="upload_label">看样小结</span>
                    <span className="view_sample_summary">
                        {
                            lookSampleSummary
                        }
                    </span>
                </div>
                <div className="flex img_box" style={{marginTop: '30px'}}>
                    <span className="upload_label">看样客户</span>
                    <SamplePersonnelTable SampleCustomerList={sampleCustomerList}/>
                </div>
            </Spin>
        );
    }
}
export default ViewingSample
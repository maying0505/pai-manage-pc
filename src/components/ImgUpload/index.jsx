import React from 'react';
import PropTypes from 'prop-types';
// import Upload from 'components/VideoUpload/index.tsx';
import { Upload, Icon, message,Button } from 'antd';
import { imgUrl, fileUrl, fileDownUrl } from 'units/Axios/http';
import PictureProcessing from 'common/pictureProcessing';
import DownloadFile from 'common/download';
import * as HTTP from 'units/Axios';
import './index.less';

class PicturesWall extends React.Component {
    static propTypes = {
        isD: PropTypes.bool,
        defaultFileList: PropTypes.array,
        disabled: PropTypes.bool,
        componentsIndex: PropTypes.number,
        componentsStyle: PropTypes.string,
        onPicturesWallChange: PropTypes.func,
        isDelete: PropTypes.bool,
        showUploadList: PropTypes.bool,
        businessId: PropTypes.string,
        businessType: PropTypes.string,
        fileType: PropTypes.string,
        fileStyle: PropTypes.string,
    };

    static defaultProps = {
        isD: false,
        businessId: '',
        businessType: '',
        fileType: '',
        fileStyle: '',
        showUploadList: true,
        defaultFileList: [],
        disabled: false,
        componentsIndex: 0,
        componentsStyle: '',
        isDelete: true,
        onPicturesWallChange: () => {
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            carouseCurrentIndex: 0,
            fileList: [],
            multiple: true,
            nextProps: [],
            carouselList: [],
            pictureProcessingVisible: false
        };
    }

    componentDidMount() { //预加载数据
        console.log('image',this.props)
        // this.fileListChange()
    }

    componentWillReceiveProps(nextProps) { //组件接收到新的props时调用
        // console.log('defaultFileList',nextProps.defaultFileList)
        if (nextProps.defaultFileList !== this.state.nextProps && nextProps.defaultFileList) {
            if (nextProps.defaultFileList.length > 0 && nextProps.defaultFileList[0] !== "") {
                this.setState({
                    nextProps: nextProps.defaultFileList
                })
                this.fileListChange(nextProps)
            }
        }
    }

    _fileDown = (path) => { //请求数据函数
        if (path) {
            DownloadFile(fileDownUrl + '?path=' + path)
        }
    }

    _imageRemove = async (id,fileList) => { //请求数据函数
        console.log(id)
        try {
            const result = await HTTP.imageRemove({
                fileName: id,
            });
            if (result.success) {
                fileList = fileList.filter((file) => {
                    if (file.response) {
                        if (file.response.success) {
                            file.thumbUrl = file.response.data.pathThumb2FileName;
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        return true;
                    }
                });
                console.log(fileList)
                this.setState({
                    fileList
                }, function () {
                    console.log(this.state.fileList)
                })
            } else {
                message.error(result.message);
            }
        } catch (e) {
            
        }
    }

    fileListChange = (nextProps) => {
        this.setState({
            fileList: nextProps.defaultFileList
        }, function () {
            console.log(this.state.fileList)
        })
    }

    handlePreview = (file) => {
        if (this.props.fileStyle === 'file') {
            let path = '';
            if (file.response) {
                path = file.response.data ? file.response.data.url : ''
            } else {
                path = file.url;
            }
            this._fileDown(path)
            return;
        }
        const {fileList} = this.state;
        let goToIndex = null;
        if (fileList.length > 0) {
            fileList.forEach((item, index) => {
                if (item.uid === file.uid) {
                    goToIndex = index;
                }
            });
        }
        this.setState({
            carouseCurrentIndex: goToIndex,
            pictureProcessingVisible: true,
            carouselList: fileList,
        }, () => {
            this.slider && this.slider.innerSlider.slickGoTo(goToIndex);
        });
    };

    handleChange = ({fileList, file, event}) => {
        console.log('fileList:',fileList)
        console.log('file:',file)
        console.log('file_event',event)
        if (file.status === 'removed') {
            let fileName = '';
            if (file.response) {
                fileName = file.response.data && file.response.data.fileName ? file.response.data.fileName : '';
            } else {
                fileName = file.fileName || file.url;
            }
            this._imageRemove(fileName,fileList)
        } else {
            if (file.status === 'error'  || (!file.response && file.status === 'done') || (file.response && !file.response.success)) {
                message.error('上传失败！');
            }
            if (file.status === 'done' || file.status === 'uploading') {
                fileList = fileList.filter((file) => {
                    if (file.response || file.response === '') {
                        if (file.response.success) {
                            file.thumbUrl = file.response.data.pathThumb2FileName;
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        return true;
                    }
                });
                console.log(fileList)
                this.setState({
                    fileList
                }, function () {
                    console.log(this.state.fileList)
                })
            }
            
        }

        
        file.status !== 'error' && file.status ? this.props.onPicturesWallChange(fileList, this.props.componentsIndex, this.props.componentsStyle, file.status) : null

        // console.log(fileList[fileList.length-1].response)
    };
    beforeUpload = (file) => { //上传前控制图片的格式和大小
        console.log('eee:', this.state.fileList)
        if (this.props.fileStyle === 'file' && this.state.fileList.length > 0) {
            message.error('只能上传一个文件，如需更换，请先删除！')
            return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 10
        if (!isLt2M) {
            message.error('文件必须小于10M！')
        }
        if (this.props.fileType === 'pdf') {
            const isPDF = file.type === 'application/pdf';
            if (!isPDF) {
                message.error('只能上传pdf文件!');
            }
            
            return isPDF && isLt2M;
        }
        return isLt2M;
    };

    _onRemove = (file) => {
        const {isDelete} = this.props;
        if (!isDelete) {
            return false;
        }
        if (file.response && file.response.data) {
            return true;
        }
        if (file.deletable) {
            return true;
        } else if (file.deletable === false) {
            message.warn('不能删除该图片');
            return false;
        } else {
            return true;
        }
    };

    pictureProcessingHandleCancel = () =>{
        this.setState({
            pictureProcessingVisible: false,
            carouseCurrentIndex: 0
        })
    }

    render() {
        const {
            pictureProcessingVisible, carouselList, carouseCurrentIndex, multiple, 
        } = this.state;

        const {showUploadList,isD,fileStyle,disabled} = this.props;
        const uploadTextShow = () => {
            if (disabled) {
                return null
            } else {
                return fileStyle === 'file' ? 
                    <Button>
                        <Icon type="upload" /> 选择文件（PDF）
                    </Button> : 
                    <div>
                        <Icon type="plus"/>
                        <div className="ant-upload-text">{`上传（<10M）`}</div>
                    </div>
            }
   
        }
        return (
            <div className={fileStyle === 'file' ? "clearfix flex-23" : 'clearfix flex-1'}>
                {
                    this.state.fileList.length > 0 ?
                        <div className={isD ? 'show' : ''}>
                            <Upload
                                action={fileStyle === 'file' ? fileUrl : imgUrl}
                                listType={fileStyle === 'file' ? "text": "picture-card"}
                                showUploadList={showUploadList}
                                fileList={this.state.fileList}
                                onPreview={this.handlePreview}
                                onChange={this.handleChange}
                                beforeUpload={this.beforeUpload}
                                data= {{businessId:this.props.businessId,businessType:this.props.businessType}}
                                name="attach"
                                headers={{token:sessionStorage.getItem('token_y')}}
                                multiple={multiple}
                                onRemove={this._onRemove}
                            >
                                {
                                    uploadTextShow()
                                }
                            </Upload>
                        </div>
                        :
                        <div className={isD ? 'show' : ''}>
                            <Upload
                                action={fileStyle === 'file' ? fileUrl : imgUrl}
                                showUploadList={showUploadList}
                                listType={fileStyle === 'file' ? "text": "picture-card"}
                                fileList={this.state.fileList}
                                onPreview={this.handlePreview}
                                onChange={this.handleChange}
                                beforeUpload={this.beforeUpload}
                                name="attach"
                                headers={{token:sessionStorage.getItem('token_y')}}
                                data= {{businessId:this.props.businessId,businessType:this.props.businessType}}
                                multiple={multiple}
                            >
                                {
                                    uploadTextShow()
                                }
                            </Upload>
                        </div>
                }
                <PictureProcessing carouseCurrentIndex={carouseCurrentIndex} pictureProcessingHandleCancel={this.pictureProcessingHandleCancel} pictureProcessingVisible={pictureProcessingVisible} carouselList={carouselList}/>
            </div>
        );
    }
}

export default PicturesWall

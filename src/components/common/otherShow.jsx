import React from 'react';
import PropTypes from 'prop-types';
import { Divider } from 'antd';
import './style.less'

class OtherShow extends React.Component {
    static propTypes = {
        showContent: PropTypes.array,
        showValues: PropTypes.object
    };

    static defaultProps = {
        showContent: [],
        showValues: {}
    };

    constructor(props) {
        super(props)
        this.state = {
            
        }
    }
    
    render() {
        const { showContent, showValues } = this.props;
        return (
            <div className="other_show">
               {showContent.map((item,index) => 
                    <div key={index}>
                        <Divider>{item.label}</Divider>
                        <div className="show_content">
                            {
                                item.child.map((val,key)=>
                                showValues[val.fieldName] ? showValues[val.fieldName] : ''
                            )}
                            
                        </div>
                    </div>
                )}
            </div>              
        );
    }
}
export default OtherShow
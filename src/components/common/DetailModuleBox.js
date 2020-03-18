import React from 'react';
import PropTypes from 'prop-types';

class DetailModuleBox extends React.Component {
    static propTypes = {
        title: PropTypes.string,
        id: PropTypes.string,
        className: PropTypes.string,
    };

    static defaultProps = {
        title: '',
        className: '',
        id: ''
    };

    constructor(props) {
        super(props)
        this.state = {
            
        }
    }
    
    componentWillMount(){ //预加载数据
       console.log('children',this.props.children)
    }
   
    render() {
        const { children, title, className } = this.props;
        return (
            <div className="tab_main" id={this.props.id} className={className}>
                <div className="tab_module">
                    <div className="module_title font_size_16">
                        <span className="green_tip"></span>{title}
                    </div>
                    <div className="module_main">
                        {
                            children
                        }
                    </div>
                </div>
            </div>              
        );
    }
}
export default DetailModuleBox
import React from 'react';
import PropTypes from 'prop-types';
import { InputNumber, Tooltip } from 'antd';
const maxNum = 100000000000;
//数字千位分隔符格式化
function formatNumber(value) {
    value += '';    
    if (Number(value) > maxNum) {
        value = maxNum
    }
    const list = value.split('.');
    const prefix = list[0].charAt(0) === '-' ? '-' : '';
    let num = prefix ? list[0].slice(1) : list[0];
    let result = '';
    while (num.length > 3) {
        result = `,${num.slice(-3)}${result}`;
        num = num.slice(0, num.length - 3);
    }
    if (num) {
        result = num + result;
    }
    if (list[1] && list[1].length > 2) {
        list[1] = list[1].substring(0, 2)
    }
    if (value.substr(value.length - 1, 1) === '.') {
        return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}.`;
    }
    return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}`;
}

//数字去掉千位分隔符
function delcommafy(num) {
    num = num + ''
    if ((num + "").trim() === "") {
        return "";
    }
    var x = num.split(',');
    return x.join("");
}

//数字大写格式化
function convertCurrency(money) {
    money = money + '';
    //汉字的数字  
    var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
    //基本单位  
    var cnIntRadice = new Array('', '拾', '佰', '仟');
    //对应整数部分扩展单位  
    var cnIntUnits = new Array('', '万', '亿', '兆');
    //对应小数部分单位  
    var cnDecUnits = new Array('角', '分', '毫', '厘');
    //整数金额时后面跟的字符  
    var cnInteger = '整';
    //整型完以后的单位  
    var cnIntLast = '元';
    //金额整数部分  
    var integerNum;
    //处理最大数字
    var maxNumM = maxNum + 0.01;
    //金额小数部分  
    var decimalNum;
    //输出的中文金额字符串  
    var chineseStr = '';
    //分离金额后用的数组，预定义  
    var parts;
    if (money === '') { return ''; }
    money = parseFloat(money);
    if (money >= maxNumM) {
        //超出最大处理数字  
        return '';
    }
    if (money === 0) {
        chineseStr = cnNums[0] + cnIntLast + cnInteger;
        return chineseStr;
    }
    //转换为字符串  
    money = money.toString();
    if (money.indexOf('.') === -1) {
        integerNum = money;
        decimalNum = '';
    } else {
        parts = money.split('.');
        integerNum = parts[0];
        decimalNum = parts[1].substr(0, 2);
    }
    //获取整型部分转换  
    if (parseInt(integerNum, 10) > 0) {
        var zeroCount = 0;
        var IntLen = integerNum.length;
        for (var i = 0; i < IntLen; i++) {
            var n = integerNum.substr(i, 1);
            var p = IntLen - i - 1;
            var q = p / 4;
            var m = p % 4;
            if (n === '0') {
                zeroCount++;
            } else {
                if (zeroCount > 0) {
                    chineseStr += cnNums[0];
                }
                //归零  
                zeroCount = 0;
                chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
            }
            if (m === 0 && zeroCount < 4) {
                chineseStr += cnIntUnits[q];
            }
        }
        chineseStr += cnIntLast;
    }
    //小数部分  
    if (decimalNum !== '') {
        let decLen = decimalNum.length;
        for (let i = 0; i < decLen; i++) {
            let n = decimalNum.substr(i, 1);
            if (n !== '0') {
                chineseStr += cnNums[Number(n)] + cnDecUnits[i];
            }
        }
    }
    if (chineseStr === '') {
        chineseStr += cnNums[0] + cnIntLast + cnInteger;
    } else if (decimalNum === '') {
        chineseStr += cnInteger;
    }
    return chineseStr;
}


class NumericInput extends React.Component {
    static propTypes = {
        form: PropTypes.object.isRequired,
        fieldName: PropTypes.string.isRequired,
        defaultValue: PropTypes.string
    };

    static defaultProps = {
        defaultValue: '',
    };
    constructor(props) {
        super(props);
        this.state = { 
            tooltipVisible: false,
            value: '',
            defaultValue: ''
        };
    }
    componentWillMount(){ //预加载数据
        this.propsDo(this.props)
        
    }
    componentWillReceiveProps(nextProps){ //组件接收到新的props时调用
        this.propsDo(nextProps)
    }

    propsDo = (props) => {
        if (props.defaultValue !== this.state.defaultValue) {
            this.setState({
                value: delcommafy(props.defaultValue),
                defaultValue: props.defaultValue,
            })
        }
    }

    onChange = (value) => {
        console.log('value',value)
        value = delcommafy(value);
        const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
        if ((!Number.isNaN(value) && reg.test(value)) || value === '') {
            this.setState({
                tooltipVisible: value && value !== '-' ? true : false
            })
            value += ''; 
            if (Number(value) > maxNum) {
                value = maxNum+''
            }
            this.setState({
                value: value
            })
        }
    }

    onBlur = (fieldName) => {
        this.setState({
            tooltipVisible: false
        })
        const { value } = this.state;
        if (value) {
            let setValue = {};
            let showNumber = formatNumber(Number(value).toFixed(2))
            setValue[fieldName] = showNumber.replace(/\$\s?|(,*)/g, '');
            this.props.form.setFieldsValue(setValue);
            this.setState({
                value: Number(value).toFixed(2)
            })
        }
    }
    onFocus = (e) => {
        console.log('value1',e.target)
        this.setState({
            tooltipVisible: this.state.value && this.state.value !== '-' ? true : false
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { fieldName } = this.props;
        const { defaultValue, value, tooltipVisible } = this.state;
        const title = value ? (
            <span className="numeric-input-title">
                {value !== '-' ? convertCurrency(value) : '-'}
            </span>
        ) : '';
        return (
            <Tooltip
                trigger={['focus']}
                visible={tooltipVisible}
                title={title}
                placement="topLeft"
                overlayClassName="numeric-input"
            >
                {getFieldDecorator(this.props.fieldName, {
                    initialValue: defaultValue.replace(/\$\s?|(,*)/g, ''),
                    rules: [{ required: this.props.isRequired, message: '必填项!' }]
                })(
                     <InputNumber
                        style={{width: '90%'}}
                        onChange={this.onChange}
                        formatter={val => formatNumber(value)}
                        onBlur={() => this.onBlur(fieldName)}
                        onFocus={this.onFocus}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        max={maxNum}
                        step={'1'}
                        min={0}
                    />
                )}

            </Tooltip>
        );
    }
}

export default NumericInput

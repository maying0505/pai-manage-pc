const numberToCN = ['〇','一','二','三','四','五','六','七','八','九','十',
    '十一','十二','十三','十四','十五','十六','十七','十八','十九',
    '二十','二十一','二十二','二十三','二十四','二十五','二十六','二十七',
    '二十八','二十九','三十','三十一','三十二','三十三','三十四','三十五',
    '三十六','三十七','三十八','三十九','四十','四十一','四十二','四十三','四十四','四十五','四十六',
    '四十七','四十八','四十九','五十','五十一','五十二','五十三','五十四','五十五','五十六',
    '五十七','五十八','五十九'];
//日期转化为大写格式化
function DateAndTimeTrans(datetime){
    //2015-07-18 08:30
    let result = "";
    result += numberToCN[datetime[0]];
    result += numberToCN[datetime[1]];
    result += numberToCN[datetime[2]];
    result += numberToCN[datetime[3]];
    result += "年";
    result += numberToCN[new Number(datetime.substr(5,2))];
    result += "月"
    result += numberToCN[new Number(datetime.substr(8,2))];
    result += "日"
    // result += numberToCN[new Number(datetime.substr(11,2))];
    // result += "点";
    // let tmp = numberToCN[new Number(datetime.substr(14,2))];
    // result += tmp == "〇" ? "整" : tmp + "分";
    return result;
}
export { DateAndTimeTrans }
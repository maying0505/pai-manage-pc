const creatWordShowJson ={
    sellOffInfo: [
        {
            label: '法院',
            isRequired: true,
            child: [
                {
                    fieldName: 'court',
                    value: '',
                    style: 'court1',
                }
            ],
        },
        {
            label: '标的物名称',
            isRequired: true,
            child: [
                {
                    fieldName: 'subjectName',
                    value: '',
                    style: 'input',
                }
            ],
        },
        {
            label: '变卖时间',
            isRequired: true,
            child: [
                {
                    fieldName: 'sellTime',
                    value: '',
                    format: 'YYYY年MM月DD日',
                    style: 'data',
                }
            ],
        },
        {
            label: '变卖价',
            isRequired: true,
            child: [
                {
                    fieldName: 'sellPrice',
                    value: '',
                    style: 'input',
                }
            ],
        },
        {
            label: '变卖预缴款',
            isRequired: true,
            child: [
                {
                    fieldName: 'waitPrice',
                    value: '',
                    style: 'input',
                }
            ],
        },
        {
            label: '保证金',
            isRequired: true,
            child: [
                {
                    fieldName: 'bondPrice',
                    value: '',
                    style: 'input',
                }
            ],
        },
        {
            label: '增价幅度',
            isRequired: true,
            child: [
                {
                    fieldName: 'price',
                    value: '',
                    style: 'input',
                }
            ],
        },
        {
            label: '阿里拍卖法院账户名',
            isRequired: true,
            child: [
                {
                    fieldName: 'aliAccount',
                    value: '',
                    style: 'input',
                }
            ],
        },
        {
            label: '标的链接',
            isRequired: true,
            child: [
                {
                    fieldName: 'bidLink',
                    value: '',
                    style: 'input',
                }
            ],
        },
        {
            label: '辅助机构',
            isRequired: true,
            child: [
                {
                    fieldName: 'company',
                    value: '',
                    style: 'input',
                }
            ],
        },
        {
            label: '看样时间',
            isRequired: true,
            child: [
                {
                    fieldName: 'seeingTime',
                    value: '',
                    format: 'YYYY年MM月DD日',
                    unit: ' ',
                    style: 'data',
                },
                {
                    fieldName: 'seeingTimeStart',
                    value: '',
                    unit: '时~',
                    width: '20',
                    style: 'numberInput',
                },
                {
                    fieldName: 'seeingTimeEnd',
                    value: '',
                    unit: '时',
                    width: '20',
                    style: 'numberInput',
                }
            ],
        },
        {
            label: '特别提醒',
            isRequired: true,
            child: [
                {
                    fieldName: 'remind',
                    value: '',
                    style: 'textarea',
                }
            ],
        },
        {
            label: '优先购买权人说明',
            isRequired: true,
            child: [
                {
                    fieldName: 'explanation',
                    value: '',
                    style: 'textarea',
                }
            ],
        },
        {
            label: '变卖余额缴纳截止日',
            isRequired: true,
            child: [
                {
                    fieldName: 'downTime',
                    value: '',
                    format: 'YYYY年MM月DD日',
                    style: 'data',
                }
            ]
        },
        {
            label: '法院银行账户名',
            isRequired: true,
            child: [
                {
                    fieldName: 'accountName',
                    value: '',
                    style: 'input',
                }
            ],
        },
        {
            label: '开户行',
            isRequired: true,
            child: [
                {
                    fieldName: 'bank',
                    value: '',
                    style: 'input',
                }
            ],
        },
        {
            label: '账号',
            isRequired: true,
            child: [
                {
                    fieldName: 'account',
                    value: '',
                    style: 'input',
                }
            ],
        },
        {
            label: '执行案号',
            isRequired: true,
            child: [
                {
                    fieldName: 'caseNumber',
                    value: '',
                    style: 'input',
                }
            ],
        },
        {
            label: '委托手续截止日',
            isRequired: true,
            child: [
                {
                    fieldName: 'entrustTime',
                    value: '',
                    format: 'YYYY年MM月DD日',
                    style: 'data',
                }
            ]
        },
        {
            label: '举报监督电话',
            isRequired: true,
            child: [
                {
                    fieldName: 'telephone',
                    value: '',
                    style: 'input',
                }
            ],
        },
        {
            label: '法院咨询电话',
            isRequired: true,
            child: [
                {
                    fieldName: 'courtPhone',
                    value: '',
                    style: 'input',
                }
            ],
        },
        {
            label: '法院联系地址',
            isRequired: true,
            child: [
                {
                    fieldName: 'address',
                    value: '',
                    style: 'input',
                }
            ],
        },
        {
            label: '公告时间',
            isRequired: true,
            child: [
                {
                    fieldName: 'noticeTime',
                    value: '',
                    format: 'YYYY年MM月DD日',
                    style: 'data',
                }
            ],
        },
        {
            label: '委托法院名称',
            isRequired: true,
            child: [
                {
                    fieldName: 'trustCourt',
                    value: '',
                    style: 'input',
                }
            ],
        },
        {
            label: '司法辅助人员',
            isRequired: true,
            child: [
                {
                    fieldName: 'worker',
                    value: '',
                    style: 'input',
                }
            ],
        },
        {
            label: '司法辅助人员身份证号',
            isRequired: true,
            child: [
                {
                    fieldName: 'idCard',
                    value: '',
                    style: 'input',
                }
            ],
        },
        {
            label: '委托日期',
            isRequired: true,
            child: [
                {
                    fieldName: 'trustTime',
                    value: '',
                    format: 'YYYY年MM月DD日',
                    style: 'data',
                }
            ],
        },
        {
            label: '承办法官',
            isRequired: true,
            child: [
                {
                    fieldName: 'judge',
                    value: '',
                    style: 'input',
                }
            ],
        },
        {
            label: '承办法官联系电话',
            isRequired: true,
            child: [
                {
                    fieldName: 'judgeNumber',
                    value: '',
                    style: 'input',
                }
            ],
        },
    ],
    auctionInfo: [
        {
            label: '标的物名称',
            isRequired: true,
            child: [
                {
                    fieldName: 'subjectName',
                    value: '',
                    style: 'input',
                }
            ],
        },
        {
            label: '拍卖阶段',
            isRequired: true,
            child: [
                {
                    fieldName: 'auctionStage',
                    value: [
                        {
                            value: '第一次拍卖',
                            text: '第一次拍卖',
                        },
                        {
                            value: '第二次拍卖',
                            text: '第二次拍卖',
                        },
                    ],
                    style: 'select',
                }
            ],
        },
        {
            label: '标的链接',
            isRequired: true,
            child: [
                {
                    fieldName: 'bidLink',
                    value: '',
                    style: 'input',
                }
            ],
        },
        {
            label: '法院',
            isRequired: true,
            child: [
                {
                    fieldName: 'court',
                    value: '',
                    style: 'court1',
                }
            ],
        },
        {
            label: '评估价',
            isRequired: true,
            child: [
                {
                    fieldName: 'evaluationPrice',
                    value: '',
                    style: 'input',
                }
            ],
        },
        {
            label: '起拍价',
            isRequired: true,
            child: [
                {
                    fieldName: 'startPrice',
                    value: '',
                    style: 'input',
                }
            ],
        },
        {
            label: '保证金',
            isRequired: true,
            child: [
                {
                    fieldName: 'bondPrice',
                    value: '',
                    style: 'input',
                }
            ],
        },
        {
            label: '加价幅度',
            isRequired: true,
            child: [
                {
                    fieldName: 'price',
                    value: '',
                    style: 'input',
                }
            ],
        },
        {
            label: '辅助机构',
            isRequired: true,
            child: [
                {
                    fieldName: 'institution',
                    value: '',
                    style: 'input',
                }
            ],
        },
        {
            label: '看样时间',
            isRequired: true,
            child: [
                {
                    fieldName: 'seeingTime',
                    value: '',
                    format: 'YYYY年MM月DD日',
                    unit: ' ',
                    style: 'data',
                },
                {
                    fieldName: 'seeingTimeStart',
                    value: '',
                    unit: '时~',
                    width: '20',
                    style: 'numberInput',
                },
                {
                    fieldName: 'seeingTimeEnd',
                    value: '',
                    unit: '时',
                    width: '20',
                    style: 'numberInput',
                }
            ],
        },
        {
            label: '特别提醒',
            isRequired: true,
            child: [
                {
                    fieldName: 'remind',
                    value: '',
                    style: 'textarea',
                }
            ],
        },
        {
            label: '公告时间',
            isRequired: true,
            child: [
                {
                    fieldName: 'noticeTime',
                    value: '',
                    format: 'YYYY年MM月DD日',
                    style: 'data',
                }
            ],
        },
        {
            label: '阿里拍卖法院账户名',
            isRequired: true,
            child: [
                {
                    fieldName: 'aliAccount',
                    value: '',
                    style: 'input',
                }
            ],
        },
        {
            label: '拍卖时间',
            isRequired: true,
            child: [
                {
                    fieldName: 'auctionTime',
                    value: '',
                    format: 'YYYY年MM月DD日HH时',
                    style: 'dataRangeTime',
                }
            ],
        },
        {
            label: '优先购买权人说明',
            isRequired: true,
            child: [
                {
                    fieldName: 'preemption',
                    value: '',
                    style: 'textarea',
                }
            ],
        },
        {
            label: '缴费时间',
            isRequired: true,
            child: [
                {
                    fieldName: 'payTime',
                    value: '',
                    format: 'YYYY年MM月DD日',
                    style: 'data',
                }
            ],
        },
        {
            label: '法院银行账户名',
            isRequired: true,
            child: [
                {
                    fieldName: 'accountName',
                    value: '',
                    style: 'input',
                }
            ],
        },
        {
            label: '开户行',
            isRequired: true,
            child: [
                {
                    fieldName: 'bank',
                    value: '',
                    style: 'input',
                }
            ],
        },
        {
            label: '账号',
            isRequired: true,
            child: [
                {
                    fieldName: 'account',
                    value: '',
                    style: 'input',
                }
            ],
        },
        {
            label: '举报监督电话',
            isRequired: true,
            child: [
                {
                    fieldName: 'telephone',
                    value: '',
                    style: 'input',
                }
            ],
        },
        {
            label: '法院联系地址',
            isRequired: true,
            child: [
                {
                    fieldName: 'address',
                    value: '',
                    style: 'input',
                }
            ],
        },
        {
            label: '委托手续截止日',
            isRequired: true,
            child: [
                {
                    fieldName: 'entrustTime',
                    value: '',
                    format: 'YYYY年MM月DD日',
                    style: 'data',
                }
            ],
        },
        {
            label: '优先购买权人证明提交截止日',
            isRequired: true,
            child: [
                {
                    fieldName: 'proveTime',
                    value: '',
                    format: 'YYYY年MM月DD日',
                    style: 'data',
                }
            ],
        },
        {
            label: '成交后余额缴纳截止日',
            isRequired: true,
            child: [
                {
                    fieldName: 'downTime',
                    value: '',
                    format: 'YYYY年MM月DD日',
                    style: 'data',
                }
            ],
        },
        {
            label: '签署《网上拍卖成交书》、领取拍卖款收款收据日期',
            isRequired: true,
            child: [
                {
                    fieldName: 'receiptTime',
                    value: '',
                    format: 'YYYY年MM月DD日',
                    style: 'data',
                }
            ],
        },
        {
            label: '法官姓氏',
            isRequired: true,
            child: [
                {
                    fieldName: 'surname',
                    value: '',
                    style: 'input',
                }
            ],
        },
        {
            label: '法官电话',
            isRequired: true,
            child: [
                {
                    fieldName: 'courtPhone',
                    value: '',
                    style: 'input',
                }
            ],
        },
        {
            label: '委托法院名称',
            isRequired: true,
            child: [
                {
                    fieldName: 'trustCourt',
                    value: '',
                    style: 'input',
                }
            ],
        },
        {
            label: '受托方',
            isRequired: true,
            child: [
                {
                    fieldName: 'company',
                    value: '',
                    style: 'input',
                }
            ],
        },
        {
            label: '司法辅助人员',
            isRequired: true,
            child: [
                {
                    fieldName: 'worker',
                    value: '',
                    style: 'input',
                }
            ],
        },
        {
            label: '司法辅助人员身份证号',
            isRequired: true,
            child: [
                {
                    fieldName: 'idCard',
                    value: '',
                    style: 'input',
                }
            ],
        },
        {
            label: '执行案号',
            isRequired: true,
            child: [
                {
                    fieldName: 'caseNumber',
                    value: '',
                    style: 'input',
                }
            ],
        },
        {
            label: '委托日期',
            isRequired: true,
            child: [
                {
                    fieldName: 'trustTime',
                    value: '',
                    format: 'YYYY年MM月DD日',
                    style: 'data',
                }
            ],
        },
        {
            label: '承办法官',
            isRequired: true,
            child: [
                {
                    fieldName: 'judge',
                    value: '',
                    style: 'input',
                }
            ],
        },
        {
            label: '承办法官联系电话',
            isRequired: true,
            child: [
                {
                    fieldName: 'judgeNumber',
                    value: '',
                    style: 'input',
                }
            ],
        },
    ],
}
export default creatWordShowJson
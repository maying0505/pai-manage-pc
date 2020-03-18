const showJson ={
    audit_opinion: [
        {
            label: '',
            child: [
                {
                    fieldName: 'opinion',
                    value: '',
                    style: 'textarea',
                }
            ],
        }
    ],
    standardDetail_others_land: [
        {
            label: '房屋用途',
            child: [
                {
                    fieldName: 'purposes',
                    value: '',
                    style: 'input',
                }
            ],
        },
        {
            label: '土地用途',
            child: [
                {
                    fieldName: 'landUse',
                    value:'',
                    style: 'input'
                }
            ],
        },
        {
            label: '土地性质',
            child: [
                {
                    fieldName: 'landNature',
                    value: '',
                    style: 'input',
                }
            ],
        },
        {
            label: '是否已腾空',
            child: [
                {
                    fieldName: 'vacate',
                    value: [
                        {
                            value: '0',
                            text: '否',
                        },
                        {
                            value: '1',
                            text: '是',
                        }
                    ],
                    style: 'select'
                }
            ],
        },
        {
            label: '租凭情况',
            child: [
                {
                    fieldName: 'lease',
                    value: [
                        {
                            value: '0',
                            text: '未租',
                        },
                        {
                            value: '1',
                            text: '已租',
                        },
                        {
                            value: '2',
                            text: '不详',
                        }
                    ],
                    style: 'select'
                }
            ],
        },
        {
            label: '经营情况',
            child: [
                {
                    fieldName: 'operating',
                    value:'',
                    style: 'input'
                }
            ],
        },
        {
            label: '附属设备',
            child: [
                {
                    fieldName: 'subordinate',
                    value:'',
                    style: 'input'
                }
            ],
        },               
        {
            label: '周边配套',
            child: [
                {
                    fieldName: 'supportingFacilities',
                    value:'',
                    style: 'textarea'
                }
            ],
        },
        {
            label: '其他介绍',
            child: [
                {
                    fieldName: 'other',
                    value:'',
                    style: 'textarea'
                }
            ],
        },
        {
            label: '权证情况',
            operation: 'add',
            class_name: 'flex_add',
            ColMd: 16,
            ColsM: 24,
            child: [
                {
                    fieldName: 'cardName',
                    value: '',
                    style: 'input',
                    showText: '证件',
                    placeholder: '请输入证件',
                    unit: ' '
                },
                {
                    fieldName: 'cardNumber',
                    value: '',
                    style: 'input',
                    showText: '证件号',
                    placeholder: '请输入证件号',
                    unit: ' '
                },
                {
                    fieldName: 'cardDate',
                    value: '',
                    style: 'data',
                    showText: '登记日期',
                    format: 'YYYY-MM-DD',
                    placeholder: '请输入登记日期',
                }
            ],
        },
    ],
    standardDetail_land: [
        {
            label: '标的物名称',
            isRequired: true,
            child: [
                {
                    fieldName: 'subjectMatterName',
                    value: '',
                    style: 'input'
                }
            ],
        },
        {
            label: '拍卖阶段',
            child: [
                {
                    fieldName: 'stage',
                    value: [
                        {
                            value: 0,
                            text: '第一次拍卖',
                        },
                        {
                            value: 1,
                            text: '第二次拍卖',
                        },
                        {
                            value: 2,
                            text: '变卖',
                        }
                    ],
                    style: 'select'
                }
            ],
        },
        {
            label: '被执行人姓名',
            isRequired: true,
            child: [
                {
                    fieldName: 'executorName',
                    value: '',
                    style: 'input'
                }
            ],
        },
        {
            label: '归属地区',
            isRequired: true,
            child: [
                {   
                    fieldName: 'addressBefore',
                    value:'',
                    style: 'area'
                }
            ],
        },
        {
            label: '标的物地址',
            isRequired: true,
            child: [
                {   
                    fieldName: 'address',
                    value:'',
                    style: 'input'
                }
            ],
        },
        {
            label: '钥匙',
            isRequired: true,
            child: [
                {
                    fieldName: 'haveKey',
                    value: [
                        {
                            value: '0',
                            text: '无',
                        },
                        {
                            value: '1',
                            text: '有',
                        }
                    ],
                    style: 'select'
                }
            ],
        },
        {
            label: '评估鉴定基准日',
            class_name: 'flex_evaluateDate',
            child: [
                {
                    fieldName: 'evaluateDate',
                    value: '',
                    style: 'input',
                }
            ],
        },
        {
            label: '评估价',
            child: [
                {
                    fieldName: 'evaluationPrice',
                    value:'',
                    style: 'number',
                    unit: '元',
                    width: '80'
                }
            ],
        },
        {
            label: '起拍价',
            child: [
                {
                    fieldName: 'startintPrice',
                    value:'',
                    style: 'number',
                    unit: '元',
                    width: '80'
                }
            ],
        },
        {
            label: '拍卖时间',
            child: [
                {
                    fieldName: 'auctionTime',
                    value: '',
                    style: 'data'
                }
            ],
        },  
        {
            label: '建筑面积',
            child: [
                {
                    fieldName: 'constructionArea',
                    value: '',
                    style: 'input',
                    unit: '平方米',
                    width: '70'
                }
            ],
        }, 
        {
            label: '公摊面积',
            child: [
                {
                    fieldName: 'publicArea',
                    value: '',
                    style: 'input',
                    unit: '平方米',
                    width: '70'
                }
            ],
        }, 
        {
            label: '土地面积',
            child: [
                {
                    fieldName: 'landArea',
                    value: '',
                    style: 'input',
                    unit: '平方米',
                    width: '70'
                }
            ],
        },
        {
            label: '产品年限',
            child: [
                {
                    fieldName: 'productYears',
                    value: '',
                    style: 'input',
                    unit: '年',
                    width: '70'
                }
            ],
        },   
        {
            label: '查封情况',
            child: [
                {
                    fieldName: 'seal',
                    value:'',
                    style: 'input'
                }
            ],
        },
        {
            label: '抵押情况',
            child: [
                {
                    fieldName: 'mortgage',
                    value:'',
                    style: 'input',
                }
            ],
        },  
        {
            label: '提供的文件',
            child: [
                {
                    fieldName: 'file',
                    mode: true,
                    value: [
                        {
                            value: 0,
                            text: '法院裁定书',
                        },
                        {
                            value: 1,
                            text: '协助执行通知书',
                        },
                        {
                            value: 2,
                            text: '拍卖成交确认书',
                        }
                    ],
                    style: 'select'
                }
            ],
        },
    ],
    standardDetail_vehicle: [       
        {
            label: '标的物名称',
            isRequired: true,
            child: [
                {
                    fieldName: 'subjectMatterName',
                    value: '',
                    style: 'input'
                }
            ],
        },
        {
            label: '拍卖阶段',
            child: [
                {
                    fieldName: 'stage',
                    value: [
                        {
                            value: 0,
                            text: '第一次拍卖',
                        },
                        {
                            value: 1,
                            text: '第二次拍卖',
                        },
                        {
                            value: 2,
                            text: '变卖',
                        }
                    ],
                    style: 'select'
                }
            ],
        },
        {
            label: '品牌车型',
            isRequired: true,
            child: [
                {
                    fieldName: 'brand',
                    value: '',
                    style: 'input'
                }
            ],
        },
        {
            label: '评估鉴定基准日',
            class_name: 'flex_evaluateDate',
            child: [
                {
                    fieldName: 'evaluateDate',
                    value: '',
                    style: 'input',
                }
            ],
        },
        {
            label: '被执行人姓名',
            isRequired: true,
            child: [
                {
                    fieldName: 'executorName',
                    value: '',
                    style: 'input'
                }
            ],
        },
        {
            label: '车牌号',
            isRequired: true,
            child: [
                {
                    fieldName: 'carPlate',
                    value: '',
                    style: 'input'
                }
            ],
        },
        {
            label: '查封情况',
            child: [
                {
                    fieldName: 'seal',
                    value:'',
                    style: 'input'
                }
            ],
        },
        {
            label: '归属地区',
            isRequired: true,
            child: [
                {   
                    fieldName: 'addressBefore',
                    value:'',
                    style: 'area'
                }
            ],
        },                              
        {
            label: '评估价',
            child: [
                {
                    fieldName: 'evaluationPrice',
                    value:'',
                    style: 'number',
                    unit: '元',
                    width: '80'
                }
            ],
        },
        {
            label: '抵押情况',
            child: [
                {
                    fieldName: 'mortgage',
                    value:'',
                    style: 'input',
                }
            ],
        },
        {
            label: '钥匙',
            isRequired: true,
            child: [
                {
                    fieldName: 'haveKey',
                    value: [
                        {
                            value: '0',
                            text: '无',
                        },
                        {
                            value: '1',
                            text: '有',
                        }
                    ],
                    style: 'select'
                }
            ],
        },
        {
            label: '起拍价',
            child: [
                {
                    fieldName: 'startintPrice',
                    value:'',
                    style: 'number',
                    unit: '元',
                    width: '80'
                }
            ],
        },
        {
            label: '使用性质',
            child: [
                {
                    fieldName: 'nature',
                    value: [
                        {
                            value: '0',
                            text: '货运',
                        },
                        {
                            value: '1',
                            text: '客运',
                        },
                        {
                            value: '2',
                            text: '营运',
                        },
                        {
                            value: '3',
                            text: '出租',
                        },
                        {
                            value: '4',
                            text: '其他',
                        }
                    ],
                    style: 'select'
                }
            ],
        },
        {
            label: '停放所在地',
            isRequired: true,
            child: [
                {
                    fieldName: 'address',
                    value:'',
                    style: 'input',
                }
            ],
        },
        {
            label: '拍卖时间',
            child: [
                {
                    fieldName: 'auctionTime',
                    value: '',
                    style: 'data'
                }
            ],
        },   
        {
            label: '提供的文件',
            child: [
                {
                    fieldName: 'file',
                    mode: true,
                    value: [
                        {
                            value: 0,
                            text: '法院裁定书',
                        },
                        {
                            value: 1,
                            text: '协助执行通知书',
                        },
                        {
                            value: 2,
                            text: '拍卖成交确认书',
                        }
                    ],
                    style: 'select'
                }
            ],
        }
    ],
    standardDetail_others_vehicle: [
        {
            label: 'VPN码',
            child: [
                {
                    fieldName: 'vin',
                    value: '',
                    style: 'input'
                }
            ],
        },    
        {
            label: '车辆类型',
            child: [
                {
                    fieldName: 'carType',
                    value: [
                        {
                            value: '0',
                            text: '轿车',
                        },
                        {
                            value: '1',
                            text: '客车',
                        },
                        {
                            value: '2',
                            text: '载货车',
                        },
                        {
                            value: '3',
                            text: '挂车',
                        },
                        {
                            value: '4',
                            text: '摩托车',
                        },
                        {
                            value: '5',
                            text: '其他',
                        }
                    ],
                    style: 'select'
                }
            ],
        },  
        {
            label: '车辆出厂日期',
            child: [
                {
                    fieldName: 'releaseDate',
                    value:'',
                    format: 'YYYY-MM-DD',
                    style: 'data',
                }
            ],
        }, 
        {
            label: '发动机型号',
            child: [
                {
                    fieldName: 'engineType',
                    value:'',
                    style: 'input',
                }
            ],
        },   
        {
            label: '变速箱类型',
            child: [
                {
                    fieldName: 'gearBoxType',
                    value: '',
                    style: 'input',
                }
            ],
        },
        {
            label: '车辆初次登记日期',
            child: [
                {
                    fieldName: 'registerDate',
                    value: '',
                    format: 'YYYY-MM-DD',
                    style: 'data',
                }
            ],
        },
        {
            label: '发动机编号',
            child: [
                {
                    fieldName: 'engineNumber',
                    value:'',
                    style: 'input',
                }
            ],
        },
        {
            label: '违章记录',
            child: [
                {
                    fieldName: 'violation',
                    value: '',
                    style: 'input',
                }
            ],
        },
        {
            label: '年审有效终止日期',
            child: [
                {
                    fieldName: 'examineDate',
                    value: '',
                    format: 'YYYY-MM-DD',
                    style: 'data',
                }
            ],
        },
        {
            label: '发动机功率',
            child: [
                {
                    fieldName: 'enginePower',
                    value:'',
                    style: 'input',
                    unit: 'KW',
                    width: '80'
                }
            ],
        },
        {
            label: '燃料种类',
            child: [
                {
                    fieldName: 'fuelType',
                    value: [
                        {
                            value: '0',
                            text: '汽油',
                        },
                        {
                            value: '1',
                            text: '柴油',
                        },
                        {
                            value: '2',
                            text: '混合油',
                        },
                        {
                            value: '3',
                            text: '电',
                        },
                        {
                            value: '4',
                            text: '太阳能',
                        },
                        {
                            value: '5',
                            text: '其他',
                        }
                    ],
                    style: 'select'
                }
            ],
        },
        {
            label: '排量（L）',
            child: [
                {
                    fieldName: 'displacement',
                    value:'',
                    style: 'input',
                }
            ],
        },
        {
            label: '排放标准',
            child: [
                {
                    fieldName: 'standard',
                    value: [
                        {
                            value: '0',
                            text: '国I',
                        },
                        {
                            value: '1',
                            text: '国Ⅱ',
                        },
                        {
                            value: '2',
                            text: '国Ⅲ',
                        },
                        {
                            value: '3',
                            text: '国Ⅳ',
                        },
                        {
                            value: '4',
                            text: '国Ⅴ',
                        },
                        {
                            value: '5',
                            text: '国Ⅵ',
                        },
                        {
                            value: '6',
                            text: '其他',
                        }
                    ],
                    style: 'select'
                }
            ],
        },
        {
            label: '车身颜色',
            child: [
                {
                    fieldName: 'carColor',
                    value: '',
                    style: 'input'
                }
            ],
        },   
        {
            label: '强制保险终止日期',
            child: [
                {
                    fieldName: 'insuranceDate',
                    value: '',
                    format: 'YYYY-MM-DD',
                    style: 'data'
                }
            ],
        },    
        {
            label: '行车里程',
            child: [
                {
                    fieldName: 'mileage',
                    value: '',
                    unit: 'KM',
                    width: '80',
                    style: 'input'
                }
            ],
        },                       
        {
            label: '瑕疵情况',
            child: [
                {
                    fieldName: 'defect',
                    value: '',
                    style: 'textarea'
                }
            ],
        },
        {
            label: '配备情况',
            child: [
                {
                    fieldName: 'toDeploy',
                    value: '',
                    style: 'textarea'
                }
            ],
        },
        {
            label: '权证情况',
            operation: 'add',
            class_name: 'flex_add',
            ColMd: 16,
            ColsM: 24,
            child: [
                {
                    fieldName: 'cardName',
                    value: '',
                    style: 'input',
                    showText: '证件',
                    placeholder: '请输入证件',
                    unit: ' '
                },
                {
                    fieldName: 'cardNumber',
                    value: '',
                    style: 'input',
                    showText: '证件号',
                    placeholder: '请输入证件号',
                    unit: ' '
                },
                {
                    fieldName: 'cardDate',
                    value: '',
                    style: 'data',
                    showText: '登记日期',
                    format: 'YYYY-MM-DD',
                    placeholder: '请输入登记日期',
                }
            ],
        },
    ],
    auctionDetail: [
        {
            label: '移交时间',
            isRequired: true,
            child: [
                {
                    fieldName: 'transferDate',
                    value: '',
                    style: 'data'
                }
            ],
        },
        {
            label: '处置法院',
            isRequired: true,
            child: [
                {   
                    fieldName: 'courtJudge',
                    value: '',
                    style: 'court'
                }
            ],
        },
        {
            label: '勘验时间',
            isRequired: true,
            child: [
                {
                    fieldName: 'inquestDate',
                    value:'',
                    style: 'data'
                }
            ],
        },
        {
            label: '勘验人员',
            isRequired: true,
            child: [
                {
                    fieldName: 'inquestId',
                    value: '',
                    style: 'outsideOperator'
                }
            ],
        },           
        {
            label: '竞价周期',
            child: [
                {
                    fieldName: 'biddingCycle',
                    value:'',
                    style: 'input',
                    unit: ' 小时',
                    width: '70'
                }
            ],
        },
        {
            label: '加价幅度',
            child: [
                {
                    fieldName: 'price',
                    value:'',
                    style: 'number',
                    unit: ' 元',
                    width: '80'
                }
            ],
        },
        {
            label: '拍卖方式',
            child: [
                {
                    fieldName: 'auction',
                    value: [
                        {
                            value: '0',
                            text: '线上',
                        },
                        {
                            value: '1',
                            text: '线下',
                        }
                    ],
                    style: 'select'
                }
            ],
        },
        {
            label: '拍卖平台',
            child: [
                {
                    fieldName: 'auctionPlatform',
                    value:'',
                    style: 'input',
                    disabled: true,
                    placeholder: '请输入拍卖平台',
                    unit: ' ',
                },
                {
                    fieldName: 'auctionLink',
                    value:'',
                    disabled: true,
                    style: 'input',
                    placeholder: '请输入拍卖链接',
                }
            ],
        },
        {
            label: '保证金',
            child: [
                {
                    fieldName: 'bond',
                    value:'',
                    style: 'number',
                    unit: ' 元',
                    width: '80'
                }
            ],
        },
        {
            label: '保留价',
            child: [
                {
                    fieldName: 'reservePrice',
                    value: [
                        {
                            value: '0',
                            text: '无',
                        },
                        {
                            value: '1',
                            text: '有',
                        }
                    ],
                    style: 'select'
                }
            ],
        },
        {
            label: '优先购买权',
            child: [
                {
                    fieldName: 'preemption',
                    value: [
                        {
                            value: '0',
                            text: '无',
                        },
                        {
                            value: '1',
                            text: '有',
                        }
                    ],
                    style: 'select'
                }
            ],
        },
    ],
    standardDetail_house: [
        {
            label: '标的物名称',
            isRequired: true,
            child: [
                {
                    fieldName: 'subjectMatterName',
                    value: '',
                    style: 'input'
                }
            ],
        },
        {
            label: '拍卖阶段',
            child: [
                {
                    fieldName: 'stage',
                    value: [
                        {
                            value: 0,
                            text: '第一次拍卖',
                        },
                        {
                            value: 1,
                            text: '第二次拍卖',
                        },
                        {
                            value: 2,
                            text: '变卖',
                        }
                    ],
                    style: 'select'
                }
            ],
        },
        {
            label: '评估价',
            child: [
                {
                    fieldName: 'evaluationPrice',
                    value:'',
                    style: 'number',
                    unit: '元',
                    width: '80'
                }
            ],
        },
        {
            label: '产品年限',
            child: [
                {
                    fieldName: 'productYears',
                    value:'',
                    style: 'input',
                    unit: ' 年'
                }
            ],
        },
        {
            label: '被执行人姓名',
            isRequired: true,
            child: [
                {
                    fieldName: 'executorName',
                    value: '',
                    style: 'input'
                }
            ],
        },
        {
            label: '起拍价',
            child: [
                {
                    fieldName: 'startintPrice',
                    value:'',
                    style: 'number',
                    unit: '元',
                    width: '80'
                }
            ],
        },
        {
            label: '装修程度',
            child: [
                {
                    fieldName: 'decoration',
                    style: 'select',
                    value: [
                        {
                            value: '0',
                            text: '豪华装修',
                        },
                        {
                            value: '1',
                            text: '精装修',
                        },
                        {
                            value: '2',
                            text: '中装修',
                        },
                        {
                            value: '3',
                            text: '简装修',
                        },
                        {
                            value: '4',
                            text: '毛坯',
                        },
                        {
                            value: '5',
                            text: '其他',
                        }
                    ],
                }
            ],
        },
        {
            label: '归属地区',
            isRequired: true,
            child: [
                {   
                    fieldName: 'addressBefore',
                    value:'',
                    style: 'area'
                }
            ],
        },
        {
            label: '拍卖时间',
            child: [
                {
                    fieldName: 'auctionTime',
                    value:'',
                    style: 'data'
                }
            ],
        },
        {
            label: '查封情况',
            child: [
                {
                    fieldName: 'seal',
                    value:'',
                    style: 'input'
                }
            ],
        },
        {
            label: '楼盘名称',
            child: [
                {
                    fieldName: 'building',
                    value: '',
                    style: 'input'
                }
            ],
        },
        {
            label: '建筑面积',
            child: [
                {
                    fieldName: 'constructionArea',
                    value: '',
                    style: 'input',
                    unit: ' 平方米',
                    width: '60'
                }
            ],
        },
        {
            label: '抵押情况',
            child: [
                {
                    fieldName: 'mortgage',
                    value:'',
                    style: 'input'
                }
            ],
        },
        {
            label: '标的物地址',
            isRequired: true,
            child: [
                {
                    fieldName: 'address',
                    value:'',
                    style: 'input'
                }
            ],
        },   
        {
            label: '公摊面积',
            child: [
                {
                    fieldName: 'publicArea',
                    value: '',
                    style: 'input',
                    unit: ' 平方米',
                    width: '60'
                }
            ],
        },
        {
            label: '钥匙',
            isRequired: true,
            child: [
                {
                    fieldName: 'haveKey',
                    value: [
                        {
                            value: '0',
                            text: '无',
                        },
                        {
                            value: '1',
                            text: '有',
                        }
                    ],
                    style: 'select'
                }
            ],
        },
        {
            label: '土地面积',
            child: [
                {
                    fieldName: 'landArea',
                    value: '',
                    style: 'input',
                    unit: ' 平方米',
                    width: '60'
                }
            ],
        },
        {
            label: '评估鉴定基准日',
            class_name: 'flex_evaluateDate',
            child: [
                {
                    fieldName: 'evaluateDate',
                    value: '',
                    style: 'input',
                }
            ],
        },
        {
            label: '提供的文件',
            child: [
                {
                    fieldName: 'file',
                    mode: true,
                    value: [
                        {
                            value: 0,
                            text: '法院裁定书',
                        },
                        {
                            value: 1,
                            text: '协助执行通知书',
                        },
                        {
                            value: 2,
                            text: '拍卖成交确认书',
                        }
                    ],
                    style: 'select'
                }
            ],
        },               
    ],
    standardDetailTaxFee_buy: [
        {
            label: '契税',
            child: [
                {
                    fieldName: 'deedTax',
                    value:'',
                    style: 'input'
                }
            ],
        },
        {
            label: '印花税',
            child: [
                {
                    fieldName: 'printingTax',
                    value:'',
                    style: 'input'
                }
            ],
        },
        {
            label: '交易费',
            child: [
                {
                    fieldName: 'transactionTax',
                    value:'',
                    style: 'input'
                }
            ],
        },
        {
            label: '测绘费',
            child: [
                {
                    fieldName: 'mappingFee',
                    value:'',
                    style: 'input'
                }
            ],
        },
        {
            label: '权证登记费及取证费',
            child: [
                {
                    fieldName: 'registrationFee',
                    value:'',
                    style: 'input'
                }
            ],
        },
    ],
    standardDetailTaxFee_sell: [
        {
            label: '增值税',
            child: [
                {
                    fieldName: 'appreciationTax',
                    value:'',
                    style: 'input'
                }
            ],
        },
        {
            label: '城建税',
            child: [
                {
                    fieldName: 'constructionTax',
                    value:'',
                    style: 'input'
                }
            ],
        },
        {
            label: '印花税',
            child: [
                {
                    fieldName: 'sellerPrintingTax',
                    value:'',
                    style: 'input'
                }
            ],
        },
        {
            label: '营业税',
            child: [
                {
                    fieldName: 'openTax',
                    value:'',
                    style: 'input'
                }
            ],
        },
        {
            label: '个人所得税',
            child: [
                {
                    fieldName: 'personalTax',
                    value:'',
                    style: 'input'
                }
            ],
        },
        
    ],
    standardDetailTaxFee_common: [
        {
            label: '其它税费',
            child: [
                {
                    fieldName: 'otherTax',
                    value:'',
                    style: 'input'
                }
            ],
        },
    ],
    standardDetail_others_house: [
        {
            label: '户型',
            child: [
                {
                    fieldName: 'room',
                    value: '',
                    style: 'input',
                    unit: '室',
                    width: '14'
                },
                {
                    fieldName: 'hall',
                    value: '',
                    style: 'input',
                    unit: '厅',
                    width: '14'
                },
                {
                    fieldName: 'kitchen',
                    value: '',
                    style: 'input',
                    unit: '厨',
                    width: '14'
                },
                {
                    fieldName: 'guard',
                    value: '',
                    style: 'input',
                    unit: '卫',
                    width: '14'
                },
                {
                    fieldName: 'balcony',
                    value: '',
                    style: 'input',
                    unit: '阳台',
                    width: '14'
                }
            ],
        },
        {
            label: '建筑年代',
            child: [
                {
                    fieldName: 'buildingAge',
                    value:'',
                    style: 'input',
                    unit: ' 年'
                }
            ],
        },
        {
            label: '楼层',
            child: [
                {
                    fieldName: 'floor',
                    value:'',
                    style: 'input',
                    unit: '层 ',
                    beforeText: '第',
                    width: '30'
                },
                {
                    fieldName: 'allFloor',
                    value:'',
                    style: 'input',
                    unit: '层',
                    beforeText: '共',
                    width: '30'
                }
            ],
        },
        {
            label: '朝向',
            child: [
                {
                    fieldName: 'oriented',                           
                    value: [
                        {
                            value: '0',
                            text: '东',
                        },
                        {
                            value: '1',
                            text: '南',
                        },
                        {
                            value: '2',
                            text: '西',
                        },
                        {
                            value: '3',
                            text: '北',
                        },
                        {
                            value: '4',
                            text: '东西',
                        },
                        {
                            value: '5',
                            text: '南北',
                        },
                        {
                            value: '6',
                            text: '东南',
                        },
                        {
                            value: '7',
                            text: '西南',
                        },
                        {
                            value: '8',
                            text: '东北',
                        },
                        {
                            value: '9',
                            text: '西北',
                        },
                    ],
                    style: 'select'
                }
            ],
        },
        {
            label: '房屋用途',
            child: [
                {
                    fieldName: 'purposes',
                    value: '',
                    style: 'input'
                }
            ],
        },
        {
            label: '是否已腾空',
            child: [
                {
                    fieldName: 'vacate',
                    value: [
                        {
                            value: '0',
                            text: '否',
                        },
                        {
                            value: '1',
                            text: '是',
                        }
                    ],
                    style: 'select'
                }
            ],
        }, 
        {
            label: '土地性质',
            child: [
                {
                    fieldName: 'landNature',
                    value: '',
                    style: 'input',
                }
            ],
        },   
        {
            label: '租赁情况',
            child: [
                {
                    fieldName: 'lease',
                    value: [
                        {
                            value: '0',
                            text: '未租',
                        },
                        {
                            value: '1',
                            text: '已租',
                        },
                        {
                            value: '2',
                            text: '不详',
                        }
                    ],
                    style: 'select'
                }
            ],
        },            
        {
            label: '土地用途',
            child: [
                {
                    fieldName: 'landUse',
                    value:'',
                    style: 'input'
                }
            ],
        },
        {
            label: '过户情况',
            child: [
                {
                    fieldName: 'transfer',
                    value:'',
                    style: 'input'
                }
            ],
        },
        {
            label: '经营情况',
            child: [
                {
                    fieldName: 'operating',
                    value:'',
                    style: 'input'
                }
            ],
        },
        {
            label: '权证情况',
            operation: 'add',
            class_name: 'flex_add',
            ColMd: 16,
            ColsM: 24,
            child: [
                {
                    fieldName: 'cardName',
                    value: '',
                    style: 'input',
                    showText: '证件',
                    placeholder: '请输入证件',
                    disabled: true,
                    disabledText: ['土地产权证','房屋产权证','不动产权登记证'],
                    unit: ' '
                },
                {
                    fieldName: 'cardNumber',
                    value: '',
                    style: 'input',
                    showText: '证件号',
                    placeholder: '请输入证件号',
                    unit: ' '
                },
                {
                    fieldName: 'cardDate',
                    value: '',
                    style: 'data',
                    showText: '登记日期',
                    format: 'YYYY-MM-DD',
                    placeholder: '请输入登记日期',
                }
            ],
        },
    ],
    standardDetailOtherFee_house: [
        {
            label: '物业费',
            child: [
                {
                    fieldName: 'propertyFee',
                    value:'',
                    unit: '元',
                    width: '80',
                    style: 'number'
                }
            ],
        },
        {
            label: '水费',
            child: [
                {
                    fieldName: 'waterFee',
                    value:'',
                    unit: '元',
                    width: '80',
                    style: 'number'
                }
            ],
        },
        {
            label: '电费',
            child: [
                {
                    fieldName: 'electricityFee',
                    value:'',
                    unit: '元',
                    width: '80',
                    style: 'number'
                }
            ],
        },
        {
            label: '煤气/天然气费',
            child: [
                {
                    fieldName: 'coalFee',
                    value:'',
                    unit: '元',
                    width: '80',
                    style: 'number'
                }
            ],
        },
        {
            label: '取暖费',
            child: [
                {
                    fieldName: 'heatingFee',
                    value:'',
                    unit: '元',
                    width: '80',
                    style: 'number'
                }
            ],
        },
        {
            label: '其他费用',
            child: [
                {
                    fieldName: 'otherFee',
                    value:'',
                    unit: '元',
                    width: '80',
                    style: 'number'
                }
            ],
        },
    ],
    standardDetailOtherFee_dataSources_house: [
        {
            label: '数据来源',
            child: [
                {
                    fieldName: 'propertyFeeSource',
                    value:'',
                    style: 'input'
                }
            ],
        },
        {
            label: '数据来源',
            child: [
                {
                    fieldName: 'waterFeeSource',
                    value:'',
                    style: 'input'
                }
            ],
        },
        {
            label: '数据来源',
            child: [
                {
                    fieldName: 'electricityFeeSource',
                    value:'',
                    style: 'input'
                }
            ],
        },
        {
            label: '数据来源',
            child: [
                {
                    fieldName: 'coalFeeSource',
                    value:'',
                    style: 'input'
                }
            ],
        },
        {
            label: '数据来源',
            child: [
                {
                    fieldName: 'heatingFeeSource',
                    value:'',
                    style: 'input'
                }
            ],
        },
        {
            label: '数据来源',
            child: [
                {
                    fieldName: 'otherFeeSource',
                    value:'',
                    style: 'input'
                }
            ],
        },
    ],
    standardDetailDistrictMatching_1_house: [
        {
            label: '供水',
            child: [
                {
                    fieldName: 'water',
                    value:'',
                    style: 'input'
                }
            ],
        },
        {
            label: '电梯',
            child: [
                {
                    fieldName: 'elevator',
                    value:'',
                    style: 'input'
                }
            ],
        },
        {
            label: '开发商',
            child: [
                {
                    fieldName: 'developer',
                    value:'',
                    style: 'input'
                }
            ],
        },
        {
            label: '停车位',
            child: [
                {
                    fieldName: 'parking',
                    value:'',
                    style: 'input'
                }
            ],
        },
        {
            label: '物业电话',
            child: [
                {
                    fieldName: 'propertyPhone',
                    value:'',
                    style: 'input'
                }
            ],
        },
    ],
    standardDetailDistrictMatching_2_house: [
        {
            label: '供电',
            child: [
                {
                    fieldName: 'electrical',
                    value:'',
                    style: 'input'
                }
            ],
        },
        {
            label: '天然气',
            child: [
                {
                    fieldName: 'naturalGas',
                    value:'',
                    style: 'input'
                }
            ],
        },
        {
            label: '物业费',
            child: [
                {
                    fieldName: 'propertyCompany',
                    value:'',
                    style: 'input'
                }
            ],
        },
        {
            label: '物业公司',
            child: [
                {
                    fieldName: 'propertyCompanyTwo',
                    value:'',
                    style: 'input'
                }
            ],
        },
        {
            label: '小区入口',
            child: [
                {
                    fieldName: 'intake',
                    value:'',
                    style: 'input'
                }
            ],
        },
    ],
    standardDetailPeripheralEnvironment_1_house: [
        {
            label: '交通',
            child: [
                {
                    fieldName: 'traffic',
                    value:'',
                    style: 'input'
                }
            ],
        },
        {
            label: '医院',
            child: [
                {
                    fieldName: 'hospital',
                    value:'',
                    style: 'input'
                }
            ],
        },
        {
            label: '小学',
            child: [
                {
                    fieldName: 'primarySchool',
                    value:'',
                    style: 'input'
                }
            ],
        },
    ],
    standardDetailPeripheralEnvironment_2_house: [
        {
            label: '商场',
            child: [
                {
                    fieldName: 'market',
                    value:'',
                    style: 'input'
                }
            ],
        },
        {
            label: '幼儿园',
            child: [
                {
                    fieldName: 'kindergarten',
                    value:'',
                    style: 'input'
                }
            ],
        },
        {
            label: '中学',
            child: [
                {
                    fieldName: 'middleSchool',
                    value:'',
                    style: 'input'
                }
            ],
        },
    ],           
    othersDetail: [
        {
            label: '重要提示',
            child: [
                {
                    fieldName: 'importantHint',
                    value:'',
                    style: 'textarea'
                }
            ],
        },
        {
            label: '其他说明',
            child: [
                {
                    fieldName: 'otherInstructions',
                    value:'',
                    style: 'textarea'
                }
            ],
        },
    ],
};
export default showJson;
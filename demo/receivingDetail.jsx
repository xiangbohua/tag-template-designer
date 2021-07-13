// api
import { confirmToWarehouseByOrder, detail, getMoreOrderList, postPrint, search } from '@/api/inspection'
import ArrowBottomIcon from '@/assets/images/arrow-bottom-icon.png'
import ArrowRightIcon from '@/assets/images/arrow-right-icon.png'
import BottomScanIcon from '@/assets/images/bottom-scan-icon.png'
// icon
import DaocangjiluIcon from '@/assets/images/daocangjilu-icon.png'
import DaocangjiluUnusedIcon from '@/assets/images/daocangjilu-unused-icon.png'
import InspectionList1 from '@/assets/images/inspection-list-1.png'
import WorkOrderIcon from '@/assets/images/inspection-work-order.png'
import NoticeIcon from '@/assets/images/notice-icon.png'
import OriginIcon from '@/assets/images/origin-icon.png'
import orderSigningicon from '@/assets/images/orderSigningicon.png'
// components
import CustomAlert from '@/components/CustomAlert/CustomAlert'
import OperaListComponent from '@/components/RelationOperaList/RelationOperaList'
import WorkOrderListComponent from '@/components/RelationWorkOrder/RelationWorkOrder'
import WaresTag from '@/template/waresTag'
// print
import bluetoothErrorCode from '@/utils/bluetoothErrorCode'
import { Image, Input, Text, View } from '@tarojs/components'
import Taro, { Component } from '@tarojs/taro'
// business components
import GoodsInfoComponent from './goodsInfo/goodsInfo'
import MoreInspectionListComponent from './moreInspectionList/moreInspectionList'
// styl
import './receivingDetail.styl'
import WarrantyInfoComponent from './warrantyInfo/warrantyInfo'







class ReceivingDetail extends Component {
  constructor(props) {
    super(props);
  }

  // eslint-disable-next-line react/sort-comp
  static options = {
    addGlobalClass: true
  };

  config = {
    navigationBarTitleText: '售后单详情',
    enablePullDownRefresh: true
  }

  state = {
    afterSaleOrderNo: '',
    detail: {},
    moreInspectionList: [], // 更多售后单
    isShowMore: false,
    isShowAlert: false,
    isLoading: true,
    isShowNotOperaAlert: false,
    page: 0,
    size: 10,
    isShowArrivalRecordDetail: false, // 是否展示售后记录详情
    isShowWarehouseAlert: false,
    isShowResultAlert: false,
    resultAlertMessage: '',
    isCanTapEnterWarehouse: false,
    scrollTimer: null, // 页面滚动定时器
    isShowApplyWorkOrder: false, // 页面滚动工单开关
    hideDomeType: false
  }

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.getDetail()
  }

  async componentDidMount() {
    this.setState({
      afterSaleOrderNo: this.$router.preload.afterSaleNo
    }, this.getDetail)
  }

  componentDidShow() {
    Taro.getStorage({
      key: 'IS_LOAD_DATA',
      success: () => {
        this.getDetail(true)
        Taro.removeStorage({ key: 'IS_LOAD_DATA' })
      },
      fail: () => {

      }
    })
  }

  onReachBottom() {
    if (!this.state.isShowMore) return

    this.getMoreOrderListData(this.state.detail)
  }

  async getMoreOrderListData({ customerId }) {
    try {
      const { content = [] } = await getMoreOrderList({
        customerId,
        excludeAfterSaleOrderNumbers: this.state.afterSaleOrderNo,
        page: this.state.page,
        size: this.state.size
      }) || {}

      if (Array.isArray(content) && content.length > 0) {
        this.setState({ moreInspectionList: [...this.state.moreInspectionList, ...content], page: this.state.page + 1 })
      }
    } catch (e) {
      Taro.showToast({ title: e.message, icon: 'none' })
    }
  }

  async getDetail(isLoadData = false) {
    Taro.showLoading({ title: '请稍等...' })

    try {
      this.setState({
        hideDomeType: false
      })
      let afterSaleOrderNo = this.state.afterSaleOrderNo

      if (!(afterSaleOrderNo.includes('AS') || afterSaleOrderNo.includes('as'))) {
        const { content = [] } = await search({ searchKey: afterSaleOrderNo, searchType: 0, page: 0, size: 10 }) || {}
        if (Array.isArray(content) && content.length > 0) {
          afterSaleOrderNo = content[0].afterSaleNo
        }
      }

      const detailResult = await detail({ afterSaleOrderNo })
      Taro.hideLoading()
      Taro.stopPullDownRefresh()

      detailResult.createExceptionOrderButton = 0
      let responsibilityList = [{ id: 0, name: '' }, { id: 1, name: '锐锢' }, { id: 2, name: '供应商' }, { id: 3, name: '客户' }]
      detailResult.responsibilityName = (responsibilityList.find(item => item.id == detailResult.responsibility) || {}).name || ''
      detailResult.imageUrls = [detailResult.productImage, ...(detailResult.imageUrls || []).splice(0, 3)].map(item => {
        return {
          url: item,
          format: '!upyun520/fw/138'
        }
      }) // 获取图片

      this.setState({
        detail: detailResult,
        isLoading: false,
        isShowNotOperaAlert: detailResult.noDataWindow,
        isCanTapEnterWarehouse: detailResult.confirmArrivalButton == 1,
        hideDomeType: true,
        afterSaleOrderNo: detailResult.afterSaleOrderNo
      }, () => {
        this.getMoreOrderListData({ customerId: detailResult.customerId }) // 展开更多售后单
        // this.setWarehousePower()
      })
    } catch (e) {
      Taro.hideLoading()
      Taro.stopPullDownRefresh()
      if (isLoadData) return
      Taro.showToast({ title: e.message, icon: 'none' })
      setTimeout(() => {
        Taro.navigateBack()
      }, 1000)
    }
  }

  // async setWarehousePower() {
  //   try {
  //     const isAdmin = await checkAdmin()
  //     this.setState({
  //       isCanTapEnterWarehouse: isAdmin && this.state.detail.checkStatus === 1
  //     })
  //   } catch (e) {
  //     Taro.showToast({title: e.message, icon: 'none'})
  //   }
  // }



  async onTapScan() {
    try {
      const { result } = await Taro.scanCode()

      this.setState({
        isLoading: true,
        afterSaleOrderNo: result,

      }, this.getDetail)
    } catch (e) {
      Taro.showToast({ title: e.message, icon: 'none' })
    }
  }

  /**
   * 获取打印数据
   * @returns {Promise<{}|boolean>}
   */
  async getPrintData() {
    try {
      const printData = await postPrint(this.state.detail.afterSaleOrderNo)
      return { ...printData }
    } catch (e) {
      Taro.showToast({ title: e.message, icon: 'none' })
      return false
    }
  }

  async onTapEnter() {
    // 获取打印数据
    const printDataResult = await this.getPrintData()
    if (!printDataResult) {
      return false
    }

    Taro.showLoading({ title: '打印中...' })
    try {
      await Taro.openBluetoothAdapter() // 初始化蓝牙模块

      // 检测蓝牙是否开启
      const { available = false } = await Taro.getBluetoothAdapterState() || {}
      if (!available) {
        Taro.showModal({ title: '请打开手机蓝牙' })
        return
      }

      // 检测当前本地缓存是否有打印机蓝牙信息。存在则直接连接，不存在则跳转至蓝牙连接页连接打印机
      const { deviceId = '', serviceId = '', characteristics = '' } = Taro.getStorageSync('BLUETOOTH_PRINTER_INFO') || {}
      if (deviceId === '' || serviceId === '' || characteristics === '') {
        Taro.navigateTo({ url: '/pages/bluetooth/bluetooth/bluetooth' })
        return
      }

      // 检测当前缓存蓝牙信息的打印机是否在连接中
      const { devices = [] } = await Taro.getConnectedBluetoothDevices({ services: [serviceId] }) || {}
      if (devices.length === 0 || devices.some(item => item.deviceId !== deviceId)) {
        await Taro.createBLEConnection({ deviceId }) // 连接目标蓝牙
      }

      // 至此，蓝牙设备连接成功，可执行打印操作
      const waresTag = new WaresTag({
        deviceId,
        serviceId,
        characteristics
      })
      waresTag.setPrintData({
        number: printDataResult.afterSaleOrderNo,
        typeText: printDataResult.typeStr,
        checkText: printDataResult.check == 1 ? '检测' : '',
        goodsName: printDataResult.productName,
        countText: `${printDataResult.effectiveCount} ${printDataResult.packageUnit}`,
        sku: printDataResult.skuCode,
        returnReason: printDataResult.returnReason || '',
        statusInWarehouseStr: printDataResult.statusInWarehouseStr || '',
      })
      waresTag.printTag()
      Taro.hideLoading()
    } catch (e) {
      Taro.hideLoading()
      if (e.message) {
        Taro.showToast({ title: e.message, icon: 'none' })
        return
      }

      if (e.errMsg) {
        Taro.showToast({ title: e.errMsg, icon: 'none' })
        return
      }

      const errMsg = bluetoothErrorCode[e.errCode || 'other']
      Taro.showModal({
        title: errMsg === '' ? e.message : errMsg,
        success({ confirm }) {
          // 点击确认并且是蓝牙触发错误，跳转至蓝牙连接页面
          if (confirm && errMsg !== '') {
            Taro.navigateTo({ url: '/pages/bluetooth/bluetooth/bluetooth' })
          }
        }
      })
    }
  }

  jump(url) {
    Taro.navigateTo({ url: `/pages/inspection/${url}/${url}` })
  }

  jumpRemote() {
    if (this.state.detail.toWarehouseButton != 1) return
    this.$preload({
      afterSaleOrderNo: this.state.detail.afterSaleOrderNo,
      afterSaleTypeStr: this.state.detail.afterSaleTypeStr,
      afterSaleType: this.state.detail.afterSaleType,
      arriveCount: this.state.detail.arrivalRecord ? this.state.detail.arrivalRecord.arriveCount : '',
      applyCount: this.state.detail.applyCount || 0,
      miniNumberOfPackage: this.state.detail.packageNum,
      arrivalRecord: this.state.detail.arrivalRecord,
      returnReasonComment: this.state.detail.returnReasonComment, // 到仓说明
      unit: this.state.detail.unit,
      assemblyVos: this.state.detail.assemblyVos || [],
      arrivalExplainImages: this.state.detail.arrivalExplainImages || [],
      toWarehouseButton: this.state.detail.toWarehouseButton,
      deliveryNo: this.state.detail.deliveryNo || '',
      responsibility: this.state.detail.responsibility
    })
    Taro.navigateTo({ url: `/pages/inspection/warehouseArrivalRecord/warehouseArrivalRecord` })
  }

  /**
   * 展开/收起更多售后单
   */
  onChangeListShow(sign) {
    this.setState({ isShowMore: sign })
  }

  /**
   * 点击进入其他售后单
   */
  onTapMoreListLink(afterSaleNo) {
    this.setState({
      afterSaleOrderNo: afterSaleNo,
      detail: {},
      moreInspectionList: [], // 更多售后单
      isShowMore: false,
      isShowAlert: false,
      isLoading: true,
      page: 0,
    }, this.getDetail)
  }

  onShowNotOperaAlert() {
    this.setState({
      isShowNotOperaAlert: !this.state.isShowNotOperaAlert
    })
  }

  /**
   * 点击图片看大图
   */
  onTapImage(index) {
    Taro.previewImage({
      urls: this.state.detail.arrivalExplainImages,
      current: this.state.detail.arrivalExplainImages[index]
    })
  }

  onShowArrivalRecordDetail() {
    this.setState({
      isShowArrivalRecordDetail: !this.state.isShowArrivalRecordDetail
    })
  }

  async onTapEnterWarehouse() {
    this.handleShowAlertWarehouse()
    try {
      Taro.showLoading({ title: '请稍等...' })
      await confirmToWarehouseByOrder({
        afterSaleNo: this.state.detail.afterSaleOrderNo
      })
      Taro.hideLoading()
      Taro.showToast({ title: '确认到仓成功', icon: 'none' })
      this.getDetail()
      // this.setState({ isShowResultAlert: true, resultAlertMessage: serverMessage, isCanTapEnterWarehouse: false })
    } catch (e) {
      Taro.hideLoading()
      Taro.showToast({ title: e.message, icon: 'none' })
    }
  }

  handleShowAlertWarehouse() {
    if (!this.state.isCanTapEnterWarehouse) return
    this.setState({
      isShowWarehouseAlert: !this.state.isShowWarehouseAlert
    })
  }

  onTapResultEnter() {
    this.setState({ isShowResultAlert: false })
  }

  createWorkOrder() {
    this.$preload({ afterSaleNo: this.state.afterSaleOrderNo, exceptionModule: 1 })
    Taro.navigateTo({ url: `/pages/inspection/workOrderCreate/workOrderCreate` })
  }

  onPageScroll() {
    clearTimeout(this.state.scrollTimer)
    this.setState({
      isShowApplyWorkOrder: true,
      scrollTimer: setTimeout(() => {
        this.setState({
          isShowApplyWorkOrder: false
        })
      }, 500)
    })

  }

  // 长按复制
  longpress(item) {
    if (!item) return
    Taro.setClipboardData({ data: item })
  }

  render() {
    return (
      <View className='receiving-detail'>
        <View className='navi-top-background'>
          {this.state.detail.showNotSupportTab == 1 ?
            <View className='flex-row-between-center navi-top-wrap'>
              <Text className={`code bold fs-36 ${this.state.isLoading ? 'skeleton-loading' : ''}`} >{this.state.detail.warehouseName || ''}
              </Text>
              <Text className={`state ${this.state.isLoading ? 'skeleton-loading' : ''}`} >{this.state.detail.mergeStatusStr || ''}</Text>
            </View> :
            <View className='flex-row-between-center navi-top-wrap' onLongpress={this.longpress.bind(this, this.state.detail.afterSaleOrderNo)}>
              <Text className={`code bold fs-44 ${this.state.isLoading ? 'skeleton-loading' : ''}`} >{this.state.detail.afterSaleOrderNo || ''}</Text>
              <Text className={`state ${this.state.isLoading ? 'skeleton-loading' : ''}`} >{this.state.detail.mergeStatusStr || ''}</Text>
            </View>
          }
        </View>
        <View className='receiving-detail-wrap top-margin-load'>
          {/* 邮寄到对应的仓库 */}
          {this.state.detail.showNotSupportTab == 1 ? <View className='box m-b-20'>
            <View className='notice-wrapper flex-row-start-center'>
              <Image className='notice-icon' src={NoticeIcon} webp />
              <Text className='notice fs-30'>请线下发给对应售后仓处理</Text>
            </View>
            <View className='line-wrapper flex-row-between-center m-b-16'>
              <View className='code-wrapper flex-row-start-center'>
                <Text className={`line-title fs-34 ${this.state.isLoading ? 'skeleton-loading' : ''}`}>联系人</Text>
                <Text
                  className={`code c-333 bold fs-34 ${this.state.isLoading ? 'skeleton-loading' : ''}`}
                >{this.state.detail.warehouseContact || ''}</Text>
              </View>
              <Text className='print-button text-center fs-28' onTap={this.onTapEnter.bind(this)}>打印售后单</Text>
            </View>
            <View className='line-wrapper flex-row-between-center m-b-16'>
              <View className='code-wrapper flex-row-start-center'>
                <Text className={`line-title fs-34 ${this.state.isLoading ? 'skeleton-loading' : ''}`}>联系电话</Text>
                <Text
                  className={`code c-333 bold fs-34 ${this.state.isLoading ? 'skeleton-loading' : ''}`}
                >{this.state.detail.warehouseContactTelephone || ''}</Text>
              </View>
            </View>
            <View className='line-wrapper flex-row-between-center '>
              <View className='code-wrapper flex-row-start-center'>
                <Text className={`line-title fs-34 ${this.state.isLoading ? 'skeleton-loading' : ''}`}>地址</Text>
                <Text
                  className={`code c-333 bold fs-34 ${this.state.isLoading ? 'skeleton-loading' : ''}`}
                >{this.state.detail.warehouseAddress || ''}</Text>
              </View>
            </View>
          </View> : null}

          {/* 单号信息 */}
          <View className='box m-b-20'>
            {this.state.detail.showNotSupportTab == 1 ? <View className='line-wrapper flex-row-between-center m-b-5'>
              <View className='code-wrapper flex-row-start-center' onLongpress={this.longpress.bind(this, this.state.detail.afterSaleOrderNo)}>
                <Text className={`line-title fs-34 ${this.state.isLoading ? 'skeleton-loading' : ''}`}>售后单号</Text>
                <Text
                  className={`code c-333 bold fs-44 ${this.state.isLoading ? 'skeleton-loading' : ''}`}
                >{this.state.detail.afterSaleOrderNo || ''}</Text>
              </View>
            </View> : null}

            <View className='line-wrapper flex-row-between-center'>
              <View className='code-wrapper flex-row-start-center'>
                <Text className={`line-title fs-34 ${this.state.isLoading ? 'skeleton-loading' : ''}`}>售后类型</Text>
                <Text
                  className={`c-333 fs-40 bold ${this.state.isLoading ? 'skeleton-loading' : ''}`}
                >{this.state.detail.afterSaleTypeStr || ''}</Text>
                {this.state.detail.check ? <Text className={`type fs-30 m-l-10 ${this.state.isLoading ? 'skeleton-loading' : ''}`}>检测</Text> : null}
              </View>
              {this.state.detail.showNotSupportTab != 1 ? <Text className='print-button text-center fs-28' onTap={this.onTapEnter.bind(this)}>打印售后单</Text> : null}

            </View>
          </View>

          {/* 商品信息 */}
          <GoodsInfoComponent detail={this.state.detail} isLoading={this.state.isLoading} />

          {/* 质保信息 */}
          <WarrantyInfoComponent detail={this.state.detail} isLoading={this.state.isLoading} />

          {/* 订单签收日期 */}
          <View className='box sign-abnormal m-b-20'>
            <View className='flex-row-between-center'>
              <View className='flex-row-start-center m-b-10'>
                <Image className='sign-icon' src={orderSigningicon} />
                <Text className='fs-34 c-333 bold'>订单签收日期</Text>
              </View>
              <View className='fs-29 c-666'>
                {this.state.detail.receiveTime ? this.state.detail.receiveTime : ''}
              </View>
            </View>
          </View>

          {/* 到仓记录 */}
          {this.state.detail.arrivalRecord !== null ?
            <View className='box m-b-20'>
              {/*title*/}
              <View className='flex-row-between-center' onTap={this.onShowArrivalRecordDetail.bind(this)}>
                <View className='flex-row-start-center'>
                  <Image className='qa-icon' src={OriginIcon} />
                  <Text className={`fs-34 c-333 bold ${this.state.isLoading ? 'skeleton-loading' : ''}`}>到仓记录</Text>
                </View>
                <View className='flex-row-end-center'>
                  {
                    this.state.detail.afterSaleType != 5 ?
                      <Text className={`code main-color fs-34 m-r-10 ${this.state.isLoading ? 'skeleton-loading' : ''}`}>{this.state.detail.arrivalRecord.effectiveCount || 0}/{this.state.detail.unit || ''}</Text> : null
                  }
                  <Image className='arrow-right-icon' src={this.state.isShowArrivalRecordDetail ? ArrowBottomIcon : ArrowRightIcon} />
                </View>
              </View>
              {/*content*/}
              {this.state.isShowArrivalRecordDetail ? <View>
                <View className='line'></View>
                {
                  this.state.detail.afterSaleType != 5 ?
                    <View>
                      <View className='flex-row-between-center m-b-20'>
                        <Text className='content-title c-888 fs-30'>到仓数量：</Text>
                        <Text className='content code c-333 fs-30'>{this.state.detail.arrivalRecord.arriveCount || 0}/{this.state.detail.arrivalRecord.unit}</Text>
                      </View>
                      {Array.isArray(this.state.detail.assemblyVos) && this.state.detail.assemblyVos.length > 0 ? <View className='flex-row-between-start m-b-20'>
                        <Text className='content-title c-888 fs-30'>组件：</Text>
                        <View className='flex-col-end-center'>
                          {this.state.detail.assemblyVos.map(item => {
                            return <Text className='content code c-333 fs-30' key={item.assemblyCode}>{item.assemblyCode}, {item.arriveCount}/{item.minUnitName}</Text>
                          })}
                        </View>
                      </View> : null}

                      {
                        this.state.detail.afterSaleType != 3 ? <View className='flex-row-between-center m-b-20'>
                          <Text className='content-title c-888 fs-30'>是否允许退换：</Text>
                          <Text className='content code c-333 fs-30'>{this.state.detail.arriveResultDesc === null ? '' : this.state.detail.arriveResultDesc}</Text>
                        </View> : null
                      }

                    </View> : <View>
                      {
                        this.state.detail.partsVOList.map((item, index) => {
                          return (
                            <View key={item.partsSku}>
                              <View className='c-333 fs-30 m-b-20'>{item.partsName}</View>
                              <View className='goods-record flex-row-between-center m-b-20'>
                                <View className='sku-wrapper flex-row-start-center'>
                                  <Text className='sku text-center fs-28'>SKU</Text>
                                  <Text className='sku-code fs-30' >{item.partsSku}</Text>
                                </View>
                                <View className='goods-unit flex-row-start-center'>
                                  <Text className='unit-name c-888 fs-30'>单位：</Text>
                                  <Text className='unit-name c-333 fs-30' >{item.unitName}</Text>
                                </View>
                              </View>
                              <View className=' flex-row-between-center m-b-20'>
                                <View className='sku-wrapper flex-row-start-center'>
                                  <Text className='c-888 fs-30'>应收数量：</Text>
                                  <Text className='c-333 fs-30' >{item.applyCount}</Text>
                                </View>
                                <View className='flex-row-start-center'>
                                  <Text className='c-888 fs-30'>实收数量：</Text>
                                  <Text className='c-333 fs-30' >{item.arriveCount}</Text>
                                </View>
                              </View>
                              <View className='line'></View>
                            </View>
                          )
                        })
                      }

                    </View>
                }
                {
                  this.state.detail.afterSaleType != 3 ?
                    <View className='flex-row-between-center m-b-20'>
                      <Text className='content-title c-666 fs-30'>售后责任：</Text>
                      <Text className='content code c-333 fs-30'>{this.state.detail.responsibilityName ? this.state.detail.responsibilityName : ''}</Text>
                    </View> : null
                }

                <View className='flex-row-between-center m-b-20'>
                  <Text className='content-title c-888 fs-30'>快递单号：</Text>
                  <Text className='content code c-333 fs-30'>{this.state.detail.deliveryNo ? this.state.detail.deliveryNo : ''}</Text>
                </View>
                <View className='flex-row-between-center m-b-20'>
                  <Text className='content-title c-888 fs-30'>到仓说明：</Text>
                  <Text className='content code c-333 fs-30'>{this.state.detail.arrivalRecord.otherDescription ? this.state.detail.arrivalRecord.otherDescription : ''}</Text>
                </View>
                <View className='flex-row-between-start m-b-10'>
                  <Text className='content-title c-888 fs-30'>图片说明：</Text>
                  <View className='flex-row-end-start'>
                    {Array.isArray(this.state.detail.arrivalExplainImages) && this.state.detail.arrivalExplainImages.length > 0 ? this.state.detail.arrivalExplainImages.map((item, index) => {
                      return <Image className='arrival-explain-image m-l-20' src={item} key={item} onTap={this.onTapImage.bind(this, index)} />
                    }) : null}
                  </View>
                </View>

              </View> : null}
            </View>
            : null}

          {/* 关联工单 */}
          {
            this.state.hideDomeType && this.state.detail.showNotSupportTab != 1 ? <WorkOrderListComponent afterSaleOrderNo={this.state.afterSaleOrderNo} exceptionModule={1} /> : null
          }


          {/*用户*/}
          <View className='box m-b-20'>
            <View className='code-wrapper flex-row-start-center m-b-5'>
              <Text className={`line-title fs-34 ${this.state.isLoading ? 'skeleton-loading' : ''}`}>订购人</Text>
              <Text
                className={`code c-333 fs-34 ${this.state.isLoading ? 'skeleton-loading' : ''}`}
              >{this.state.detail.customerName || ''}</Text>
            </View>
            <View className='code-wrapper flex-row-start-center m-b-5'>
              <Text className={`line-title fs-34 ${this.state.isLoading ? 'skeleton-loading' : ''}`}>电话</Text>
              <Text
                className={`code c-333 fs-34 ${this.state.isLoading ? 'skeleton-loading' : ''}`}
              >{this.state.detail.customerPhone || ''}</Text>
            </View>
            <View className='code-wrapper flex-row-start-start'>
              <Text className={`line-title fs-34 ${this.state.isLoading ? 'skeleton-loading' : ''}`}>地址</Text>
              <Text
                className={`c c-333 fs-34 ${this.state.isLoading ? 'skeleton-loading' : ''}`}
              >{this.state.detail.afterSalesAddress || ''}</Text>
            </View>
          </View>

          {/*操作记录*/}
          <OperaListComponent afterSaleOrderNo={this.state.afterSaleOrderNo} />

          {/* 展开更多售后单 */}
          <MoreInspectionListComponent
            detail={this.state.detail}
            moreInspectionList={this.state.moreInspectionList}
            isShowMore={this.state.isShowMore}
            onChangeListShow={this.onChangeListShow.bind(this)}
            onTapMoreListLink={this.onTapMoreListLink.bind(this)}
          />

          {/* bottom button */}
          <View className='bottom-button-wrapper flex-row-between-center'>
            <View
              className={`bottom-button flex-col-center-center ${this.state.isCanTapEnterWarehouse ? '' : 'unused'}`}
              onTap={this.handleShowAlertWarehouse.bind(this)}
            >
              <Image className='unusual-icon' src={InspectionList1} />
              <Text className='button-name'>确认到仓</Text>
            </View>
            <View
              className={`bottom-button flex-col-center-center ${this.state.detail.toWarehouseButton ? '' : 'unused'}`}
              onTap={this.jumpRemote.bind(this)}
            >
              <Image
                className='daocangjilu-icon'
                src={this.state.detail.toWarehouseButton ? DaocangjiluIcon : DaocangjiluUnusedIcon}
              />
              <Text className='button-name'>到仓记录</Text>
            </View>
            <Image className='button-scan-icon' src={BottomScanIcon} onTap={this.onTapScan.bind(this)} />
          </View>

          {/* 创建工单 */}
          <Image className={`work-order-icon ${this.state.isShowApplyWorkOrder ? 'page-scroll' : ''}`} onTap={this.createWorkOrder.bind(this)} src={WorkOrderIcon} />

          {this.state.isShowAlert ? <CustomAlert
            title='打印异常面单'
            onEnter={this.onTapEnter.bind(this)}
            renderContent={
              <View className='alert-content flex-row-center-center'>
                <Text className='alert-notice c-555 fs-34'>异常单数量</Text>
                <Input type='number' className='alert-number text-center bold c-333 fs-56 m-0-20' value={3} />
                <Text className='alert-notice c-555 fs-34'>台</Text>
              </View>
            }
          /> : null}

          {this.state.isShowNotOperaAlert ? <CustomAlert
            title='请至OMS系统操作验货'
            onEnter={this.onShowNotOperaAlert.bind(this)}
            renderContent={
              <Text className='fs-30 text-center c-666'>小程序不支持对此售后单操作到仓记录，请至OMS系统按照原有流程操作，谢谢～</Text>
            }
          /> : null}

          {/*alert*/}
          {this.state.isShowWarehouseAlert ? <CustomAlert
            isShowCancel
            onEnter={this.onTapEnterWarehouse.bind(this)}
            onCancel={this.handleShowAlertWarehouse.bind(this)}
            renderContent={
              <View className='alert-content flex-col-center-center'>
                <Text className='display-block text-center fs-34 alert-text m-b-20'>说明：确认到仓后将生成退款单、换货单、入库单等</Text>
                <View className='notice-wrapper flex-row-center-center'>
                  <Image className='notice-icon m-r-10' src={NoticeIcon} />
                  <Text className='fs-30 main-color'>确认后操作不可撤回</Text>
                </View>
              </View>
            }
          /> : null}

          {this.state.isShowResultAlert ? <CustomAlert
            onEnter={this.onTapResultEnter.bind(this)}
            renderContent={
              <View className='alert-content flex-col-center-center'>
                <Text className='display-block text-center fs-34 alert-text m-b-20 bold'>{this.state.resultAlertMessage}</Text>
              </View>
            }
          /> : null}
        </View>
      </View>
    )
  }
}

export default ReceivingDetail

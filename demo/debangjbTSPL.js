import PrinterService from '@/service/jbtspl.service';
import Taro from '@tarojs/taro';

class ShunfengTag {
  constructor(data) {
    this.setPrinterInfo(data)
  }

  buffer = ''
  deviceId = ''
  serviceId = ''
  characteristics = ''

  setPrinterInfo({ deviceId, serviceId, characteristics }) {
    this.deviceId = deviceId
    this.serviceId = serviceId
    this.characteristics = characteristics
  }

  setPrintData(expressData,imgRes) {

    const printerService = new PrinterService();
    // 内容宽度72mm，内容高度125mm
    // top logo offset 10mm
    const baseX = 2 * 8 // 2mm
    const baseY = 12 * 8 // 15mm
    const printWidth = 72 * 8

    // set config
    printerService.setCustomOrder('SIZE 76 mm,130 mm')
    printerService.setCustomOrder('SPEED 4')
    printerService.setCustomOrder('GAP 4 mm,0 mm')
    printerService.setCustomOrder('DIRECTION 0') // 打印时出纸和打印字体的方向
    printerService.setCustomOrder('REFERENCE 0,0') // 参考坐标原点

    // clear cache
    printerService.setCls()

    // printerService.setText(baseX + 30 * 8, baseY - 10 * 8, '德邦快递', 1, 1)
    // printerService.setText(baseX + 28 * 8, baseY - 6 * 8, 'DEPPON EXPRESS', 1, 1, 1)

    // 打印LOGO
    printerService.setBitmap(16, 16, imgRes, 0)

    // 1、content
    printerService.setBox(baseX, baseY, baseX + printWidth, (104) * 8)
    printerService.setText(baseX + 1 * 8, baseY - 2 * 8, expressData.printTime, 1, 1, 1)
    printerService.setText(baseX + 60 * 8, baseY - 10 * 8, '快递', 1, 1)
    printerService.setText(baseX + 60 * 8, baseY - 5 * 8, '包裹', 1, 1)
    printerService.setBoldText(baseX + 4 * 8, baseY + 2 * 8, expressData.bigPen, 2, 2)
    printerService.setLine(baseX, baseY + (10 * 8), printWidth, 1)

    // 2、一维码
    printerService.setLine(baseX, baseY + (29 * 8), printWidth, 1)
    printerService.setBarcode(baseX + 15 * 8, baseY + 12 * 8, 10 * 8, expressData.mailNo, 2, 3)
    printerService.setText(baseX + 20 * 8, baseY + 24 * 8, expressData.mailNo, 1, 1)

    // 3、收货地址
    printerService.setBox(baseX, baseY + 29 * 8, baseX + 52 * 8, baseY + 45 * 8)
    printerService.setBoldText(baseX + 1 * 8, baseY + 34 * 8, '收', 2, 2)
    printerService.setBoldText(baseX + 8 * 8, baseY + 31 * 8, expressData.receiveContactName, 1, 1)
    printerService.setBoldText(baseX + 28 * 8, baseY + 31 * 8, expressData.receiveContactMobile.replace(/^(\d{3})\d*(\d{4})$/, '$1****$2'), 1, 1)
    const LINE_MAX_CHAR = 14 // 多行文本每行最大字数
    const receiveAddressLength = expressData.receiveAddress.length
    const receiveAddressStep = Math.ceil(receiveAddressLength / LINE_MAX_CHAR)
    for (let i = 0; i < receiveAddressStep; i++) {
      printerService.setText(baseX + 8 * 8, baseY + (36 + i * 3.2) * 8, expressData.receiveAddress.substr(i * LINE_MAX_CHAR, LINE_MAX_CHAR), 1, 1)
    }

    // 4、寄货地址
    printerService.setLine(baseX, baseY + 61 * 8, 52 * 8, 1)
    printerService.setLine(baseX + 52 * 8, baseY + 45 * 8, 1, 61 * 8 - 29 * 8)
    printerService.setBoldText(baseX + 1 * 8, baseY + 50 * 8, '寄', 2, 2)
    printerService.setBoldText(baseX + 8 * 8, baseY + 47 * 8, expressData.startContactName, 1, 1)
    printerService.setBoldText(baseX + 28 * 8, baseY + 47 * 8, expressData.startContactMobile.replace(/^(\d{3})\d*(\d{4})$/, '$1****$2'), 1, 1)

    const startAddressLength = expressData.startAddress.length
    const startAddressStep = Math.ceil(startAddressLength / LINE_MAX_CHAR)
    for (let i = 0; i < startAddressStep; i++) {
      printerService.setText(baseX + 8 * 8, baseY + (52 + i * 3.2) * 8, expressData.startAddress.substr(i * LINE_MAX_CHAR, LINE_MAX_CHAR), 1, 1)
    }

    // 5、地址右侧
    printerService.setLine(baseX + 52 * 8, baseY + 37 * 8, printWidth - 52 * 8, 1)
    //到付
    // printerService.setBoldText(baseX + 55 * 8, baseY + 32 * 8, '', 1, 1, 0)
    printerService.setLine(baseX + 52 * 8, baseY + 49 * 8, printWidth - 52 * 8, 1)
    if (expressData.subMoney && expressData.subMoney != '' && parseFloat(expressData.subMoney) > 0) {
      printerService.setBoldText(baseX + 53 * 8, baseY + 40 * 8, '代收货款', 1, 1)
      printerService.setBoldText(baseX + 53 * 8, baseY + 44 * 8, expressData.subMoney, 1, 1)
    }
    printerService.setLine(baseX + 52 * 8, baseY + 61 * 8, printWidth - 52 * 8, 1)
    if (expressData.needReorder && expressData.needReorder != '') {
      printerService.setBoldText(baseX + 53 * 8, baseY + 52 * 8, '签收返单', 1, 1)
      printerService.setBoldText(baseX + 53 * 8, baseY + 56 * 8, expressData.needReorder, 1, 1)
    }
    // 备注
    // printerService.setBoldText(baseX + 2 * 8, baseY + 62 * 8, '备注：', 1, 1)
    // for (let i = 0; i < expressData.remark.length; i++) {
    //   printerService.setBoldText(baseX + 14 * 8, baseY + (62 + i * 4) * 8, expressData.remark[i], 1, 1)
    // }

    printerService.setText(baseX + 2 * 8, baseY + 72 * 8, expressData.remark.orderNoRemark, 1, 1);
    const CONTENT_LINE_MAX_CHAR = 18 // 多行文本每行最大字数
    const contentAddressLength = expressData.remark.productRemark.length
    const contentAddressStep = Math.ceil(contentAddressLength / CONTENT_LINE_MAX_CHAR)
    for (let i = 0; i < contentAddressStep; i++) {
      printerService.setText(baseX + 2 * 8, baseY + (75.2  + i * 2.8) * 8, expressData.remark.productRemark.substr(i * CONTENT_LINE_MAX_CHAR, CONTENT_LINE_MAX_CHAR), 1, 1)
    }

    printerService.setLine(baseX + 52 * 8, baseY + 61 * 8, 1, 61 * 8 - 29 * 8)

    printerService.setText(baseX + 56 * 8, baseY + 87 * 8, '已验视', 1, 1)
    printerService.getQueue();
    this.printTag(printerService.getData())
  }

  async printTag(bufferData) {
    await Taro.getBLEDeviceServices({ deviceId: this.deviceId }) // 获取打印机服务
    await Taro.getBLEDeviceCharacteristics({ deviceId: this.deviceId, serviceId: this.serviceId }) // 获取打印机特征值

    const that = this
    let currentTime = 1
    let loopTime = parseInt(bufferData.length / 20) + 1
    let lastData = parseInt(bufferData.length % 20);
    let onTimeData = 20

    function fasong() {
      let buf
      let dataView
      if (currentTime < loopTime) {
        buf = new ArrayBuffer(onTimeData)
        dataView = new DataView(buf)
        for (var i = 0; i < onTimeData; ++i) {
          dataView.setUint8(i, bufferData[(currentTime - 1) * onTimeData + i])
        }
      } else {
        buf = new ArrayBuffer(lastData)
        dataView = new DataView(buf)
        for (var i = 0; i < lastData; ++i) {
          dataView.setUint8(i, bufferData[(currentTime - 1) * onTimeData + i])
        }
      }
      // console.log("第" + currentTime + "次发送数据大小为：" + buf.byteLength)
      Taro.writeBLECharacteristicValue({
        deviceId: that.deviceId,
        serviceId: that.serviceId,
        characteristicId: that.characteristics,
        value: buf,
        complete: function () {
          currentTime = currentTime + 1
          if (currentTime <= loopTime) {
            fasong()
          }else{
            Taro.hideLoading()
          }
        },
        fail: (res) =>{
          console.log(res,'err')
        }
      })
    }

    fasong()
  }
}

export default ShunfengTag

// config
// printerService.setGapdectect()
// printerService.setDensity(10)
// printerService.setFormfeed()

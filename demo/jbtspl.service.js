import encode from '@/utils/jbTspl/encoding';
/**
 * 打印服务
 */
class printerService {
  /**
   * 初始化纸张
   */
  constructor(){
    this.command = []
    this.str = ''
  }

  addCommand (content) { //将指令转成数组装起
    var code = new encode.TextEncoder(
      'gb18030', {
        NONSTANDARD_allowLegacyEncoding: true
      }).encode(content)
    for (var i = 0; i < code.length; ++i) {
      this.command.push(code[i])
    }
  }

  // clear cache
  setCls() {
    this.str = `CLS \r\n`
    this.addCommand(this.str)
  }

  // 控制打印速度
  setSpeed(speed = 2) {
    this.str = `SPEED ${speed} \r\n`
    this.addCommand(this.str)
  }

  // 控制打印浓度
  setDensity(density = 10) {
    this.str = `DENSITY ${density} \r\n`
    this.addCommand(this.str)
  }

  // 定义打印标签的参考坐标原点
  setReference() {
    this.str = `REFERENCE 0,0 \r\n`
    this.addCommand(this.str)
  }

  /**
   * 打印粗体字
   * x坐标
   * y坐标
   * font字体
   * rotation文字旋转角度
   * xM水平放大倍数
   * yM垂直放大倍数
   * align文字对齐方式
   * content打印内容
   */
  setBoldText(x = 0, y = 0, content = '', xM = 1, yM = 1, font = 'TSS24.BF2', rotation = 0) {
    // this.str = this.str.concat(`BOLD 1 \r\n`)
    this.str = `TEXT ${x},${y},"${font}",${rotation},${xM},${yM},"${content}" \r\n`
    this.addCommand(this.str)
  }

  /**
   * 打印文字
   * x坐标
   * y坐标
   * font字体
   * rotation文字旋转角度
   * xM水平放大倍数
   * yM垂直放大倍数
   * align文字对齐方式
   * content打印内容
   */
  setText(x = 0, y = 0, content = '', xM = 1, yM = 1, font = 'TSS24.BF2', rotation = 0) {
    this.str = `TEXT ${x},${y},"${font}",${rotation},${xM},${yM},"${content}" \r\n`
    this.addCommand(this.str)
  }
  setTextVB(x = 0, y = 0, content = '', xM = 1, yM = 1, font = 'TSS24.BF2', rotation = 90) {
    this.str = `TEXT ${x},${y},"${font}",${rotation},${xM},${yM},"${content}" \r\n`
    this.addCommand(this.str)
  }

  /**
   * 打印一维条形码
   * x坐标
   * y坐标
   * height条形码高度
   * narrow窄bar宽度
   * wide宽bar宽度
   * content内容
   * code编码格式
   * humanReadable人眼是否可识别
   * rotation旋转角度
   */
  setBarcode(x = 0, y = 0, height = 10, content = '', narrow = 6, wide = 6, code = '128', humanReadable = 0, rotation = 0) {
    this.str = `BARCODE ${x},${y},"${code}",${height},${humanReadable},${rotation},${narrow},${wide},"${content}" \r\n`
    this.addCommand(this.str)
  }

  // 打印矩形框
  setBox(x1 = 0,y1 = 0,x2 = 0,y2 = 0) {
    this.str = `BOX ${x1},${y1},${x2},${y2},1 \r\n`
    this.addCommand(this.str)
  }

  // 打印线条
  setLine(x = 0,y = 0,w = 1,h = 1) {
    this.str = `BAR ${x},${y},${w},${h} \r\n`
    this.addCommand(this.str)
  }

  /**
   * 打印二维码
   * x坐标
   * y坐标
   * height条形码高度
   * narrow窄bar宽度
   * wide宽bar宽度
   * content内容
   * code编码格式
   * humanReadable人眼是否可识别
   * rotation旋转角度
   */
  setQrcode(x = 0, y = 0, content = '', cellWidth = 1, eccLevel = 'H',  mode = 'A', rotation = 0) {
    this.str = `QRCODE ${x},${y},${eccLevel},${cellWidth},${mode},${rotation},"${content}" \r\n`
    this.addCommand(this.str)
  }

  // 打印图片
  setBitmap(x = 0, y = 0, res = '', mode = 0){
    var w = res.width;
    var h = res.height;
    var bitw = parseInt((w + 7) / 8) * 8;
    // var bitw = (parseInt(w) % 8) == 0 ? (parseInt(w) / 8) :( parseInt(w) / 8+1);
    var pitch = parseInt(bitw / 8);
    var bits = new Uint8Array(h * pitch);

    this.str = `BITMAP ${x},${y},${pitch},${h},${mode},`
    this.addCommand(this.str)

    for (y = 0; y < h; y++) {
      for (x = 0; x < w; x++) {
        var color = res.data[(y * w + x) * 4 + 1];
        if (color <= 128) {
          bits[parseInt(y * pitch + x / 8)] |= (0x80 >> (x % 8));
        }
      }
    }
    for (var i = 0; i < bits.length; i++) {
      this.command.push((~bits[i]) & 0xFF);
    }
  }


  // 设置
  setCustomOrder(text = '') {
    this.str = `${text} \r\n`
    this.addCommand(this.str)
  }

  // 进纸至下一个标签的起始位置
  setFormfeed() {
    this.str = `FORMFEED \r\n`
    this.addCommand(this.str)
  }

  // get data
  getQueue(number = 1){
    this.str = `PRINT ${number},1 \r\n` // 打印
    this.addCommand(this.str)
  }
  getData(){
    return this.command
  }
}

export default printerService

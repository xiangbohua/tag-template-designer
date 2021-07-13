class Page {
    
    elId;
    elName = "标签";
    elDesc = "";
    
    constructor(elId) {
        this.elId = elId;
    }

    pageWidth = 20;
    pageHeight = 20;
    pageSizeUnit = '';
    
    printSpeed = 1.5;

    gapVerticalDistance = 0;
    gapPaperLength = 0;
    gapUnit = "";

    direction = 1;
    referenceX = 0;
    referenceY = 0;

    bLineM = 0;
    bLineN = 0;
    bLineUnit = '';

    density = 1;

    soundAfterPrintLevel = 0;
    soundAfterPrintLevel = 0;
    soundAfterPrintInterval = 0;

    offSet = 0;
    offSetUnit = '';

    feedAfterPrint = 0;
    limitFeed = 0;

    limitFeedUnit = '';

    getPropertyDesc() {
        var property = [];

        
        property.push(new Property("elId", PropertyType.Text, "组件ID"));
        property.push(new Property("pageWidth", PropertyType.Number, "PageSize:标签纸宽度，单位dot", "", 0, 999));
        property.push(new Property("pageHight", PropertyType.Number, "PageSize:标签纸高度，单位dot", "", 0, 999));
        property.push(new Property("pageSizeUnit", PropertyType.List, "PageSize:纸张尺寸单位", "->英制系统(inch),mm->公制系统（mm）"));

        property.push(new Property("printSpeed", PropertyType.List, "打印速度", "1.5->1.5'/sec,2.0->2.0'/sec,3.0->3.0'/sec,4.0->4.0'/sec"));

        property.push(new Property("gapVerticalDistance", PropertyType.Number, "GAP：标签纸垂直距离"));
        property.push(new Property("gapPaperLength", PropertyType.Number, "GAP：标签纸长度"));
        property.push(new Property("gapUnit", PropertyType.List, "GAP：标签分割线单位", "->英制系统(inch),mm->公制系统（mm）"));

        
        property.push(new Property("direction", PropertyType.List, "打印方向", "0->文字与出纸方向相反,1->文字与出纸方向相同"));

        property.push(new Property("referenceX", PropertyType.Number, "Reference：卷标的参考坐标原点X位置"));
        property.push(new Property("referenceY", PropertyType.Number, "Reference：卷标的参考坐标原点Y位置"));

        property.push(new Property("bLineM", PropertyType.Number, "BLine:黑标高度"));
        property.push(new Property("bLineN", PropertyType.Number, "BLine:额外送纸长度"));
        property.push(new Property("bLineUnit", PropertyType.List, "BLine:额外送纸长度单位", "->英制系统(inch),mm->公制系统（mm）"));

        property.push(new Property("density", PropertyType.Number, "打印浓度(1-15)"));

        property.push(new Property("soundAfterPrintLevel", PropertyType.Number, "开始打印时发声控制", '', 0, 9));
        property.push(new Property("soundAfterPrintInterval", PropertyType.Number, "开始打印时发声控制", '', 0, 4096));

        property.push(new Property("offSet", PropertyType.Number, "剥离模式纸张位移"));
        property.push(new Property("offSetUnit", PropertyType.List, "剥离模式纸张单位", '->英制系统(inch),mm->公制系统（mm）'));

        property.push(new Property("feedAfterPrint", PropertyType.Number, "打印结束以后向前进纸长度，单位dot"));

        property.push(new Property("limitFeed", PropertyType.Number, "纸张检测最大长度"));
        property.push(new Property("limitFeedUnit", PropertyType.List, "纸张检测长度单位", '->英制系统(inch),mm->公制系统（mm）'));


        return property;
    }

   getCommand() {
       var pageCmd = '';
       if (this.pageSizeUnit == '') {
            pageCmd += `SIZE ${this.pageWidth},${this.pageHight}\r\n`;
        } else {
            pageCmd +=  `SIZE ${this.pageWidth} ${this.pageSizeUnit},${this.pageHight} ${this.pageSizeUnit}\r\n`
        }

        pageCmd + `SPEED ${this.printSpeed}\r\n`;

        if (this.gapUnit == '') {
            pageCmd += `GAP ${this.gapVerticalDistance},${this.gapPaperLength}\r\n`;
        } else {
            pageCmd += `GAP ${this.gapVerticalDistance} ${this.gapUnit},${this.gapPaperLength} ${this.gapUnit}\r\n`
        }

        pageCmd += `DIRECTION ${this.direction}\r\n`;
        pageCmd += `DENSITY ${this.density}\r\n`;

        pageCmd += `REFERENCE ${this.referenceX},${this.referenceY}\r\n`;

        return pageCmd;
   }


}

class Bar {
    elId;
    elName = "线条";
    elDesc = "用于在标签上绘制线条";

    getPropertyDesc() {
        var property = [];
        property.push(new Property("elId", PropertyType.Text, "组件ID"));
        property.push(new Property("x", PropertyType.Number, "线条X方向起始点坐标，单位dot"));
        property.push(new Property("y", PropertyType.Number, "线条Y方向起始点坐标，单位dot"));
        property.push(new Property("width", PropertyType.Number, "线条宽度，单位dot"));
        property.push(new Property("hight", PropertyType.Number, "线条高度，单位dot"));
        return property;
    }

    x = 0;
    y = 0;

    width = 10;
    hight = 10;
    
    constructor(elementId) {
        this.elId = elementId;
    }

    setX(locationXForLeft) {
        this.x = locationForLeft;
    }

    setY(locationYForLeft) {
        this.y = locationYForLeft
    }

    setWidth(widthForLine) {
        this.width = widthForLine;
    }
    
    setHeight(hightForLine) {
        this.hight = hightForLine;
    }
    
    getCommand() {
        return `BAR ${this.elId} ${this.x},${this.y},${this.width},${this.hight} \r\n`
    }


}






class BarCode {
    elId;
    elName = "条码";
    elDesc = "用于在标签上绘制条码";

    constructor(elementId) {
        this.elId = elementId;
    }
    getPropertyDesc() {
        var property = [];
        property.push(new Property("elId", PropertyType.Text, "组件ID"));
        property.push(new Property("leftXPoint", PropertyType.Number, "文字X方向起始点坐标，单位dot"));
        property.push(new Property("leftYPoint", PropertyType.Number, "文字Y方向起始点坐标，单位dot"));
        property.push(new Property("height", PropertyType.Number, "条码高度，单位dot"));
        property.push(new Property("humanReadable", PropertyType.List, "肉眼可识别", "0->不可识别,1->可识别", 0, 90));
        property.push(new Property("rotation", PropertyType.List, "旋转", "0->0度,90->90度,180->180度,270->270度"));
        property.push(new Property("narrowBarWide", PropertyType.Number, "窄条码宽度，单位dot"));
        property.push(new Property("wideBarWide", PropertyType.Number, "宽条码宽度，单位dot"));
        property.push(new Property("codeType", PropertyType.List, "条码类型(详情见文档)", "128->Code128,128M->Code128M,EAN128->EAN128,25->Inter leaved 2 of 5,25C->Inter leavel 2 of 5 with check digits,39->Code 39 full ASCII for TSPL2 printers,39c->Code 39 full ASCII with check digits for TSPL2 printers,39S->Code 39 standards for TSPL2 printers,93->Code 93,EAN13->EAN13,EAN13+2->EAN 13 with 2 digits add on,EAN13+5->EAN 13 with 5 digits add on,EAN8->EAN8,EAN8+2->EAN8 with 2 digits add on,EAN8+5->EAN8 with 5 digits add on,CODA->Codabar,UPCA->UPC-A,UPCA+2->UPC-A with 2 digits add on,UPCA+5->UPC-A with 5 digits add on,UPCE->UPC-E,UPCE+2->UPC-E with 2 digits add on,UPCE->UPC-E,UPCE+5->UPC-E with 5 digits add on"));
        property.push(new Property("content", PropertyType.Text, "条形码内容"));


        return property;
    }
    leftXPoint = 0;

    leftYPoint = 0;

    height = 30;

    codeType = '128';

    humanReadable = 1;

    rotation = 0;

    narrowBarWide = 10;

    wideBarWide = 10;

    content = "";
    
    setLeftXPoint(x) {
        this.leftXPoint = x;
    }

    setLeftYPoint(y) {
        this.leftYPoint = y
    }

    setCodeType(codeType) {
        this.codeType = codeType;
    }

    setHeight(height) {
        this.height = height;
    }

    setHumanReadable(readble = 0) {
        this.humanReadable =  readble;
    }

    setRotaion(rotation) {
        this.rotation = rotation;
    }

    setNarrowBarWide(wide) {
        this.narrowBarWide = wide;
    }

    setWideBarWide(wide) {
        this.wideBarWide = wide;
    }

    setConent(content) {
        this.content = content;
    }

    getCommand() {
        return `BARCODE ${this.elId} ${this.leftXPoint},${this.leftYPoint},"${this.codeType}",${this.height},${this.humanReadable},${this.rotation},${this.narrow},${this.wide},"${this.content}" \r\n`
    }

}



class BitMap {
    elId;

    elName = "位图";
    elDesc = "用于在标签上绘制位图（非BMP格式图档）";

    constructor(elementId) {
        this.elId
    }
    getPropertyDesc() {
        var property = [];
        property.push(new Property("elId", PropertyType.Text, "组件ID"));
        property.push(new Property("leftPointX", PropertyType.Number, "位图X方向起始点坐标"));
        property.push(new Property("leftPointY", PropertyType.Number, "位图Y方向起始点坐标"));
        property.push(new Property("width", PropertyType.Number, "位图的宽度，单位dot"));
        property.push(new Property("heght", PropertyType.Number, "位图的宽度，单位dot"));
        property.push(new Property("mode", PropertyType.List, "位图绘制模式", "0->OVERWRITE,1->OR,2->XOR"));
        property.push(new Property("bitMapData", PropertyType.Bytes, "16进制位图，请选择图片"));

        return property;
    }
    leftPointX = 0;

    leftPointY = 0;

    width = 100; 

    heght = 100;

    mode = 0;

    bitMapData = [];

    setLeftPointX(x) {
        this.x = x;
    }

    setLeftPointY(y) {
        this.y = y;
    }

    setWidth(width) {
        this.width = width;
    }

    setHeight(height) {
        this.setHeight = height;
    }

    setMode(mode) {
        this.mode = mode;
    }

    setBitMapData(data) {
        this.bitMapData = data;
    }


    getCommand() {
        return `BARCODE ${this.elId} ${this.x},${this.y},"${this.code}",${this.height},${this.humanReadable},${this.rotation},${this.narrow},${this.wide},"${this.content}" \r\n`
    }
}




class Box {
    elId;

    elName = "矩形方框";
    elDesc = "用于在标签上绘制矩形方框";
    
    constructor(elementId) {
        this.elId;
    }
    
    getPropertyDesc() {
        var property = [];
        property.push(new Property("elId", PropertyType.Text, "组件ID"));
        property.push(new Property("xStart", PropertyType.Number, "方框左上角X坐标，单位dot"));
        property.push(new Property("yStart", PropertyType.Number, "方框左上角Y坐标，单位dot"));
        property.push(new Property("xEnd", PropertyType.Number, "方框右下角X坐标，单位dot"));
        property.push(new Property("yEnd", PropertyType.Number, "方框右下角Y坐标，单位dot"));
        property.push(new Property("lineWidth", PropertyType.Number, "方框线宽，单位dot"));


        return property;
    }

    xStart = 0;

    yStart = 0;

    xEnd = 100;

    yEnd = 100;

    lineWidth = 1;

    
    setXStart(xStart) {
        this.xStart = xStart;
    }

    setXEnd(xEnd) {
        this.xEnd = xEnd;
    }

    setYStart(yStart) {
        this.yStart = yStart;
    }

    setYEnd(yEnd) {
        this.yEnd = yEnd;
    }

    setLineWidth(lineWidth) {
        this.lineWidth = lineWidth;
    }
    
    getCommand() {
        this.str = `BOX ${this.elId} ${this.xStart},${this.yStart},${this.xEnd},${this.yEnd},${this.lineWidth} \r\n`
    }

}






class QrCode {
    elId;

    elName = "二维码";
    elDesc = "用于在标签上绘制二维码";

    constructor(elementId) {
        this.elId = elementId;
    }
    
    getPropertyDesc() {
        var property = [];
        property.push(new Property("elId", PropertyType.Text, "组件ID"));
        property.push(new Property("x", PropertyType.Number, "文字X方向起始点坐标"));
        property.push(new Property("y", PropertyType.Number, "文字Y方向起始点坐标"));
        property.push(new Property("eccLevel", PropertyType.List, "纠错登记", "L->7%,M->15%,Q->25%,H->30%"));
        property.push(new Property("cellWitdh", PropertyType.Number, "方块宽度", "", 0, 10));
        property.push(new Property("mode", PropertyType.List, "编码模式", "A->自动编码,M->手动编码"));
        property.push(new Property("rotation", PropertyType.List, "旋转", "0->0度,90->90度,180->180度,270->270度"));
        property.push(new Property("content", PropertyType.Text, "二维码内容"));


        return property;
    }

    x = 0;

    y = 0;

    eccLevel = 'L';

    cellWitdh = 1;

    mode = "A";

    rotation = 0;

    content = '';

    setX(x) {
        this.x = x;
    }

    setY(y) {
        this.y = y;
    }

    setMode(mode) {
        this.mode = mode;
    }

    setRotation(rotation) {
        this.rotation = rotation;
    }

    setContent(content) {
        this.content = content;
    }

    getCommand() {
        return `QRCODE ${this.elId} ${this.x},${this.y},${this.eccLevel},${this.cellWidth},${this.mode},${this.rotation},"${this.content}" \r\n`
    }

}





class Text {
    elId;


    elName = "文本";
    elDesc = "用于在标签上绘制文本";

    constructor(elementId) {
        this.elId = elementId;

    }

    getPropertyDesc() {
        var property = [];
        property.push(new Property("elId", PropertyType.Text, "组件ID"));
        property.push(new Property("x", PropertyType.Number, "文字X方向起始点坐标"));
        property.push(new Property("y", PropertyType.Number, "文字Y方向起始点坐标"));
        property.push(new Property("font", PropertyType.List, "字体名称", "1->8x12 dot 英数字体,TST24.BF2->繁体中文24x24Font,TSS24.BF2->简体中文24x24Font"));
        property.push(new Property("rotation", PropertyType.List, "旋转", "0->0度,90->90度,180->180度,270->270度"));
        property.push(new Property("xMultiplication", PropertyType.Number, "横向放大倍数 1-10", "", 0, 90));
        property.push(new Property("yMultiplication", PropertyType.Number, "纵向放大倍数 1-10", "", 0, 90));
        property.push(new Property("content", PropertyType.Text, "文本内容（{{占位符}}）"));


        return property;
    }


    x = 0;
    y = 0;
    font = 'TSS24.BF2';
    rotation = 0;
    xMultiplication = 1;
    yMultiplication = 1;
    content = "";

    setX(x) {
        this.x = x;
    }

    setY(y) {
        this.y = y;
    }

    setFont(font) {
        this.font = font;
    }

    setRotation(rotation) {
        this.rotation = rotation;
    }

    setXMultiplication(xMultiplication) {
        this.xMultiplication = xMultiplication;
    }

    setYMultiplication(yMultiplication) {
        this.yMultiplication = yMultiplication;
    }

    setContent(content) {
        this.content = content;
    }


    getCommand() {
        return `TEXT ${this.elId} ${this.x},${this.y},"${this.font}",${this.rotation},${this.xMultiplication},${this.yMultiplication},"${this.content}" \r\n`
    }

}
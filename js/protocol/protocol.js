class Element {
    supportElements =  {
        Bar : "Bar",//线条
        Text : "Text",//文本
        BarCode : "BarCode",//条码
        QrCode : "QrCode",//二维码
        BitMap : "BitMap",//图片
        Box : "Box",//矩形框
        Reverse : "Reverse"//指定区域反向打印
    }
}


class Property {
    name;
    type;
    desc;
    alternativeValue;
    minIfNumber ;
    maxIfNumber;


    constructor(name, type, desc, alternative = "", minIfNumber = 0, maxIfNumber = 0) {
        if (PropertyType.hasOwnProperty(type)) {
            this.name = name;
            this.type = type;
            this.desc = desc;
            this.alternativeValue = alternative;
            this.minIfNumber = minIfNumber;
            this.maxIfNumber = maxIfNumber;
        } else {
            throw new Error("")
        }
    }

}

var PropertyType = {
    Text:"Text",
    List:"List",
    Number:"Number",
    Bytes:"Bytes",
}



class CommandReader {

    readCommand(cmd, jsonData) {
        let elId = this.getElementId(cmd);

        var childData;
        if (!childData.hasOwnProperty(elId)) {
            childData = "Value not found";
        } else {
            childData = jsonData[elId];
        }      

        let holders = this.getElementHolders(cmd);

        holders.forEach(function(h) {
            cmd = this.fillHolder(cmd, h, childData);
        });
        return cmd.replace(elId, "");
    }


    getElementId(cmd) {
        return command.split(" ")[1]
    }

    getElementHolders(cmd) {
        var holders = [];
        
        var state = 0;
        var hodler = "";

        for (let i = 0; i < cmd.length; i++) {
            if (state == 0 && cmd[i]=="{") {
                state = 1;
            }
            if (state == 1 && cmd[i]=="{") {
                state=2;
            }
            if (state == 2) {
                holder += cmd[i];
            }
            if (state == 2 && cmd[i] == "}") {
                state = 3;
            }

            if (state == 3 && cmd[i] == "}") {
                state = 0;
                hodler = "";
                holders.push("{{" + holder + "}}");
            }
        }


        return holders;
    }

    fillHolder(cmd, holderName, childData) {
        var holderName = holderName.replace("{{", "").replace("}}", "");
        let holderValue;
        if (childData.hasOwnProperty(holderName)) {
            holderValue = childData[holderName];
        } else {
            holderValue = "Value for " + holderName + " not present!";
        }
        cmd.replace(holderName, holderValue);
        return cmd;
    }
}



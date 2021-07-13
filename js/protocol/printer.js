class Printer {

    commandReader;
    printerService;
    
    constructor(data) {
        this.printerService = new PrinterService();
        this.commandReader = new CommandReader();
    }


    readProtocal(template, data) {
        commandLine = this.getTemplateLine(template);
        var realCommands = "";

        let jsonData = JSON.parse(data);
        
        commandLine.forEach(function(line) {
            let element = this.getElementType(line);
            let command = this.commandReader.realCommand(line, data);
            realCommands += command;
        });
        return realCommands;
    }


    getTemplateLine(template) {
        snsArr = template.split(/[(\r\n)\r\n]+/);
        snsArr.forEach((item,index)=>{
              if(!item){
                  snsArr.splice(index,1);//删除空项
              }
        })
        return snsArr;
    }

    getElementType(command) {
        return command.substring(0, command.indexOf(" "));
    }


    print(realCommand) {
        //to be done!
    }


}


//读取模版文件，并且替换占位符，构建完整的打印命令
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

        for (var i = 0; i < cmd.length; i++) {
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

    fillHolder(cmd, holderName, holderValue) {
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
class Designer {
    template;

    // encoder = new encode.TextEncoder(
    //     'gb18030', {
    //       NONSTANDARD_allowLegacyEncoding: true
    //     });

    templateStr = '';
    strUnit = new DesignerUnit();

    constructor(template) {
        this.template = new Template();
    }

    propertyChangeHandler;

    getClsCommand() {
        return `CLS\r\n`;
    }


    updateElementProperty(elId, propertyName, value) {
        var changeingEl = this.template.getElementeById(elId);
        if (changeingEl == undefined || getElementeById == null) {
            return;
        }

        if (!changeingEl.hasOwenProperty(propertyName)) {
            return;
        }

        changeingEl[this.strUnit.firstCharUpperCase(propertyName)](value);
        
        if (this.propertyChangeHandler != undefined) {
            this.propertyChangeHandler(changeingEl);
        }
    }

    setPropertyChangeHandler(handler) {
        this.propertyChangeHandler = handler;
    }

    getCommand() {

        for (var el in this.template.elementes) {
            this.addCommand(this.template.elementes[el].getCommand());
        }

        return this.templateStr;
    }

    addCommand (content) { //将指令转成数组装起
        this.templateStr += content;
    }
    



}
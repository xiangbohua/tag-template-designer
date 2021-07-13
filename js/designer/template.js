class Template {
    
    constructor(templateStr) {
        if (templateStr == '' || templateStr == undefined) {
            var page = new Page('page');
            this.elementes.push(page);
        }
        this.templateStr = templateStr;
    }

    addElement(el) {
        if (el instanceof Page) {
            throw new Error('can not add a new page')
        }
        this.elementes.push(el);
    }

    removeElement(elId) {
        for (var el in this.elementes) {
            if (el.elId == elId) {
                this.elementes.remove(el);
            }
        }
    }

    getElementeById(elId) {
        for (var el in this.elementes) {
            if (this.elementes[el].elId == elId) {
                return this.elementes[el]
            }
        }
        return null;
    }

    getNewElementeId(elType) {
        var countOfThisType = 0;
        for (var el in this.elementes) {
            if (this.elementes[el].constructor.name == elType) {
                countOfThisType ++;
            }
        }
        return elType + countOfThisType;
    }


    elementes = [];

    templateStr = '';

}

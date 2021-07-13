var designer = new Designer();
var strUnit = new DesignerUnit();
var canvasHelper = {
    canvas : function () {
        return document.getElementById("drawCancas");
    }

};


var helper = {
    showProperties : function(el) {
        $(".dsn-middle-right-bottom").children().remove();
        
        var group = $("#property-container-group").clone().css('display', 'block');

        var properties = el.getPropertyDesc();
        var elId = el.elId;
        for (pro in properties) {
            var propertyDom;
            var p = properties[pro];
            switch (p.type) {
                case PropertyType.Text : 
                    propertyDom = this.buildTextProperty(elId, p.name, p.desc, el[p.name]);
                    break;
                case PropertyType.List:
                    propertyDom = this.buildListProperty(elId, p.name, p.desc, p.alternativeValue, el[p.name]);
                    break;
                case PropertyType.Number:
                    propertyDom = this.buildNumberProperty(elId, p.name, p.desc, p.minIfNumber, p.maxIfNumber, el[p.name]);
                    break;
                case PropertyType.Bytes:
                    propertyDom = this.buildByteProperty(elId, p.name, p.desc, el[p.name]);
                    break;
                default:
                    propertyDom = undefined;
                    break;
            }
            
            if (propertyDom != undefined) {
                propertyDom.find('.dsn-property-container-desc').html(p.desc).attr('data-property-name', p.name);
                $(group).append(propertyDom);
            }
        }
        $(".dsn-middle-right-bottom").append(`<p class="dsn-middle-right-bottom-el-name">${el.elName} 的属性</p>`)
        $(".dsn-middle-right-bottom").append(group);
    },


    buildTextProperty : function(elId, name, desc, value) {

        var container = $("#property-container").clone().css('display', 'block');
        var text = $(`<input type= "text" data-elid="${elId}" data-property-name="${name}" value="${value}">`);
        container.append(text)

        $(text).on('change', function(value) {
            alert("text changed" + elId + name + desc + value);
            designer.update()
        });
        return container;
    },

    buildListProperty : function (elId, name, desc, selectValue, current) {

        var container = $("#property-container").clone().css('display', 'block');
        
        var select = $('<select data-elid="${elId}" data-property-name="${name}"></select>');
        var options = selectValue.split(',');
        for (opStr in options) {
            var optionSubStr = options[opStr];
            var opKey = optionSubStr.split('->')[0];
            var opValue = optionSubStr.split('->')[1];
            var selected = opKey === current ? "current" : "";
            $(select).append(`<option ${selected} value=${opKey}>${opValue}</option>`);
        }

        container.append(select)

        $(select).on('change', function(value) {
            alert("select changed" + elId + name + desc + value);
            designer.updateElementProperty($(value.target).attr('data-elid'), name, value);
        });

        return container;
    },

    buildNumberProperty : function (elId, name, desc, min, max, value) {

        var container = $("#property-container").clone().css('display', 'block');
        var text = $(`<input type= "number" data-elid="${elId}" data-property-name="${name}" value='${value}'> min="${min}" max="${max}"`);
        container.append(text)

        $(text).on('change', function(value) {
            alert("text changed" + elId + name + desc + value);
            
            designer.updateElementProperty($(value.target).attr('data-elid'), name, value);
        });

        return container;
    },

    buildByteProperty : function (elId, name, desc) {

    },

    createNewElement : function (elType) {
        var newElCode = designer.template.getNewElementeId(elType);
        
        var newElement;
        switch (elType) {
            case "Text":
                newElement = new Text(newElCode);
                break;
            case "Bar":
                newElement = new Bar(newElCode);
                break;
            case "Box":
                newElement = new Box(newElCode);
                break;
            case "BarCode":
                newElement = new BarCode(newElCode);
                break;
            case "QrCode":
                newElement = new QrCode(newElCode);
                break;
            case "BitMap":
                newElement = new BitMap(newElCode);
                break;
        }
        return newElement;
    },

    addNewElementToCanvas : function (newEl) {
        var elType = newEl.constructor.name;

        var templateDom = $(`[data-template-type='${elType}']`);

        var newDom = templateDom.clone();
        newDom.removeAttr('data-template-type').css('top', (designer.template.elementes.length * 40) + "px");
        newDom.attr('data-element-id', newEl.elId);

        newDom.on('clock', function() {
            helper.showProperties(template.getElementeById(newEl.elId));
        });
        newDom.on('change', function() {
            helper.showProperties(template.getElementeById(newEl.elId));
        });

        $(".dsn-middle-center-draw").append(newDom);
    },

    drawElement : function (element) {
        var elType = strUnit.getClassName(element);
        this['draw' + elType](element);
    },

    drawPage : function(pageEl) {

    },

    drawCoordinate : function(xLength, yLength) {
        var ctx = canvasHelper.canvas().getContext('2d');
        ctx.beginPath();
        ctx.moveTo(10, 10);
        ctx.lineTo(10, yLength);
        ctx.closePath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'red';
        ctx.stroke();



    },


    drawText : function (textEl) {
        var elId = textEl.elId;
        $(".dsn-middle-center-draw");
    },

    drawBar : function (barEl) {
        
    },

    drawQrCode : function (barEl) {

    },

    drawBarCode : function (barEl) {

    }
}


$(document).ready(function() {
    $(".dsn-tool-container").on("click", function(event){
        var type = $(event.target).parent().attr("data-new-el-type");
        var newEl = helper.createNewElement(type);

        designer.template.addElement(newEl);
        helper.addNewElementToCanvas(newEl);
        helper.drawElement(newEl);
        helper.showProperties(newEl);
    });

    var page = designer.template.getElementeById('page');

    helper.showProperties(page);
    helper.drawCoordinate(page.pageWidth + 10, page.pageHeight + 10);//初始化

    $('#btn').on('click', function() {
        var cmd = designer.getCommand();

        console.log(cmd);

    });

});


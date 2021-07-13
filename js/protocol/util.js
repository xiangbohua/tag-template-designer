class DesignerUnit {
    firstCharUpperCase(str) {
        return str[0] = str[0].toUpperCase();
    }


    firstCharLowerCase(str) {
        return str[0] = str[0].toLowerCase();
    }

    getClassName(obj) {
        return obj.constructor.name;
    }
}
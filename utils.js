function extend(obj1, obj2){
    if( obj1 == undefined ) obj1 = {};
    if( obj2 == undefined ) obj2 = {};
    var obj3 = {};
    
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
}

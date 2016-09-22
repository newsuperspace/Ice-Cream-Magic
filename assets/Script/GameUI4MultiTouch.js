var touchType = cc.Class({

    //---------------状态标记-------------
    isInvalidation: false,
    index: 0,

    // --------------当前触点所代表的操作类型-------------
    isMoving:false,
    isJumping: false,
    jumpForward: 0,  // -1 = left; 0=no; 1=right

    // --------------判断当前触点执行Jump操作的数据信息---------------
    jumpControlStartPoint: null,
    jumpControlStartTime: 0,
    // ---------------- 与移动操作有关的数据信息-------------------

    touchBeginTime: 0,
    touchCurrentTime: 0,
    
    touch: null,  // cc.Touch类型

});

module.exports = touchType;





cc.Class({
    extends: cc.Component,

    properties: {

        player:{
            default: null,
            type: cc.Node
        },

    },

    // use this for initialization
    onLoad: function () {






        
    },







    update: function (dt) {

    },
});

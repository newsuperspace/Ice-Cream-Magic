
var life = require('life');


// 近乎于一种标记接口，所有敌人节点的逻辑控制组件都必须是继承自我们这个标记ccclass
cc.Class({
    extends: life,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function () {
       
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },


});


var life = require('life');


// 近乎于一种标记接口，所有敌人节点的逻辑控制组件都必须是继承自我们这个标记ccclass
cc.Class({
    extends: life,     // 作为一切敌对生命体的父类，它也是有生命的因此基类是life

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
        this.player = this.node.parent.getChildByName('player');   // 因为敌人节点、player节点、法术节点都是在同一个父节点foe之下
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    // 当发现玩家点击了当前对象，说明自己被攻击了，则调用这个逻辑
    // 每个敌人类型生命体都可以接受玩家的点击操作
    // 玩家点击这个敌人生命体就代表，向这个敌人省生命体发射普通攻击（魔法飞弹）
    // 然后就是调用这个方法
    beAttacked: function () {
        var position = this.node.getPosition();
        this.player.getComponent('player').shooting(position);
    },


});

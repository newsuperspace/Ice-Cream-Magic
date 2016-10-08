var FoeMother = require('FoeMother');

cc.Class({
    extends: FoeMother,

    properties: {
        moveSpeed: {   // 移动速度
            default: 100,
            type: cc.Integer
        },

        healthValue: {   // 自定义生命值
            default: 100,
            type: cc.Integer
        },

    },

    // use this for initialization
    onLoad: function () {

        this.player = this.node.parent.getChildByName('player');   // 因为敌人节点、player节点、法术节点都是在同一个父节点foe之下
        this.health = this.healthValue;

    },

    // 当发现玩家点击了当前对象，说明自己被攻击了，则调用这个逻辑
    beAttacked: function () {
        var position = this.node.getPosition();
        this.player.getComponent('player').shooting(position);
    },


    




    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

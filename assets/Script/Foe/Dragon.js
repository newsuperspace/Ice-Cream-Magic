var FoeMother = require('FoeMother');

cc.Class({
    extends: FoeMother,

    properties: {
        moveSpeed: {   // 移动速度
            default: 100,
            type: cc.Integer
        },

        healthValue: {   // 自定义生命值
            default: 1000,
            type: cc.Integer
        },



    },

    // use this for initialization
    onLoad: function () {
        this.player = this.node.parent.getChildByName('player');   // 因为敌人节点、player节点、法术节点都是在同一个父节点foe之下
        this.health = this.healthValue;

    },

    // 龙出场，从天而降，下落到地面的动画效果的最后一帧调用的动画事件回调
    // 作用就是调用父节点的父节点rootCanvas的画面震动动画。
    shock: function(){
        this.node.parent.parent.parent.getComponent(cc.Animation).play('shock');
    },

    // 龙攻击，在攻击动画走到探头的那一帧的时候所产生的动画事件的回调函数
    // 作用就是执行攻击逻辑，具体执行那种攻击类型还需要更深入的判定逻辑的支持
    attack: function(){
        // 执行攻击逻辑
        
    },    




    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },


    // =================================以下均是测试使用方法=================================
    playDragonDown: function(){
        this.node.getComponent(cc.Animation).play('DragonDown');
    },

    playDragonAttack: function(){
        this.node.getComponent(cc.Animation).play('DragonAttack');
    },













});

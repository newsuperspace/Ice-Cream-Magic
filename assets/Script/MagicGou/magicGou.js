const enumType = require('enum');

cc.Class({
    extends: cc.Component,

    properties: {

        damageValue: {
            default: 300,
            type: cc.Integer
        },

    },

    // use this for initialization
    onLoad: function () {

        cc.log('onLoad');

        this.player = cc.find('Canvas/rootCanvas/foe/player');  // 用来定位player上的PoolManage，从而将当前组件所挂载对象返回给特定的NodePool中去

        this.gouRoot = cc.find('gouRoot', this.node);

        this.gouRoot.active = true;
    },

    // 向指定位置发动魔法
    magicGouStart: function (position) {

        cc.log('magicGouStart已经开动了');

        this.onLoad();

        var pos = position;

        // 设置魔法集合体的初始位置
        this.node.x = pos.x;
        this.node.y = pos.y;

        cc.log('Gou节点起始位置是：' + this.node.x + ',' + this.node.y);
        // 播放下坠动作动画
        this.gouRoot.getComponent(cc.Animation).play('magicGou');
    },

    // 资源回收
    recycle: function () {

        cc.log('Gou技能回收了');

        var manager = this.player.getComponent('PoolManager');
        manager.backNode(enumType.playerMagicType.gou, this.node);

    },

    // 测试按钮回调方法
    play: function () {
        this.onLoad();
        this.gouRoot.getComponent(cc.Animation).play('magicGou');

        cc.log('play了');
    },


    // called every frame, uncomment this function to activate update callback
    update: function (dt) {

        if (!this.gouRoot.active) {
            // 讲当前gou魔法节点回收到player指定的对象池中去，以备下次重复利用
            this.recycle();
        }

    },
});

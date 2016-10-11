const enumType = require('enum');

cc.Class({
    extends: cc.Component,

    properties: {
        fallSpeed: {
            default: 100,
            type: cc.Integer
        },

        elevation: {    // 当魔法节点距离屏幕可见上缘多少像素的时候的开始播放转换尾炎的动画
            default: 100,
            type: cc.Integer
        },

        damageValue: {
            default: 100,
            type: cc.Integer
        },

    },

    // use this for initialization
    onLoad: function () {

        // 启动碰撞检测
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;

        this.blue = cc.find('fallRoot/blue', this.node);
        this.green = cc.find('fallRoot/green', this.node);
        this.yellow = cc.find('fallRoot/yellow', this.node);

        this.player = cc.find('Canvas/rootCanvas/foe/player');   // 查找到角色player节点对象

        this.anims = ['magicFallStart', 'magicFallChange', 'magicFallStill', 'magicFallDown'];

        this.activeAllNodes();
    },

    activeAllNodes: function () {
        // 保证所有节点都被激活
        for (var i = 0; i < this.node.children[0].children.length; i++) {
            let child = this.node.children[0].children[i];
            child.active = true;

            for (var j = 0; j < child.children.length; j++) {
                child.children[j].active = true;
            }
        }
    },



    // ==================================播放子节点rootFall上的形态改变动画=====================================
    playStart: function () {
        this.node.children[0].getComponent(cc.Animation).play(this.anims[0]);
        cc.log('执行了start');
    },

    playChange: function () {
        this.node.children[0].getComponent(cc.Animation).play(this.anims[1]);
        cc.log('执行了change');
    },

    playStill: function () {
        this.node.children[0].getComponent(cc.Animation).play(this.anims[2]);
        cc.log('执行了still');
    },


    // ===========================================魔法的启动源头================================================
    // 参数position类型为cc.Vec2 告知目标的下落撞击点的位置坐标
    magicFallStart: function (position) {

        cc.log('magicFallStart已经开动了');

        // 将位置坐标转换为父节点foe节点的坐标系的坐标
        var pos = this.node.parent.convertToNodeSpaceAR(position);

        // 设置魔法集合体的初始位置
        // this.node.setPosition(pos.x, cc.director.getVisibleSize().height / 2); 
        this.node.x = pos.x;

        cc.log('fall节点起始位置是：' + this.node.x + ',' + this.node.y);
        // 播放下坠动作动画
        this.node.getComponent(cc.Animation).play(this.anims[3]);
    },

    // 测试按钮回调方法
    play: function () {
        this.node.getComponent(cc.Animation).play(this.anims[3]);
        cc.log('play了');
    },



    // 返回对象池
    recycle: function () {

        cc.log('fall技能回收了');

        var manager = this.player.getComponent('PoolManager');
        manager.backNode(enumType.playerMagicType.fall, this.node);
    },


    // 监控是否因该返回到对象池中去了
    update: function (dt) {

        // cc.log('fall位置变化：' + this.node.x + ',' + this.node.y);

        if (!this.blue.active && !this.green.active && !this.yellow.active) {

            cc.find('Canvas/rootCanvas').getComponent(cc.Animation).play('shock');

            this.recycle();
        }
    },
});

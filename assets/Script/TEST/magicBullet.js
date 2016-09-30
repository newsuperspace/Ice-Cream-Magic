const enumType = require('enum');

cc.Class({
    extends: cc.Component,

    properties: {

        atlas: {     // 魔法飞弹的外形所需要使用的三种飞弹图片所在的图集
            default: null,
            type: cc.SpriteAtlas
        },

        flySpeed: {   // 魔法飞弹的飞行速度
            default: 600,
            type: cc.Integer
        }
    },

    // use this for initialization
    onLoad: function () {

        this.player = cc.find('Canvas/rootCanvas/foe/player');   // 查找到角色player节点对象
        this.stopMoving = false;   // 是否停止飞弹的运动,当飞弹触碰到敌人或者障碍物的时候设置该属性为true

        // 飞弹的飞行向量 —————— 通过自身的confirmFlyForward()方法计算得来
        this.flyForward = null;  // 这是一个单位向量，向量长度为1，保存着X和Y的比例信息

        // -------------------随机生成不同颜色的魔法飞弹所需要使用的数组信息----------------
        this.animNames = ['magicBullet_blue', 'magicBullet_green', 'magicBullet_yellow']; // 三种动画名称对应三种颜色
        this.spriteFrames = ['blueBALL', 'greenBALL', 'yellowBALL'];
        this.index = this.randomColor();

        // -------------------设置飞弹外观-------------------
        this.node.getComponent(cc.Sprite).spriteFrame = this.atlas.getSpriteFrame(this.spriteFrames[this.index]);


        // ------------------获取当前游戏所运行设备屏幕的可见范围-------------------
        this.visibleWidth = cc.director.getVisibleSize().width;  // 获取可是范围——cc.Size类型中的width记录可是范围的宽度（像素）
        this.visibleHeight = cc.director.getVisibleSize().height;  // 可是范围的高度（像素）
    },

    // 在三种颜色中随机选择一种作为魔法飞弹的图形图像和碎裂动画的标准
    randomColor: function () {
        // Math.floor(Math.random() * (max - min + 1) + min);
        return Math.floor(Math.random() * 3);
    },


    // 根据player节点当前的scaleX的数值判断飞弹的初始位置是在player的左侧还是右侧,由confirmFlyForward()调用
    // scaleX == 1 右侧
    // scaleX == -1 左侧
    initPosition: function () {
                                
        // var player = cc.find('Canvas/rootCanvas/foe/player');
        var player = this.player;

        var position = new cc.Vec2();
        position.x = player.getPosition().x;
        position.y = player.getPosition().y;

        if (player.scaleX > 0) {
            // 右侧出现
            position.x += player.width / 2;
            position.y += player.height / 4;
        }
        else {
            // 左侧出现
            position.x -= player.width / 2;
            position.y += player.height / 4;
        }

        this.node.x = position.x;  // 重置飞弹位置
        this.node.y = position.y;

        return position;
    },


    // 根据player的位置，确定当前这颗魔法飞弹的位置
    // 敌人的目标位置 —————— 敌人节点的监听器收到单击事件->调用同级节点player的shooting方法将自身位置传递进去->shooting内部从PoolMng中得到飞弹实例并调用该方法计算得到飞行向量
    // position是cc.Vec2类型
    confirmFlyForward: function (position) {

        var startPosition = this.initPosition();
        this.flyForward = cc.pNormalize(cc.pSub(position, startPosition));
        
        this.stopMoving = false;   // 不停止飞行
        this.node.getComponent(cc.Sprite).spriteFrame = this.atlas.getSpriteFrame(this.spriteFrames[this.index]);  // 重置外观
    },

    // 向指定目标飞行
    flying: function (dt) {

        cc.log('飞行速度为:'+this.flySpeed);

        this.node.x += this.flyForward.x * this.flySpeed * dt;
        this.node.y += this.flyForward.y * this.flySpeed * dt;
    },


    // 返回对象池
    recycle: function () {
        var manager = this.player.getComponent('PoolManager');
        manager.backNode(enumType.playerMagicType.bullet, this.node);
    },



    // --------------------------------------------碰撞检测回调函数-------------------------------------------------
    onCollisionEnter: function (other, self) {

        // 停止飞弹的运动
        this.stopMoving = true;

        // 对于子弹来说只需要破裂消失就好了
        this.node.getComponent(cc.Animation).play(this.animNames[this.index]);   // 播放动画
    },

    // -------------------------------------------------刷新绘制帧-------------------------------------------------
    update: function (dt) {

        // 由于飞弹的所使用的父节点的坐标系锚点为0.5,0.5也就是坐标原点位于屏幕中央，因此这里比较都用一般的宽度和高度
        // 来判定当前飞弹节点是否超出了屏幕的可视范围？如果超出了就回收
        if (Math.abs(this.node.x) > this.visibleWidth / 2 || Math.abs(this.node.y) > this.visibleHeight / 2) {
            // 超出了可视范围———回收回对象池中去，循环以备下次使用
            this.recycle();
        }
        else {

            if(!this.stopMoving && this.flyForward)
                this.flying(dt); // 没超出可视范围————继续绘制飞弹的新位置
        }

    },
});

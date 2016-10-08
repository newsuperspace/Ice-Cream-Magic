var touchType = require('GameUI4MultiTouch');

var EnumType = require('enum');

var NodePool = require('NodePool');

var life = require('life');

cc.Class({
    extends: life,

    properties: {

        playerSpeed: {
            default: 50,   // 默认 50像素/秒
            type: cc.Integer
        },


        // ----------------------各个技能的CD时间-------------------------
        magicBulletCD: {
            default: 300,  // 300毫秒
            type: cc.Integer
        },

        magicGouCD: {
            default: 4000, // 4000毫秒
            type: cc.Integer
        },

        magicFallCD: {
            default: 5000,   // 5000毫秒
            type: cc.Integer
        },


        // ----------------------各个技能的硬直时间-------------------------
        bulletStiffTime: {
            default: 150,
            type: cc.Integer
        },

        gouStiffTime: {
            default: 500,
            type: cc.Integer
        },

        fallStiffTime: {
            default: 1000,
            type: cc.Integer
        }

    },

    // use this for initialization
    onLoad: function () {

        // 初始化对象池管理器，管理器会自动批量初始化其所管理的所有对象池，为对象池中对象的存取做好准备
        this.node.getComponent('PoolManager').init();


        // 记录三个技能最后一次释放的
        this.magicBulletPrepareTime = this.magicBulletCD;
        this.magicGouPrepareTime = this.magicGouCD;
        this.magicFallPrepareTime = this.magicFallCD;

        // 过去的硬直时间
        this.passedBulletStiffTime = this.bulletStiffTime;
        this.passedGouStiffTime = this.gouStiffTime;
        this.passedFallStiffTime = this.fallStiffTime;



        this.isMoving = false;   // flag标志，告诉update是否应该根据targetX来变更player的位置坐标
        this.targetX = 0;   // player的移动目标位置的X坐标。

        this.moveType = EnumType.MoveType.walk;  // 默认初始化的player的行走方式是走动

        // 这个动画属性很关键，用来告诉GameUI那边的Update()方法不用重复播放行走的动画了，不然人物在
        // 绘制每一帧画面的时候都会重头播放行走动画，等同于人物动作不改变（永远从动画的第一个关键帧开始，不会有变化）
        this.moveAnimationIsPlaying = false;
        this.jumpAnimationIsPlaying = false;
    },


    // 判断当前player人物是否处于技能使用后的硬直时间
    isStiffing: function () {

        var result = false;

        if (this.passedBulletStiffTime != this.bulletStiffTime || this.passedGouStiffTime != this.gouStiffTime || this.passedFallStiffTime != this.fallStiffTime) {
            result = true;
        }

        return result;
    },


    // =====================================移动========================================
    // 玩家角色移动功能---------本方法是在当前脚本内部的update()中调用的
    Move: function (dt) {

        // 如果人物当前处于僵直状态，则直接退出
        if (this.isStiffing())
            return;


        // 播放动画吗？
        if (!this.jumpAnimationIsPlaying && !this.moveAnimationIsPlaying) // 如果当前没在播放跳跃动画，则才可以播放行走动画
        {
            this.node.getComponent(cc.Animation).play('walk_player');
            this.moveAnimationIsPlaying = true;
        }

        // -----------------------------行走的运动逻辑-----------------------------------

        if (this.moveType === EnumType.MoveType.walk) {

            if (this.targetX > this.node.x)  // 如果触点x坐标大于player节点的x坐标
            {
                this.node.scaleX = Math.abs(this.node.scaleX);  //  人物图片脸部向右

                var distance = dt * this.playerSpeed;

                if ((this.node.x + distance) >= -(cc.director.getVisibleSize().width / 2 * 0.3)) {
                    // 看人物有没有超过-140的坐标点（以标准屏幕 960×480为标准屏幕，且父节点锚点为0.5,0.5）
                    this.node.x = -(cc.director.getVisibleSize().width / 2 * 0.3);
                }
                else {
                    if ((this.node.x + distance) >= this.targetX) {
                        this.node.x = this.targetX;
                    }
                    else {
                        this.node.x += distance;
                    }
                }

            } else {  // 触点的X坐标小于player节点的x坐标

                this.node.scaleX = -Math.abs(this.node.scaleX); //  人物图片脸部向左

                var distance = dt * this.playerSpeed;

                if ((this.node.x - distance) <= -(cc.director.getVisibleSize().width / 2)) {
                    // 看人物有没有超出屏幕的可见范围
                    this.node.x = -(cc.director.getVisibleSize().width / 2);
                }
                else {
                    if ((this.node.x - distance) <= this.targetX) {
                        this.node.x = this.targetX;
                    }
                    else {
                        this.node.x -= distance;
                    }
                }
            }
            return;
        }

        // ------------------------------战斗的运动逻辑-----------------------------------
        if (this.targetX > this.node.x)  // 如果触点x坐标大于player节点的x坐标
        {
            this.node.scaleX = Math.abs(this.node.scaleX);  // 图片方向向右

            var distance = dt * this.playerSpeed;

            if ((this.node.x + distance) >= (cc.director.getVisibleSize().width / 2)) {
                // 看人物有没有超出屏幕的可见范围
                this.node.x = cc.director.getVisibleSize().width / 2;
            }
            else {
                if ((this.node.x + distance) >= this.targetX) {
                    this.node.x = this.targetX;
                }
                else {
                    this.node.x += distance;
                }
            }

        } else {  // 触点的X坐标小于player节点的x坐标

            this.node.scaleX = -Math.abs(this.node.scaleX); // 图片方向向左

            var distance = dt * this.playerSpeed;

            if ((this.node.x - distance) <= -(cc.director.getVisibleSize().width / 2)) {
                // 看人物有没有超出屏幕的可见范围
                this.node.x = -(cc.director.getVisibleSize().width / 2);
            }
            else {
                if ((this.node.x - distance) <= this.targetX) {
                    this.node.x = this.targetX;
                }
                else {
                    this.node.x -= distance;
                }
            }
        }

    },

    // 被GameUI脚本调用，因为攻击、跳跃等动作会自动停止（一次性动作）只有移动时候小碎步的动画是循环播放的，因此GameUI需要在用户停止所有触点后停止移动动画
    Moved: function () {
        this.isMoving = false;
        if (this.moveAnimationIsPlaying) {
            this.moveAnimationIsPlaying = false;
            this.node.getComponent(cc.Animation).stop();
        }
    },



    // =====================================跳跃========================================
    // touchType存放着关于操作的一切信息； GameUI所使用的玩家输入操作控制脚本实例对象
    // 本方法是由GameUI脚本组件直接调用的
    Jump: function (touchtype, gameui) {

        // 如果人物当前处于将之状态，则直接退出
        if (this.isStiffing())
            return;

        if (this.jumpAnimationIsPlaying) {
            // 防止重复执行跳跃动画，当跳跃动画当前正在播放（跳跃动作还没完成）的时候不重复出现跳跃动作
            return;
        }

        var forward = touchtype.jumpForward;

        if (1 == forward) {
            // 向右挑
            this.node.scaleX = Math.abs(this.node.scaleX);
        }
        else if (-1 == forward) {
            // 向左跳
            this.node.scaleX = -Math.abs(this.node.scaleX);
        }

        this.jumpAnimationIsPlaying = true;

        var anim = this.node.getComponent(cc.Animation);

        if (this.moveAnimationIsPlaying) {
            this.node.getComponent(cc.Animation).stop();
            this.moveAnimationIsPlaying = false;
        }

        anim.play('jump_player');

        // 至此跳跃动画已经执行，然后调用GameUI脚本上的跳跃收尾工作逻辑
        // （将一切touchArray数组中isJumping为true的touchType对象设置为null）
        gameui.hasJumped();
    },

    Jumped: function ()  // 跳跃的收尾工作,被跳跃动画剪辑调用
    {
        this.jumpAnimationIsPlaying = false;
    },


    // =====================================射蛋========================================
    // 射击魔法飞弹————射出去后不管
    shooting: function (position) {

        if (this.magicBulletPrepareTime != this.magicBulletCD) {
            // 如果冷却时间累计不足规定技能CD时间，则直接退出
            return;
        }

        var manager = this.node.getComponent('PoolManager');
        var node = manager.requestNode(EnumType.playerMagicType.bullet);

        // 发射飞弹的时候player人物要朝向敌人的方向
        if (position.x > this.node.x) {
            this.node.scaleX = Math.abs(this.node.scaleX);  // 人物图片脸部向右
        }
        else {
            this.node.scaleX = -Math.abs(this.node.scaleX); //  人物图片脸部向左
        }

        // 飞弹节点所属坐标系（父节点）已经在NodePool内设置好了
        // 现在只要设置起始的位置坐标就行了
        node.getComponent('magicBullet').confirmFlyForward(position);


        // 技能释放完成后，清空冷却事件累计变量为0
        this.magicBulletPrepareTime = 0;
        // 硬质时间归0
        this.passedBulletStiffTime = 0;
    },


    // ==================================帧绘制任务功能==================================
    update: function (dt) {    // 记住cocos中使用的时间单位是秒，而不是其他语言和IDE中通常使用的毫秒

        // 移动
        if (this.isMoving)
            this.Move(dt);

        //----------------------------- 技能冷却时间流逝-------------------------------
        if (this.magicBulletPrepareTime < this.magicBulletCD)  // 如果飞弹技能的冷却累计时间没有达到规定的CD事件，则
        {
            // 将距离上一帧的时间流逝累加到冷却时间累计变量上
            this.magicBulletPrepareTime += dt * 1000;     // 转秒为毫秒
            if (this.magicBulletPrepareTime > this.magicBulletCD) {
                // 如果超过了规定的CD时间，则说明技能已经准备好，将累计变量更改为CD上限就说明可以发动技能了
                this.magicBulletPrepareTime = this.magicBulletCD;
            }
            cc.log('技能冷却时间累计:' + this.magicBulletPrepareTime);
        }

        if (this.magicGouPrepareTime < this.magicGouCD)  // 如果飞弹技能的冷却累计时间没有达到规定的CD事件，则
        {
            // 将距离上一帧的时间流逝累加到冷却时间累计变量上
            this.magicGouPrepareTime += dt * 1000;   // 转秒为毫秒
            if (this.magicGouPrepareTime > this.magicGouCD) {
                // 如果超过了规定的CD时间，则说明技能已经准备好，将累计变量更改为CD上限就说明可以发动技能了
                this.magicGouPrepareTime = this.magicGouCD;
            }
        }

        if (this.magicFallPrepareTime < this.magicFallCD)  // 如果飞弹技能的冷却累计时间没有达到规定的CD事件，则
        {
            // 将距离上一帧的时间流逝累加到冷却时间累计变量上
            this.magicFallPrepareTime += dt * 1000;       // 转秒为毫秒
            if (this.magicFallPrepareTime > this.magicFallCD) {
                // 如果超过了规定的CD时间，则说明技能已经准备好，将累计变量更改为CD上限就说明可以发动技能了
                this.magicFallPrepareTime = this.magicFallCD;
            }
        }

        //----------------------------- 人物僵直时间流逝-------------------------------

        if (this.passedBulletStiffTime < this.bulletStiffTime) {

            this.passedBulletStiffTime += dt * 1000;
            if (this.passedBulletStiffTime > this.bulletStiffTime) {
                this.passedBulletStiffTime = this.bulletStiffTime;
            }
        }

        if (this.passedGouStiffTime < this.gouStiffTime) {

            this.passedGouStiffTime += dt * 1000;
            if (this.passedGouStiffTime > this.gouStiffTime) {
                this.passedGouStiffTime = this.gouStiffTime;
            }
        }

        if (this.passedFallStiffTime < this.fallStiffTime) {

            this.passedBulletStiffTime += dt * 1000;
            if (this.passedFallStiffTime > this.fallStiffTime) {
                this.passedFallStiffTime = this.fallStiffTime;
            }
        }



    },
});

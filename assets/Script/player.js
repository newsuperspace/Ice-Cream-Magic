var touchType = require('GameUI4MultiTouch');

var EnumType = require('enum');


cc.Class({
    extends: cc.Component,

    properties: {

        playerSpeed: {
            default: 50,   // 默认 50像素/秒
            type: cc.Integer
        },

    },

    // use this for initialization
    onLoad: function () {
        this.isMoving = false;   // flag标志，告诉update是否应该根据targetX来变更player的位置坐标
        this.targetX = 0;   // player的移动目标位置的X坐标。

        this.moveType = EnumType.MoveType.walk;  // 默认初始化的player的行走方式是走动

        // 这个动画属性很关键，用来告诉GameUI那边的Update()方法不用重复播放行走的动画了，不然人物在
        // 绘制每一帧画面的时候都会重头播放行走动画，等同于人物动作不改变（永远从动画的第一个关键帧开始，不会有变化）
        this.moveAnimationIsPlaying = false;
        this.jumpAnimationIsPlaying = false;
    },


    // 玩家角色移动功能---------本方法是在当前脚本内部的update()中调用的
    Move: function (dt) {

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
                this.node.scaleX = Math.abs(this.node.scaleX);  // 图片方向向右

                var distance = dt * this.playerSpeed;

                if ((this.node.x + distance) >= -(cc.director.getVisibleSize().width/2*0.3)) {
                    // 看人物有没有超过-140的坐标点（以标准屏幕 960×480为标准屏幕，且父节点锚点为0.5,0.5）
                    this.node.x = -(cc.director.getVisibleSize().width/2*0.3);
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


    // ===============跳跃====================
    // touchType存放着关于操作的一切信息； GameUI所使用的玩家输入操作控制脚本实例对象
    // 本方法是由GameUI脚本组件直接调用的
    Jump: function (touchtype, gameui) {

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



    // =========================帧绘制任务功能==========================
    update: function (dt) {

        // 移动
        if (this.isMoving)
            this.Move(dt);

        // 普通攻击

        // 施法

    },
});

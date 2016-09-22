var touchType = require('GameUI4MultiTouch');

cc.Class({
    extends: cc.Component,

    properties: {

        playerSpeed: {
            default: 50,
            type: cc.Integer
        },



    },

    // use this for initialization
    onLoad: function () {
        this.isMoving = false;
        this.targetX = 0;

        // 这个动画属性很关键，用来告诉GameUI那边的Update()方法不用重复播放行走的动画了，不然人物在
        // 绘制每一帧画面的时候都会重头播放行走动画，等同于人物动作不改变（永远从动画的第一个关键帧开始，不会有变化）
        this.moveAnimationIsPlaying = false;
        this.jumpAnimationIsPlaying = false;
    },


    // 玩家角色移动功能
    Move: function (dt) {
        if (this.targetX > this.node.x)  // 如果触点x坐标大于player节点的x坐标
        {
            this.node.scaleX = Math.abs(this.node.scaleX);  // 图片方向向右

            var distance = dt * this.playerSpeed;
            if ((this.node.x + distance) >= this.targetX) {
                this.node.x = this.targetX;
            }
            else {
                this.node.x += distance;
            }
        } else {  // 触点的X坐标小于player节点的x坐标

            this.node.scaleX = -Math.abs(this.node.scaleX); // 图片方向向左

            var distance = dt * this.playerSpeed;
            if ((this.node.x - distance) <= this.targetX) {
                this.node.x = this.targetX;
                // var action =  cc.moveTo(dt,cc.p(this.targetX,this.node.y));
                // this.node.runAction(action);
            }
            else {
                this.node.x -= distance;
                // var action = cc.moveBy(dt,cc.p(-distance,0));
                // this.node.runAction(action);
            }
        }
    },


    // ===============跳跃====================
    // touchType存放着关于操作的一切信息； GameUI所使用的玩家输入操作控制脚本实例对象
    Jump: function (touchtype,gameui) {

        var forward =  touchtype.jumpforward;

        if (1 == forward) {
            // 向左挑
            this.node.scaleX = Math.abs(this.node.scaleX);
        }
        else if (-1 == forward) {
            // 向右跳
            this.node.scaleX = -Math.abs(this.node.scaleX);
        }

        this.jumpAnimationIsPlaying = true;

        var anim = this.node.getComponent(cc.Animation);
        anim.play('jump_player');

        // 至此跳跃动画已经执行，然后调用GameUI脚本上的跳跃收尾工作逻辑
        // （将一切touchArray数组中isJumping为true的touchType对象设置为null）
         this.gameui.Jumped(); 
    },

    Jumped: function ()  // 跳跃的收尾工作
    {
        this.moveAnimationIsPlaying = false;
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

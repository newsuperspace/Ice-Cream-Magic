cc.Class({
    extends: cc.Component,

    properties: {

        // player节点
        player: {
            default: null,
            type: cc.Node
        },

        touchMoveDist: {   // 手指移动多远才可以被认定为拖拽操作？ 
            default: 50,   // 50px
            type: cc.Integer
        },


        // 触屏时间多久才算做是移动操作？
        touchTimeLimit: {
            default: 200,  // 100ms
            type: cc.Integer
        },



        // 技能按钮
        skill01: {
            default: null,
            type: cc.Button
        },

        skill02: {
            default: null,
            type: cc.Button
        },

        skill03: {
            default: null,
            type: cc.Button
        }

    },


    onLoad: function () {
        // 得到每个场景中的player节点，这个节点的路径在每个场景中都是相同的
        if (!this.player)
            this.player = cc.find('Canvas/rootCanvas/foe/player');
        // 注册事件监听器，监听发生在当前游戏UI节点（最靠前的节点）上发生的触碰事件
        this.node.on(cc.Node.EventType.TOUCH_START, this.Touch_Start, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.Touch_End, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.Touch_Move, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.Touch_Cancel, this);

        this.firstTouchPoint = null; // 记录一次操作的最初始触碰点(左下角的坐标系原点)
        this.touchTarget = null;  // 保存最新的触碰点(手指可能拖动到任意一个新位置)
        this.touchTime = 0; // 用来计算触碰持续时间
        this.hasMoved = false;  // 玩家是否已经移动了手指,执行了拖拽操作

        this.isJumping = false;  // 玩家正在执行或者已经下达了跳跃操作，这个变量的改变是由player节点完成的，如果这个属性为True则在所有触碰事件监听器中一概不接受业务处理
        this.jumpforward = 0  // -1向左跳；0不跳；1向右跳
    },

    // 游戏失去焦点（最小化、后台化）
    onEnable: function () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.Touch_Start, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.Touch_End, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.Touch_Move, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.Touch_Cancel, this);
    },

    // 游戏重获焦点（最大化，前台化）
    onDisable: function () {

        this.node.off(cc.Node.EventType.TOUCH_START, this.Touch_Start, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.Touch_End, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.Touch_Move, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.Touch_Cancel, this);
    },


    //==================================================事件处理例程======================================================

    // 手指按下
    Touch_Start: function (event) {

        // if (this.isJumping) {
        //     return;
        // }
        this.jumpforward = 0;  // 跳跃方向归零


        var v2 = event.getLocation();
        this.firstTouchPoint = v2;    // 注意此时保存的触点最初位置是以父节点左下角为坐标系原点的

        v2 = this.node.convertToNodeSpaceAR(v2);  // 由于触点事件的默认坐标系锚点是以左下角的，所以这里转换为节点坐标系（这里我将其锚点射在正中心）
        this.touchTarget = v2; // 保存触点
        this.touchTime = Date.now();  // 保存触点时间      

        return true;   // 一个操作是从触碰开始的，这个事件监听器一定要首先返回true才可以让后续的监听器产生作用，切记!!!!!!!!!!!
    },

    // 手指抬起
    Touch_End: function (event) {

        // if (this.isJumping) {
        //     return;
        // }

        //-----------------------终止player与行走有关的一切逻辑---------------------
        var anim = this.player.getComponent(cc.Animation);
        var state = anim.getAnimationState('walk_player');
        if (state.isPlaying) {
            this.player.getComponent('player').moveAnimationIsPlaying = false;
            anim.stop();
        }

        var jsplayer = this.player.getComponent('player');
        jsplayer.isMoving = false;
        jsplayer.targetX = 0;

        //---------------------- 判断玩家是否执行了跳跃操作------------------------
        var distance = cc.pDistance(this.firstTouchPoint, event.getLocation());

        if (!this.hasMoved && (distance > this.touchMoveDist) && !this.isJumping) {
            // 如果玩家操作是拖拽操作，则判断玩家抬起手指的时间与最开始的触碰时间是否小于阈限值
            var time = Date.now() - this.touchTime;
            if (time < this.touchTimeLimit) {
                // 这次操作是持续时间小于进行人物移动所需要的最小时间阈限，说明这是一次快速的滑动操作
                var forward = cc.pSub(event.getLocation(), this.firstTouchPoint);
                // 判断这次滑动的向量与Y轴的夹角是否小于45°，大于则代表这是一次趋于向上的滑动，也就是玩家执行了跳跃操作
                let rad = cc.pAngleSigned(cc.p(0, 1), forward);
                let degree = cc.radiansToDegrees(rad);
                if (Math.abs(degree) < 45) {
                    this.isJumping = true;
                    if (this.firstTouchPoint.x > event.getLocation().x) {
                        // 说明是向左滑动
                        this.jumpforward = -1;
                    }
                    else {
                        // 向右滑动
                        this.jumpforward = 1;
                    }
                }
            }
        }


        //----------------------一切归零----------------------
        this.firstTouchPoint = null; // 手指抬起后就代表一次操作输入的完成，则初次触碰点清空
        this.touchTarget = null;  // 触碰点归零
        this.touchTime = 0; //  持续时间归零
        this.hasMoved = false;  // 重置
    },


    // 手指拖拽移动
    Touch_Move: function (event) {

        // if (this.isJumping) {
        //     return;
        // }

        if (this.hasMoved) {
            this.touchTarget = this.node.convertToNodeSpaceAR(event.getLocation());
        }
        else {
            // 首先我们获取到当前手指位移到的点和上一个触碰点之间的距离
            var distance = cc.pDistance(this.touchTarget, this.node.convertToNodeSpaceAR(event.getLocation()));
            var time = Date.now() - this.touchTime;
            // cc.log("拖动的时间间隔为：" + time);

            if (distance > this.touchMoveDist && time > this.touchTimeLimit) {
                // 如果这个手指移动的距离 大于 我们设定的最小滑动距离阈限，则即可认定玩家实行了 拖拽操作
                this.hasMoved = true;
                // 然后刷新手指最新的位置
                this.touchTarget = this.node.convertToNodeSpaceAR(event.getLocation());
            }
        }

    },


    // 手指移出屏幕
    Touch_Cancel: function (event) {
        this.Touch_End(event);
    },




    update: function (dt) {

        // 玩家还没有抬手，则此时if分支中的逻辑是执行移动操作
        if (0 != this.touchTime) {

            if (!this.hasMoved)  // 玩家并没有实施拖拽操作，则即可认为是按住一点的操作
            {
                // 查看持续时间是否满足移动player节点所需要的最低触碰事件间隔？
                var time = Date.now() - this.touchTime

                // 触碰时间大于最小触碰阈限值 且 player的X与触碰点X不一样，则执行移动逻辑
                if (time > this.touchTimeLimit && this.player.x != this.touchTarget.x) {
                    // 动画播放只开始播放一次，不要在每帧都重头播放
                    if (!this.player.getComponent('player').moveAnimationIsPlaying) {
                        cc.log('播放动画');
                        var animation = this.player.getComponent(cc.Animation);
                        animation.play('walk_player');
                        this.player.getComponent('player').moveAnimationIsPlaying = true;
                    }

                    // 下面的语句是即时性地向player逻辑组件报告最新的触点位置,因此每一帧都要执行
                    var jsplayer = this.player.getComponent('player');
                    jsplayer.isMoving = true;
                    jsplayer.targetX = this.touchTarget.x;
                }
            }
            else   // this.hasMoved = true
            {
                // 动画播放只开始播放一次，不要在每帧都重头播放
                if (!this.player.getComponent('player').moveAnimationIsPlaying) {
                    cc.log('播放动画');
                    var animation = this.player.getComponent(cc.Animation);
                    animation.play('walk_player');
                    this.player.getComponent('player').moveAnimationIsPlaying = true;
                }
                // 执行拖拽的移动操作
                var jsplayer = this.player.getComponent('player');
                jsplayer.isMoving = true;
                jsplayer.targetX = this.touchTarget.x;  // 持续更新最新的手指位置的X坐标
            }

        }
        else {
            // 否则，玩家已经抬手，时间已经归零，则需要判断是否执行了滑动操作（跳跃操作）
            if (this.isJumping) {
                // 动画播放只播放一次，不要在每帧都重头调用player脚本中的Move方法，造成动画总是重新播放
                if (!this.player.getComponent('player').moveAnimationIsPlaying) {
                    // 玩家执行了跳跃操作
                    var jsplayer = this.player.getComponent('player');
                    jsplayer.Jump(this, this.jumpforward);
                }
            }
        }






    },




});   // <-----------------游戏脚本结束

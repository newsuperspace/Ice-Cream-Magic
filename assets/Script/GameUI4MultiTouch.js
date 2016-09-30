
// 触点开始到触点结束的间隔时间小于 touchStillTimeLimit  则可能是点击操作 也可能是 滑动操作  前者是发射魔法飞弹 后者是执行人物跳跃
// 这两个的区分要看 触点开始 到触点结束时候 两个位置的距离 如果距离小于 touchMoveDistLimit 则是 点击操作  大于touchMoveDistLimit则是跳跃

// 如果触点开始之后没有触发任何其他包括move 、 cancel、 end在内的其他事件，则经过update的时间间隔检验 如果发现距离首次begin过去的时间超过了touchStillTimeLimit
// 则说明这是一次按住的移动操作

// 如果从触点开始 到 move事件的时间间隔超过 touchStillTimeLimit 且 两次的移动距离 超过 touchMoveDistLimit 说明试一次滑动的移动操作

var touchType = cc.Class({

    properties: {
        //---------------状态标记-------------
        isInvalidation: false,  // 失效了吗？
        index: 0,

        // --------------当前触点所代表的操作类型-------------
        isMoving: false,

        isJumping: false,
        jumpForward: 0,  // -1 = left; 0=no; 1=right

        // --------------判断当前触点执行Jump操作的数据信息---------------
        jumpControlStartPoint: {
            default: new cc.Vec2(),
            // type: cc.Vec2
        },

        jumpControlStartTime: 0,
        // ---------------- 与移动操作有关的数据信息-------------------

        touchBeginTime: 0,
        touchCurrentTime: 0,

        // touch:{
        //     default:  null,
        //     type: cc.Touch
        // }  // 企图直接通过保存touch对象来从中获取数据会触发Error : Invalid Native Object错误
        // 其深层次的原因是来自cocos creator的本质JSB。
        // 具体原因请见笔记资料

        touchCurrentLocation: {
            default: new cc.Vec2(),
            // type: cc.Vec2
        }


    },

});

module.exports = touchType;


var broadcast = require('broadcast');


cc.Class({
    extends: cc.Component,

    properties: {

        player: {
            default: null,
            type: cc.Node
        },

        touchMoveDistLimit: {
            default: 50,
            type: cc.Integer
        },

        touchStillTimeLimit: {
            default: 200,
            type: cc.Integer
        },


        // 用来存放多点触碰中的多点触碰信息类型——touchType的实例对象的Array数组容器
        _touchTypeArray: {
            default: [],
            type: touchType,
            serializable: false   // 不序列化当前属性
        }

    },

    // use this for initialization
    onLoad: function () {

        if (this.player == null)
            this.player = cc.find('Canvas/rootCanvas/foe/player');

        // --------------------------玩家操控事件监听处理相关-----------------------------

        var self = this;

        var listener = {
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
            onTouchesBegan: function (touches, event) {

                var touch = touches[0];

                var ele = new touchType();
                ele.touchBeginTime = Date.now();
                ele.touchCurrentTime = ele.touchBeginTime;
                ele.touchCurrentLocation = touch.getLocation();


                if (self._touchTypeArray.length == 0) {
                    ele.index = 1;
                }
                else {

                    let maxIndex = 0;

                    for (var i = 0; i < self._touchTypeArray.length; i++) {
                        let arrEle = self._touchTypeArray[i];
                        if (arrEle == null)
                            continue;

                        if (maxIndex < arrEle.index) {
                            maxIndex = arrEle.index;
                        }
                    }

                    ele.index = maxIndex + 1;
                }

                self._touchTypeArray[touch.getID()] = ele;

                return true; //这里必须要写 retur n true
            },

            onTouchesMoved: function (touches, event) {

                var touch = touches[0];
                var ele = self._touchTypeArray[touch.getID()];
                ele.touchCurrentLocation = touch.getLocation();

                var delta = touch.getDelta();
                if (Math.abs(delta.x) > Math.abs(delta.y))  // 触点横向移动
                {
                    // 重置跳跃判定
                    ele.jumpControlStartPoint = null;
                    ele.jumpControlStartTime = 0;

                    let dist = cc.pDistance(touch.getPreviousLocation(), touch.getLocation());
                    let time = Date.now() - ele.touchCurrentTime;
                    ele.touchCurrentTime = Date.now();
                    if (dist > self.touchMoveDistLimit && time > self.touchStillTimeLimit) {
                        ele.isMoving = true;
                    }
                }
                else {    // 触点纵向移动

                    ele.touchCurrentTime = Date.now();

                    if (delta.y < 0)  // 向下滑动的情况排除掉吧
                    {
                        // 重置跳跃判定
                        ele.jumpControlStartPoint = null;
                        ele.jumpControlStartTime = 0;
                        return;
                    }

                    if (ele.jumpControlStartPoint) {
                        if ((ele.touchCurrentTime - ele.jumpControlStartTime) > self.touchStillTimeLimit) {
                            ele.jumpControlStartPoint = touch.getPreviousLocation();
                            ele.jumpControlStartTime = ele.touchCurrentTime;
                        }
                        else
                            ; // 一切正常直接跳过
                    }
                    else {
                        ele.jumpControlStartPoint = touch.getPreviousLocation();
                        ele.jumpControlStartTime = ele.touchCurrentTime;
                    }
                }
            },

            onTouchesEnded: function (touches, event) {

                var touch = touches[0];
                var ele = self._touchTypeArray[touch.getID()];
                ele.touchCurrentTime = Date.now();

                // && (cc.pDistance(touch.getStartLocation(), touch.getLocation()) < this.touchMoveDistLimit)
                if ((ele.touchCurrentTime - ele.touchBeginTime) < self.touchStillTimeLimit) {
                    // 这是一次单纯的单击操作                             
                    let pos = touch.getStartLocation();
                    broadcast.addClickPoint(pos);
                    cc.log('单击出现了！坐标'+'('+pos.x+','+pos.y+')');
                }

                if (ele.jumpControlStartPoint == null) {
                    // 当前触点没有发生跳跃操作的趋势，直接结束即可
                    self._touchTypeArray[touch.getID()] = null;  // 这个触点已经没用了，其ID索引位置被值为空，当代相同ID的触点在begin事件中再次重生

                }
                else {
                    // 当前触点发生了跳跃操作的趋势，应该加以判断
                    let dist = cc.pDistance(ele.jumpControlStartPoint, touch.getLocation());
                    let time = ele.touchCurrentTime - ele.jumpControlStartTime;

                    if (dist > self.touchMoveDistLimit && time < self.touchStillTimeLimit) {
                        // 符合条件的跳跃操作判定
                        ele.isJumping = true;

                        // -------判断跳跃的方向是向左还是向右-------
                        var start = ele.jumpControlStartPoint;
                        var end = touch.getLocation();

                        if (start.x >= end.x) {
                            // 向左
                            ele.jumpForward = -1;
                        }
                        else {
                            // 向右
                            ele.jumpForward = 1;
                        }
                    }
                    else {
                        self._touchTypeArray[touch.getID()] = null;
                    }
                }
            },


            onTouchesCancelled: function (touches, event) {
                onTouchesEnded();
            }
        }
        // 绑定多点触摸事件
        cc.eventManager.addListener(listener, self.node);
    },



    //=======================================总控逻辑=======================================

    // 由player节点在已经播放跳跃动画后回调，用来清空_touchTypeArray中所有isJumping为true的touchType对象，放置跳跃动作重复出现
    hasJumped: function () {
        for (var i = 0; i < this._touchTypeArray.length; i++) {
            let ele = this._touchTypeArray[i];
            if (ele == null)
                continue;

            if (ele.isJumping)
                this._touchTypeArray[i] = null;
        }
    },



    update: function (dt) {

        var minIndex = 10000;
        var eleNum = 0;

        for (var i = 0; i < this._touchTypeArray.length; i++) {
            let ele = this._touchTypeArray[i];
            if (ele == null)
                continue;

            if (!ele.isMoving && !ele.isJumping)  // 如果现存的触碰点既不是移动操作也不是跳跃操作，说明该触碰点是按住的操作，应该判断时间符合最大时间阈限后就设置isMoving为true
            {
                let time = Date.now() - ele.touchCurrentTime;
                if (time > this.touchStillTimeLimit) {
                    ele.isMoving = true;
                }
            }

            if (ele.index < minIndex) {
                minIndex = ele.index;
                eleNum = i;
            }
        }

        var controller = this._touchTypeArray[eleNum];
        if (controller) {
            if (controller.isJumping) {
                // 跳跃操作逻辑
                cc.log('跳跃');
                this.player.getComponent('player').Jump(controller, this);
            }
            else if (controller.isMoving) {
                // 移动操作逻辑
                cc.log('移动');
                this.player.getComponent('player').isMoving = true;

                var v2 = this.player.parent.convertToNodeSpaceAR(controller.touchCurrentLocation);

                this.player.getComponent('player').targetX = v2.x;
            }
        }
        else {
            // 所有的touchType元素都是null，说明玩家已经手指不再有任何控制操作，则这个时候可以终止player上的移动逻辑
            this.player.getComponent('player').Moved();
        }
    },
});

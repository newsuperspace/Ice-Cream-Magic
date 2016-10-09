cc.Class({
    extends: cc.Component,

    properties: {

        showing: {
            default: null,
            type: cc.Node
        },

        showingShowTime: {

            default: 500,   // 500ms
            type: cc.Integer,
            tooltip: '技能预览显示节点在按下图标后多少毫秒（ms）后出现'
        }


    },

    // use this for initialization
    onLoad: function () {

        // ---------------------------------------------准备工作------------------------------------------------
        if (!this.showing)   // 获取对技能展示图像节点showing的引用
        {
            this.showing = cc.find('showingFall', this.node.parent);
        }
        this.showing.active = false;

        this.hasPressed = false;  // 技能图标是否已经被按下了？
        this.position = null;  // 实时更新手指触碰点的位置坐标（通过onTouchMoved历程更新）




        // ---------------------------------------------事件监听器------------------------------------------------

        // 保存当前逻辑控制组件实例对象引用到self，该变量可以在事件监听器内的事件处理例程中使用，因为未来事件处理例程的调用者不再是当前脚本组件对象，因此需要
        // 提前保存当前脚本组件对象来使用。这一点一定要多加注意，不论何时如此保存组件对象引用是个好习惯，因为你不知道当前脚本中的这个方法的调用者未来是否还是
        // 当前脚本组件对象，由于js语言中方法中的this指的是调用该方法的实例对象，这与JAVA中this永远指代当前类实例的不同的，也就是说JS中的this会随时变动
        // java中的this永远不变。6666666666666666
        var self = this;   // 实际上调用事件处理例程的是下面通过{}引用类型的字面量表示形式定义的这个叫做listener的对象

        // 添加单点触摸事件监听器
        //  需要注意的是，单点触碰的信息获取只能通过各个事件处理例程的event参数
        // 多点触碰的信息获取才能通过 var touch = touches[0]  来获取  666666666666666
        var listener = {

            event: cc.EventListener.TOUCH_ONE_BY_ONE,  // 当前构建的是单点触碰类型事件

            onTouchBegan: function (touches, event) {

                self.hasPressed = true;

                // 不需要做什么,只需呀记录一下按下的时间点用作日后在update中比对就可以了
                self.startTime = Date.now();
                var position = touches.getLocation();   // 获取触点坐标（世界坐标系）
                position = self.node.parent.convertToNodeSpaceAR(position);  // 将世界坐标系的坐标转变为Game节点坐标系坐标
                self.position = position;

                event.stopPropagation();   // 停止事件继续向parent节点方向传递，与Android从父向子传递不同，cocos是从子向父传递。66666666666
                return true;    // 任何关于触碰点击的事件监听器，都是从Began开始，这里必须返回true，才能让之后的事件处理例程接收到后续事件，切记666666666
            },

            onTouchMoved: function (touches, event) {
                // 时刻保存触点的位置坐标，并将坐标信息告知给作为子节点的  技能预览图节点对象，达到预览图随着手指移动的效果
                var position = touches.getLocation();   // 获取触点坐标（世界坐标系）
                position = self.node.parent.convertToNodeSpaceAR(position);  // 将世界坐标系的坐标转变为Game节点坐标系坐标
                self.position = position;

                event.stopPropagation();   // 停止事件继续向parent节点方向传递，与Android从父向子传递不同，cocos是从子向父传递。66666666666
            },

            onTouchEnded: function (touches, event) {

                var script = self.showing.getComponent('showingFall');

                if (script.hasTouchedFoe) {
                    cc.log('释放技能');

                } else {
                    cc.log('不释放技能');

                }

                self.hasPressed = false;
                self.startTime = 0;
                self.position = null;
                self.showing.active = false;

                event.stopPropagation();   // 停止事件继续向parent节点方向传递，与Android从父向子传递不同，cocos是从子向父传递。66666666666
            },

            onTouchCancelled: function (touches, event) {
                // 调用上面的onTouchEnded()事件处理例程
                this.onTouchEnded(touches,event);   // this指的是listener对象，self指的才是脚本组件对象666666666
            }
        }
        // 绑定单点触摸事件
        cc.eventManager.addListener(listener, this.node);
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {


        if (this.hasPressed)  // 按下了
        {
            if (this.showing.active)   // showing 已经显示
            {
                this.showing.setPosition(this.position); // 更新其showing的位置，让其始终跟随玩家的手指
            }
            else {
                var currentTime = Date.now();
                if (this.showingShowTime <= (currentTime - this.startTime)) {
                    // 在技能图标上按下的时间够了，则可以显示showing技能预览节点并且随时更新其位置
                    this.showing.active = true;  // 显示节点
                    this.showing.setPosition(this.position);
                }
            }

        }
        else {   // 没按下
            return;
        }


    }




});

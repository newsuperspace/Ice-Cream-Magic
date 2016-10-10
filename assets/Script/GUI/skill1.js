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
        },

        gray: {
            default: null,
            type: cc.Node
        },

        black:{
            default: null,
            type: cc.Node
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

        if(!this.gray)
        {
            this.gray = cc.find('gray',this.node);
        }

        if(!this.black)
        {
            this.black = cc.find('black',this.node);
        }


        this.hasPressed = false;  // 技能图标是否已经被按下了？
        this.position = null;  // 实时更新手指触碰点的位置坐标（通过onTouchMoved历程更新）

        
        this.register();  // 开启事件监听器
    },

    // ===================注册和注销事件监听器的封装方法===================

    register: function () {
        // ---------------------------------------------事件监听器------------------------------------------------
        // 这里之所以选择这种注册事件监听的方式而不是使用cc.EventManager.addListener() 是因为当前所监听的单点触碰事件的技能图标节点的父节点Game上已经有了使用
        // cc.EventManager.addListener() 注册的多点触碰事件监听器，如果当前节点仍然使用EventManager的形式注册作为子节点的节能图标上的单点触碰事件监听器，由于
        // cocos的事件传递原则，在当前节点的单击事件不仅被当前单点触碰事件监听器拦截，而且会继续传递给其父节点（Game）上的监听器。如果想阻止这种向上传递，就需要在
        // 所有处理例程的结尾使用event.stopPropagation()来结束事件向父节点传递，但这时候又出现了一个问题，就是当前子节点会拦截所有屏幕上发生的触碰事件，不论这个
        // 触碰是否出现在当前节点的体积框区域内。因此为了让Game和当前技能图标子节点分别响应发生在各自节点之上的触碰事件，我需要通过这种node.on()的方式明确地在指定
        // 节点上注册制定类型的事件处理历程，这样只有在这个节点俄体积框的范围内发生指定类型的触碰事件的时候才会调用事件处理例程，同时该事件默认就是是这个节点独占的，
        // 不会向上传递给父节点。66666666666666666666666666666666666666666
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoved, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnded, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancelled, this);

        this.listenerOpened = true; // 标志位，用来在gameReceiver中获知当前节点监听器是否正在工作
    },

    logout: function () {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoved, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnded, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancelled, this);

        this.listenerOpened = false;   // 标志位，用来在gameReceiver中获知当前节点监听器是否正在工作
    },



    // =============================================单击事件监听器所调用之处理历程================================================
    onTouchBegan: function (event) {
        var touches = event.touch;

        this.hasPressed = true;

        // 不需要做什么,只需呀记录一下按下的时间点用作日后在update中比对就可以了
        this.startTime = Date.now();
        var position = touches.getLocation();   // 获取触点坐标（世界坐标系）
        position = this.node.parent.convertToNodeSpaceAR(position);  // 将世界坐标系的坐标转变为Game节点坐标系坐标
        this.position = position;

        // event.stopPropagation();   // 停止事件继续向parent节点方向传递，与Android从父向子传递不同，cocos是从子向父传递。66666666666
        return true;    // 任何关于触碰点击的事件监听器，都是从Began开始，这里必须返回true，才能让之后的事件处理例程接收到后续事件，切记666666666
    },

    onTouchMoved: function (event) {
        var touches = event.touch;
        // 时刻保存触点的位置坐标，并将坐标信息告知给作为子节点的  技能预览图节点对象，达到预览图随着手指移动的效果
        var position = touches.getLocation();   // 获取触点坐标（世界坐标系）
        position = this.node.parent.convertToNodeSpaceAR(position);  // 将世界坐标系的坐标转变为Game节点坐标系坐标
        this.position = position;

        // event.stopPropagation();   // 停止事件继续向parent节点方向传递，与Android从父向子传递不同，cocos是从子向父传递。66666666666
    },

    onTouchEnded: function (event) {

        var script = this.showing.getComponent('showingFall');
        var touches = event.touch;
        var position = touches.getLocation();

        if (script.hasTouchedFoe) {
            cc.log('释放技能');

            var receiver = this.node.parent.getComponent('gameReceiver');

            cc.log('fall技能位置坐标：'+position.x+','+position.y);
            receiver.setSkill1Position(position);

        } else {
            cc.log('不释放技能');
        }

        this.hasPressed = false;
        this.startTime = 0;
        this.position = null;
        this.showing.active = false;

        // event.stopPropagation();   // 停止事件继续向parent节点方向传递，与Android从父向子传递不同，cocos是从子向父传递。66666666666
    },

    onTouchCancelled: function (event) {
        // 调用上面的onTouchEnded()事件处理例程
        this.onTouchEnded(event);   // this指的是listener对象，this指的才是脚本组件对象666666666
    },




    // =========================================帧绘制方法========================================
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

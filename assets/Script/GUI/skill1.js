cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function () {

        // 保存当前逻辑控制组件实例对象引用到self，该变量可以在事件监听器内的事件处理例程中使用，因为未来事件处理例程的调用者不再是当前脚本组件对象，因此需要
        // 提前保存当前脚本组件对象来使用。这一点一定要多加注意，不论何时如此保存组件对象引用是个好习惯，因为你不知道当前脚本中的这个方法的调用者未来是否还是
        // 当前脚本组件对象，由于js语言中方法中的this指的是调用该方法的实例对象，这与JAVA中this永远指代当前类实例的不同的，也就是说JS中的this会随时变动
        // java中的this永远不变。6666666666666666
        var self = this;

        // 添加单点触摸事件监听器
        var listener = {

            event: cc.EventListener.TOUCH_ONE_BY_ONE,

            onTouchBegan: function (touches, event) {
                // 不需要做什么
            },

            onTouchMoved: function (touches, event) {
                // 时刻保存触点的位置坐标，并将坐标信息告知给作为子节点的  技能预览图节点对象，达到预览图随着手指移动的效果
            },

            onTouchEnded: function (touches, event) {
                // 做cancelled的else分支语句中一样的事情
            },

            onTouchCancelled: function (touches, event) {
                // 
                
                // if(技能释放可行)
                //     // 保存技能预览图节点的位置坐标，并告知player进行技能释放的逻辑；
                // else // 技能预览图节点没有碰到有效的敌对生命体上
                //     // 重新隐藏节能预览图节点；
                    
            }
        }
        // 绑定单点触摸事件
        cc.eventManager.addListener(listener, this.node);


    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

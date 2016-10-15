
var life = require('life');


// 近乎于一种标记接口，所有敌人节点的逻辑控制组件都必须是继承自我们这个标记ccclass
cc.Class({
    extends: life,     // 作为一切敌对生命体的父类，它也是有生命的因此基类是life

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
        this.player = cc.find('Canvas/rootCanvas/foe/player'); 
        this.slow2left = false;   // 向左移动的时候减速二分之一
        this.slow2right = false;  // 向右移动的时候减速二分之一
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    // 当发现玩家点击了当前对象，说明自己被攻击了，则调用这个逻辑
    // 每个敌人类型生命体都可以接受玩家的点击操作
    // 玩家点击这个敌人生命体就代表，向这个敌人省生命体发射普通攻击（魔法飞弹）
    // 然后就是调用这个方法
    beAttacked: function () {
        var position = this.node.parent.getPosition();
        cc.log(this.player);
        this.player.getComponent('player').shooting(position);
    },


    onCollisionEnter: function (other, self) {

        var lifeSc = other.node.getComponent(life);   // 获取被碰撞节点的life类型的组件，如果有这种类型的组件则返回引用到life，否则life为null

        if (lifeSc) {
            // life类型组件不为空，说明当前Foe碰上的是player（因为能与Foe发生碰撞检测的life只有player）
            // 设定向player移动的方向将减速到this.speed / 2; 
            if (self.node.x < other.node.x) {
                this.slow2right = true;
                this.slow2left = false;
            }
            else {
                this.slow2left = true;
                this.slow2right = false;
            }
        }
        else {
           
        }

    },

    /**
     * 当碰撞结束后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionExit: function (other, self) {

        // 恢复向other的功能
        this.slow2left = false;
        this.slow2right = false;
    },


});

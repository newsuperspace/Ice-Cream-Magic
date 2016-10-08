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
        this.health = 100;    // 默认生命值是100，之后可以在各个子脚本中自行修改
    },


    // 当有害实体触碰到当前脚本所绑定物体的时候会自动调用这个方法来扣减血量
    // 参数damage是此次伤害的伤害值
    hurted: function (damage) {
        this.health -= damage;
        this.redFlash();
    },

    // 当前脚本所绑定实体被攻击的时候会发生颜色变红的闪烁效果————————该方法由hurted调用
    redFlash: function () {
        for (var i = 0; i < 5; i++) {
            this.node.color = cc.Color.RED;
            this.node.color = cc.Color.WHITE;
        }
    },
});

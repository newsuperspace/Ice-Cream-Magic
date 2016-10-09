
// 一切有生命的ccclass类都是该类的子类，比如敌人foe的父类FoeMother以及player玩家角色都是这个类型的子类，用以将有生命的类型与其他类型实例区分开来，并且方便统一调用
// 能够收到伤害的逻辑。
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true     // optional, default is true
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
        cc.log('生命值：' + this.health);

        this.redFlash();
    },

    // =======================================被攻击后的闪烁功能=============================================
    // 当前脚本所绑定实体被攻击的时候会发生颜色变红的闪烁效果————————该方法由hurted调用
    redFlash: function () {

        this.node.color = cc.Color.RED;
        this.scheduleOnce(this.whiteFlash,0.2);
    },
    whiteFlash: function () {
        // 恢复节点为本色
        this.node.color = cc.Color.WHITE;
    }




});

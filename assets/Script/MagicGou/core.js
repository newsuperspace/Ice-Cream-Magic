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

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    /**
     * 当碰撞产生的时候调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionEnter: function (other, self) {

        cc.log('Gou Core 发生了碰撞');
        var script = other.node.getComponent(life);   // 父类引用，指向子类对象

        if (script) {
            // 如果脚本不为null，则说明碰撞上的是有生命的敌人实体对象
            script.hurted(self.node.parent.parent.getComponent('magicGou').damageValue);
        }
        else {
            // 否则，碰撞上的是没有生命的对象，比如地面等
        }

    },

});

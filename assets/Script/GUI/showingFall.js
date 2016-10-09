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
        this.hasTouchedFoe = false;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },


    onCollisionEnter: function (other, self) {
       this.hasTouchedFoe = true;
       this.node.opacity = 255;
    },
  

    /**
     * 当碰撞结束后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionExit: function (other, self) {
        this.hasTouchedFoe = false;
        this.node.opacity = 100;
    }




});

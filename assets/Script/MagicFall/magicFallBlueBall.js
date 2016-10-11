var life = require('life');

cc.Class({
    extends: cc.Component,

    properties: {
        atlas: {
            default: null,
            type: cc.SpriteAtlas
        }
    },

    // use this for initialization
    onLoad: function () {
        // cc.log('blueBall初始化');
        // this.node.getComponent(cc.Sprite).spriteFrame = this.atlas.getSpriteFrame('blueLIE1');
    },


    /**
     * 当碰撞产生的时候调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionEnter: function (other, self) {

        cc.log('blueBall发生了碰撞');
        var script = other.node.getComponent(life);   // 父类引用，指向子类对象

        if (script) {
            // 如果脚本不为null，则说明碰撞上的是有生命的敌人实体对象
            script.hurted(self.node.parent.parent.parent.getComponent('magicFall').damageValue);
        }
        else {
            // 否则，碰撞上的是没有生命的对象，比如地面等
        }

        // 可不管碰上什么物体，自身都要播放碎裂的动画效果
        self.node.parent.getComponent(cc.Animation).play('magicFallBlue');  // 得到父节点blue上的动画组件，并调用其上的动画

    },

    

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

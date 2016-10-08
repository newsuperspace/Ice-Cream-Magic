cc.Class({
    extends: cc.Component,

    properties: {
        fallSpeed:{
            default: 100,
            type: cc.Integer
        },

        elevation :{    // 当魔法节点距离屏幕可见上缘多少像素的时候的开始播放转换尾炎的动画
            default: 100,
            type: cc.Integer
        },




    },

    // use this for initialization
    onLoad: function () {

        // 保证所有节点都被激活
        for(var i = 0; i<this.node.children[0].children.length; i++)
        {
            let child = this.node.children[0].children[i];
            child.active = true;

            for(var j = 0; j < child.children.length; j++)
            {
                child.children[j].active = true;
            }
        }

        this.anims = ['magicFallStart','magicFallChange','magicFallStill','magicFallDown'];

    },

    // ==================================播放子节点rootFall上的形态改变动画=====================================
    playStart: function(){
        this.node.children[0].getComponent(cc.Animation).play(this.anims[0]);
        cc.log('执行了start');
    },

    playChange: function(){
        this.node.children[0].getComponent(cc.Animation).play(this.anims[1]);
        cc.log('执行了change');
    },

    playStill: function(){
        this.node.children[0].getComponent(cc.Animation).play(this.anims[2]);
        cc.log('执行了still');
    },


    // ===========================================魔法的启动源头================================================
    // 参数position类型为cc.Vec2 告知目标的下落撞击点的位置坐标
    magicFallStart: function(position){

        // 设置魔法集合体的初始位置
        this.node.setPosition(position.x, cc.director.getVisibleSize.height / 2); 
        // 播放下坠动作动画
        this.node.getComponent(cc.Animation).play(this.anims[3]);

    },

    // 测试按钮回调方法
    play: function(){
        this.node.getComponent(cc.Animation).play(this.anims[3]);
        cc.log('play了');
    },


    update: function (dt) {

    },
});

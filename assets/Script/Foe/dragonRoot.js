// dragonRoot 作为父节点的作用仅仅是为了能够集合性地设置Dragon节点在foe层上的位置
// 而子节点dragon才是真正的逻辑功能 、外形表现 的真正内核所在。
// 也就是说外部根节点只负责确定位置，而内部子节点是功能的核心。
// 这种设计模式在2D游戏设计中非常常见，谨记666666666666666666666666



// 用来修正dragonRoot和其子节点dragon之间的坐标系统的关系
// 例如当子节点dragon播放的DragonAttack的动画之后，其位置会系那个对于dragonRoot锚点发生改变
// 因为dragon需要重复播放攻击动画因此会多次改变位置，为了能让DragonAttack动画符合dragonRoot在不同位置下的播放效果
// 因此dragonRoot需要在update中巡视其子节点位置坐标相对于（0.0）原始位置是否发生了偏移，如果发生偏移，则说明
// dragon节点播放了例如DragonAttack这类需要x坐标改变的动画，因此会启动修正逻辑
// 修正逻辑的大概意思是，当发现dragon的x坐标与dragonRoot坐标系（0,0）发生变化（正常情况下dragon上所有动画播放的基准是以其自身位置坐标在父节点坐标系
// 也就是dragonRoot的原点上开始的第一帧）后，dragonRoot的update会在一帧的时间差内（玩家肉眼绝对察觉不到这种调整）将dragon在foe层的位置坐标确定，
// 然后将dragonRoot瞬间设置到这个坐标位置上，然后再将子节点dragon的坐标归位为（0,0）就可以继续正常播放dragon的动画了。
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
        this.dragon = cc.find('dragon', this.node);
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        var dragonAnim = this.dragon.getComponent(cc.Animation);  // 获取dragon子节点上的动画组件
          
        // 确定当前dragon节点是否正在播放动画,如果没有播放动画才开始动手
        if (this.dragon.x != 0 || this.dragon.y != 0) {
            if (!dragonAnim.getAnimationState('DragonAttack').isPlaying && !dragonAnim.getAnimationState('DragonDown').isPlaying) {

                // 获取dragon在屏幕上的真实视觉位置坐标（也就是世界坐标系坐标）
                let rootPosition = this.node.convertToWorldSpace(this.dragon.position);  
                // 然后再根据这个真实位置，将其转化为指定节点的坐标系的坐标，这里就是将dragon的视觉位置转变为foe节点坐标系的对应坐标
                rootPosition = this.node.parent.convertToNodeSpaceAR(rootPosition);

                // 然后将dragonRoot节点设置到该坐标位置上（dragonRoot也是使用的foe坐标系的坐标）
                this.node.position = rootPosition;  // 变更dragonRoot位置到dragon相对于foe坐标系上的位置

                // 最后重置dragon到dragonRoot的圆心（0,0）上即可完成全部的调整工作。
                this.dragon.position = new cc.Vec2(0, 0);  // 然后再重新设置dragon的坐标回到dragonRoot的坐标系原点
                // 因为dragon上所有的关于位置特别是X坐标变更的动画都是以其父节点dragonRoot的原点为起始位置的
            }
        }



    },
});

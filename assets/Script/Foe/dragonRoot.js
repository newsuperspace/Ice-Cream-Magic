var frame = require('frame');

// dragonRoot 作为父节点的作用仅仅是为了能够集合性地设置Dragon节点在foe层上的位置
// 而子节点dragon才是真正的逻辑功能 、外形表现 的真正内核所在。
// 也就是说外部根节点只负责确定位置，而内部子节点是功能的核心。
// 这种设计模式在2D游戏设计中非常常见，谨记!


// 66666666666666666666666666666666这是很六六六的视觉表现逻辑代码66666666666666666666666666666666666
// 用来修正dragonRoot和其子节点dragon之间的坐标系统的关系
// 例如当子节点dragon播放的DragonAttack的动画之后，其位置会系那个对于dragonRoot锚点发生改变
// 因为dragon需要重复播放攻击动画因此会多次改变位置，为了能让DragonAttack动画符合dragonRoot在不同位置下的播放效果
// 因此dragonRoot需要在update中巡视其子节点位置坐标相对于（0.0）原始位置是否发生了偏移，如果发生偏移，则说明
// dragon节点播放了例如DragonAttack这类需要x坐标改变的动画，因此会启动修正逻辑
// 修正逻辑的大概意思是，当发现dragon的x坐标与dragonRoot坐标系（0,0）发生变化（正常情况下dragon上所有动画播放的基准是以其自身位置坐标在父节点坐标系
// 也就是dragonRoot的原点上开始的第一帧）后，dragonRoot的update会在一帧的时间差内（玩家肉眼绝对察觉不到这种调整）将dragon在foe层的位置坐标确定，
// 然后将dragonRoot瞬间设置到这个坐标位置上，然后再将子节点dragon的坐标归位为（0,0）就可以继续正常播放dragon的动画了。
cc.Class({
    // extends: cc.Component,
    extends: frame,

    properties: {

        distance: {
            default: 400,
            type: cc.Integer,
            tooltip: '与玩家保持的距离阈限值',
        },
    },

    // use this for initialization
    onLoad: function () {
        this.dragon = cc.find('dragon', this.node);
        this.player = cc.find('player', this.node.parent);
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        var dragonAnim = this.dragon.getComponent(cc.Animation);  // 获取dragon子节点上的动画组件

        // ---------随时根据dragon在foe上的视觉坐标调整dragonRoot的位置坐标，然后再将dragon重新修正道dragonRoot的原点位置，以便dragon动画播放无误差----------
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

        // --------------------------修正dragon对象的位置，跟player一样使其始终保持在屏幕中可见范围内-----------------------------
        var width = cc.director.getVisibleSize().width;
        if (this.node.x > width / 2 || this.node.x < -width / 2) {
            if (this.node.scaleX > 0) {
                // 龙头向 左
                this.node.x = width / 2;
            }
            else {
                // 龙头向 右
                this.node.x = -width / 2;
            }
        }

        // ----------------------------自行移动逻辑---------------------------------
        // 原则：以this.distance为基准，当与player节点距离大于这个阈限的时候进行移动逻辑
        cc.log('两者之间距离是：'+Math.abs(this.node.x - this.player.x));
        if (Math.abs(this.node.x - this.player.x) > this.distance) {
            // 执行向玩家player靠近的移动逻辑
            var speed = this.dragon.getComponent('Dragon').speed;

            if (this.node.scaleX > 0) {
                // 龙头向左，应该向左移动
                this.node.x -= speed * dt;
            } else {
                // 龙头向右，应该向右移动
                this.node.x += speed * dt;
            }
        }
        else {
            // ----------------------------自行攻击逻辑---------------------------------
            this.dragon.getComponent('Dragon').attack();
        }




    },
});

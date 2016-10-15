var FoeMother = require('FoeMother');

cc.Class({
    extends: FoeMother,

    properties: {
        moveSpeed: {   // 移动速度
            default: 100,
            type: cc.Integer
        },

        healthValue: {   // 自定义生命值
            default: 1000,
            type: cc.Integer
        },

        fireCircleCD: {    // 普通攻击火环技能的CD时间
            default: 1000,
            type: cc.Integer
        }

    },

    // use this for initialization
    onLoad: function () {
        this.player = cc.find('Canvas/rootCanvas/foe/player');
        this.health = this.healthValue;
        this.speed = this.moveSpeed;

        this.fireCirclePreparedTime = this.fireCircleCD;   // 火环技能准备时间，当技能发动后会被清0，然后再update中不断累积时间，直到与fireCircleCD时间相同后才能再次发动技能。
    },


    // ============================================当前脚本所挂在节点上cc.Animation上播放动画所调用的动画事件回调函数=======================================
    // 龙出场，从天而降，下落到地面的动画效果的最后一帧调用的动画事件回调
    // 作用就是调用父节点的父节点rootCanvas的画面震动动画。
    shock: function () {
        this.node.parent.parent.parent.getComponent(cc.Animation).play('shock');
    },

    // 龙攻击，在攻击动画走到探头的那一帧的时候所产生的动画事件的回调函数
    // 作用就是执行攻击逻辑，具体执行那种攻击类型还需要更深入的判定逻辑的支持
    attack: function () {
        // TODO:在本次demo中这里仅仅执行一种火环的攻击，之后还需要更复杂的逻辑判定支持来实现更丰富的攻击技能
        if (this.fireCirclePreparedTime === this.fireCircleCD) {
            this.node.getComponent(cc.Animation).play('DragonAttack');
            this.fireCirclePreparedTime = 0;
        }


    },


    update: function (dt) {

        //----------------------------- 技能冷却时间流逝-------------------------------
        if (this.fireCirclePreparedTime != this.fireCircleCD)  // 如果火环技能的冷却累计时间没有累计到规定的CD时间，则
        {
            // 将距离上一帧的到现在的时间流逝累加到冷却时间累计变量上
            this.fireCirclePreparedTime += dt * 1000;     // 因为dt是秒为单位，而我们的CD是毫秒，因此这里转秒为毫秒
            if (this.fireCirclePreparedTime > this.fireCircleCD) {
                // 如果超过了规定的CD时间，则说明技能已经准备好，将累计变量更改为CD上限就说明可以发动技能了
                this.fireCirclePreparedTime = this.fireCircleCD;
            }
            cc.log('fireCircle技能冷却时间累计计量:' + this.fireCirclePreparedTime);
        }



    },



    // =================================以下均是测试使用方法=================================
    playDragonDown: function () {
        this.node.getComponent(cc.Animation).play('DragonDown');
    },

    playDragonAttack: function () {
        this.node.getComponent(cc.Animation).play('DragonAttack');
    },



});

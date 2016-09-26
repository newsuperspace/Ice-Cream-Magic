var EnumType = require('enum');

cc.Class({
    extends: cc.Component,

    properties: {

        player: {
            default: null,
            type: cc.Node
        },

        ground01: {
            default: null,
            type: cc.Node
        },

        ground02: {
            default: null,
            type: cc.Node
        },

        mountain: {
            default: null,
            type: cc.Node
        },
    },

    // use this for initialization
    onLoad: function () {
        if (this.player == null) {
            this.player = cc.find('Canvas/rootCanvas/foe/player');
        }

        if (this.groundBefore == null) {
            this.groundBefore = cc.find('Canvas/rootCanvas/background/ground01');
        }

        if (this.groundAfter == null) {
            this.groundAfter = cc.find('Canvas/rootCanvas/background/ground02');
        }

        if (null == this.mountain) {
            this.mountain = cc.find('Canvas/rootCanvas/background/mountain');
        }

        //-----------------------构建两张地面图片接续--------------------------
        var x = this.groundBefore.x + this.groundBefore.width * this.groundBefore.scaleX;   //得到接续的X坐标
        var y = this.groundBefore.y   //得到接续的Y坐标
        this.groundAfter.x = x;
        this.groundAfter.y = y;

        cc.log('groundAfter的坐标：'+x+','+y);


        this.scrolledDistance = 0;  // 记录已卷动的距离

        this.moveType = EnumType.MoveType.walk;  // 默认设定画面为卷动方式，当刷出敌人的时候才改为false非卷动方式，该属性与枚举类型MoveType相对应

        this.showFoe = false;   // 状态flag，用来表示当前是否执行刷敌逻辑
        this.waveNum = 0;  // 刷敌回合索引数，对应关卡信息数组中的索引位置。

    },

    // 滚动
    scroll: function (dt) {

        var playerScript = this.player.getComponent('player');

        if (playerScript.isMoving && this.player.x == -(cc.director.getVisibleSize().width / 2 * 0.3)) {
            // 此时应该卷动画面
            this.groundBefore.x -= playerScript.playerSpeed * dt;  // 实现地面的滚动
            this.groundAfter.x -= playerScript.playerSpeed * dt;

            if (this.groundBefore.x <= -(1920 + 480)) {
                // 开始交换
                var temp = this.groundBefore;
                this.groundBefore = this.groundAfter;
                this.groundAfter = temp;

                //-----------------------构建两张地面图片接续--------------------------
                var x = this.groundBefore.x + this.groundBefore.width * this.groundBefore.scaleX;  //得到接续的X坐标
                var y = this.groundBefore.y   //得到接续的Y坐标
                this.groundAfter.setPosition(x, y);
            }

            this.scrolledDistance += playerScript.playerSpeed * dt;  // 累加滚动距离
        }

    },






    // 同步player组件中的moveType属性和当前脚本的moveType属性相一致
    changeAndSyncMoveType: function () {
        if (EnumType.MoveType.walk == this.moveType) {
            // 当前为行走模式，将要改为攻击模式
            this.moveType = EnumType.MoveType.attack;
        }
        else {
            // 当前为攻击模式，将要改为行走模式
            this.moveType = EnumType.MoveType.walk;
        }
        this.player.getComponent('player').moveType = this.moveType;
    },

    update: function (dt) {

        if (!this.showFoe) {
            // 如果当前showFoe为不刷敌状态，则判断当前是否符合刷敌的条件，并更改this.showFoe为true
            if (false) {
                // 符合刷敌人条件
                this.showFoe = true;
                this.changeAndSyncMoveType();
            }
        }

        var playerScript = this.player.getComponent('player');

        // 判断是否到达了刷敌人点，如果是则,更换moveType，并执行刷敌逻辑
        if (this.showFoe) {
            // 执行刷敌逻辑，并随时判断这一波敌人是否被消灭完全了，然后重置showFoe为false

            //............

            if (false) {
                // 如果敌人已经刷完，则重置showFoe为false
                this.showFoe = false;
                this.waveNum += 1;
                this.changeAndSyncMoveType();
            }
        }
        else {   // 没到刷敌点，只执行walk卷动地图的逻辑
            this.scroll(dt); // 卷动
        }


    },
});

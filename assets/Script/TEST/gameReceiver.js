
var broadcast = require('broadcast');   // 获取broadcast模块中导出的ccclass类对象，该对象的类成员保存着两个层交换的数据信息


// 与用来代表foe（游戏画面表现层）接受从broadCast模块交换来的来自Game（游戏控制层）的数据信息的数据接收器
// 本接收器是Game（游戏控制层）接受从broadCast模块交换来的来自foe（游戏画面表现层）的数据信息的数据接收器
cc.Class({
    extends: cc.Component,

    properties: {
        skill1:{
            default: null,
            type: cc.Node
        },

        skill2: {
            default: null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function () {
        if(!this.skill1)
        {
            this.skill1 = cc.find('skill1', this.node);
        }

        if(!this.skill2)
        {
            this.skill2 = cc.find('skill2',this.node);
        }


    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {

        var skill1Script = this.skill1.getComponent('skill1');

        // 调控 skill1节点
        if(1 != broadcast.skill1CDPercent)    // 技能冷却的逻辑
        {
            // 关闭skill1节点的事件监听器
            if(skill1Script.listenerOpened)
            {
                skill1Script.logout();
            }

            // 激活gray产生技能图标的遮蔽效果
            if(!skill1Script.gray.active)
            {
                skill1Script.gray.active = true;
            }

            // 激活black用作技能的冷却CD的读条的动态效果
            if(!skill1Script.black.active)
            {
                skill1Script.black.active = true;
            }

            skill1Script.black.getComponent(cc.ProgressBar).progress = 1 - broadcast.skill1CDPercent
        }
        else{   // 技能正常使用状态的维持判定

            // 保持skill1节点的事件监听器的开启
            if(!skill1Script.listenerOpened)
            {
                skill1Script.register();
            }

            // gray保持隐藏状态
            if(skill1Script.gray.active)
            {
                skill1Script.gray.active = false;
            }

            // black保持隐藏状态
            if(skill1Script.black.active)
            {
                skill1Script.black.active = false;
            }

        }




    },
});

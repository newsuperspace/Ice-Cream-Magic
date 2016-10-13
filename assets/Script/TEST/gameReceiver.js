
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


    // 该方法由skill脚本控件的onTouchEnded事件处理过程在玩家释放技能按钮的是判定释放技能的逻辑分支中调用，用来将这一刻技能释放位置的坐标存放到broadcast中供foeReceiver巡视使用
    setSkill1Position: function(position){
        broadcast.skill1AttackPosition = position;
    },

    setSkill2Position: function(position){
        broadcast.skill2AttackPosition = position;
    },



    // called every frame, uncomment this function to activate update callback
    update: function (dt) {

        var skill1Script = this.skill1.getComponent('skill1');
        var skill2Script = this.skill2.getComponent('skill2');

        // 调控 skill1节点 的冷却表现
        if(1 != broadcast.skill1CDPercent)    // 技能冷却的逻辑
        {
            cc.log('fall进行技能冷却');
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
            // cc.log('fall技能冷却剩余百分比：'+Math.floor(skill1Script.black.getComponent(cc.ProgressBar).progress*100));
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


        // 调控 skill2节点 的冷却表现
        if(1 != broadcast.skill2CDPercent)    // 技能冷却的逻辑
        {
            cc.log('gou进行技能冷却');
            // 关闭skill2节点的事件监听器
            if(skill2Script.listenerOpened)
            {
                skill2Script.logout();
            }

            // 激活gray产生技能图标的遮蔽效果
            if(!skill2Script.gray.active)
            {
                skill2Script.gray.active = true;
            }

            // 激活black用作技能的冷却CD的读条的动态效果
            if(!skill2Script.black.active)
            {
                skill2Script.black.active = true;
            }

            skill2Script.black.getComponent(cc.ProgressBar).progress = 1 - broadcast.skill2CDPercent
            // cc.log('fall技能冷却剩余百分比：'+Math.floor(skill1Script.black.getComponent(cc.ProgressBar).progress*100));
        }
        else{   // 技能正常使用状态的维持判定

            // 保持skill2节点的事件监听器的开启
            if(!skill2Script.listenerOpened)
            {
                skill2Script.register();   // 重新允许节点skill2接受点击事件
            }

            // gray保持隐藏状态
            if(skill2Script.gray.active)
            {
                skill2Script.gray.active = false;
            }

            // black保持隐藏状态
            if(skill2Script.black.active)
            {
                skill2Script.black.active = false;
            }
        }



    },
});

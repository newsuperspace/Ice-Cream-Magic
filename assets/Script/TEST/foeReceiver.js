var FoeMother = require('FoeMother');

var broadcast = require('broadcast');

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
        this.player = cc.find('player',this.node);
    },

    // 他会提取其之下的所有子节点，其中一定包括player、skill、foe等多种类型的节点
    // 然后进一步筛选
    update: function (dt) {

        // ----------------------------魔法飞弹技能发动条件的巡视逻辑--------------------------

        var nodes = [];   // 作为调用braodcast模块中的hasTouchedOneChildNode()方法的参数备用

        var children  = this.node.children;  // 获得所有子节点
        // cc.log('子节点：'+children.length+'个');

        for(var i=0; i<children.length; i++) // 遍历所有子节点获取节点上的所有组件
        {
            let node = children[i];
            let component =  node.getComponentInChildren(FoeMother);  // 查找子节点中第一个匹配拥有FoeMother组件的节点的FoeMother组件实例
            if(component)
            {
                var nodeComponent  =  new nodeAndFoeMotherTypeComponent();
                nodeComponent.node = node;   // 注意！ 以dragon类型foe为例子，此时的node就是dragonRoot根节点
                nodeComponent.component = component;   // 注意！以dragon类型foe为例子，此时的component是dragonRoot子节点dragon上的dragon组件实例

                nodes.push(nodeComponent);
            }
        }

        // cc.log('敌人节点：'+nodes.length+'个');
        broadcast.hasTouchedOneChildNode(nodes);



        //-------------------------magicFall魔法发动条件的巡视逻辑---------------------------

        var playerScript = this.player.getComponent('player');   // 得到子节点player上的逻辑控制脚本，便于从其中获取数据
        // this.magicFallPrepareTime != this.magicFallCD
        
        broadcast.skill1CDPercent = playerScript.magicFallPrepareTime / playerScript.magicFallCD;   // 计算Fall技能CD时间流逝的百分比小数

        broadcast.skill2CDPercent = playerScript.magicGouPrepareTime / playerScript.magicGouCD;     // 计算Gou技能的CD事件流逝的百分比小数


        // 技能1 攻击位置存在 且 技能CD完成，则可以发动技能
        if(broadcast.skill1AttackPosition && 1 == broadcast.skill1CDPercent)
        {
            playerScript.falling(broadcast.skill1AttackPosition);
            broadcast.skill1AttackPosition = null;
        }
        else{
            broadcast.skill1AttackPosition = null;
        }
        
        // 技能2 攻击位置存在 且 技能CD完成，则可以发动技能
        if(broadcast.skill2AttackPosition && 1 == broadcast.skill2CDPercent){
            playerScript.gouing(broadcast.skill2AttackPosition);
            broadcast.skill2AttackPosition = null;
        }
        else{
            broadcast.skill2AttackPosition = null;
        }


    },
});


// 这是一种特殊的内定义数据结构，用来存放一个节点及该节点上所挂载的逻辑控制组件，从而方便指定方法的调用
var nodeAndFoeMotherTypeComponent = cc.Class({

    properties:{

        node:{
            default: null,
            type: cc.Node
        },

        component: {
            default: null,
            type: FoeMother
        }
    }

});




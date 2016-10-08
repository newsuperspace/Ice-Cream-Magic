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

    },

    // 他会提取其之下的所有子节点，其中一定包括player、skill、foe等多种类型的节点
    // 然后进一步筛选
    update: function (dt) {

        var nodes = [];   // 作为参数备用

        var children  = this.node.children;  // 获得所有子节点
        // cc.log('子节点：'+children.length+'个');

        for(var i=0; i<children.length; i++) // 遍历所有子节点获取节点上的所有组件
        {
            let node = children[i];
            let components =  node.getComponents(FoeMother);
            // cc.log('组件数'+components.length+'个');
            if(components.length >0)
            {
                var nodeComponent  =  new nodeAndFoeMotherTypeComponent();
                nodeComponent.node = node;
                nodeComponent.component = components[0];

                nodes.push(nodeComponent);
            }
        }

        // cc.log('敌人节点：'+nodes.length+'个');
        broadcast.hasTouchedOneChildNode(nodes);
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




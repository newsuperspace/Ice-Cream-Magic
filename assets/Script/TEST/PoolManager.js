// 对象池类型（JS中的类型本质上都是Function类型对象），作用是在properties中作为属性
//的type可以引用到自定义脚本组件中定义的ccclass类型，这里就是将其他脚本中定义的ccclass（本质就是Function）引用到本地脚本叫NodePool
//的变量上，好在这里用NodePool这个变量来指代这种ccclass自定义逻辑控制组件类型  66666666666666666666666666
const NodePool = require('NodePool');

const enumType = require('enum');

cc.Class({
    extends: cc.Component,

    properties: {

        mold: {
            default: 0,
            type: enumType.PoolMngType
        },

        // 定义一个数组属性，数组元素的类型是NodePool，它存储着多个对象池，每一个对象池对应一种perfab预制
        Pools: {
            default: [],
            type: NodePool   // NodePool是一个自定义脚本组件类型（JS的类型本质都是Function，包括cc.Node也是一个Function），通过模块引用到本地脚本的NodePool变量上，这样这里才能引用到
        },


    },




    // 所有脚本的init()方法都是由“Game总控‘主干’节点”调用的，并将总控节点的引用作为参数传递进来
    init() {
        // 两个数组的长度是开发人员从属性检查器中定义的，这里遍历出每一个NodePool实例并调用他们的初始化方法

        for (let i = 0; i < this.Pools.length; ++i) {
            this.Pools[i].init();
        }
    },


    // ====================================敌人实例对象从对象池中的获取和归还========================================

    // foeType必须是enumType中的某个枚举类型下的一个元素
    // Pools中的对象池所引用的预制类型的顺序一定要与enumType中的枚举的顺序一致
    requestNode(type) {

        // 每一个type对应一个对象池
        // 如果 type ===  PlayerMagicType.bullet ，则对应对象池数组this.Pools中索引为0的第一个对象池
        // 如果 type ===  PlayerMagicType.gou ，则对应对象池数组this.Pools中索引为1的第一个对象池
        // 如果 type ===  PlayerMagicType.fall ，则对应对象池数组this.Pools中索引为2的第一个对象池

        let nodePool = this.Pools[type];
        if (nodePool != null && nodePool.getLength() > 0) {
            return nodePool.request();
        } else {
            return null;
        }
    },

    // 归还敌人实例，参数分别为 敌人种类的枚举值索引和敌人实例对象
    backNode(type, obj) {
        let thePool = this.Pools[type];
        if (thePool.getLength() < thePool.size) {
            thePool.Back(obj);
        } else {
            cc.log('Return obj to a full pool, something has gone wrong');
            return;
        }
    },

});

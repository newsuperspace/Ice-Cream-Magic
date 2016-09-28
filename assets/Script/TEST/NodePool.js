var enumType = require('enum');



// 当前ccclass的名字是NodePool，表明这是一个存放Node节点的对象池，用来循环利用敌人实例对象
var NodePool = cc.Class({
    
    name: 'NodePool',  // 类名，用于序列化（钝化）的时候需要

    properties: {
        // 一个预制属性，每个对象池实例对应一种节点
        prefab: cc.Prefab,
        // 一个size尺寸，表示对象池的大小
        size: 0,
        
    },

    // ccclass的构造器，其中的两个数组就是对象池的核心66666666666666所在
    ctor () {
        this.initList = [];   // 初始实例对象容器，存放从预制实例化出来的全部对象的引用

        this.list = [];   // 对外使用的容器，从这个数组中会经常性地进行添加、删除的动作。


        // 由于对象池中的所有对象都是渲染节点并且目前全部都是放在Canvas/rootCanvas/foe这个层级上的节点下
        // 例如魔法、player、敌人等都是在共同的foe节点上相互作用的，因此这里默认获取当前场景根节点下的
        // 这一路径的作为父节点使用
        this.fatherNode = cc.find('Canvas/rootCanvas/foe');
    },

    // 得到对外使用数组的剩余节点对象数目
    getLength: function(){
        return  this.list.length;
    },


    // 当前脚本的init()方法是由Game节点上的PoolManager（对象池管理器）在适当的时候调用的。
    init () {
        // 创建预制的实例对象
        for ( let i = 0; i < this.size; ++i ) {
            let obj = cc.instantiate(this.prefab);
            // 将预制的实例对象放入到两个[]数组中（两个数组同时指向同一个实例对象）
            this.initList[i] = obj;
            this.list[i] = obj;
        }
    },

    // 重置？将所有敌人实例重置为初始状态（没有父节点、没有激活active === false）并重新填充到外部引用数组中去
    reset () {
        for ( let i = 0; i < this.size; ++i ) {  
            let obj = this.initList[i];   // 重新遍历实例化出来的敌人实例对象，从初始数组中
            this.list[i] = obj;    // 并重新填充到外部引用数组中去

            // 将节点重置
            if (obj.active) {  
                obj.active = false;   // 重置为未激活状态
            }
            if (obj.parent) {
                obj.removeFromParent();   // 从父节点上移除重新成为无归属节点66666666
            }
        }
    },

    // 获取一个敌人实例
    request ()  {
        if ( this.idx < 0 ) {  // 如果引用已经小于0，则说明外部引用容器中已经没有剩余节点对象可供使用了
            cc.log ("对象池已经空了，请稍候再试");
            return null;  // 返回null，因此在外部使用的时候应该还要先判断下返回的是不是null
        }

        // 从外部引用数组中的最后一个位置拿取一个节点
        let obj = this.list.pop();

        if ( obj ) {
            obj.parent = this.fatherNode;  // 将节点对象添加到foe父节点下


            // 如果确实拿到了这个节点（不为null），则设置其active为true
            // 当节点的active属性被重新设置为true的时候，就会重新执行节点上所挂载所有组件的onLoad()方法
            // 也就是说生命周期重新开始，节点犹如重生
            obj.active = true;    // 等同于执行脚本的onload方法
        }

        return obj; // 返回这个对象即可
    },

    // 归还之前从外部引用数组中拿出来的实例对象
    Back ( obj ) {

        // 重置节点为初始状态
        obj.active = false;
        if (obj.parent) {
            obj.removeFromParent();
        }

        // 还回给外部引用容器以便于下次循环使用
        this.list.push(obj);
    }
});

module.exports = NodePool;
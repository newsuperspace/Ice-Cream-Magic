

// 当前定义的ccclass是用来在GameUI4MultiTouch中将获取的单击（非拖拽、滑动、按住）操作的位置坐标存储起来
// 之后共享给foe节点上的敌人对象节点，这些敌人对象节点中的update会在每帧的时候遍历我们ccclass提供的存放单击position（cc.Vec2）数组容器，对比自己的范围区域
// 如果这个点击位置是在自己的范围内，就宣告玩家正在操作player向它进行shooting操作。
var broadcast = cc.Class({

    // 类名，用于序列化
    // 值类型：String
    name: "Broadcast",

    // 构造函数
    // 值类型：Function
    ctor: function () {

    },

    // 属性定义（方式一，直接定义）
    properties: {
       
    },

    // 实例方法
    print: function () {
        cc.log(this.text);
    },

    // 静态成员定义
    // 值类型：Object
    // 在这里定义只属于当前脚本所定义的这个ccclass类（本质是一个Function对象）的属性和方法，调用这些静态方法直接通过ccclass即可，无需先创建实例对象
    // 这里的成员用来沟通控制层和显示层节点的数据交换
    statics: {
       
       // -----------------------------------------------与magicFall魔法相关的成员-------------------------------------------------
       // ~~~~~~~~~~Game层 从 foe层 获取数据时使用的成员~~~~~~~~~~~~~~
       skill1CDPercent: 1.0,   // Game层上的skill1节点会从这里获取到从foe层的player节点所反馈来的技能冷却时间信息，用来设置skill1上的progressBar进度条(小数点后1位)
       skill2CDPercent: 1.0,   // Game层上的skill2节点会从这里获取到从foe层的player节点所反馈来的技能冷却时间信息，用来设置skill2上的progressBar进度条（小数点后1位）

    
       // ~~~~~~~~~~foe层 从 Game层 获取数据时使用的成员~~~~~~~~~~~~~~
       skill1AttackPosition: null,  // 从skill1节点返回来的技能释放的目标位置坐标，是一个cc.Vec2类型数据。由foeReceiver脚本获取并交由player节点上的逻辑组件使用
       skill2AttackPosition: null,  // 从skill2节点返回来的技能释放的目标位置坐标，是一个cc.Vec2类型数据。由foeReceiver脚本获取并交由player节点上的逻辑组件使用
       
       
       
       // -----------------------------------------------与magicBall魔法球相关的成员-------------------------------------------------
       
        _clickPoints: [],   // 存放点击触碰点位置坐标（世界坐标系——以屏幕左下角为原点的坐标系）

        getClickPointsCount: function () {

            // 在其他脚本中调用当前ccclass的静态方法是先通过 var xxx = requres('broadcast')得到这个ccclass的function类对象
            // 然后再 xxx.getClickPointsCount()调用，也就是说在JS中的函数内部的this指的是调用该方法的对象，而现在调用getClickPointsCount()方法的正式
            // 该方法所属的ccclass的类型对象（JS的类本质就是function对象），因此在函数内部的this就是当前这个ccclass。而_clickPoints又是ccclass的静态成员
            // 所以this._clickPoints就是引用的当前ccclass的静态成员_clickPoints
            return this._clickPoints.length;   
        },

        addClickPoint: function(position){   // 从Game控制层面上提交过来的position都是世界坐标系（坐标原点在左下角）的位置坐标   

            this._clickPoints.push(position);
        },




        // 参数nodes是一个数组，其元素类型是在脚本foeReceiver中定义的名为nodeAndFoeMotherTypeComponent类型
        hasTouchedOneChildNode: function( nodes ){     // 这个方法会被foe层面的update轮番调用，foe会将他之下的所有敌人节点放入到数组nodes中传递进来
            // 遍历clickPoints数组中的每个点击点，判断是否有位于nodes中的节点的范围框内的，如果有就出发这个node的发射魔法飞弹的逻辑，当所有nodes判断完后
            // 清空clickPoints
            var len  = this.getClickPointsCount();
            for(var i = 0; i<nodes.length; i++)
            {
                var nodeComponent = nodes[i];
                for(var j = 0; j<len; j++)
                {
                    let AR = nodeComponent.node.parent.convertToNodeSpaceAR(this._clickPoints[j]);  // 将触点转换为与node相同的坐标系统
                    let rect = nodeComponent.node.getBoundingBox();
                    if(cc.rectContainsPoint(rect,AR))
                    {
                        cc.log('玩家射击了敌人');
                        // 如果触点的位置在敌人节点的包装盒范围内则调用
                        nodeComponent.component.beAttacked();
                    }
                }
            }
            this._clickPoints.splice(0,len);  // 清空数组中已经遍历的点击点元素
        }
    },

});


module.exports = broadcast;
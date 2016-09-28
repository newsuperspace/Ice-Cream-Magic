
// player的移动方式（地图卷动移动还是攻击中移动）
var MoveType = cc.Enum({
    walk: -1,
    attack: -1
});

//敌人的刷新方位
var FoeShowForward = cc.Enum({
    left: -1,
    right: -1,
    random: -1
});

// 敌人的难度等级
var FoeDifficulty = cc.Enum({
    easy: -1,
    normal: -1,
    hard: -1
});


// 敌人种类
var FoeType = cc.Enum({
    fireDragon: -1
});

// 玩家的魔法类型
var playerMagicType = cc.Enum({
    bullet: -1,   //index = 0
    gou: -1,      // index = 1
    fall: -1        // index = 2
});


// 对象池管理器所管理的对象池的类型
var PoolMngType = cc.Enum({
    playerMagic: -1,
    foeMagic: -1,
    foeType: -1,
});






module.exports = {
    MoveType,
    FoeShowForward,
    FoeType,
    FoeDifficulty,
    playerMagicType,
    PoolMngType,
    
}
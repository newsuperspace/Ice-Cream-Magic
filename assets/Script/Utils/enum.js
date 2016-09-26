var MoveType = cc.Enum({
    walk: -1,
    attack: -1
});

var FoeShowForward = cc.Enum({
    left: -1,
    right: -1,
    random: -1
});


var FoeType = cc.Enum({
    fireDragon: -1
});

var FoeDifficulty = cc.Enum({
    easy: -1,
    normal: -1,
    hard: -1
});



module.exports = {
    MoveType,
    FoeShowForward,
    FoeType,
    FoeDifficulty,
}
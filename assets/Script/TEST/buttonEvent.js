cc.Class({
    extends: cc.Component,

    properties: {
        Game:{
            default: null,
            type: cc.Node
        },


    },

    // use this for initialization
    onLoad: function () {

    },

    click: function(){

        var ctrl = this.Game.getComponent('GameControl');
        ctrl.changeAndSyncMoveType();

        var label = this.node.getComponentInChildren(cc.Label); 
        if(label.string == 'walk')
        {
            label.string = 'attack';
        }
        else
        {
            label.string = 'walk';
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

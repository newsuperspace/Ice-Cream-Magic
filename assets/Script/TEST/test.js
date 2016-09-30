
var broadcast = require('broadcast');

cc.Class({
    extends: cc.Component,

    properties: {
        
        label:{
            default: null,
            type: cc.Label
        },

        button: {
            default: null,
            type:cc.Button
        }

    },

    // use this for initialization
    onLoad: function () {
        
    },


    click: function(){

        var point = new cc.Vec2(100,100);
        broadcast.addClickPoint(point);

        this.label.string = broadcast.getClickPointsCount();
        cc.log(broadcast.getClickPointsCount());
    }



    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

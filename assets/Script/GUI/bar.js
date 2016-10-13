cc.Class({
    extends: cc.Component,

    properties: {
        
        blueBar4Ice: {
            default: null,
            type: cc.Node
        },

        redBar4Thirsty: {
            default: null,
            type: cc.Node
        }

    },

    // use this for initialization
    onLoad: function () {
        if(!this.blueBar4Ice)
        {
            this.blueBar4Ice = cc.find('iceDuring/blueBar',this.node);
        }

        if(!this.redBar4Thirsty)
        {
            this.redBar4Thirsty = cc.find('thirsty/redBar',this.node);
        }
    },

    setIceDuring: function(param){
        this.blueBar4Ice.progress = param;
    },

    setThirsty: function(param){
        this.redBar4Thirsty.progress = param;
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

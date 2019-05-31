
cc.Class({
    extends: cc.Component,

    properties: {
        mask: cc.Node,
        againBtn: cc.Button,
        returnBtn: cc.Button,
        failureAudio: {
            default: null,
            type: cc.AudioClip
        },
        ButtonAudio: {
            default: null,
            type: cc.AudioClip
        },
    },

   
    onLoad () {
        this.mask.active = true;
        cc.audioEngine.play(this.failureAudio, false, 1);

        this.againBtn.node.on('touchstart', this.PlayClick.bind(this));
        this.returnBtn.node.on('touchstart', this.PlayClick.bind(this));
        
        this.againBtn.node.on('touchend',this.Again.bind(this));
        this.returnBtn.node.on('touchend',this.ToMenu.bind(this));
        //预加载game场景
        cc.director.preloadScene("game", function () {
            cc.log("Next scene preloaded");
        });
    },

    PlayClick: function () {
        cc.audioEngine.play(this.ButtonAudio, false, 1);
    },
    
    ToMenu: function () {
        //调用系统方法加载menu场景  
        cc.director.loadScene('menu');
        
    },

    Again : function () {
        //调用系统方法加载menu场景 
        cc.director.resume();
       cc.director.loadScene('game');
    },

    // start () {

    // },

    // update (dt) {},
});

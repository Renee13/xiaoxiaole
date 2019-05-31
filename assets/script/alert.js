
// var setMusicOnOff = 1;
cc.Class({
    extends: cc.Component,

    properties: {
        alert : cc.Node,
        mask : cc.Node,
        exitCancel : cc.Button,
        playAgain : cc.Button,
        returnBack : cc.Button,
        WorldAudio: {
            default: null,
            type: cc.AudioClip
        },
        ButtonAudio: {
            default: null,
            type: cc.AudioClip
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //遮罩层，防止上层game场景的事件；
        //this.mask.active = true;  
        //cc.log(this.mask); 

        this.returnBack.node.on('touchstart', this.PlayClick.bind(this));
        this.playAgain.node.on('touchstart', this.PlayClick.bind(this));
        this.exitCancel.node.on('touchstart', this.PlayClick.bind(this));
        
        this.returnBack.node.on('touchend',this.ToMenu.bind(this));
        this.playAgain.node.on('touchend',this.Again.bind(this));
        this.exitCancel.node.on('touchend',this.Closewin.bind(this));
        
        
        //预加载game场景
        cc.director.preloadScene("game", function () {
            cc.log("Next scene preloaded");
        });

    },

    PlayClick: function () {
        cc.audioEngine.play(this.ButtonAudio, false, 1);
    },

    Closewin : function () {
        //关闭alert节点；
        this.alert.active = false;
        //cc.log("看看能不能执行resume恢复场景");
        //恢复暂停的game场景；
        cc.director.resume();
        //cc.log("看看能不能执行resume恢复场景！！！！");
    },

    Again : function () {
         //调用系统方法加载menu场景 
        cc.director.loadScene('game');
    },

    ToMenu: function () {
        //调用系统方法加载menu场景  
        cc.director.loadScene('menu');
        
    },

    start () {
       
    },

   
    // update (dt) {},
});

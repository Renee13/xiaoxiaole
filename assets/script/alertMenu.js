
cc.Class({
    extends: cc.Component,

    properties: {
        alertM : cc.Node,
        mask : cc.Node,
        exitCancel : cc.Button,
        startBtn : cc.Button,
        ButtonAudio: {
            default: null,
            type: cc.AudioClip
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //遮罩层，防止上层game场景的事件；
        // this.mask.active = true;  
        //cc.log(this.mask);  
        this.startBtn.node.on('touchstart', this.PlayClick.bind(this));
        this.exitCancel.node.on('touchstart', this.PlayClick.bind(this));
        this.startBtn.node.on('touchend',this.ToGame.bind(this));
        this.exitCancel.node.on('touchend',this.Closewin.bind(this));
       
    },

    PlayClick: function () {
        cc.audioEngine.play(this.ButtonAudio, false, 1);
    },

    Closewin : function () {
        //关闭alert节点；
        this.alertM.active = false;
        //cc.log("看看能不能执行resume恢复场景");
        //恢复暂停的game场景；
        cc.director.resume();
        //cc.log("看看能不能执行resume恢复场景！！！！");
    },

    ToGame: function () {
        //调用系统方法加载menu场景
        cc.director.loadScene('game');
        
    },

    start () {

    },

    // update (dt) {},
});

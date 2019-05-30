
cc.Class({
    extends: cc.Component,

    properties: {
        mask: cc.Node,
        startBtn: cc.Button,
        goldCoin: cc.Label,
        successAudio: {
            default: null,
            type: cc.AudioClip
        },
    },

   
    onLoad () {
        this.mask.active = true;
        cc.audioEngine.play(this.successAudio, false, 1);
        this.goldCoin.string = Global.score;
        this.startBtn.node.on('touchend',this.ToMenu.bind(this));

    },

    ToMenu: function () {
        //调用系统方法加载menu场景  
        cc.director.loadScene('menu');
        
    },

    // start () {

    // },

    // update (dt) {},
});

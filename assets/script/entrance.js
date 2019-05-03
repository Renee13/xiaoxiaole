
cc.Class({
    extends: cc.Component,

    properties: {
        //开始按钮
        StartBtn:{
            default: null,
            type: cc.Button
        },
        WorldAudio: {
            default: null,
            url: cc.AudioClip
        },

    },
    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        //场景加载时执行
        //侦听touchend事件来触发转到menu场景方法。不能用click，否则在微信中无效。
        this.StartBtn.node.on('touchend', this.ToMenu.bind(this));
        this.gameSceneBGMAudioId = cc.audioEngine.play(this.WorldAudio, true, 1);
    },

    ToMenu: function () {
        //调用系统方法加载menu场景
        cc.director.loadScene('menu');
    },

    // start () {

    // },

    // update (dt) {},

    onDestroy: function(){
        cc.audioEngine.stop(this.gameSceneBGMAudioId);
    }
});

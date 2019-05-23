import alertMenu from 'alertMenu';

cc.Class({
    extends: cc.Component,

    properties: {
        returnBack : cc.Button,
         //第一关按钮
        FirstPass:{
            default: null,
            type: cc.Button
        },
        ButtonAudio: {
            default: null,
            type: cc.AudioClip
        },
        //背景
        bg : cc.Node,
        //alert弹框资源
        alertMenuEvent : cc.Node,
    },

    onLoad () {
        //场景加载时执行
        //关闭节点
        this.alertMenuEvent.active = false;
        //手指触摸事件touch
        //侦听touchend事件来触发转到entrance场景方法。不能用click，否则在微信中无效。
        this.returnBack.node.on('touchstart', this.PlayClick.bind(this));
        this.FirstPass.node.on('touchstart', this.PlayClick.bind(this));
        this.returnBack.node.on('touchend',this.ToEntrance.bind(this));  
        this.FirstPass.node.on('touchend', this.AlertMenuEvent.bind(this));
    },

    PlayClick: function () {
        cc.audioEngine.play(this.ButtonAudio, false, 1);
    },

    ToEntrance: function () {
        //调用系统方法加载menu场景
        cc.director.loadScene('entrance');
    },

    AlertMenuEvent: function() {
        cc.director.pause();
        this.alertMenuEvent.active = true;
        //alertE.parent = this.bg;
        //cc.log(alertE);
    },

    
    // start () {

    // },

    // update (dt) {},
});

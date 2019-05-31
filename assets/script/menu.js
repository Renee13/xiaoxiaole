import alertMenu from 'alertMenu';

cc.Class({
    extends: cc.Component,

    properties: {
        returnBack : cc.Button,
        allScore: cc.Label,
        allStar: cc.Label,
         //第一关按钮
        FirstPass:{
            default: null,
            type: cc.Button
        },
         //第二关按钮
        // SecondPass:{
        //     default: null,
        //     type: cc.Button
        // },
        //背景音乐
        WorldAudio: {
            default: null,
            type: cc.AudioClip
        },
        //按钮点击音乐
        ButtonAudio: {
            default: null,
            type: cc.AudioClip
        },
        //背景节点
        bg : cc.Node,
        //alert弹框资源
        alertMenuEvent : cc.Node,
        //alertMenuEvent2 : cc.Node,
    },

    onLoad () {
        //场景加载时执行
        
        //this.SecondPass.active = false;

        //cc.log(this.SecondPass.active);
        //总分数
        this.allScore.string = Global.score;
        //总星星数
        this.allStar.string = Global.star;
        // if (Global.score != 0) {
        //     this.SecondPass.active = true;
        // }

        //关闭节点
        this.alertMenuEvent.active = false;
        // this.alertMenuEvent2.active = false;
        //手指触摸事件touch
       
        this.returnBack.node.on('touchstart', this.PlayClick.bind(this));
        this.FirstPass.node.on('touchstart', this.PlayClick.bind(this));
        // this.SecondPass.node.on('touchstart', this.PlayClick.bind(this));
         //侦听touchend事件来触发转到entrance场景方法。不能用click，否则在微信中无效。
        this.returnBack.node.on('touchend',this.ToEntrance.bind(this));  
         //侦听touchend事件来触发弹框方法。不能用click，否则在微信中无效。
        this.FirstPass.node.on('touchend', this.AlertMenuEvent.bind(this));
        // this.SecondPass.node.on('touchend', this.AlertMenuEvent2.bind(this));
        if (Global.setMusicOnOff%2 == 0) {
            this.allMusicStart();
        }
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
    
    //背景音乐开始
    allMusicStart(){
        this.gameSceneBGMAudioId = cc.audioEngine.play(this.WorldAudio, true, 1);
    },

    onDestroy: function(){
        cc.audioEngine.stop(this.gameSceneBGMAudioId);
    }
    
    // start () {

    // },

    // update (dt) {},
});

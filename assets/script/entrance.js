
var setMusicOnOff = 0;


cc.Class({
    extends: cc.Component,

    properties: {
        // setMusicOnOff: 0,
        //开始按钮
        StartBtn:{
            default: null,
            type: cc.Button
        },
        MusicBtn:{
            default: null,
            type: cc.Button
        },
        MusicSpriteFrame1:{
            default: null,
            type: cc.SpriteFrame
        },
        MusicSpriteFrame2:{
            default: null,
            type: cc.SpriteFrame
        },
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
        //场景加载时执行
        //侦听touchend事件来触发转到menu场景方法。不能用click，否则在微信中无效。
        //this.gameSceneBGMAudioId = cc.audioEngine.play(this.WorldAudio, true, 1);
        //cc.game.addPersistRootNode(setMusicOnOff);
        if (setMusicOnOff%2 == 0) {
            this.allMusicStart();
        } else {
            this.MusicBtn.getComponent(cc.Button).normalSprite = this.MusicSpriteFrame2;
            this.MusicBtn.getComponent(cc.Button).pressedSprite = this.MusicSpriteFrame2;
            this.MusicBtn.getComponent(cc.Button).hoverSprite = this.musicSpriteFrame2;
            this.MusicBtn.getComponent(cc.Button).disabledSprite = this.musicSpriteFrame2;
        }
        cc.log(setMusicOnOff);
        
        this.MusicBtn.node.on('touchstart', this.PlayClick.bind(this));
        this.MusicBtn.node.on('touchend',this.PlayMusic.bind(this));
        this.StartBtn.node.on('touchstart', this.PlayClick.bind(this));
        this.StartBtn.node.on('touchend', this.ToMenu.bind(this));
    },

    PlayClick: function () {
        cc.audioEngine.play(this.ButtonAudio, false, 1);
    },

    ToMenu: function () {
        //调用系统方法加载menu场景
        
        cc.director.loadScene('menu');
    },

    PlayMusic: function () {
        setMusicOnOff++;
        cc.log(setMusicOnOff);
        if (setMusicOnOff%2 == 0) {
            this.allMusicStart();
            
            this.MusicBtn.getComponent(cc.Button).normalSprite = this.MusicSpriteFrame1;
            this.MusicBtn.getComponent(cc.Button).pressedSprite = this.MusicSpriteFrame1;
            this.MusicBtn.getComponent(cc.Button).hoverSprite = this.musicSpriteFrame1;
            this.MusicBtn.getComponent(cc.Button).disabledSprite = this.musicSpriteFrame1;
        } else {
            this.allMusicPause();

            this.MusicBtn.getComponent(cc.Button).normalSprite = this.MusicSpriteFrame2;
            this.MusicBtn.getComponent(cc.Button).pressedSprite = this.MusicSpriteFrame2;
            this.MusicBtn.getComponent(cc.Button).hoverSprite = this.musicSpriteFrame2;
            this.MusicBtn.getComponent(cc.Button).disabledSprite = this.musicSpriteFrame2;
        }
    },
    // start () {

    // },

    
    //背景音乐暂停
    allMusicPause(){
        cc.audioEngine.pause(this.gameSceneBGMAudioId);
    },
    //背景音乐开始
    allMusicStart(){
        this.gameSceneBGMAudioId = cc.audioEngine.play(this.WorldAudio, true, 1);
    },

    onDestroy: function(){
        cc.audioEngine.stop(this.gameSceneBGMAudioId);
    }
});


// var setMusicOnOff = 0;


cc.Class({
    extends: cc.Component,

    properties: {
        // setMusicOnOff: 0,
        //开始按钮
        StartBtn:{
            default: null,
            type: cc.Button
        },
        //音乐控制按钮
        MusicBtn:{
            default: null,
            type: cc.Button
        },
        //音乐开
        MusicSpriteFrame1:{
            default: null,
            type: cc.SpriteFrame
        },
        //音乐关
        MusicSpriteFrame2:{
            default: null,
            type: cc.SpriteFrame
        },
        //背景音乐资源
        WorldAudio: {
            default: null,
            type: cc.AudioClip
        },
        //按钮音乐资源
        ButtonAudio: {
            default: null,
            type: cc.AudioClip
        },

    },
    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        //场景加载时执行
        
        //设置音乐开关的图集资源
        if (Global.setMusicOnOff%2 == 0) {
            this.allMusicStart();
        } else {
            this.MusicBtn.getComponent(cc.Button).normalSprite = this.MusicSpriteFrame2;
            this.MusicBtn.getComponent(cc.Button).pressedSprite = this.MusicSpriteFrame2;
            this.MusicBtn.getComponent(cc.Button).hoverSprite = this.musicSpriteFrame2;
            this.MusicBtn.getComponent(cc.Button).disabledSprite = this.musicSpriteFrame2;
        }
        cc.log(Global.setMusicOnOff);
        
        this.MusicBtn.node.on('touchstart', this.PlayClick.bind(this));
        this.MusicBtn.node.on('touchend',this.PlayMusic.bind(this));
        this.StartBtn.node.on('touchstart', this.PlayClick.bind(this));
        //侦听touchend事件来触发转到menu场景方法。不能用click，否则在微信中无效。
        this.StartBtn.node.on('touchend', this.ToMenu.bind(this));
    },
    //播放按钮点击音效；
    PlayClick: function () {
        cc.audioEngine.play(this.ButtonAudio, false, 1);
    },
    //跳转场景到Menu场景；
    ToMenu: function () {
        //调用系统方法加载menu场景
        cc.director.loadScene('menu');
    },
    //播放背景音乐函数；
    PlayMusic: function () {
        Global.setMusicOnOff++;
        //SetMusicOnOff为偶数播放音乐，奇数暂停音乐
        if (Global.setMusicOnOff%2 == 0) {
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
    //背景音乐开始，true循环播放
    allMusicStart(){
        this.gameSceneBGMAudioId = cc.audioEngine.play(this.WorldAudio, true, 1);
    },
    //切换场景时停止播放音乐
    onDestroy: function(){
        cc.audioEngine.stop(this.gameSceneBGMAudioId);
    }
});

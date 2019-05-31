// window.Global = {
//     star : 0,
// };

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
        ButtonAudio: {
            default: null,
            type: cc.AudioClip
        },
        messageWin: cc.Node,
        stars1: cc.Prefab,
        stars2: cc.Prefab,
        stars3: cc.Prefab,
    },

   
    onLoad () {
        this.mask.active = true;
        cc.audioEngine.play(this.successAudio, false, 1);
        this.goldCoin.string = Global.score;
        this.startBtn.node.on('touchstart', this.PlayClick.bind(this));
        this.startBtn.node.on('touchend',this.ToMenu.bind(this));
        this.StarsNum();
    },

    PlayClick: function () {
        cc.audioEngine.play(this.ButtonAudio, false, 1);
    },

    ToMenu: function () {
        //调用系统方法加载menu场景  
        cc.director.loadScene('menu');
        
    },

    StarsNum: function () {
        if (Global.score <= 800) {
            var star1 = cc.instantiate(this.stars1);
            star1.parent = this.messageWin;
            Global.star = 1;
        }
        if (Global.score <= 1000 && Global.score > 800) {
            var star2 = cc.instantiate(this.stars2);
            star2.parent = this.messageWin;
            Global.star = 2;
        }
        if (Global.score > 1000) {
            var star3 = cc.instantiate(this.stars3);
            star3.parent = this.messageWin;
            Global.star = 3;
        }
    },


    // start () {

    // },

    // update (dt) {},
});

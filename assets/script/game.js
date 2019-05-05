

import alert from 'alert';

var rows = 8;
var columns = 6;

cc.Class({
    extends: cc.Component,

    properties: {
        //暂停按钮
        pauseBtn:{
            default: null,
            type: cc.Button
        },
        //分数
        scoreLabel : cc.Label,
        score : 0,
        //步数
        stepsLabel : cc.Label,
        steps : 9,
        //饼干个数
        cookiesLabel : cc.Label,
        cookies : 15,
        //间隔
        gap : 20,
        //块
        blockSN : cc.Prefab,
        //零食[]
        snacks : {
            default : [],
            type : [cc.Prefab],
        },
        //背景
        bg : cc.Node,
        //alert弹框资源
        alertEvent : cc.Prefab,
    },
    onLoad () {
        //场景加载时执行
        //侦听touchend事件来触他弹框。不能用click，否则在微信中无效。
        this.pauseBtn.node.on('touchend',this.AlertEvent.bind(this));
        this.drawBgBlocks();
        //this.randomNum();
        this.init();
    },

    AlertEvent: function() {
        cc.director.pause();
        let alertE = cc.instantiate(this.alertEvent);
        // cc.log(alertE);
        //cc.log("alertalertalertalertalertalert");
        alertE.parent = this.bg;
        //cc.log(alertE);
    },

    start () {

    },

    drawBgBlocks() {
        //循环获得6*8的块
        //获得块的width
        this.blockSizeW = (cc.winSize.width - this.gap*2) /columns;
        //获得块的height
        this.blockSizeH = (cc.winSize.height - 275 - this.gap*2 ) /rows;
        //横坐标
        let x = this.gap + this.blockSizeW/2;
        //纵坐标
        let y = 125 + this.blockSizeH/2;
       
        this.positions = [];
        for(let i = 0;i < rows;++i) {
            this.positions.push([0,0,0,0,0,0]);
            for (let j = 0;j < columns;++j) {  
                //克隆已有节点
                let block = cc.instantiate(this.blockSN);
                block.width = this.blockSizeW;
                block.height = this.blockSizeH; 
                //设置块的坐标位置      
                block.setPosition(cc.v2(x,y));
                block.parent = this.bg;
                if (this.randomNum() in this.snacks) {
                    let snack = cc.instantiate(this.snacks[this.randomNum()]);
                    snack.width = this.blockSizeW-5;
                    snack.height = this.blockSizeH-5;
                    snack.setPosition(0,0);
                    snack.parent = block;
                   
                }
                //cc.log(x)
                this.positions[i][j] = cc.v2(x,y);
                //横坐标加一个块的宽度
                x += this.blockSizeW;
            }
            //纵坐标加一个块的高度
            y += this.blockSizeH;
            //设置横坐标为初始值
            x = this.gap + this.blockSizeW/2;
            //cc.log(x,y);
        }
        //cc.log(this.positions);
    },

    randomNum () {
        //取得1~6的整数；
        let randoms = Math.random()*6;
        //cc.log(randoms);
        let num = Math.ceil(randoms);
        //cc.log(num);
        //cc.log(this.snacks[num]);
        return num;
        
    },

    init () {
        this.updateScore(0);
        this.updateSteps(9);
        this.updateCookies(15);
        // if(this.blocks) {
        //     for(let i = 0;i < rows;++i) {   
        //         for (let j = 0;j < columns;++j) {  
        //            if(this.blocks[i][j] == null) {
        //                //填充零食
        //            }
        //         }    
        //     }
        // }
    },

    updateScore(number) {
        this.score = number;
        this.scoreLabel.string = number;
    },

    updateSteps(number) {
        this.steps = number;
        this.stepsLabel.string = number;
    },

    updateCookies(number) {
        this.cookies = number;
        this.cookiesLabel.string = number;
    },
    
    //存储每一块对应的零食；
    

    // update (dt) {},
});


import alert from 'alert';

var rows = 8;
var columns = 6;
var m = {};
var n = {};
var vis = [];
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
        // this.scanAllSnacks();
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
                this.positions[i][j] = cc.v2(x,y);
                //根据产生的随机数来填充格子
                if (this.randomNum() in this.snacks) {
                    var snack = cc.instantiate(this.snacks[this.randomNum()]);
                    snack.width = this.blockSizeW-5;
                    snack.height = this.blockSizeH-5;
                    snack.setPosition(0,0);
                    snack.parent = block;

                }

                 //var location = this.positions[i][j];
                 //m[location] = snack;
                 m[this.positions[i][j]] = snack;
                 n[this.positions[i][j]] = block;
                //m.set(this.positions[i][j],snack);
                //cc.log(m[this.positions[i][j]].name)
                //cc.log(x)
                
                //横坐标加一个块的宽度
                x += this.blockSizeW;
                //cc.log(m);
            }
           
            //纵坐标加一个块的高度
            y += this.blockSizeH;
            //设置横坐标为初始值
            x = this.gap + this.blockSizeW/2;
            //cc.log(x,y);
        }
        //cc.log(m);
        this.scanAllSnacks();
        //cc.log(this.positions);
    },

    randomNum () {
        //取得1~6的整数；
        let randoms = Math.random()*6;
        //cc.log(randoms);
        //返回大于或等于其数值参数的最小整数;
        let num = Math.ceil(randoms);
        //cc.log(num);
        //cc.log(this.snacks[num]);
        return num;
        
    },

    scanSwapSnack (i,j) {
        
        for(let i = 0;i < rows;++i) {   
            vis[i] = [];        
            for (let j = 0;j < columns;++j) { 
                vis[i][j] = 0;
            }
        }
        //记录此次点击的零食；
        var clickedSnack = m[this.positions[i][j]];
        //cc.log(clickedSnack.name);
        
        //记录横向扫描的相同snack数，r_num；
        var r_num = 0 ;
        //记录纵向扫描的相同snack数，c_num；
        var c_num = 0 ;
        //向左扫描；其中本身也记录了
        for (let a = 0; ;a++) {
            if (j - a < 0 || m[this.positions[i][j-a]].name != clickedSnack.name) {
                break;
            }
            if (m[this.positions[i][j-a]].name == clickedSnack.name) {
                r_num++;
                //记录与当前零食相同的零食；
                vis[i][j-a]++;
                //cc.log(vis[i][j-a]++);
            }
            //cc.log(m[this.positions[i][j-a]].name);
        } 
        //向右扫描；
        for (let a = 1; ;a++) {
            if (j + a > 5 || m[this.positions[i][j+a]].name != clickedSnack.name) {
                break;
            }
            if (m[this.positions[i][j+a]].name == clickedSnack.name) {
                r_num++;
                vis[i][j+a]++;
            }
            //cc.log(m[this.positions[i][j+a]].name);
        }
        //判断是否能消除；
        //r_num 小于 3 即不能消除；
        // cc.log(r_num);
        if (r_num < 3) {
            r_num = 0;
        }
        //向下扫描；
        for (let a = 0; ;a++) {
            if (i - a < 0 || m[this.positions[i-a][j]].name != clickedSnack.name) {
                break;
            }
            if (m[this.positions[i-a][j]].name == clickedSnack.name) {
                c_num++;
                //记录与当前零食相同的零食；
                vis[i-a][j]++;
                //cc.log(vis[i][j-a]++);
            }
            //cc.log(m[this.positions[i-a][j]].name);
        } 
        //向上扫描；
        for (let a = 1; ;a++) {
            if (i + a > 7 || m[this.positions[i+a][j]].name != clickedSnack.name) {
                break;
            }
            if (m[this.positions[i+a][j]].name == clickedSnack.name) {
                c_num++;
                //记录与当前零食相同的零食；
                vis[i+a][j]++;
                //cc.log(vis[i][j-a]++);
            }
            //cc.log(m[this.positions[i+a][j]].name);
        }
        if (c_num < 3) {
            c_num = 0;
        }
        //为3时即普通消除；
        if (r_num == 3 || c_num == 3) {
            //消除snack
            //消除函数
            cc.log(r_num);
            cc.log(c_num);
            //this.delSnack();
            //返回1表示可以交换
            return 1;
        
        }
        //为4时即横纵特效；
        else if (r_num == 4 || c_num == 4) {
            //消除snack
            //消除函数
            //this.delSnack();
            //返回1表示可以交换
            return 1;
        }
        //为5时即魔力天使特效；
        else if (r_num == 5 || c_num == 5) {
            //消除snack
            //消除函数
            //this.delSnack();
            //返回1表示可以交换
            return 1;
        }
        else {
            //返回0表示不可交换；
            return 0;
        }
    },

    //删除snack节点
    delSnack () {
        for(let i = 0;i < rows;++i) {           
            for (let j = 0;j < columns;++j) { 
                //vis值大于0，即消除；
                if (vis[i][j] > 0) {
                    vis[i][j] = 0;
                    //删除此节点
                    m[this.positions[i][j]].destroy();
                    //创建节点
                    if (this.randomNum() in this.snacks) {
                        var snack = cc.instantiate(this.snacks[this.randomNum()]);
                        snack.width = this.blockSizeW-5;
                        snack.height = this.blockSizeH-5;
                        snack.setPosition(0,0);
                        snack.parent = n[this.positions[i][j]];
                        m[this.positions[i][j]] = snack;
                        cc.log(snack.name);
                    }
                    //this.addSnack();
                }
            }
        }
    },

    //扫描所以snack节点，判断是否可以消除；
    scanAllSnacks () {
        
        for(let i = 0;i < rows;++i) {    
            for (let j = 0;j < columns;++j) {  
                if (this.scanSwapSnack(i,j) == 1) {
                    this.delSnack();
                }
            }
        }   
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

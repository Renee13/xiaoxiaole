
import alert from 'alert';
window.Global = {
    score: 0,
    star : 0,
    setMusicOnOff: 0,
};
var rows = 10;   //排
var columns = 8;    //列
//标记是否可消除数组；
var vis = [];
//sum 触摸次数；
var sum = 0;
//存储第一次触摸
var lastx = 0;
var lasty = 0;
//存储触摸节点
var touchesSnack = [];
var touchesSnackData = [];
var touchesSnackAnim = [];
//初始化标记数组
for (let x = 0; x < rows; ++x) {
    vis[x] = [];
    for (let y = 0; y < columns; ++y) {
        vis[x][y] = 0;
    }
}
//存储爆炸特效节点
var boomObj = [];
//检查横排；
var checkedR = [];
//检查竖排；
var checkedC = [];
cc.Class({
    extends: cc.Component,

    properties: {
        //画布
        canvas: cc.Node,
        //暂停按钮
        pauseBtn: {
            default: null,
            type: cc.Button
        },
        //分数
        scoreLabel: cc.Label,
        // score: 0,
        //步数
        stepsLabel: cc.Label,
        steps: 20,
        //饼干个数
        cookiesLabel: cc.Label,
        cookies: 15,
        //间隔
        gap: 20,
        //块
        blockSN: cc.Prefab,
        //零食[]
        snacks: {
            default: [],
            type: [cc.Prefab],
        },
        //爆炸预制节点
        boom: {
            default: null,
            type: cc.Prefab
        },
        //音效
        WorldAudio: {
            default: null,
            type: cc.AudioClip
        },
        ButtonAudio: {
            default: null,
            type: cc.AudioClip
        },
        BoomAudio: {
            default: null,
            type: cc.AudioClip
        },
        //背景
        bg: cc.Node,
        //alert弹框资源
        alertEvent: cc.Node,
        //success弹框资源
        successEvent: cc.Prefab,
        //failure弹框资源
        failureEvent: cc.Prefab,
      
    },
    onLoad() {
        //场景加载时执行
        
        if (Global.setMusicOnOff%2 == 0) {
            this.allMusicStart();
        } 
        //关闭alertEvent节点
        this.alertEvent.active = false;
        
        this.pauseBtn.node.on('touchstart', this.PlayClick.bind(this));
        //侦听touchend事件来触他弹框。不能用click，否则在微信中无效。
        this.pauseBtn.node.on('touchend', this.AlertEvent.bind(this));
        
        //初始化背景块；
        this.drawBgBlocks();
        //初始化零食块；
        this.drawBgSnacks();
        //全局扫描；
        this.scanAllSnacksInit();
        //死地图是重新生成初始地图；
        //this.reDrawBgSnacks();
        //初始化分数，过关条件，过关限制等数据；
        this.initGameData();
        
        cc.director.pause();
        cc.director.resume();
        //注册触摸事件    
        this.canvas.on(cc.Node.EventType.TOUCH_END, this.onmTouchEnd, this);
    },
    
    // 背景音乐开始
    allMusicStart(){
        this.gameSceneBGMAudioId = cc.audioEngine.play(this.WorldAudio, true, 1);
    },  

    onDestroy: function(){
        cc.audioEngine.stop(this.gameSceneBGMAudioId);
    },

    PlayClick: function () {
        cc.audioEngine.play(this.ButtonAudio, false, 1);
    },
    //初始化数据；
    initGameData() {
        this.updateScore(0);
        this.updateSteps(20);
        this.updateCookies(15);
    },

    //当前分数初始化；
    updateScore(number) {
        Global.score = number;
        this.scoreLabel.string = number;
    },

    //剩余步数初始化；
    updateSteps(number) {
        this.steps = number;
        this.stepsLabel.string = number;
    },

    //需要消除的饼干数初始化；
    updateCookies(number) {
        this.cookies = number;
        this.cookiesLabel.string = number;
    },

    //暂停按钮触发的弹框事件；
    AlertEvent: function () {
        //暂停场景；
        cc.director.pause();
        //激活节点
        this.alertEvent.active = true;
        // cc.log(alertE);
        //alertE.parent = this.bg;
    },

    //循环画出背景块；
    drawBgBlocks() {
        
        //获得块的width
        this.blockSizeW = (cc.winSize.width - this.gap * 2) / columns;
        //获得块的height
        this.blockSizeH = (cc.winSize.height - 275 - this.gap * 2) / rows;
        //横坐标
        let x = this.gap + this.blockSizeW / 2;
        //纵坐标
        let y = 125 + this.blockSizeH / 2;
        // this.positions = [];
        for (let i = 0; i < rows; ++i) {
            // this.positions.push([0, 0, 0, 0, 0, 0]);
            for (let j = 0; j < columns; ++j) {
                //克隆已有节点
                let block = cc.instantiate(this.blockSN);
                block.width = this.blockSizeW;
                block.height = this.blockSizeH;
                //设置块的坐标位置      
                block.setPosition(cc.v2(x, y));
                block.parent = this.bg;
                //this.positions[i][j] = cc.v2(x, y);
                //横坐标加一个块的宽度
                x += this.blockSizeW;
                //cc.log(m);
                //block.active = false;
            }
            //纵坐标加一个块的高度
            y += this.blockSizeH;
            //设置横坐标为初始值
            x = this.gap + this.blockSizeW / 2;
        }

    },
    //循环生成零食节点
    drawBgSnacks() {
        //存储snack节点；
        this.snacksTable = [];
        //存储对应动画；
        this.snacksAnimTable = [];
        //存储位置；
        this.snacksPosTable = [];
        //存储snack对应数字；
        this.snacksDataTable = [];
        //获得块的width
        this.blockSizeW = (cc.winSize.width - this.gap * 2) / columns;
        //获得块的height
        this.blockSizeH = (cc.winSize.height - 275 - this.gap * 2) / rows;
        //横坐标
        let x = this.gap + this.blockSizeW / 2;
        //纵坐标
        let y = 125 + this.blockSizeH / 2;

        for (let i = 0; i < rows; ++i) {
            //存储snack节点；
            this.snacksTable[i] = [];
            //存储位置；
            this.snacksPosTable[i] = [];
            //存储对应动画；
            this.snacksAnimTable[i] = [];
            //存储snack对应数字；
            this.snacksDataTable[i] = [];

            for (let j = 0; j < columns; ++j) {

                this.snacksPosTable[i][j] = cc.v2(x, y);
                this.snacksDataTable[i][j] = this.randomNum();
                //根据产生的随机数来填充格子
                var snack = cc.instantiate(this.snacks[this.snacksDataTable[i][j]]);
                snack.width = this.blockSizeW - 5;
                snack.height = this.blockSizeH - 5;
                snack.setPosition(cc.v2(x, y));
                snack.parent = this.bg;
                this.snacksTable[i][j] = snack;
                //cc.log(snack);
                this.snacksAnimTable[i][j] = this.snacksTable[i][j].getComponent(cc.Animation);
                
                //cc.log(this.snacksAnimTable[i][j]);
                // snack.on('touchend',this.exchange(snack,i,j),this);
                //横坐标加一个块的宽度
                x += this.blockSizeW;
                //cc.log(snack);
            }

            //纵坐标加一个块的高度
            y += this.blockSizeH;
            //设置横坐标为初始值
            x = this.gap + this.blockSizeW / 2;
            //cc.log(x,y);
        }

    },

    randomNum() {
        //取得1~6的整数；
        //0~1*6 = 0~6
        let randoms = Math.random() * 6;
        //返回大于或等于其数值参数的最小整数;
        //1——6
        let num = Math.ceil(randoms);
        return num;

    },

    scanSwapSnack(i, j) {
       
        //记录此次点击的零食；
        var clickedSnack = this.snacksTable[i][j];
        //cc.log(clickedSnack.name);

        //记录横向扫描的相同snack数，r_num；
        var r_num = 0;
        //记录纵向扫描的相同snack数，c_num；
        var c_num = 0;
        //记录与当前零食相同的最左边零食位置；
        var left_i = i;
        var left_j = j;
        //记录与当前零食相同的最上边零食位置；
        var up_i = i;
        var up_j = j;
        //向左扫描；其中本身也记录了
        for (let a = 0; ; a++) {
            //扫描到j-a<0时即左边已经没有可以扫描的节点了，跳出循环；
            //一旦扫描到的节点名和当前点击的不同时，跳出循环；
            if (j - a < 0 || this.snacksTable[i][j - a].name != clickedSnack.name) {
                break;
            }
            //左侧的和点击
            if (this.snacksTable[i][j - a].name == clickedSnack.name) {
                r_num++;
                //与当前零食相同的零食  的标记数组+1；
                vis[i][j - a]++;
                //cc.log(vis[i][j-a]++);
                if (a != 0) { //a==0时为本身
                    left_j--; //纵列-1；记录相同的最左边零食；
                }

            }
            //cc.log(this.snacksTable[i][j - a].name);
        }
        //向右扫描；
        for (let a = 1; ; a++) {
            if (j + a > 7 || this.snacksTable[i][j + a].name != clickedSnack.name) {
                break;
            }
            if (this.snacksTable[i][j + a].name == clickedSnack.name) {
                r_num++;
                vis[i][j + a]++;
            }
           // cc.log(this.snacksTable[i][j + a].name);
        }
        //判断是否能消除；
        //r_num 小于 3 即不能消除；
        //cc.log(r_num);
        if (r_num < 3) {    
            for (let x = 0;x < r_num;x++) {
                //相同零食的标记数组-1，不能置为0，以防竖排可以消除
                vis[left_i][left_j+x]--; 
                //向右扫描不需要记录最右侧，因为当记录最左侧后，根据r_num循环向右，可以保证右侧的被-1
            }
            r_num = 0;
        }
        //向下扫描；
        for (let a = 0; ; a++) {
            if (i - a < 0 || this.snacksTable[i - a][j].name != clickedSnack.name) {
                break;
            }
            if (this.snacksTable[i - a][j].name == clickedSnack.name) {
                c_num++;
                //记录与当前零食相同的零食；
                vis[i - a][j]++;
                //cc.log(vis[i][j-a]++);
                if (a != 0) { //a==0时为本身
                    up_i--; //横排-1；
                }
            }
            //cc.log(this.snacksTable[i - a][j].name);
        }
        //向上扫描；
        for (let a = 1; ; a++) {
            if (i + a > 9 || this.snacksTable[i + a][j].name != clickedSnack.name) {
                break;
            }
            if (this.snacksTable[i + a][j].name == clickedSnack.name) {
                c_num++;
                //记录与当前零食相同的零食；
                vis[i + a][j]++;
                //cc.log(vis[i][j-a]++);
            }
            //cc.log(this.snacksTable[i + a][j].name);
        }
        //cc.log(c_num);
        if (c_num < 3) {
            for (let y = 0;y < c_num;y++) {
                vis[up_i+y][up_j]--;
            }
            c_num = 0;
        }
        //为3时即普通消除；
        if (r_num == 3 || c_num == 3) {
            // cc.log(r_num);
            // cc.log(c_num);
            Global.score = Global.score + 30;
            //返回1表示可以交换,执行消除
            return 1;

        }
        //为4时即横纵特效；
        else if (r_num == 4 || c_num == 4) {
            // cc.log(r_num);
            // cc.log(c_num);
            Global.score = Global.score + 60;
            //返回1表示可以交换
            return 1;
        }
        //为5时即魔力天使特效；
        else if (r_num == 5 || c_num == 5) {
            // cc.log(r_num);
            // cc.log(c_num);
            Global.score = Global.score + 100;
            //返回1表示可以交换
            return 1;
        }
        else {
            //返回0表示不可交换；
            return 0;
        }
    },
    //扫描所有snack节点，判断是否可以消除；
    scanAllSnacksInit() {
        //是否进行下轮全局扫描；
        var flag = false;
        //先进行一次全局扫描；
        //if flag = true 继续循环do while 直到没有可以消除的节点
        //if flag = false 跳出循环do while 
        do {
            flag = false;
            for (let i = 0; i < rows; ++i) {
                for (let j = 0; j < columns; ++j) {
                    if (this.scanSwapSnack(i, j) == 1) {
                        
                        this.delSnackInit();
                        
                        this.addSnackInit();
                        //删除后添加完，再检查此节点是否可消除；
                        j--;
                        flag = true;
                        break;
                    }
                }
                if (flag == true) {
                    break;
                }
            }
        }
        while (flag);
    
    },
     //删除snack节点
     delSnackInit() {
       //var _this = this;
       for (let i = 0; i < rows; ++i) {
          
           for (let j = 0; j < columns; ++j) {
               //标记数组vis值大于0，即消除；
               
               if (vis[i][j] > 0) {
                   
                   vis[i][j] = 0;
                   //置零食节点对应数据为9，以便进行生成节点；
                   this.snacksDataTable[i][j] = 9;             
                   //关闭此节点
                   this.snacksTable[i][j].active = false;
                   
               }
           }
       }
    },

    addSnackInit() {

        this.refreshScoreLabel();
        for (let i = 0; i < rows; ++i) {
            for (let j = 0; j < columns; ++j) {
                //data值为9，即生成；
                if (this.snacksDataTable[i][j] == 9) {
                    //创建节点
                    this.snacksDataTable[i][j] = this.randomNum();
                    var snack = cc.instantiate(this.snacks[this.snacksDataTable[i][j]]);
                    snack.width = this.blockSizeW - 5;
                    snack.height = this.blockSizeH - 5;
                    snack.setPosition(this.snacksPosTable[i][j]);
                    snack.parent = this.bg;
                    this.snacksTable[i][j] = snack;
                    this.snacksAnimTable[i][j] = snack.getComponent(cc.Animation);
                    //cc.log(this.snacksAnimTable[i][j]);
                    //激活此节点
                    this.snacksTable[i][j].active = true;
                   
                    //cc.log(this.snacksTable[i][j].name);
                }
            }
        }
    },

    //删除snack节点
    delSnack() {
        //存储爆炸动画；
        this.boomAnim = [];
        //var _this = this;
        for (let i = 0; i < rows; ++i) {
            boomObj[i] = [];
            this.boomAnim[i] = [];
            for (let j = 0; j < columns; ++j) {
                //vis值大于0，即消除；
                boomObj[i][j] = [];
                this.boomAnim[i][j] = [];
                if (vis[i][j] > 0) {
                    
                    vis[i][j] = 0;
                    
                    if(this.snacksTable[i][j].name == "饼干") {
                        this.cookies--;
                        this.cookiesLabel.string = this.cookies;

                    }

                    this.snacksDataTable[i][j] = 9; 
                    // var snackstable =  this.snacksTable[i][j]; 
                    // var snacksAnim = this.snacksAnimTable[i][j];
                    //删除此节点
                    //cc.log("aaaaaaaaa")
                    
                    // let action1 = cc.spawn(cc.rotateBy(1, 90, 90), cc.scaleTo(1, 1.1, 1.1));
                    // let action2 =  cc.delayTime(1);
                    // let action3 = cc.callFunc(() => {
                    //     this.snacksTable[i][j].active = false;
                    //     cc.log("aiaiaiaiaiaiaiaiaiai")
                    // },this);
                    
                    //this.snacksAnimTable[i][j].play("cancel"); 
                    // cc.log(snacksAnim);
                    // snacksAnim.scheduleOnce(function() {
                    //     // 这里的 this 指向 component
                    //     cc.log(snacksAnim);
                    //     snackstable.active = false;
                        
                       
                    // }, 0);  

                    //this.snacksTable[i][j].runAction(cc.sequence(action,action2));
                    this.snacksTable[i][j].active = false;

                    var boom = cc.instantiate(this.boom);
                    boom.width = this.blockSizeW - 5;
                    boom.height = this.blockSizeH - 5;
                    boom.setPosition(this.snacksPosTable[i][j]);
                    boom.parent = this.bg;
                    //获取节点的animation动画组件
                    this.boomAnim[i][j] = boom.getComponent(cc.Animation);
                    //播放组件的cancel动画
                    this.boomAnim[i][j].play("cancel");
                    //播放动画音效
                    this.PlayBoom();
                    //this.boomAnim[i][j].on('finished',this.onFinished,this);
                    boomObj[i][j] = boom;
                    
                   
                    //cc.log(this.snacksTable[i][j].name);
                }
            }
        }
    },
    //播放爆炸音效；
    PlayBoom: function () {
        cc.audioEngine.play(this.BoomAudio, false, 0.5);
    },
    //成功弹框事件；
    SuccessEvent: function () {
        //暂停场景；
        cc.director.pause();
        var success = cc.instantiate(this.successEvent);
        // cc.log(alertE);
        success.parent = this.bg;
    },
    ///失败弹框事件；
    FailureEvent: function () {
        //暂停场景；
        cc.director.pause();
        var failure = cc.instantiate(this.failureEvent);
        // cc.log(alertE);
        failure.parent = this.bg;
    },
    //暂未使用
    onFinished: function (event) {
        cc.log(event)
        for (let i = 0; i < rows; ++i) {
            for (let j = 0; j < columns; ++j) {
                //data值为9，即生成；
                if (this.snacksDataTable[i][j] == 9) {
                    boomObj[i][j].active = false;
                    this.snacksDataTable[i][j] = this.randomNum();
                    var snack = cc.instantiate(this.snacks[this.snacksDataTable[i][j]]);
                    snack.width = this.blockSizeW - 5;
                    snack.height = this.blockSizeH - 5;
                    snack.setPosition(this.snacksPosTable[i][j]);
                    snack.parent = this.bg;
                    this.snacksTable[i][j] = snack;
                    this.snacksAnimTable[i][j] = snack.getComponent(cc.Animation);
                    //cc.log(this.snacksAnimTable[i][j]);
                    this.snacksTable[i][j].active = true;
                }
            }
        }
    },
    //暂未使用
    setSnackAnimObj (obj,name) {
        obj.play(name); 
       
        // var clip = animState.clip;
        // var isPlaying = animState.isPlaying;
        // // animation.on('finished',  this.onAnimCompleted, this);
        // cc.log(clip)
        // cc.log(isPlaying)
    },

    //生成节点；
    addSnack() {
        //刷新分数；
        this.refreshScoreLabel();
        for (let i = 0; i < rows; ++i) {
            for (let j = 0; j < columns; ++j) {
                //data值为9，即生成；
                if (this.snacksDataTable[i][j] == 9) {
                    //创建节点
                    //组件的计时器使用，指定0.5s后执行一次；
                    this.boomAnim[i][j].scheduleOnce(function() {
                        // 这里的 this 指向 component
                        boomObj[i][j].active = false;
                            
                    }, 0.5); 
                    this.snacksDataTable[i][j] = this.randomNum();
                    var snack = cc.instantiate(this.snacks[this.snacksDataTable[i][j]]);
                    snack.width = this.blockSizeW - 5;
                    snack.height = this.blockSizeH - 5;
                    snack.setPosition(this.snacksPosTable[i][j]);
                    snack.parent = this.bg;
                    this.snacksTable[i][j] = snack;
                    this.snacksAnimTable[i][j] = snack.getComponent(cc.Animation);
                    //cc.log(this.snacksAnimTable[i][j]);
                    this.snacksTable[i][j].active = true;
                    
                    //cc.log(this.snacksTable[i][j].name);
                }
            }
        }
    },

    

    //扫描所以snack节点，判断是否可以消除；
    scanAllSnacks() {
        //是否进行下轮全局扫描；flag为true继续循环，为false则不循环；
        var flag = false;
        do {
            flag = false;
            for (let i = 0; i < rows; ++i) {
                for (let j = 0; j < columns; ++j) {
                    if (this.scanSwapSnack(i, j) == 1) {
                        cc.log("qisiwole")
                        this.delSnack();
                        cc.log("buxianghuole")
                        this.addSnack();
                        cc.log("haofana")
                        //删除后添加完，再检查此节点是否可消除；
                        j--;
                        flag = true;
                        break;
                    }
                }
                if (flag == true) {
                    break;
                }
            }
        }
        while (flag);
       
    },
    //更新分数；
    refreshScoreLabel () {
        this.scoreLabel.string =  Global.score;
    },
    //交换函数；
    exchange(x, y) {
        //存储第一次和第二次触摸交换后是否可以消除；
        var m = 0;
        var n = 0;
        //记录第几次点击
        if (sum == 0) {
            //第一次点击
            lastx = x;
            lasty = y;
        }
        //把交换的图片存起来
        //cc.log(this.snacksTable[x][y].getPosition());
        touchesSnackAnim[sum] = this.snacksAnimTable[x][y];
        touchesSnackData[sum] = this.snacksDataTable[x][y];
        touchesSnack[sum] = this.snacksTable[x][y];
        sum++;
        
        
        if (sum == 2) {
            
            // cc.log(x,y);
            // cc.log(lastx,lasty);
            if ( lastx == x && lasty == y) {//同排同列
                sum = 1; //处理连续点击一样的图片
            }
            //x==lastx在同排不同列，左右交换，y==lasty在同列不同排，上下交换；
            else if (lastx == x || lasty == y){
                
                //确定交换的两个为相邻的；
                if (Math.abs(lastx - x) == 1 || Math.abs(lasty - y) == 1) {

                    if(touchesSnackData[0]==touchesSnackData[1]){
                        //cc.log("交换的两个零食一样！不交换");
                        sum = 0;
                        
                    }
                    else { //交换
                        this.snacksTable[x][y] = touchesSnack[0];
                        this.snacksTable[lastx][lasty] = touchesSnack[1];
                        //1为可以消除，0不可消除；
                        n = this.scanSwapSnack(x,y);
                        m = this.scanSwapSnack(lastx,lasty);
                        // cc.log(n);
                        // cc.log(m);
                        if (n==1 || m==1) { //可以消除；
                            sum = 0;
                            touchesSnack[0] =  touchesSnack[1] = '';
                            //交换存储过的其他数据；
                            this.snacksDataTable[x][y] = touchesSnackData[0];
                            this.snacksDataTable[lastx][lasty] = touchesSnackData[1];
                            this.snacksAnimTable[x][y] = touchesSnackAnim[0];
                            this.snacksAnimTable[lastx][lasty] = touchesSnackAnim[1];
                            this.snacksTable[x][y].setPosition(this.snacksPosTable[x][y]);
                            this.snacksTable[lastx][lasty].setPosition(this.snacksPosTable[lastx][lasty]);
                            // cc.log(this.snacksTable[x][y]);
                            // cc.log(this.snacksTable[lastx][lasty]);
                            //剩余步数-1；
                            this.steps--;
                            this.stepsLabel.string = this.steps;
                            //action为延时0.3s的动作；
                            let action =  cc.delayTime(0.3);
                            //action1为消除节点动作；
                            let action1 = cc.callFunc(() => {
                                this.delSnack();
                            },this);
                            let action2 = cc.callFunc(() => {
                                this.addSnack();
                            },this);
                            //action3为全局扫描动作；
                            let action3 = cc.callFunc(() => {
                                this.scanAllSnacksInit();
                            },this);
                            //action4为判断游戏是否结束的动作；
                            let action4 =  cc.callFunc(() => {
                                if(this.cookies > 0) {
                                    if (this.steps == 0) {
                                        //cc.log("game over!");
                                        cc.director.pause();
                                        cc.director.resume();
                                        cc.director.pause();
                                        Global.score = 0;
                                        this.refreshScoreLabel();
                                        //游戏失败；
                                        this.FailureEvent();
                                    }
                                    
                                }    
                                if(this.cookies <= 0){
                                    if (this.steps >= 0) {
                                        this.cookies = 0;
                                        Global.score = Global.score + this.steps*50;
                                        this.refreshScoreLabel();
                                        this.steps = 0;
                                        this.stepsLabel.string = this.steps;
                                        cc.director.pause();
                                        cc.director.resume();
                                        cc.director.pause();
                                        //游戏成功；
                                        this.SuccessEvent();
                                        //cc.log("success");
                                    }
                                } 
                            },this);
                            //顺序执行以上动作；
                            this.bg.runAction(cc.sequence(action,action1,action2,action3,action4));
                            //this.snacksTable[lastx][lasty].runAction(action);
                            // this.delSnack();
                            
                            // this.addSnack();

                            // this.scanAllSnacksInit();

                            
                            
                            //this.reDrawBgSnacks();
                            //cc.log("可以消除，执行");
   
                        } 
                        else { //不可以消除，换回来
                            this.snacksTable[x][y] = touchesSnack[1];
                            this.snacksTable[lastx][lasty] = touchesSnack[0];
                            //cc.log("不可以消除，换回来")
                            sum = 0;    
                        }
                        
                    }
                }
                //交换的两个不相邻
                else {
                    sum = 0;
                    touchesSnack[0] =  touchesSnack[1] = '';
                    
                    //cc.log("交换不相邻！");    
                }
                
            }
            //不同排不同列，肯定不相邻，则去最后一次触摸的节点为第一次，sum=1；
            else { 
                sum = 0;
                touchesSnack[0] =  touchesSnack[1] = '';
                
                //cc.log("交换不相邻!!!!!");
            }
        }
        // cc.log(sum);
        //this.scanAllSnacks();    

    },
    //触摸事件；
    onmTouchEnd(event) {
        //获取触摸的坐标；
        var touches = event.getLocation();
        var touchesX = touches.x;
        var touchesY = touches.y;
        //var touchesStart = touchesStart[0].getStartLocation();
        //cc.log(touches);
        //触点范围； x += this.blockSizeW; y += this.blockSizeH;
        //有效的触摸范围；
        let xMin= this.gap ;
        let yMin = 125 ;
        let xMax= this.gap + this.blockSizeW*columns ;
        let yMax = 125 + this.blockSizeH*rows ;
        if (touchesX < xMin || touchesX > xMax || touchesY < yMin || touchesY > yMax) {
            cc.log("触点不在范围内，无效");
            //不处理；
        }

        for (let i = 0; i < rows; ++i) {
            for (let j = 0; j < columns; ++j) {
                //判断触摸位置是否在节点内；
                //getBoundingBoxToWorld世界坐标系的包围盒
                if(this.snacksTable[i][j].getBoundingBoxToWorld().contains(touches)) {
                    //如果在，触发交换事件；
                    this.exchange(i,j);
                    //this.scanAllSnacks();
                }
               
            }
              
        }

    },

    exchangeTry(x, y) {
   
        var m = 0;
        var n = 0;
        if (sum == 0) {
            //第一次点击
            lastx = x;
            lasty = y;
        }
        //把交换的图片存起来
        //cc.log(this.snacksTable[x][y].getPosition());
        touchesSnackAnim[sum] = this.snacksAnimTable[x][y];
        touchesSnackData[sum] = this.snacksDataTable[x][y];
        touchesSnack[sum] = this.snacksTable[x][y];
        sum++;
        
        
        if (sum == 2) {
           
                //确定交换的两个为相邻的；
                
                     //交换
                        this.snacksTable[x][y] = touchesSnack[0];
                        this.snacksTable[lastx][lasty] = touchesSnack[1];
                        
                        n = this.scanSwapSnack(x,y);
                        m = this.scanSwapSnack(lastx,lasty);
                        // cc.log(n);
                        // cc.log(m);
                        if (n==1 || m==1) { //可以消除,也要换回来
                            this.snacksTable[x][y] = touchesSnack[1];
                            this.snacksTable[lastx][lasty] = touchesSnack[0];
                            sum = 0;
                            return 1;
   
                        } 
                        else { //不可以消除，换回来
                            this.snacksTable[x][y] = touchesSnack[1];
                            this.snacksTable[lastx][lasty] = touchesSnack[0];
                            //cc.log("不可以消除，换回来")
                            sum = 0;  
                            return 0;  
                        }
                        
                    
                             
        }
    },
    //检查地图是否为死地图；
    checkMap() {
        for (let i = 0; i < rows; ++i) {
            checkedR[i] = [];
            checkedC[i] = [];
            for (let j = 0; j < columns; ++j) {
                checkedR[i][j] = [];
                checkedC[i][j] = [];
                if (j == 7 && i != 9) {
                    this.exchangeTry(i,j);
                    checkedC[i][j] = this.exchangeTry(i+1,j);
                    checkedR[i][j] = 0;
                    continue;
                }
                if (i == 9 && j != 7) {
                    this.exchangeTry(i,j);
                    checkedR[i][j] = this.exchangeTry(i,j+1);
                    checkedC[i][j] = 0;
                    continue;
                }
                if (i == 9 && j == 7) {
                    break;
                }
                this.exchangeTry(i,j);
                checkedR[i][j] = this.exchangeTry(i,j+1);
                
                this.exchangeTry(i,j);
                checkedC[i][j] = this.exchangeTry(i+1,j);
            }
        }
        for (let i = 0; i < rows; ++i) {
            
            for (let j = 0; j < columns; ++j) {
                if (checkedR[i][j] != 0 || checkeC[i][j] != 0) {
                    return true; 
                }

            }
        }
        return false; //死地图 全为0
    },

    reDrawBgSnacks() {
        //是否进行下轮重新生成；
        var flag = false;
        do {
            //flag = false;
            if (this.checkMap() == false) {
                this.drawBgSnacks();
                this.scanAllSnacksInit();
                flag = true;   //继续判断是否需要重新生成
            }
            if (this.checkMap() == true) {
               flag = false;
            }
           
   
        }
        while (flag);   
    }
    // update (dt) {},
});



        
        /*
        如果步数为0，饼干数不为0，即失败，游戏结束；
        如果步数为0，饼干数也为0，最后一步成功，游戏结束；
        如果步数不为0，饼干数为0，成功，游戏结束；
        如果步数不为0，饼干数也不为0，游戏继续。


        */   
         /*
        for i
            for j
                交换 i,j    i,j+1    return 0
                交换 i,j    i+1,j    return 0


        */ 
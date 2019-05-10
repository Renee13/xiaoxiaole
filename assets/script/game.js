
import alert from 'alert';

var rows = 8;
var columns = 6;

var vis = [];
//零食块的状态值；
var ICON_STATE_NORMAL = 1
var ICON_STATE_MOVE   = 2
var ICON_STATE_PRECANCEL = 3
var ICON_STATE_PRECANCEL2 = 4
var ICON_STATE_CANCEL = 5
var ICON_STATE_CANCELED = 6

cc.Class({
    extends: cc.Component,

    properties: {
        //画布
        canvas : cc.Node,
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
        //初始化背景块；
        this.drawBgBlocks();
        //初始化零食块；
        this.drawBgSnacks();
        //初始化分数，过关条件，过关限制等数据；
        this.initGameData();
        //点击事件
        this.canvas.on(cc.Node.EventType.TOUCH_START,this.onmTouchBagan,this);
        this.canvas.on(cc.Node.EventType.TOUCH_MOVE,this.onmTouchMove,this);
        this.canvas.on(cc.Node.EventType.TOUCH_END,this.onmTouchEnd,this);
    },

    start () {
      
    },

    initGameData () {
        this.updateScore(0);
        this.updateSteps(9);
        this.updateCookies(15);
        this.typeNum = 6;//零食块种类
        this.isControl = false;  //是否控制着零食块
        this.chooseSnackPos = cc.v2(-1,-1); //控制零食块的位置
        this.deltaPos = cc.v2(0,0); //相差坐标
        this.snacksDataTable = [];
        for(var i = 1;i < rows;i ++)
        {
            this.snacksDataTable[i] = []
            for(var j = 1;j <columns;j ++)
            {
                this.snacksDataTable[i][j] = {"state":ICON_STATE_NORMAL,"iconType":1,"obj":null}
                this.snacksDataTable[i][j].iconType = this.getNewIconType(i,j)
            }
        }
        
    },

    //当前分数初始化
    updateScore(number) {
        this.score = number;
        this.scoreLabel.string = number;
    },

    //剩余步数初始化
    updateSteps(number) {
        this.steps = number;
        this.stepsLabel.string = number;
    },

    //需要消除的饼干数初始化
    updateCookies(number) {
        this.cookies = number;
        this.cookiesLabel.string = number;
    },

    //生成零食块的类型数据
    getNewIconType:function(i,j){
        var exTypeTable = [-1,-1]
        if(i > 1)
        {
            exTypeTable[1] = this.snacksDataTable[i - 1][j].iconType
        }
        if(j > 1)
        {
            exTypeTable[2] = this.snacksDataTable[i][j - 1].iconType
        }
        var typeTable = [];
        var max = 0;
        for(var i = 1;i < this.typeNum;i ++)
        {
            if(i != exTypeTable[1] && i != exTypeTable[2])
            {
                max = max + 1
                typeTable[max] = i
            }
        }
        return typeTable[this.randomNum()];
    },
    
    //暂停按钮触发的弹框事件；
    AlertEvent: function() {
        cc.director.pause();
        let alertE = cc.instantiate(this.alertEvent);
        // cc.log(alertE);
        alertE.parent = this.bg;
    },

    //循环画出背景块；
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
                //横坐标加一个块的宽度
                x += this.blockSizeW;
                //cc.log(m);
            }
            //纵坐标加一个块的高度
            y += this.blockSizeH;
            //设置横坐标为初始值
            x = this.gap + this.blockSizeW/2;
        }
        
    },
    //循环
    drawBgSnacks () {
        this.iconsTable = []
        this.iconsAnimTable = []
        this.iconsPosTable = []
        //获得块的width
        this.blockSizeW = (cc.winSize.width - this.gap*2) /columns;
        //获得块的height
        this.blockSizeH = (cc.winSize.height - 275 - this.gap*2 ) /rows;
        //横坐标
        let x = this.gap + this.blockSizeW/2;
        //纵坐标
        let y = 125 + this.blockSizeH/2;

        for(let i = 0;i < rows;++i) {
            //存储snack节点；
            this.iconsTable[i] = [];
            //存储位置；
            this.iconsPosTable[i] = [];
            //存储对应动画；
            this.iconsAnimTable[i] = [];
            
            for (let j = 0;j < columns;++j) {  
                
                this.iconsPosTable[i][j] = cc.v2(x,y);
                //根据产生的随机数来填充格子
                if (this.randomNum() in this.snacks) {
                    var snack = cc.instantiate(this.snacks[this.randomNum()]);
                    snack.width = this.blockSizeW-5;
                    snack.height = this.blockSizeH-5;
                    snack.setPosition(cc.v2(x,y));
                    snack.parent = this.bg;
                    this.iconsTable[i][j] = snack;
                    this.iconsAnimTable[i][j] = snack.getComponent(cc.Animation);
                }   
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
        this.scanAllSnacks();
    },

    randomNum () {
        //取得1~6的整数；
        let randoms = Math.random()*6;
        
        //返回大于或等于其数值参数的最小整数;
        let num = Math.ceil(randoms);
        
        return num;
        
    },
    //交换两个snack，判断是否可以交换
    // exchange(snackA,snackB) {
    //     var Aparent = snackA.parentNode;
    //     var Bparent = snackB.parentNode;
    // },

    scanSwapSnack (i,j) {
        
        for(let i = 0;i < rows;++i) {   
            vis[i] = [];        
            for (let j = 0;j < columns;++j) { 
                vis[i][j] = 0;
            }
        }
        //记录此次点击的零食；
        var clickedSnack = this.iconsTable[i][j];
        //cc.log(clickedSnack.name);
        
        //记录横向扫描的相同snack数，r_num；
        var r_num = 0 ;
        //记录纵向扫描的相同snack数，c_num；
        var c_num = 0 ;
        //向左扫描；其中本身也记录了
        for (let a = 0; ;a++) {
            if (j - a < 0 || this.iconsTable[i][j-a].name != clickedSnack.name) {
                break;
            }
            if (this.iconsTable[i][j-a].name == clickedSnack.name) {
                r_num++;
                //记录与当前零食相同的零食；
                vis[i][j-a]++;
                //cc.log(vis[i][j-a]++);
            }
            cc.log(this.iconsTable[i][j-a].name);
        } 
        //向右扫描；
        for (let a = 1; ;a++) {
            if (j + a > 5 || this.iconsTable[i][j+a].name.name != clickedSnack.name) {
                break;
            }
            if (this.iconsTable[i][j+a].name == clickedSnack.name) {
                r_num++;
                vis[i][j+a]++;
            }
            cc.log(this.iconsTable[i][j+a].name);
        }
        //判断是否能消除；
        //r_num 小于 3 即不能消除；
        // cc.log(r_num);
        if (r_num < 3) {
            r_num = 0;
        }
        //向下扫描；
        for (let a = 0; ;a++) {
            if (i - a < 0 || this.iconsTable[i-a][j].name != clickedSnack.name) {
                break;
            }
            if (this.iconsTable[i-a][j].name == clickedSnack.name) {
                c_num++;
                //记录与当前零食相同的零食；
                vis[i-a][j]++;
                //cc.log(vis[i][j-a]++);
            }
            cc.log(this.iconsTable[i-a][j].name);
        } 
        //向上扫描；
        for (let a = 1; ;a++) {
            if (i + a > 7 || this.iconsTable[i+a][j].name != clickedSnack.name) {
                break;
            }
            if (this.iconsTable[i+a][j].name == clickedSnack.name) {
                c_num++;
                //记录与当前零食相同的零食；
                vis[i+a][j]++;
                //cc.log(vis[i][j-a]++);
            }
            cc.log(this.iconsTable[i+a][j].name);
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
            cc.log(r_num);
            cc.log(c_num);
            //this.delSnack();
            //返回1表示可以交换
            return 1;
        }
        //为5时即魔力天使特效；
        else if (r_num == 5 || c_num == 5) {
            //消除snack
            //消除函数
            cc.log(r_num);
            cc.log(c_num);
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
                    
                    this.iconsTable[i][j].destroy();
                    
                    
                    //创建节点
                    if (this.randomNum() in this.snacks) {
                        var snack = cc.instantiate(this.snacks[this.randomNum()]);
                        snack.width = this.blockSizeW-5;
                        snack.height = this.blockSizeH-5;
                        snack.setPosition(this.iconsPosTable[i][j]);
                        snack.parent = this.bg;
                        this.iconsTable[i][j] = snack;
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
                    //删除后，再检查此节点是否可消除；
                    j--;
                }
            }
        }   
    },

    onmTouchBagan:function (event) {
        var touches = event.getTouches();
        var touchLoc = touches[0].getLocation();   
        for(var i = 1;i < this.row;i ++)
        {
            for(var j = 1;j < this.col;j ++)
            {
                if(this.iconsTable[i][j].getBoundingBoxToWorld().contains(touchLoc))
                {
                    this.isControl = true
                    this.chooseIconPos.x = i
                    this.chooseIconPos.y = j
                    this.deltaPos.x = this.iconsTable[i][j].getPosition().x - touchLoc.x
                    this.deltaPos.y = this.iconsTable[i][j].getPosition().y - touchLoc.y
                    this.iconsTable[i][j].zIndex = 1
                    break
                }
            }
        }
    },
    onmTouchMove:function (event) {
        if(this.isControl){
            var touches = event.getTouches()
            var touchLoc = touches[0].getLocation()
            var startTouchLoc = touches[0].getStartLocation()
            var deltaX = touchLoc.x - startTouchLoc.x
            var deltaY = touchLoc.y - startTouchLoc.y
            var deltaX2 = deltaX * deltaX
            var deltaY2 = deltaY * deltaY
            var deltaDistance = deltaX2 + deltaY2
            var anchor = 1
            //获得点击方向
            if(deltaX2 > deltaY2)
            {
                if(deltaX < 0)
                {
                    anchor = 1
                }else{
                    anchor = 3
                }
            }else{
                if(deltaY > 0)
                {
                    anchor = 2
                }else{
                    anchor = 4
                }
            }
            //判断拖动区域是否出界
            if(this.chooseIconPos.x == 1 && anchor == 1)
            {
                this.iconsTable[this.chooseIconPos.x][this.chooseIconPos.y].setPosition(this.iconsPosTable[this.chooseIconPos.x][this.chooseIconPos.y])
                this.iconsTable[this.chooseIconPos.x][this.chooseIconPos.y].zIndex = 0
                this.isControl = false
                return 
            }else if(this.chooseIconPos.x == this.row && anchor == 3)
            {
                this.iconsTable[this.chooseIconPos.x][this.chooseIconPos.y].setPosition(this.iconsPosTable[this.chooseIconPos.x][this.chooseIconPos.y])
                this.iconsTable[this.chooseIconPos.x][this.chooseIconPos.y].zIndex = 0
                this.isControl = false
                return
            }else if(this.chooseIconPos.y == this.col && anchor == 2)
            {
                this.iconsTable[this.chooseIconPos.x][this.chooseIconPos.y].setPosition(this.iconsPosTable[this.chooseIconPos.x][this.chooseIconPos.y])
                this.iconsTable[this.chooseIconPos.x][this.chooseIconPos.y].zIndex = 0
                this.isControl = false
                return
            }else if(this.chooseIconPos.y == 1 && anchor == 4)
            {
                this.iconsTable[this.chooseIconPos.x][this.chooseIconPos.y].setPosition(this.iconsPosTable[this.chooseIconPos.x][this.chooseIconPos.y])
                this.iconsTable[this.chooseIconPos.x][this.chooseIconPos.y].zIndex = 0
                this.isControl = false
                return
            }
            //点击到物块自动判断是否可以消除
            if(deltaDistance > 4900)
            {
                this.iconsTable[this.chooseIconPos.x][this.chooseIconPos.y].setPosition(this.iconsPosTable[this.chooseIconPos.x][this.chooseIconPos.y])
                this.iconsTable[this.chooseIconPos.x][this.chooseIconPos.y].zIndex = 0
                this.isControl = false
                this.handelMessage("exchange",{"pos":touchLoc,"anchor":anchor})
            //移动物块
            }else{
                this.iconsTable[this.chooseIconPos.x][this.chooseIconPos.y].setPosition(cc.p(touchLoc.x + this.deltaPos.x,touchLoc.y + this.deltaPos.y))
            }
        }
    },
    onmTouchEnd:function (event) {
        if(this.isControl){
            var touches = event.getTouches()
            var touchLoc = touches[0].getLocation()
            var startTouchLoc = touches[0].getStartLocation()
            var deltaX = touchLoc.x - startTouchLoc.x
            var deltaY = touchLoc.y - startTouchLoc.y
            var deltaX2 = deltaX * deltaX
            var deltaY2 = deltaY * deltaY
            var deltaDistance = deltaX2 + deltaY2
            var anchor = 1
            if(deltaX2 > deltaY2)
            {
                if(deltaX < 0)
                {
                    anchor = 1
                }else{
                    anchor = 3
                }
            }else{
                if(deltaY > 0)
                {
                    anchor = 2
                }else{
                    anchor = 4
                }
            }
            this.iconsTable[this.chooseIconPos.x][this.chooseIconPos.y].setPosition(this.iconsPosTable[this.chooseIconPos.x][this.chooseIconPos.y])
            this.iconsTable[this.chooseIconPos.x][this.chooseIconPos.y].zIndex = 0
            this.isControl = false
            this.handelMessage("exchange",{"pos":touchLoc,"anchor":anchor})
        }
    },

    
    

    // update (dt) {},
});

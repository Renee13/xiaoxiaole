
cc.Class({
    extends: cc.Component,

    properties: {
        alertM : cc.Node,
        mask : cc.Node,
        exitCancel : cc.Button,
        startBtn : cc.Button,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //遮罩层，防止上层game场景的事件；
        this.mask.active = true;  
        //cc.log(this.mask);  
        this.startBtn.node.on('touchend',this.ToGame.bind(this));
        //cc.log("rrrrrrrrrrrrrr");
        this.exitCancel.node.on('touchend',this.Closewin.bind(this));
        //cc.log("eeeeeeeeeeeeee");
    },

    Closewin : function () {
         //销毁alert节点，即关闭；
        this.alertM.destroy();
        //cc.log("看看能不能执行resume恢复场景");
        //恢复暂停的game场景；
        cc.director.resume();
        //cc.log("看看能不能执行resume恢复场景！！！！");
    },

    ToGame: function () {
        //调用系统方法加载menu场景
        cc.director.loadScene('game');
        
    },

    start () {

    },

    // update (dt) {},
});

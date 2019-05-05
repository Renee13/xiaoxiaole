import game from 'game';

cc.Class({
    extends: cc.Component,

    properties: {
        //零食[]
        snacks : {
            default : [],
            type : [cc.Prefab],
        },
        block : cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
       // this.randomNum();
        //cc.log(this.snacks[0]);
    },

    start () {
        
    },

    // setSnacks(snack) {
    //     if(snack == null) {
    //         //块上无零食；
    //         //填充零食；
    //     }
    //     for (let i = 0;i < this.snacks.length;++i) {
    //         if (this.snacks[i].name == snack) {
    //             //以防传进来的snack不在snacks数组中；
    //         }
    //     }
    // },
    // randomNum () {
    //     //取得1~6的整数；
    //     let randoms = Math.random()*6;
    //     //cc.log(randoms);
    //     let num = Math.ceil(randoms);
    //     //cc.log(num);
    //     cc.log(this.snacks[num]);
    //     if (num in this.snacks) {
    //         let snack = cc.instantiate(this.snacks[num]);
    //         snack.width = this.block.width;
    //         snack.height = this.block.height;
    //         snack.setPosition(0,0);
    //         snack.parent = this.block;
           
    //     }
    // },

    // update (dt) {},
});

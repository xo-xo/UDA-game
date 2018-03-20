// 基础常量
var BASIC_CONST = {
        move_speed: 1
    }
// UI图形界面
var ui = {
        allowClick: false,
        allowKeyboard: false,
        init: function() {
            var that = this;
            console.log(that)
            this.render('init');
            this.allowClick = true;
            uCanvas.addEventListener('click', function(e) {
                if (!that.allowClick) return;
                that._handleClick();
            })
        },
        render: function(e) {
            switch (e) {
                case 'init':
                    this._renderMask();
                    this._renderStarter();
                    break;
                case 'reset':
                    this.allowClick = true;
                    this._cls();
                    this._renderMask();
                    this._renderEnder();
                    break;
            }
        },
        _cls: function() {
            uCtx.clearRect(0, 0, uCanvas.width, uCanvas.height);
        },
        _renderMask: function() {
            // 渲染黑色遮罩
            uCtx.fillStyle = "rgba(0,0,0,0.8)";
            uCtx.fillRect(0, 0, uCanvas.width, uCanvas.height);
        },
        _renderStarter: function() {
            // 渲染游戏开始界面
            uCtx.fillStyle = "#00FF00";
            uCtx.font = '35px "Lucida Console", "Monaco", "Courier New", Courier, mono';
            uCtx.fillText("CAN YOU WIN THE GAME?", 28, 250);
            uCtx.fillStyle = "#ffffff";
            uCtx.font = "20px Verdana, Geneva, sans-serif";
            uCtx.fillText("I WANT TO TRY!", 180, 350);
        },
        _handleClick: function() {
            // 处理点击事件
            this.allowClick = false;
            this.allowKeyboard = true;
            player.reset();
            this._cls();
        }
    }
    // 这是我们的玩家要躲避的敌人
var Enemy = function() {
    // 要应用到每个敌人的实例的变量写在这里
    // 我们已经提供了一个来帮助你实现更多

    // 敌人的图片或者雪碧图，用一个我们提供的工具函数来轻松的加载文件
    this.sprite = 'images/enemy-bug.png';
};

// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
Enemy.prototype.update = function(dt) {
    // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
    // 都是以同样的速度运行的
    if (this.x > 6) {
        this.speed = Math.random() * 3 + 2;
        this.y = Math.floor(Math.random() * 3) + 0.7;
        this.x = Math.random() * -10;
    } else {
        this.x = this.x + BASIC_CONST.move_speed * this.speed * dt;
    }

    // 碰撞检测
    if (Math.abs(this.x - player.x) < 0.5 && Math.abs(this.y - player.y) < 0.2 ) {
        player.dead();
    }
};

// 此为游戏必须的函数，用来在屏幕上画出敌人，
Enemy.prototype.render = function() {
    eCtx.drawImage(Resources.get(this.sprite), this.x * 101, this.y * 83);
};

Enemy.prototype.reset = function() {
    // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
    // 都是以同样的速度运行的
    this.x = Math.random() * -5;
    this.y = Math.floor(Math.random() * 2) + 0.8;
    this.speed = Math.random() * 1 + 2;
};

// 现在实现你自己的玩家类
var Player = function(playerPic) {
    this.playerPic = playerPic;
}

Player.prototype.update = function(axis, num) {
    // 角色可移动范围、角色通过判断
    switch (axis) {
        case "x":
            if (0 <= this[axis] + num && this[axis] + num < 5) {
                this[axis] += num;
            }
            break;
        case "y":
            if (0 <= this[axis] + num && this[axis] + num < 5) {
                this[axis] += num;
            } else if (this[axis] + num < 0) {
                this.makeit();
            }
            break;
    }
}

// 角色渲染
Player.prototype.render = function() {  
    pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
    pCtx.drawImage(Resources.get(this.playerPic), this.x * 101, this.y * 83);
}

// 完全重置
Player.prototype.reset = function() {
        this.x = 2;
        this.y = 4.6;
    }
// 用户角色死亡
Player.prototype.dead = function() {
    this.x = 2;
    this.y = 4.6;
    console.log('you are died')
}
// 用户成功
Player.prototype.makeit = function() {
    console.log('you are win');
    this.x = 2;
    this.y = 4.6;
    ui.allowKeyboard = false;
    uCtx.fillStyle = "rgba(0,0,0,0.8)";
    uCtx.fillRect(0, 0, uCanvas.width, uCanvas.height);
    uCtx.fillStyle = "#00FF00";
    uCtx.font = '35px "Lucida Console", "Monaco", "Courier New", Courier, mono';
    uCtx.fillText("congratulations!!!", 70, 250);
    uCtx.fillStyle = "#ffffff";
    uCtx.font = "20px Verdana, Geneva, sans-serif";
    uCtx.fillText("YOU WIN!!!", 190, 350);
}
// 处理用户键盘输入
Player.prototype.handleInput = function(operation) {
    if (!ui.allowKeyboard) return;
    switch (operation) {
        case "left":
            this.update("x", -1);
            break;
        case "right":
            this.update("x", 1);
            break;
        case "up":
            this.update("y", -1);
            break;
        case "down":
            this.update("y", 1);
            break;
    }
}


// 现在实例化你的所有对象
// 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
var allEnemies = [];
for (var i = 0; i < 8; i++) {
    allEnemies.push(new Enemy());
}

// 把玩家对象放进一个叫 player 的变量里面
var player = new Player('images/char-cat-girl.png');


// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Play.handleInput()
// 方法里面。你不需要再更改这段代码了。
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
var Duck = MoveableEntity.extend({
   init: function(maxArea, level) {
       this._super({width: 50, height:50, x:Math.random() * maxArea.width, y:maxArea.height-50});
       this.speed = (Math.random() * level) + 1;
       this.maxArea = maxArea;
       this.targetCoords = {x: Math.random() * this.maxArea.width, y: Math.random() * this.maxArea.height};
       this.dead = false;
       this.turns = 0;
   },

   render: function(context) {
       if (this.dead) {

       } else {
        this.img = document.getElementById('duck_image');
        context.drawImage(this.img, this.x, this.y);
       }
   },

    update: function() {
        if (this.y < -50) {
            this.away = true;
            return;
        }
        var a = Math.atan2(this.targetCoords.y - this.y, this.targetCoords.x - this.x);
        var dy = Math.sin(a) * this.speed;
        var dx = Math.cos(a) * this.speed;
        this.x += dx;
        this.y += dy;

        if (Math.abs(this.targetCoords.x - this.x) <= this.speed && Math.abs(this.targetCoords.y - this.y) <= this.speed) {
            this.turns++;
            this.setTarget();
        }

    },

    setTarget: function() {
        if (this.turns > 2) {
            this.targetCoords = {x: Math.random() * this.maxArea.width, y: -100};
            this.speed = 10;
        } else {
            this.targetCoords = {x: Math.random() * this.maxArea.width, y: Math.random() * (this.maxArea.height - 100)};
        }
    },

    isHit: function(x, y) {
        var padding = 10;
        return !this.dead && (x > this.x - padding && (x < this.x + this.width + padding) && (y > this.y - padding) && (y < this.y + this.height + padding));
    },

    explode: function(context) {
        this.img = document.getElementById('duck_image');
        this.dead = true;
        if (context) {
            context.drawImage(this.img, this.x, this.y);
        }
    }
});

Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

var GameController = Class.extend({
    init: function(canvas_element) {
        this.canvas = canvas_element;
        this.context = this.canvas.getContext('2d');

        this.maxArea = {width: canvas_element.width, height: canvas_element.height};
        this.nextLevel = 1;
        this.totalKills = 0;
        this.startLevel();

        this.hitSound = "WilhelmScream_64kb.mp3";
        this.gunSound = "gun-gunshot-01.mp3";
        this.loseSound = new Audio("WilhelmScream_64kb.mp3");

        this.update();
        var self = this;
        this.canvas.onmousedown = function(event){
            //self.gunSound.play();
            new Audio(self.gunSound).play();
            self.ducks.forEach(function(duck, index) {
                    console.log(event);
                    if (duck.isHit(event.offsetX, event.offsetY)){
                        new Audio(self.hitSound).play();
                        self.ducks.remove(index)
                        self.kills++;
                        self.totalKills++;
                        //duck.explode();
                    }
                }
            )
        };

    },

    startLevel: function() {
        this.kills = 0;
        this.ducks = [];
        for (var i = 0; i < this.nextLevel; i++) {
            this.ducks.push(new Duck(this.maxArea, this.nextLevel));
        }

        this.nextLevel++;
    },

    // game world updates go here 
    update: function() {
        requestAnimationFrame(this.update.bind(this));
        this.render();

        var self = this;
        this.ducks.forEach(function(duck, index) {
            duck.update();
            if (duck.away) {
                self.ducks.remove(index);
            }
        });
        if (this.ducks.length == 0) {
            if (this.kills >= Math.max(this.nextLevel - 2, 1)) {
                if (this.nextLevel > 500) {
                    console.log('congrats game over');
                } else {
                    this.startLevel();
                }
            } else {
                this.setGameOver();
            }
        }
    },

    setGameOver: function() {
        this.isGameOver = true;
        document.getElementById('gameover').style.display = 'block';
        this.loseSound.play();
    },

    // rendering calls go here 
    render: function() {
        var context = this.context;

        if (this.isGameOver) {
            this.context.fillStyle = '#000000';
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.context.fillStyle = '#fff';
            this.context.font = "24px courier";
            this.context.fillText("Level " + (this.nextLevel - 1) + ', Kills: ' + this.totalKills, 10, 20 );
        } else {
            this.context.fillStyle = '#b0e7fa';
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ducks.forEach(function(duck) {
                duck.render(context);
            })
            this.context.fillStyle = '#000000';
            this.context.font = "24px courier";
            this.context.fillText("Level " + (this.nextLevel - 1) + ', Kills: ' + this.totalKills, 10, 20 );
            this.context.fillStyle = '#33CC33';
            this.context.fillRect(0,this.canvas.height-50,this.canvas.width,50);
            this.context.fillStyle = '#996633';
            this.context.fillRect(0,this.canvas.height-10,this.canvas.width,10);
        }
    }
});
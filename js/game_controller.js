var Duck = MoveableEntity.extend({
   init: function(maxArea) {
       this._super({width: 50, height:50, x:Math.random() * maxArea.width, y:maxArea.height});
       this.speed = 5;
       this.oldCoords = {x:5, y:5};
       this.maxArea = maxArea;
       this.targetCoords = {x: Math.random() * this.maxArea.width, y: Math.random() * this.maxArea.height};
   },

   render: function(context) {
       this.img = document.getElementById('duck_image');
       context.drawImage(this.img, this.x, this.y);
   },

    update: function() {
        var a = Math.atan2(this.targetCoords.y - this.y, this.targetCoords.x - this.x);
        var dy = Math.sin(a) * this.speed;
        var dx = Math.cos(a) * this.speed;
        this.x += dx;
        this.y += dy;
        if (Math.abs(this.targetCoords.x - this.x) <= this.speed && Math.abs(this.targetCoords.y - this.y) <= this.speed) {
            this.setTarget();
        }
    },

    setTarget: function() {
        this.targetCoords = {x: Math.random() * this.maxArea.width, y: Math.random() * this.maxArea.height};
    }

});

var GameController = Class.extend({
    init: function(canvas_element) {
        this.canvas = canvas_element;
        this.context = this.canvas.getContext('2d');

        var maxArea = {width: canvas_element.width, height: canvas_element.height};
        this.ducks = [new Duck(maxArea)];

        this.update();
    },

    // game world updates go here 
    update: function() {
        requestAnimationFrame(this.update.bind(this));
        this.render();

        this.ducks.forEach(function(duck) {
            duck.update();
        })
    },

    // rendering calls go here 
    render: function() {
        var context = this.context;
        this.context.fillStyle = '#eeeeff';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ducks.forEach(function(duck) {
            duck.render(context);
        })
    }
});
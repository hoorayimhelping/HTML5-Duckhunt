var MoveableEntity = Class.extend({
    init: function(coords) {
        this.x = coords.x;
        this.y = coords.y;
        this.width = coords.width;
        this.height = coords.height;
    },

    // override
    update: function() {},

    getCoords: function() {
        return {
            x: this.x, 
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
});
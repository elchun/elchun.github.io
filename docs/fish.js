var FishBoard = /** @class */ (function () {
    /**
     * Public constructor,
     *
     * @param front this card's front side, e.g. a vocabulary word
     * @param back this card's back side, e.g. its definition
     */
    function FishBoard() {
        this.board_border = 'black';
        this.board_background = "rgba(100, 100, 100, 0.2)";
        this.fishArr = [];
        this.click_timer = 0;
        this.show_fish = true;
        this.body_to_canvas = 1.10;
        this.fish_range_offset = 20;
        this.board = document.getElementById("board");
        this.board_ctx = this.board.getContext("2d");
        // const dimension = [document.documentElement.scrollHeight, document.documentElement.scrollWidth];
        // document.querySelector('body').clientHeight
        this.board.width = document.documentElement.scrollWidth * this.body_to_canvas;
        this.board.height = document.documentElement.scrollHeight;
        // this.board.style.left = '50%';
        // this.board.style.top = '0%';
        // Draw rectangel to cover canvas
        // this.board_ctx.fillStyle = this.board_background;
        // this.board_ctx.fillRect(0, 0, this.board.width, this.board.height)
        this.foodIm = new Image();
        this.foodIm.src = 'icecream.png';
        var fish_x_range = { low: -this.fish_range_offset, high: this.board.width + this.fish_range_offset };
        var fish_y_range = { low: -this.fish_range_offset, high: this.board.height + this.fish_range_offset };
        var n_fish = 20;
        for (var i = 0; i < n_fish; i++) {
            this.fishArr.push(new Fish(fish_x_range, fish_y_range));
        }
        this.draw_all_fish();
    }
    /**
     * Deprecated testing code.
     */
    FishBoard.prototype.log_status = function () {
        console.log('hello!');
        // console.log(this.board.width, this.board.height)
    };
    /**
     * Helper method to clear the board in preperation for next drawing.
     *
     * @returns true when task completes.
     */
    FishBoard.prototype.clear_board = function () {
        this.board_ctx.clearRect(0, 0, this.board.width, this.board.height);
        // Draw rectangel to cover canvas
        // this.board_ctx.fillStyle = this.board_background;
        // this.board_ctx.fillRect(0, 0, this.board.width, this.board.height);
        return true;
    };
    /**
     * Draw all fish in the fish array of the board.
     */
    FishBoard.prototype.draw_all_fish = function () {
        // const dimension = [document.documentElement.clientWidth, document.documentElement.clientHeight];
        // this.board.width = dimension[0];
        // this.board.height = dimension[1];
        this.clear_board();
        if (this.show_fish) {
            this.draw_click();
            for (var _i = 0, _a = this.fishArr; _i < _a.length; _i++) {
                var fish = _a[_i];
                var x_loc = randint(100, 700);
                var y_loc = randint(100, 700);
                this.draw_single_fish(fish, fish.location, fish.dx);
            }
        }
    };
    FishBoard.prototype.on_resize = function () {
        console.log('resizing');
        // Full height, including the scroll part
        this.board.width = document.documentElement.scrollWidth * this.body_to_canvas;
        this.board.height = document.documentElement.scrollHeight;
        var fish_x_range = { low: -this.fish_range_offset, high: this.board.width + this.fish_range_offset };
        var fish_y_range = { low: -this.fish_range_offset, high: this.board.height + this.fish_range_offset };
        for (var _i = 0, _a = this.fishArr; _i < _a.length; _i++) {
            var fish = _a[_i];
            fish.update_bounds(fish_x_range, fish_y_range);
        }
    };
    /**
     * Update position of all fish.
     */
    FishBoard.prototype.move_all_fish = function () {
        if (!this.show_fish) {
            return;
        }
        var click_timout = 400;
        // console.log(this.click_location);
        if (this.click_location) {
            this.click_timer++;
        }
        if (this.click_timer > click_timout) {
            this.click_timer = 0;
            this.click_location = null;
        }
        for (var _i = 0, _a = this.fishArr; _i < _a.length; _i++) {
            var fish = _a[_i];
            fish.moveFish();
        }
    };
    /**
     * Helper method to draw a single fish.
     *
     * @param fish Fish object to draw.
     * @param coord Location of fish.
     * @param dx X direction of movement (so we can see fish moving)
     */
    FishBoard.prototype.draw_single_fish = function (fish, coord, dx) {
        // Set the colour of the snake part
        this.board_ctx.fillStyle = fish.color;
        // Set the border colour of the snake part
        this.board_ctx.strokeStyle = fish.color;
        // Draw a "filled" rectangle to represent the snake part at the coordinates
        // the part is located
        this.board_ctx.font = fish.size + "px serif";
        if (dx > 0) {
            this.board_ctx.fillText("><>", coord.x, coord.y);
        }
        else {
            this.board_ctx.fillText("<><", coord.x, coord.y);
        }
    };
    FishBoard.prototype.draw_click = function () {
        if (this.click_location) {
            var target_width = this.foodIm.width / 4;
            var target_height = this.foodIm.height / 4;
            var x_offset = -target_width / 2;
            var y_offset = -target_height / 2;
            this.board_ctx.drawImage(this.foodIm, x_offset + this.click_location.x, y_offset + this.click_location.y, target_width, target_height);
            // this.board_ctx.fillText("🍦", this.click_location.x, this.click_location.y)
        }
    };
    FishBoard.prototype.move_to_click = function (event) {
        var xPos = event.clientX;
        var yPos = event.clientY;
        var click_coord = { x: xPos, y: yPos };
        this.click_location = click_coord;
        console.log(this.click_location);
        // console.log(click_coord);
        // console.log(this.fishArr);
        // // console.log(this.fishArr.length);
        // for (const fish of this.fishArr) {
        //     console.log(fish);
        //     // fish.go_to_coord(click_coord);
        // }
        // console.log(xPos, yPos);
    };
    FishBoard.prototype.set_click_location = function (click_location) {
        if (this.show_fish) {
            this.click_location = click_location;
            this.draw_click();
            this.click_timer = 0;
            for (var _i = 0, _a = this.fishArr; _i < _a.length; _i++) {
                var fish = _a[_i];
                fish.set_target(this.click_location);
            }
        }
    };
    FishBoard.prototype.change_show_fish = function () {
        this.show_fish = !this.show_fish;
    };
    return FishBoard;
}());
var Fish = /** @class */ (function () {
    function Fish(x_bounds, y_bounds) {
        this.got_target = true;
        this.x_bounds = x_bounds;
        this.y_bounds = y_bounds;
        this.initFish();
        this.location = { x: randint(this.x_bounds.low, this.x_bounds.high),
            y: randint(this.y_bounds.low, this.y_bounds.high) };
        this.chooseDir(0.5);
        // this.dx = 1;
        // this.dy = -0.1;
    }
    Fish.prototype.initFish = function () {
        var fish_r = Math.floor(Math.random() * 255);
        var fish_g = Math.floor(Math.random() * 255);
        var fish_b = Math.floor(Math.random() * 255);
        this.size = String(Math.floor(Math.random() * 100));
        this.color = 'rgb(' + String(fish_r) + ',' + String(fish_g) + ',' + String(fish_b) + ')';
    };
    Fish.prototype.chooseDir = function (dir_change_thresh) {
        var current_direction = this.dx > 0 ? 1 : -1;
        this.dx = randfloat(0, 2) * current_direction;
        if (Math.random() < dir_change_thresh) {
            this.dx *= -1;
        }
        var y_dir = Math.random() < 0.5 ? -1 : 1;
        this.dy = (this.dx * Math.random() / 2) * y_dir;
    };
    Fish.prototype.moveFish = function () {
        var thresh = 0.01;
        var regen_thresh = 0.1;
        var move_thresh = 0.5;
        var dir_change_thresh = 0.1;
        var got_target_thresh = 0.01;
        this.location = { x: this.location.x + this.dx, y: this.location.y + this.dy };
        // if (Math.random() < move_thresh) {
        // }
        if (this.getInBounds()) {
            console.log("out");
            this.initFish();
            // if (Math.random() < regen_thresh) {
            //     this.initFish();
            // }
        }
        if (this.target && !this.got_target) {
            var dx_ratio = (this.target.x - this.location.x) / (this.x_bounds.high - this.x_bounds.low);
            var dy_ratio = (this.target.y - this.location.y) / (this.y_bounds.high - this.y_bounds.low);
            this.dx = 2 * dx_ratio;
            this.dy = 2 * dy_ratio;
            var ratio_thresh = 0.1;
            if (Math.abs(dy_ratio) < ratio_thresh && Math.abs(dx_ratio) < ratio_thresh) {
                this.got_target = true;
                console.log('Got target');
            }
        }
        if (Math.random() < thresh) {
            // this.dx = randfloat(-1, 1);
            this.chooseDir(dir_change_thresh);
        }
        if (!this.got_target && Math.random() < got_target_thresh) {
            this.got_target = true;
            console.log('Got target');
        }
        // console.log(this.location);
    };
    Fish.prototype.getInBounds = function () {
        var was_out = false;
        if (this.location.x < this.x_bounds.low) {
            this.dx = Math.abs(this.dx);
            was_out = true;
        }
        if (this.location.y < this.y_bounds.low) {
            this.dy = Math.abs(this.dy);
            was_out = true;
        }
        if (this.location.x > this.x_bounds.high) {
            this.dx = -Math.abs(this.dx);
            was_out = true;
        }
        if (this.location.y > this.y_bounds.high) {
            this.dy = -Math.abs(this.dy);
            was_out = true;
        }
        return was_out;
    };
    Fish.prototype.update_bounds = function (x_bounds, y_bounds) {
        this.x_bounds = x_bounds;
        this.y_bounds = y_bounds;
    };
    Fish.prototype.set_target = function (target) {
        this.target = target;
        this.got_target = false;
    };
    // public go_to_coord(coord: {x: number, y: number}) {
    //     const dx_ratio = (coord.x - this.location.x) / (this.x_bounds.high - this.x_bounds.low);
    //     const dy_ratio = (coord.y - this.location.y) / (this.y_bounds.high - this.y_bounds.low);
    //     this.dx = 2 * dx_ratio;
    //     this.dy = 2 * dy_ratio;
    // }
    Fish.prototype.set_got_target = function () {
        this.got_target = true;
    };
    return Fish;
}());
function randint(low, high) {
    return Math.floor(low + Math.random() * (high - low));
}
function randfloat(low, high) {
    return (low + Math.random() * (high - low));
}
var board = new FishBoard();
function main() {
    setTimeout(function onTick() {
        // board.log_status();
        board.move_all_fish();
        board.draw_all_fish();
        // board.draw_all_fish();
        main();
    }, 10);
}
document.addEventListener("click", function (e) {
    console.log(e.target.id);
    if (e.target.id === 'fish_on') {
        return;
    }
    console.log('hi');
    var xPos = e.clientX;
    var yPos = e.clientY;
    var coord = { x: xPos, y: yPos };
    board.set_click_location(coord);
});
var button = document.getElementById('fish_on');
button.addEventListener('click', function (e) {
    var off_text = "Turn fish on!";
    var on_text = "Turn fish off!";
    if (button.innerHTML === off_text) {
        button.innerHTML = on_text;
        button.style.backgroundColor = 'red';
    }
    else {
        button.innerHTML = off_text;
        button.style.backgroundColor = 'green';
    }
    board.change_show_fish();
});
window.addEventListener('resize', function (e) {
    board.on_resize();
}, false);
main();
//# sourceMappingURL=fish.js.map
class FishBoard {

    private readonly board: HTMLCanvasElement;
    private readonly board_ctx: CanvasRenderingContext2D;

    private readonly board_border = 'black';
    private readonly board_background = "rgba(100, 100, 100, 0.2)";

    private fishArr: Array<Fish> = [];

    private click_location: {x: number, y: number};
    private click_timer: number = 0;

    private readonly foodIm: HTMLImageElement;

    private show_fish: boolean = true;

    /**
     * Public constructor,
     *
     * @param front this card's front side, e.g. a vocabulary word
     * @param back this card's back side, e.g. its definition
     */
    public constructor() {


        this.board = document.getElementById("board") as HTMLCanvasElement;
        this.board_ctx = this.board.getContext("2d");

        const dimension = [document.documentElement.clientWidth, document.documentElement.clientHeight];
        this.board.width = dimension[0];
        this.board.height = dimension[1];

        // Draw rectangel to cover canvas
        // this.board_ctx.fillStyle = this.board_background;
        // this.board_ctx.fillRect(0, 0, this.board.width, this.board.height)

        this.foodIm = new Image();
        this.foodIm.src = 'icecream.png';

        const fish_x_range = {low: -20, high: this.board.width + 20}
        const fish_y_range = {low: -20, high: this.board.height + 20}

        const n_fish = 20;
        for (let i=0; i<n_fish; i++) {
            this.fishArr.push(new Fish(fish_x_range, fish_y_range));
        }

        this.draw_all_fish();
    }

    /**
     * Deprecated testing code.
     */
    public log_status() {
        console.log('hello!');
        // console.log(this.board.width, this.board.height)
    }

    /**
     * Helper method to clear the board in preperation for next drawing.
     *
     * @returns true when task completes.
     */
    private clear_board(): boolean{
        this.board_ctx.clearRect(0, 0, this.board.width, this.board.height);
        // Draw rectangel to cover canvas
        // this.board_ctx.fillStyle = this.board_background;
        // this.board_ctx.fillRect(0, 0, this.board.width, this.board.height);

        return true;
    }

    /**
     * Draw all fish in the fish array of the board.
     */
    public draw_all_fish() {
        this.clear_board();
        if (this.show_fish) {
            this.draw_click();

            for (const fish of this.fishArr) {
                const x_loc = randint(100, 700);
                const y_loc = randint(100, 700);

                this.draw_single_fish(fish, fish.location, fish.dx)
            }
        }
    }

    /**
     * Update position of all fish.
     */
    public move_all_fish() {
        const click_timout = 400;

        // console.log(this.click_location);
        if (this.click_location) {
            this.click_timer++;
        }

        if (this.click_timer > click_timout) {
            this.click_timer = 0;
            this.click_location = null;
        }

        for (const fish of this.fishArr) {
            fish.moveFish();
        }
    }


    /**
     * Helper method to draw a single fish.
     *
     * @param fish Fish object to draw.
     * @param coord Location of fish.
     * @param dx X direction of movement (so we can see fish moving)
     */
    public draw_single_fish(fish: Fish, coord, dx) {
        // Set the colour of the snake part
        this.board_ctx.fillStyle = fish.color;
        // Set the border colour of the snake part
        this.board_ctx.strokeStyle = fish.color;
        // Draw a "filled" rectangle to represent the snake part at the coordinates
        // the part is located

        this.board_ctx.font = fish.size + "px serif";
        if (dx > 0) {
            this.board_ctx.fillText("><>", coord.x, coord.y);
        } else {
            this.board_ctx.fillText("<><", coord.x, coord.y);
        }
    }

    public draw_click() {
        if (this.click_location) {
            const target_width = this.foodIm.width / 4;
            const target_height = this.foodIm.height/ 4;
            const x_offset = -target_width / 2;
            const y_offset = -target_height / 2;
            this.board_ctx.drawImage(this.foodIm, x_offset + this.click_location.x,
                y_offset + this.click_location.y,
                target_width, target_height);
            // this.board_ctx.fillText("🍦", this.click_location.x, this.click_location.y)
        }
    }

    public move_to_click(event) {
        const xPos= event.clientX;
        const yPos= event.clientY;
        const click_coord = {x: xPos, y: yPos};
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
    }

    public set_click_location(click_location: {x: number, y: number}) {
        if (this.show_fish) {
            this.click_location = click_location;
            this.draw_click();
            this.click_timer = 0;
            for (const fish of this.fishArr) {
                fish.set_target(this.click_location);
            }
        }
    }

    public change_show_fish() {
        this.show_fish = !this.show_fish;
    }
}

class Fish {
    public color: string;
    public size: string;

    public location: {x: number, y: number};
    public dx: number;
    public dy: number;

    private x_bounds: {low: number, high: number};
    private y_bounds: {low: number, high: number};

    private target: {x: number, y: number};
    private got_target: boolean = true;


    public constructor(x_bounds: {low: number, high: number}, y_bounds: {low: number, high:number}) {
        this.x_bounds = x_bounds;
        this.y_bounds = y_bounds

        this.initFish();

        this.location = {x: randint(this.x_bounds.low, this.x_bounds.high),
            y: randint(this.y_bounds.low, this.y_bounds.high)}


        this.chooseDir(0.5);
        // this.dx = 1;
        // this.dy = -0.1;
    }

    private initFish() {
        const fish_r = Math.floor(Math.random() * 255);
        const fish_g = Math.floor(Math.random() * 255);
        const fish_b = Math.floor(Math.random() * 255);

        this.size = String(Math.floor(Math.random() * 100));

        this.color= 'rgb(' + String(fish_r) + ',' + String(fish_g) + ',' + String(fish_b) + ')';
    }

    private chooseDir(dir_change_thresh) {
        const current_direction = this.dx > 0 ? 1 : -1;
        this.dx = randfloat(0, 2) * current_direction;
        if (Math.random() < dir_change_thresh) {
            this.dx *= -1;
        }
        const y_dir = Math.random() < 0.5 ? -1 : 1;
        this.dy = (this.dx * Math.random() / 2) * y_dir;
    }

    public moveFish() {
        const thresh = 0.01;
        const regen_thresh = 0.1;
        const move_thresh = 0.5;
        const dir_change_thresh = 0.1;
        const got_target_thresh = 0.01;

        this.location = {x: this.location.x + this.dx, y: this.location.y + this.dy};
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
            const dx_ratio = (this.target.x - this.location.x) / (this.x_bounds.high - this.x_bounds.low);
            const dy_ratio = (this.target.y - this.location.y) / (this.y_bounds.high - this.y_bounds.low);

            this.dx = 2 * dx_ratio;
            this.dy = 2 * dy_ratio;

            const ratio_thresh = 0.1
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
    }


    public getInBounds() : boolean {
        let was_out = false;
        if (this.location.x < this.x_bounds.low) {
            this.dx = Math.abs(this.dx);
            was_out = true;
        }
        if (this.location.y < this.y_bounds.low) {
            this.dy = Math.abs(this.dy);
            was_out = true;
        }
        if (this.location.x > this.x_bounds.high) {
            this.dx = - Math.abs(this.dx);
            was_out = true;
        }
        if (this.location.y > this.y_bounds.high) {
            this.dy = - Math.abs(this.dy);
            was_out = true;

        }
        return was_out;
    }

    public set_target(target: {x: number, y: number}) {
        this.target = target;
        this.got_target = false;
    }
    // public go_to_coord(coord: {x: number, y: number}) {
    //     const dx_ratio = (coord.x - this.location.x) / (this.x_bounds.high - this.x_bounds.low);
    //     const dy_ratio = (coord.y - this.location.y) / (this.y_bounds.high - this.y_bounds.low);

    //     this.dx = 2 * dx_ratio;
    //     this.dy = 2 * dy_ratio;
    // }

    public set_got_target() {
        this.got_target = true;
    }

}

function randint(low: number, high: number) {
    return Math.floor(low + Math.random() * (high - low));
}

function randfloat(low: number, high: number) {
    return (low + Math.random() * (high - low));
}

const board = new FishBoard();

function main() {
    setTimeout(function onTick() {
        // board.log_status();
        board.move_all_fish();
        board.draw_all_fish();
        // board.draw_all_fish();
        main();
    }, 10)
}

document.addEventListener("click", function(e) {


    console.log((e.target as Element).id );
    if ((e.target as Element).id === 'fish_on') {
        return
    }

    console.log('hi');
    const xPos = e.clientX;
    const yPos = e.clientY;

    const coord = {x: xPos, y: yPos};
    board.set_click_location(coord)
});

const button = document.getElementById('fish_on')
button.addEventListener('click', function(e) {
    const off_text = "Turn fish on!";
    const on_text = "Turn fish off!";
    if (button.innerHTML === off_text) {
        button.innerHTML = on_text;
    }  else {
        button.innerHTML = off_text;
    }
    board.change_show_fish();
})


main();
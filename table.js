import { tiny, defs } from "./examples/common.js";

const {
    Vector,
    Vector3,
    vec,
    vec3,
    vec4,
    color,
    hex_color,
    Shader,
    Matrix,
    Mat4,
    Light,
    Shape,
    Material,
    Scene,
    Texture,
} = tiny;
const { Cube, Axis_Arrows, Textured_Phong } = defs;
function assert(condition, message) {
    if (!condition) {
        throw message;
    }
}

export class Table extends Scene {
    constructor() {
        super();
        this.TABLE_WIDTH = 10;
        this.TABLE_LENGTH = 15;
        this.BACKBOARD_HEIGHT = 20;
        this.cube = new defs.Cube();
        this.cube2 = new defs.Cube();
        this.cube3 = new defs.Cube();
        (this.cylinder = new defs.Cylindrical_Tube(1, 10, [
            [0, 2],
            [0, 1],
        ])),
            this.cube3.arrays.texture_coord.forEach((v, i, l) => (l[i] = vec(v[0], 0.3 * v[1])));
        this.cube2.arrays.texture_coord.forEach((v, i, l) => (l[i] = vec(3 * v[0], 2 * v[1])));

        this.materials = {
            table: new Material(new defs.Textured_Phong(), {
                ambient: 0.6,
                specularity: 1,
                color: hex_color("#000000"),
                texture: new Texture("assets/texturep2.jpg"),
            }),
            backboard: new Material(new defs.Textured_Phong(), {
                ambient: 0.5,
                specularity: 0.5,
                color: hex_color("#0088ff"),
                texture: new Texture("assets/brick.jpg"),
            }),
            leg: new Material(new defs.Phong_Shader(), {
                ambient: 0.4,
                specularity: 0.5,
                color: hex_color("#e5e5e5"),
                smoothness: 1,
            }),
            net: new Material(new defs.Textured_Phong(), {
                ambient: 0.5,
                specularity: 1,
                diffusivity: 1,
                color: hex_color("#ffffff"),
                texture: new Texture("assets/netstransparent.png"),
            }),
            net2: new Material(new defs.Textured_Phong(), {
                ambient: 0.5,
                specularity: 1,
                diffusivity: 1,
                color: hex_color("#FF0000"),
                texture: new Texture("assets/netstransparent.png"),
            }),
        };

        this.positions = {
            table: {
                x: 0,
                y: -5,
                z: -17,
            },
            backboard: {
                x: 0,
                y: -5 + 1.5,
                z: -20.2 - this.TABLE_LENGTH / 2, //magic. figure this out.
            },
        };

        this.bounds = {
            table: {
                LEFT: -this.TABLE_WIDTH / 2 + this.positions.table.x,
                RIGHT: this.TABLE_WIDTH / 2 + this.positions.table.x,
                UP: this.TABLE_LENGTH / 2 + this.positions.table.z,
                DOWN: -this.TABLE_LENGTH / 2 + this.positions.table.z,
                FRONT: this.positions.table.y,
            },
            backboard: {
                LEFT: -this.TABLE_WIDTH / 2 + this.positions.table.x,
                RIGHT: this.TABLE_WIDTH / 2 + this.positions.table.x,
                UP: this.BACKBOARD_HEIGHT + this.positions.backboard.y,
                DOWN: this.positions.backboard.y,
                FRONT: this.positions.backboard.z,
            },
        };

        this.t = undefined;
        this.dt = 0;
    }

    log() {
        //console.log(this.position.x);
    }

    draw(context, program_state, model_transform) {
        const t = program_state.animation_time / 1000;

        // Set the initial time
        if (this.t == undefined) {
            this.t = t;
        }

        //model_transform = Mat4.identity();
        let table_transform = model_transform
            .times(Mat4.translation(this.positions.table.x, this.positions.table.y, this.positions.table.z))
            .times(Mat4.scale(this.TABLE_WIDTH, 0.5, this.TABLE_LENGTH));
        this.cube.draw(context, program_state, table_transform, this.materials.table);

        let backboard_transform = model_transform
            .times(
                Mat4.translation(this.positions.backboard.x, this.positions.backboard.y, this.positions.backboard.z - 5)
            )
            .times(Mat4.scale(this.TABLE_WIDTH, 5, 0.3));
        this.cube2.draw(context, program_state, backboard_transform, this.materials.backboard);

        this.t = t;

        let left_leg = model_transform
            .times(Mat4.translation(-9, this.positions.table.y - 5, -2.5))
            .times(Mat4.rotation(1.57, 1, 0, 0))
            .times(Mat4.scale(0.4, 0.4, 10));
        this.cylinder.draw(context, program_state, left_leg, this.materials.leg);
        let right_leg = model_transform
            .times(Mat4.translation(9, this.positions.table.y - 5, -2.5))
            .times(Mat4.rotation(1.57, 1, 0, 0))
            .times(Mat4.scale(0.4, 0.4, 10));
        this.cylinder.draw(context, program_state, right_leg, this.materials.leg);
        let right_back_leg = model_transform
            .times(Mat4.translation(9, this.positions.table.y - 5, -30.5))
            .times(Mat4.rotation(1.57, 1, 0, 0))
            .times(Mat4.scale(0.4, 0.4, 10));
        this.cylinder.draw(context, program_state, right_back_leg, this.materials.leg);
        let left_back_leg = model_transform
            .times(Mat4.translation(-9, this.positions.table.y - 5, -30.5))
            .times(Mat4.rotation(1.57, 1, 0, 0))
            .times(Mat4.scale(0.4, 0.4, 10));
        this.cylinder.draw(context, program_state, left_back_leg, this.materials.leg);

        
        let net = model_transform.times(Mat4.translation(0, -4, -17)).times(Mat4.scale(10, 1, 0.1));
        this.cube3.draw(context, program_state, net, this.materials.net);

        let net2 = model_transform.times(Mat4.translation(-10, -2.5, -17))
                                    .times(Mat4.rotation(1.57,0,1,0))
                                    .times(Mat4.scale(15, 2, 0.05));
        this.cube3.draw(context,program_state,net2,this.materials.net);

        let net3 = model_transform.times(Mat4.translation(10, -2.5, -17))
                                    .times(Mat4.rotation(1.57,0,1,0))
                                    .times(Mat4.scale(15, 2, 0.05));
        this.cube3.draw(context,program_state,net3,this.materials.net);


    }
}

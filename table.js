import { tiny, defs } from "./examples/common.js";

const { Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene } =
    tiny;

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
        this.BACKBOARD_HEIGHT = 2;
        this.cube = new defs.Cube();
        this.cube2 = new defs.Cube();
        this.materials = 
        {   
            table: new Material(new defs.Phong_Shader(), {
                ambient: 0.5,
                specularity: 0.5,
                color: hex_color("#1af002"),
            }),
            backboard: new Material(new defs.Phong_Shader(), {
                ambient: 0.5,
                specularity: 0.5,
                color: hex_color("#0088ff"),
            }),
        };

        this.positions = {
            table: {
                x: 0,
                y: -5,
                z: -17
            },
            backboard: {
                x: 0,
                y: -5 + 1.5,
                z: -20.2 - this.TABLE_LENGTH/2, //magic. figure this out.
            }
        };

        this.bounds = {
            table: {
                LEFT: -this.TABLE_WIDTH/2 + this.positions.table.x,
                RIGHT: this.TABLE_WIDTH/2 + this.positions.table.x,
                UP: this.TABLE_LENGTH/2 + this.positions.table.z,
                DOWN: -this.TABLE_LENGTH/2 + this.positions.table.z,
                FRONT: this.positions.table.y,
            },
            backboard: {
                LEFT: -this.TABLE_WIDTH/2 + this.positions.table.x,
                RIGHT: this.TABLE_WIDTH/2 + this.positions.table.x,
                UP: this.BACKBOARD_HEIGHT + this.positions.backboard.y,
                DOWN: this.positions.backboard.y,
                FRONT: this.positions.backboard.z, 
            }
        }


        this.t = undefined;
        this.dt = 0;
    }

    log() {
        console.log(this.position.x);
    }

    draw(context, program_state, model_transform) {
        const t = program_state.animation_time / 1000;

        // Set the initial time
        if (this.t == undefined) {
            this.t = t;
        }

        //model_transform = Mat4.identity();
        let table_transform = model_transform.times(Mat4.translation(this.positions.table.x, this.positions.table.y, this.positions.table.z))
                                             .times(Mat4.scale(this.TABLE_WIDTH, 0.5, this.TABLE_LENGTH));
        this.cube.draw(context, program_state, table_transform, this.materials.table);
        let backboard_transform = model_transform.times(Mat4.translation(this.positions.backboard.x, this.positions.backboard.y, this.positions.backboard.z))
                                                 .times(Mat4.scale(this.TABLE_WIDTH, 2, 0.3));
        this.cube.draw(context, program_state, backboard_transform, this.materials.backboard);
        this.t = t;
    }
}
import { tiny, defs } from "./examples/common.js";

const { Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene } =
    tiny;

function assert(condition, message) {
    if (!condition) {
        throw message;
    }
}

export class Paddle extends Scene {
    constructor() {
        super();

        this.cylinder = new defs.Capped_Cylinder(20, 20);
        this.materials = 
        {   
            paddle_top: new Material(new defs.Phong_Shader(), {
                ambient: 0.5,
                specularity: 0.5,
                color: hex_color("#fc0303"),
            }),
            paddle_stick: new Material(new defs.Phong_Shader(), {
                ambient: 0.5,
                specularity: 0.5,
                color: hex_color("#f2e8b3"),
            }),
        };

        this.acceleration = {
            x: 0,
            y: 0,
            z: -9.8,
        };

        this.velocity = {
            x: 1,
            y: 1,
            z: -1,
        };

        this.position = {
            x: 0,
            y: 0,
            z: 0,
        };

        this.t = undefined;
        this.dt = 0;
    }

    move(x, y, z) {
        this.position.x += x;
        this.position.y += y;
        this.position.z += z;
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

        this.dt = t - this.t;
        assert(this.dt >= 0, { m: "ball: dt has become negative" });

        //this.move(this.dt);
        
        let paddle_transform = model_transform.times(Mat4.translation(this.position.x, this.position.y, this.position.z))
                                        .times(Mat4.scale(1, 1, 0.3));
        this.cylinder.draw(context, program_state, paddle_transform, this.materials.paddle_top);
        let stick_transform = paddle_transform.times(Mat4.rotation(Math.PI/180*90, 1, 0.7, 0))
                            .times(Mat4.translation(0, 0, 1))
                            .times(Mat4.scale(0.2, 0.3, 1.5));
        this.cylinder.draw(context, program_state, stick_transform, this.materials.paddle_stick);
        //model_transform = model_transform.times(Mat4.translation(-this.position.x, -this.position.y, -this.position.z));

        this.log();
        this.t = t;
    }
}
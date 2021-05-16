import { tiny, defs } from "./examples/common.js";

const { Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene } =
    tiny;

function assert(condition, message) {
    if (!condition) {
        throw message;
    }
}

export class Ball extends Scene {
    constructor() {
        super();

        this.sphere = new defs.Subdivision_Sphere(6);
        this.material = new Material(new defs.Phong_Shader(), {
            ambient: 0.5,
            specularity: 0.5,
            color: color(1, 0.52, 0, 1),
        });

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

    move(dt) {
        // Δd = vΔt
        this.position.x += this.velocity.x * dt;
        this.position.y += this.velocity.y * dt;
        this.position.z += this.velocity.z * dt;
    }

    log() {
        console.log("a ball is here");
    }

    draw(context, program_state, model_transform) {
        const t = program_state.animation_time / 1000;

        // Set the initial time
        if (this.t == undefined) {
            this.t = t;
        }

        this.dt = t - this.t;
        assert(this.dt >= 0, { m: "ball: dt has become negative" });

        this.move(this.dt);

        model_transform = model_transform.times(Mat4.translation(this.position.x, this.position.y, this.position.z));
        this.sphere.draw(context, program_state, model_transform, this.material);
        model_transform = model_transform.times(Mat4.translation(-this.position.x, -this.position.y, -this.position.z));


        this.t = t;
    }
}

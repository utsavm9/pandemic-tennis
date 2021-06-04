import { tiny, defs } from "./examples/common.js";

const { Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene } =
    tiny;

function assert(condition, message) {
    if (!condition) {
        throw message;
    }
}

export class Ball extends Scene {
    constructor(paddleBounds) {
        super();

        this.sphere = new defs.Subdivision_Sphere(6);
        this.material = new Material(new defs.Phong_Shader(), {
            ambient: 0.9,
            specularity: 0.5,
            color: color(1, 0.52, 0, 1),
        });

        // Ball related constants
        this.scale = 0.3;

        this.table = -4.25; // z-axis
        this.wall = 32; // y-axis
        this.player = 0.5; // y-axis
        this.left = -10; // x-axis
        this.right = 10; // x-axis

        this.time = 1; // seconds for the ball to hit the wall

        this.acceleration = {
            x: 0,
            y: 0,
            z: -9.8,
        };

        this.velocity = {
            x: 3,
            y: 10,
            z: 0,
        };

        this.position = {
            x: 0,
            y: 0,
            z: 0,
        };

        this.t = undefined;
        this.dt = 0;
    }

    getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }

    move(dt) {
        // Δv = aΔt
        this.velocity.x += this.acceleration.x * dt;
        this.velocity.y += this.acceleration.y * dt;
        this.velocity.z += this.acceleration.z * dt;

        // Δd = vΔt
        this.position.x += this.velocity.x * dt;
        this.position.y += this.velocity.y * dt;
        this.position.z += this.velocity.z * dt;
    }

    playerHits() {
        const wallPoint = this.getRandom(this.left, this.right);
        const yDist = this.wall - this.position.y;
        this.velocity.x = (wallPoint - this.position.x) / this.time;
        this.velocity.y = yDist / this.time;
    }

    bounce() {
        if (this.position.z < this.table && this.velocity.z < 0) {
            this.velocity.z *= -1;
        }
        if (this.position.y > this.wall && this.velocity.y > 0) {
            this.velocity.y *= -1;
        }
        if (this.position.y < this.player && this.velocity.y < 0) {
            this.playerHits();
        }
        if (this.position.x < this.left && this.velocity.x < 0) {
            this.velocity.x *= -1;
        }
        if (this.position.x > this.right && this.velocity.x > 0) {
            this.velocity.x *= -1;
        }
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
        this.bounce();

        model_transform = model_transform
            .times(Mat4.translation(this.position.x, this.position.y, this.position.z))
            .times(Mat4.scale(this.scale, this.scale, this.scale));
        this.sphere.draw(context, program_state, model_transform, this.material);
        model_transform = model_transform
            .times(Mat4.scale(1 / this.scale, 1 / this.scale, 1 / this.scale))
            .times(Mat4.translation(-this.position.x, -this.position.y, -this.position.z));

        this.t = t;
    }
}

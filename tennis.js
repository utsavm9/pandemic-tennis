import { defs, tiny } from "./examples/common.js";
import { Paddle } from "./paddle.js";

const { Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene } =
    tiny;

export class Tennis extends Scene {
    constructor() {
        // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
        super();

        // At the beginning of our program, load one of each of these shape definitions onto the GPU.
        this.shapes = {
            sphere: new defs.Subdivision_Sphere(4),
        };

        this.paddle = new Paddle();

        // *** Materials
        this.materials = {
            sphere: new Material(new defs.Phong_Shader(), {
                ambient: 1,
                diffusivity: 0,
                specularity: 0,
                color: color(1, 1, 1, 1),
            }),
        };

        this.initial_camera_location = Mat4.look_at(vec3(0, 10, 20), vec3(0, 0, 0), vec3(0, 1, 0));
    }

    make_control_panel() {
        // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
        this.key_triggered_button("Up", ["w"], () => (this.paddle.move(0,0.5,0)));
        //this.new_line();
        this.key_triggered_button("Left", ["a"], () => (this.paddle.move(-0.5, 0, 0)));
        this.key_triggered_button("Down", ["s"], () => (this.paddle.move(0,-0.5,0)));
        this.key_triggered_button("Right", ["d"], () => (this.paddle.move(0.5, 0, 0)));
    }

    display(context, program_state) {
        // display():  Called once per frame of animation.
        // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:
        if (!context.scratchpad.controls) {
            let movement_controls = new defs.Movement_Controls();
            movement_controls.add_mouse_controls(context.canvas, this.paddle);
            movement_controls.mouse_enabled_canvases.add(context.canvas);
            this.children.push((context.scratchpad.controls = movement_controls));
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(this.initial_camera_location);
        }

        program_state.projection_transform = Mat4.perspective(Math.PI / 4, context.width / context.height, 0.1, 1000);

        // Transform matrix
        let model_transform = Mat4.identity();

        let stick_transform = Mat4.identity();

        // Lighting
        const light_position = vec4(5, 0, 0, 1);
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 10)];

        this.paddle.draw(context, program_state, model_transform);
    }
}
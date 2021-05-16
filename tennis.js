import { defs, tiny } from "./examples/common.js";
import { Ball } from "./ball.js";

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

        this.ball = new Ball();
        this.ball.log();

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
        this.key_triggered_button("View solar system", ["Control", "0"], () => (this.attached = () => "init"));
        this.new_line();
        this.key_triggered_button("Attach to planet 1", ["Control", "1"], () => (this.attached = () => this.planet_1));
    }

    display(context, program_state) {
        // display():  Called once per frame of animation.
        // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:
        if (!context.scratchpad.controls) {
            this.children.push((context.scratchpad.controls = new defs.Movement_Controls()));
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(this.initial_camera_location);
        }

        program_state.projection_transform = Mat4.perspective(Math.PI / 4, context.width / context.height, 0.1, 1000);

        // Transform matrix
        let model_transform = Mat4.identity();

        // Lighting
        const light_position = vec4(5, 0, 0, 1);
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 100)];

        this.shapes.sphere.draw(context, program_state, model_transform, this.materials.sphere);

        this.ball.draw(context, program_state, model_transform);
    }
}

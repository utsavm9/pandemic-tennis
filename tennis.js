import { defs, tiny } from "./examples/common.js";
import { Ball } from "./ball.js";
import { Background } from "./background.js";
import { Paddle } from "./paddle.js";
import { Axes_Viewer } from "./examples/axes-viewer.js";
import { Table } from "./table.js";
import { Text_Box } from "./text_line.js";

const { Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene } =
    tiny;
var i = 0;
var start = 1;
var score_num=0;
export class Tennis extends Scene {
    constructor() {
        // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
        super();

        this.background = new Background();
        this.texts = new Text_Box();

        // At the beginning of our program, load one of each of these shape definitions onto the GPU.
        this.shapes = {
            sphere: new defs.Subdivision_Sphere(4),
        };

        this.axis = new Axes_Viewer();
        this.paddle = new Paddle();
        this.table = new Table();
        // *** Materials
        this.materials = {
            sphere: new Material(new defs.Phong_Shader(), {
                ambient: 1,
                diffusivity: 0,
                specularity: 0,
                color: color(1, 1, 1, 1),
            }),
        };

        this.ball = new Ball(this.paddle.bounds);
        this.ball.log();

        this.initial_camera_location = Mat4.look_at(vec3(0, 10, 20), vec3(0, 0, 0), vec3(0, 1, 0));
    }

    make_control_panel() {
        // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
        //this.key_triggered_button("Up", ["w"], () => (this.paddle.move(0,0.5,0)));
        //this.new_line();
        //this.key_triggered_button("Left", ["a"], () => (this.paddle.move(-0.5, 0, 0)));
        //this.key_triggered_button("Down", ["s"], () => (this.paddle.move(0,-0.5,0)));
        //this.key_triggered_button("Right", ["d"], () => (this.paddle.move(0.5, 0, 0)));
    }
     game_over(){
        start=0;
    }
    increase_score()
    {
        score_num=score_num+1;
    }

   
    display(context, program_state) {
        // display():  Called once per frame of animation.
        // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:
        const t = program_state.animation_time / 1000,
            dt = program_state.animation_delta_time / 1000;
        if (!context.scratchpad.controls) {
            let movement_controls = new defs.Movement_Controls();
            movement_controls.add_mouse_controls(context.canvas, this);
            //movement_controls.add_mouse_controls(context.canvas, this.background);
            movement_controls.mouse_enabled_canvases.add(context.canvas);
            this.children.push((context.scratchpad.controls = movement_controls));
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(this.initial_camera_location);
            let camerap = Mat4.translation(0, 0, -40);
            camerap = camerap.times(Mat4.rotation(0.1, -1, 0, 0));
            //program_state.set_camera(camerap);
        }

        program_state.projection_transform = Mat4.perspective(Math.PI / 4, context.width / context.height, 0.1, 1000);

        // Transform matrix
        let model_transform = Mat4.identity();
        let stick_transform = Mat4.identity();

        // Lighting
        const light_position = vec4(5, 0, 0, 10);
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 10)];

        if (this.swarm != 1) {
            if (start == 1) {
                this.background.displays(context, program_state, 1);
                this.texts.display(context, program_state, 1,score_num);
            } 
        }

        if (this.swarm == 1) {
            if(start ==1)
            {
            this.background.displays(context, program_state, 2);

            this.paddle.draw(context, program_state, model_transform);
            program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 100)];

            // Make z-upwards
            model_transform = model_transform.times(Mat4.rotation(-Math.PI / 2, 1, 0, 0));
            this.axis.insert(model_transform.copy());
            this.axis.display(context, program_state);
            this.ball.draw(context, program_state, model_transform);
            model_transform = model_transform.times(Mat4.rotation(Math.PI / 2, 1, 0, 0));
            // Revert z

            this.table.draw(context, program_state, model_transform);
            this.texts.display(context, program_state, 2,score_num);
            //this.increase_score();
            }
            else if (start ==0)
            {
                this.background.displays(context, program_state, 1);
                this.texts.display(context, program_state, 3,score_num);

            }
            
        }
       
    }
}

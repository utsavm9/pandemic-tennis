import { defs, tiny } from "./examples/common.js";

const { Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene, Texture } =
    tiny;

export class Tennis extends Scene {
    constructor() {
        // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
        super();

        // At the beginning of our program, load one of each of these shape definitions onto the GPU.
        this.shapes = {
            sphere: new defs.Subdivision_Sphere(4),
            box: new defs.Cube(),
        };
        //this.shapes.box_2.arrays.texture_coord.forEach(p => p.scale_by(2));

        this.scratchpad = document.createElement('canvas');
        // A hidden canvas for re-sizing the real canvas to be square:
        this.scratchpad_context = this.scratchpad.getContext('2d');
        this.scratchpad.width = 1920;
        this.scratchpad.height = 1200;                // Initial image source: Blank gif file:
        this.texture = new Texture("data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7");
        const bump = new defs.Fake_Bump_Map(1);
        // *** Materials
        this.materials = {
            sphere: new Material(new defs.Phong_Shader(), {
                ambient: 1,
                diffusivity: 0,
                specularity: 0,
                color: color(1, 1, 1, 1),
            }),
            a: new Material(bump, {ambient: .5, texture: new Texture("assets/earth.gif")}),
            b: new Material(bump, {ambient: .5, texture: new Texture("assets/rgb.jpg")}),
            c: new Material(bump, {ambient: 1, texture: new Texture("assets/minion.jpg")}),
            d: new Material(bump, {ambient: .5, texture: new Texture("assets/chrome1x.png")}),
            e: new Material(bump, {ambient: 1, texture: new Texture("assets/text.png")}),
            //f: new Material(bump, {ambient: .5, texture: new Texture("assets/Stadium-Backgrounds-Wallpaper-Cave.jpg")}),

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
        model_transform=Mat4.translation(1,-14,-60);
        model_transform=model_transform.times(Mat4.rotation(0.5,-1,0,0))
        model_transform=model_transform.times(Mat4.scale(70,20,0.1))
        // Lighting
        const light_position = vec4(5, 0, 0, 1);
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 10)];

        this.shapes.box.draw(context, program_state, model_transform, this.materials.c);

        
    }
}

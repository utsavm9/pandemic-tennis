import { defs, tiny } from "./examples/common.js";

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
    Texture,
    Scene,
} = tiny;
var score_num = 0;

export class Text_Line extends Shape {
    // **Text_Line** embeds text in the 3D world, using a crude texture
    // method.  This Shape is made of a horizontal arrangement of quads.
    // Each is textured over with images of ASCII characters, spelling
    // out a string.  Usage:  Instantiate the Shape with the desired
    // character line width.  Then assign it a single-line string by calling
    // set_string("your string") on it. Draw the shape on a material
    // with full ambient weight, and text.png assigned as its texture
    // file.  For multi-line strings, repeat this process and draw with
    // a different matrix.
    constructor(max_size) {
        super("position", "normal", "texture_coord");
        this.max_size = max_size;
        var object_transform = Mat4.identity();
        for (var i = 0; i < max_size; i++) {
            // Each quad is a separate Square instance:
            defs.Square.insert_transformed_copy_into(this, [], object_transform);
            object_transform.post_multiply(Mat4.translation(1.5, 0, 0));
        }
    }

    set_string(line, context) {
        // set_string():  Call this to overwrite the texture coordinates buffer with new
        // values per quad, which enclose each of the string's characters.
        this.arrays.texture_coord = [];
        for (var i = 0; i < this.max_size; i++) {
            var row = Math.floor((i < line.length ? line.charCodeAt(i) : " ".charCodeAt()) / 16),
                col = Math.floor((i < line.length ? line.charCodeAt(i) : " ".charCodeAt()) % 16);

            var skip = 3,
                size = 32,
                sizefloor = size - skip;
            var dim = size * 16,
                left = (col * size + skip) / dim,
                top = (row * size + skip) / dim,
                right = (col * size + sizefloor) / dim,
                bottom = (row * size + sizefloor + 5) / dim;

            this.arrays.texture_coord.push(
                ...Vector.cast([left, 1 - bottom], [right, 1 - bottom], [left, 1 - top], [right, 1 - top])
            );
        }
        if (!this.existing) {
            this.copy_onto_graphics_card(context);
            this.existing = true;
        } else this.copy_onto_graphics_card(context, ["texture_coord"], false);
    }
}

export class Text_Box extends Scene {
    constructor() {
        // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
        super();

        // At the beginning of our program, load one of each of these shape definitions onto the GPU.
        this.shapes = {
            sphere: new defs.Subdivision_Sphere(4),
            cube: new defs.Cube(),
            text: new Text_Line(35),
        };

        // *** Materials
        this.materials = {
            sphere: new Material(new defs.Phong_Shader(), {
                ambient: 1,
                diffusivity: 0,
                specularity: 0,
                color: color(1, 1, 1, 1),
            }),
            trans: new Material(new defs.Textured_Phong(), {
                ambient: 1,
                specularity: 1,
                color: hex_color("#ffffff"),
                texture: new Texture("assets/transparent.png"),
            }),
        };

        const phong = new defs.Phong_Shader();
        const texture = new defs.Textured_Phong(1);

        this.grey = new Material(phong, {
            color: color(0.5, 0.5, 0.5, 1),
            ambient: 0,
            diffusivity: 0.3,
            specularity: 0.5,
            smoothness: 10,
        });

        // To show text you need a Material like this one:
        this.text_image = new Material(texture, {
            ambient: 1,
            diffusivity: 0,
            specularity: 0,
            texture: new Texture("assets/text.png"),
        });
    }

    display(context, program_state, setting) {
        // display():  Called once per frame of animation.
        // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:

        program_state.projection_transform = Mat4.perspective(Math.PI / 4, context.width / context.height, 0.1, 1000);

        // Transform matrix
        let model_transform = Mat4.identity();

        let stick_transform = Mat4.identity();

        // Lighting
        const light_position = vec4(5, 0, 0, 1);
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 10)];

        //SCORE: adapted from text-demo.js
        let strings = ["", "", "", "", "Start", ""];
        if (setting == 1) {
            strings = ["", "", "", "", "Start", ""];
        }
        if (setting == 2) {
            strings = ["", "", "", "", "Score:" + score_num, ""];
        }
        if (setting == 3) {
            strings = ["", "", "", "", "TRY AGAIN", ""];
        }
        let funny_orbit = Mat4.identity(); //Mat4.rotation(Math.PI / 4 * t, Math.cos(t), Math.sin(t), .7 * Math.cos(t));
        if (setting == 1) {
            funny_orbit = Mat4.identity();
            funny_orbit = funny_orbit.times(Mat4.translation(-1, 0, 0)).times(Mat4.rotation(-0.2, 1, 0, 0));
        }
        if (setting == 2) {
            funny_orbit = Mat4.identity();
            funny_orbit = funny_orbit.times(Mat4.translation(-11, 6, 1)).times(Mat4.rotation(-0.2, 1, 0, 0));
            score_num = score_num += 1;
        }
        if (setting == 3) {
            funny_orbit = Mat4.identity();
            funny_orbit = funny_orbit.times(Mat4.translation(-1, 0, 0)).times(Mat4.rotation(-0.2, 1, 0, 0));
        }

        this.shapes.cube.draw(context, program_state, funny_orbit, this.materials.trans);

        // Sample the "strings" array and draw them onto a cube.
        for (let i = 0; i < 3; i++)
            for (let j = 0; j < 2; j++) {
                // Find the matrix for a basis located along one of the cube's sides:
                let cube_side = Mat4.rotation(i == 0 ? Math.PI / 2 : 0, 1, 0, 0)
                    .times(Mat4.rotation(Math.PI * j - (i == 1 ? Math.PI / 2 : 0), 0, 1, 0))
                    .times(Mat4.translation(-0.9, 0.9, 1.01));
                const multi_line_string = strings[2 * i + j].split("\n");
                // Draw a Text_String for every line in our string, up to 30 lines:
                for (let line of multi_line_string.slice(0, 30)) {
                    // Assign the string to Text_String, and then draw it.
                    this.shapes.text.set_string(line, context.context);
                    this.shapes.text.draw(
                        context,
                        program_state,
                        funny_orbit.times(cube_side).times(Mat4.scale(0.6, 1, 0.1)),
                        this.text_image
                    );
                    // Move our basis down a line.
                    cube_side.post_multiply(Mat4.translation(0, -0.06, 0));
                    //cube_side.post_multiply(Mat4.scale(5,5, 5));
                }
            }

        // basically when collision is detected increase score_num then it should update
    }
}

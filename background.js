import { defs, tiny } from "./examples/common.js";

const { Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene, Texture } =
    tiny;





export class Background extends Scene {
    constructor() {
        // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
        super();

        // At the beginning of our program, load one of each of these shape definitions onto the GPU.
        this.shapes = {
            sphere: new defs.Subdivision_Sphere(4),
            box: new defs.Cube(),
            //cone: new defs.Rounded_Closed_Cone(4, 10, [[0, 2], [0, 1]]),
            cone: new defs.Rounded_Closed_Cone(4,10,[[.67, 1], [0, 1]]),
            //where to start roundness, num of points on the bottom
            cylinder:new defs.Capped_Cylinder(1, 10, [[0, 2], [0, 1]]),
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
            Cone: new Material(new defs.Phong_Shader(), {
                ambient: 0.5,
                diffusivity: 1,
                specularity: 1,
                color: vec4(0.21, 0.62, 0.21, 1.0),
            }),
            trunk: new Material(new defs.Phong_Shader(), {
                ambient: 0.5,
                diffusivity: 1,
                specularity: 1,
                color: vec4(0.82, 0.61, 0.31, 1.0),
            }),


            a: new Material(bump, {ambient: .5, texture: new Texture("assets/earth.gif")}),
            b: new Material(bump, {ambient: .5, texture: new Texture("assets/rgb.jpg")}),
            c: new Material(bump, {ambient: 1, texture: new Texture("assets/minion.jpg")}),
            nx: new Material(bump, {ambient: 1, texture: new Texture("assets/CloudyCrown_Midday_Left.png")}),
            ny: new Material(bump, {ambient: 1, texture: new Texture("assets/CloudyCrown_Midday_Down.png")}),
            nz: new Material(bump, {ambient: 1, texture: new Texture("assets/CloudyCrown_Midday_Back.png")}),
            px: new Material(bump, {ambient: 1, texture: new Texture("assets/CloudyCrown_Midday_Right.png")}),
            py: new Material(bump, {ambient: 1, texture: new Texture("assets/CloudyCrown_Midday_Up.png")}),
            pz: new Material(bump, {ambient: 1, texture: new Texture("assets/CloudyCrown_Midday_Front.png")}),

            

        };

        this.initial_camera_location = Mat4.look_at(vec3(0, 10, 20), vec3(0, 0, 0), vec3(0, 1, 0));
        
        

    }
    

    make_trees(context, program_state, branch,x_pos,y_pos,z_pos)
        {
            let i=0;
            let t_y=y_pos;
            let s_x=1;
            
                
                while(i<branch)
                {
                    let model_transform=Mat4.identity()
                    model_transform=model_transform.times(Mat4.translation(x_pos,-t_y,z_pos))
                        .times(Mat4.rotation(90,-1,0,0))
                        .times(Mat4.scale(s_x,1,1))
                    ;
                    this.shapes.cone.draw(context,program_state,model_transform,this.materials.Cone);
                    i++;
                    t_y=t_y+1.5;
                    s_x=s_x+0.5;

                }
                let trunk=Mat4.identity();
                trunk=trunk.times(Mat4.translation(x_pos,-t_y,z_pos))
                           .times(Mat4.rotation(90,-1,0,0))  
                           .times(Mat4.scale(0.4,0.4,2));;
                this.shapes.cylinder.draw(context,program_state,trunk,this.materials.trunk);
        
       
        }
   




    add_back(context,program_state)
    {
        let model_transform = Mat4.identity();


        model_transform=Mat4.translation(0,0,-50.0);
        //model_transform=model_transform.times(Mat4.rotation(0.5,-1,0,0));
        model_transform=model_transform.times(Mat4.scale(40,40,0.1));
        this.shapes.box.draw(context, program_state, model_transform, this.materials.pz);

    }
    add_bottom(context,program_state)
    {
        let model_transform = Mat4.identity();
        model_transform=Mat4.translation(0,-40,-25);
        model_transform=model_transform.times(Mat4.rotation(1.57,-1,0,0));
        model_transform=model_transform.times(Mat4.scale(40,40,0.1));
        this.shapes.box.draw(context, program_state, model_transform, this.materials.ny);

    }
    add_left(context,program_state)
    {
        let model_transform = Mat4.identity();
        model_transform=Mat4.translation(-40.0,0,-25);
        model_transform=model_transform.times(Mat4.rotation(1.57,0,1,0));
        model_transform=model_transform.times(Mat4.scale(40,40,0.1));
        this.shapes.box.draw(context, program_state, model_transform, this.materials.nx);

    }
    add_right(context,program_state)
    {
        let model_transform = Mat4.identity();
        model_transform=Mat4.translation(40,0,-25);
        model_transform=model_transform.times(Mat4.rotation(1.57,0,-1,0));
        model_transform=model_transform.times(Mat4.scale(40,40,0.1));
        this.shapes.box.draw(context, program_state, model_transform, this.materials.px);

    }
    add_top(context,program_state)
    {
        let model_transform = Mat4.identity();
        model_transform=Mat4.translation(0,40,-25);
        model_transform=model_transform.times(Mat4.rotation(1.57,1,0,0));
        model_transform=model_transform.times(Mat4.scale(40,40,0.1));
        this.shapes.box.draw(context, program_state, model_transform, this.materials.py);

    }
    add_front(context,program_state)
    {
        let model_transform = Mat4.identity();


        model_transform=Mat4.translation(0,0,47);
        //model_transform=model_transform.times(Mat4.rotation(0.5,-1,0,0));
        model_transform=model_transform.times(Mat4.scale(25,25,0.1));
        this.shapes.box.draw(context, program_state, model_transform, this.materials.pz);

    }
    add_ground(context,program_state)
    {
        let model_transform = Mat4.identity();
        model_transform=Mat4.translation(0,-20,-25);
        model_transform=model_transform.times(Mat4.rotation(1.57,-1,0,0));
        model_transform=model_transform.times(Mat4.scale(40,40,0.1));
        this.shapes.box.draw(context, program_state, model_transform, this.materials.b);

    }


    displays(context, program_state) {
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
        //model_transform=Mat4.translation(1,-14,-60);
        //model_transform=model_transform.times(Mat4.rotation(0.5,-1,0,0))
        //model_transform=model_transform.times(Mat4.scale(70,25,0.1))
        // Lighting
        const light_position = vec4(5, 0, 0, 1);
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 10)];
        //this.make_trees(context,program_state,4,-4,0,-10);
        
        //this.make_trees(context,program_state,2,3,0,-5);
        //this.make_trees(context,program_state,3,-5,-1,-3);
        //this.make_trees(context,program_state,2,0,2,-3);

        this.add_back(context,program_state);
        this.add_bottom(context,program_state);
        this.add_left(context,program_state);
        
        this.add_right(context,program_state);
        
        this.add_top(context,program_state);
        //this.add_front(context,program_state);
        
        //this.add_ground(context,program_state);
        
       
    }
}

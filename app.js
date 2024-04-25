class Boid {
    constructor(x, y) {
        this.pos = new Vec(x, y);
        this.vel = new Vec(Math.random() - 0.5, Math.random() - 0.5).mult(100);

        this.visionRange = 200;
        this.protectedRange = 50;

        this.cohesionFactor = 50;
        this.separationFactor = 100;
        this.alignmentFactor = 200;
        this.turnFactor = 500;
        this.boostFactor = 1;
        this.maxSpeed = 500;
        this.minSpeed = 100;
    }

    update(dt) {
        let acc = this.getForce();
        dt /= 1000;
        this.pos = this.pos.add(this.vel.mult(dt / App.scale).add(acc.mult(0.5 * (dt*dt) / App.scale))); // s = ut + 0.5at^2
        this.vel = this.vel.add(acc.mult(dt)); // v = u + at
    }

    draw() {
        Graphics.fillRect((this.pos.x - 2.5) / App.scale, (this.pos.y - 2.5) / App.scale, 5 / App.scale, 5 / App.scale)
        //Graphics.drawArrow(this.pos.x, this.pos.y, this.pos.x + this.force.x * 0.3, this.pos.y + this.force.y * 0.3);

    }

    getForce() {
        let force = new Vec(0, 0);
        force = force.add(this.cohesion());
        force = force.add(this.separation());
        force = force.add(this.alignment());
        force = force.add(this.edges());
        force = force.add(this.speedLimit())
        this.force = force
        return force;
    }

    cohesion() {
        let com = new Vec(0, 0);
        let numInRange = 0;
        for (let i = 0; i < Game.boidArray.length; i++) {
            let boid = Game.boidArray[i];
            let diff = this.pos.sub(boid.pos).abs().mult(App.scale);
            if (diff.x < this.visionRange && diff.y < this.visionRange) {
                com = com.add(boid.pos);
                numInRange++;
            }
        }

        if (numInRange == 0) {
            return new Vec(0, 0);
        }
        com = com.div(numInRange).sub(this.pos).mult(Game.cohesionFactor);
        return com;
    }

    separation() {
        let force = new Vec(0, 0);
        let close = new Vec(0, 0);
        for (let i = 0; i < Game.boidArray.length; i++) {
            let boid = Game.boidArray[i];
            let diff = this.pos.sub(boid.pos).abs();
            if (diff.x < this.protectedRange && diff.y < this.protectedRange) {
                close = close.add(this.pos.sub(boid.pos));
            }
        }
        force = close.mult(Game.separationFactor)
        return force;
    }

    alignment() {
        let motion = new Vec(this.vel.x, this.vel.y);
        let numInRange = 0;
        for (let i = 0; i < Game.boidArray.length; i++) {
            let boid = Game.boidArray[i];
            let diff = this.pos.sub(boid.pos).abs();
            if (diff.x < this.visionRange && diff.y < this.visionRange) {
                motion = motion.add(boid.vel);
                numInRange++;
            }
        }
        if (numInRange == 0) {
            return new Vec(0, 0);
        }
        motion = motion.div(numInRange).sub(this.vel).norm().mult(Game.alignmentFactor)
        return motion;
    }

    edges() {
        let force = new Vec(0, 0);
        if (this.pos.x / App.scale < Game.marginWidth) {
            force = force.add(new Vec(this.turnFactor, 0));
        }
        if (this.pos.x / App.scale > App.width - Game.marginWidth) {
            force = force.add(new Vec(-this.turnFactor, 0));
        }
        if (this.pos.y / App.scale < Game.marginWidth) {
            force = force.add(new Vec(0, this.turnFactor))
        }
        if (this.pos.y / App.scale > App.height - Game.marginWidth) {
            force = force.add(new Vec(0, -this.turnFactor));
        }

        return force;
    }

    speedLimit() {
        let force = new Vec(0, 0);
        let speed = this.vel.mag();
        if (speed == 0) {
            return force;
        }
        if (speed > this.maxSpeed) {
            this.vel = this.vel.div(speed).mult(this.maxSpeed * 1);
        } else if (speed < this.maxSpeed) {
            force = this.vel.div(speed).mult(this.minSpeed * 1);
        }
        return force;
    }
}

App = {}
Graphics = {}
Game = {}

App.init = function() {
    App.canvas = document.getElementById("canvas");
    App.width = window.innerWidth;
    App.height = window.innerHeight - 150;
    App.canvas.width = App.width;
    App.canvas.height = App.height;
    App.oldTimeStamp = 0;
    App.frames = 0;
    App.scale = 2;
    App.initSliders();

    Graphics.context = App.canvas.getContext("2d");
    Graphics.fg = "black"
    Graphics.bg = "#776065"

    Game.boidArray = Game.randomBoidArray(400);
    Game.marginWidth = 100;
    Game.cohesionFactor = 100;
    Game.alignmentFactor = 100;
    Game.separationFactor = 100;
    

    window.requestAnimationFrame(App.gameLoop);
}

App.initSliders = function() {
    let cohesionSlider = document.getElementById("cohesion");
    let cohesionOut = document.getElementById("cohesionOut");
    let separationSlider = document.getElementById("separation");
    let separationOut = document.getElementById("separationOut");
    let alignmentSlider = document.getElementById("alignment");
    let alignmentOut = document.getElementById("alignmentOut");
    let visionRangeSlider = document.getElementById("visionRange");
    let visionRangeOut = document.getElementById("visionRangeOut");
    let protectedRangeSlider = document.getElementById("protectedRange");
    let protectedRangeOut = document.getElementById("protectedRangeOut");

    Game.cohesionFactor = cohesionSlider.value;
    Game.alignmentFactor = alignmentSlider.value;
    Game.separationFactor = separationSlider.value;
    Game.visionRange = visionRangeSlider.value;
    Game.protectedRange = protectedRangeSlider.value;

    cohesionSlider.addEventListener("input", function() {
        cohesionOut.textContent = this.value;
        Game.cohesionFactor = this.value;
    });
    separationSlider.addEventListener("input", function() {
        separationOut.textContent = this.value;
        Game.separationFactor = this.value;
    });
    alignmentSlider.addEventListener("input", function() {
        alignmentOut.textContent = this.value;
        Game.alignmentFactor = this.value;
    });
    visionRangeSlider.addEventListener("input", function() {
        visionRangeOut.textContent = this.value;
        Game.visionRange = this.value;
    });
    protectedRangeSlider.addEventListener("input", function() {
        protectedRangeOut.textContent = this.value;
        Game.protectedRange = this.value;
    });
};

App.gameLoop = function(timeStamp) {
    App.dt = (timeStamp - App.oldTimeStamp);
    App.oldTimeStamp = timeStamp;

    let fps = Math.round(1000 / App.dt);

    Game.update(App.dt);
    Game.draw();

    Graphics.drawFps(fps);
    App.frames++;

    window.requestAnimationFrame(App.gameLoop);
}

Game.update = function(dt) {
    for (let i = 0; i < Game.boidArray.length; i++) {
        Game.boidArray[i].update(dt);
    }
}

Game.draw = function() {
    Graphics.background("#776065");

    for (let i = 0; i < Game.boidArray.length; i++) {
        Game.boidArray[i].draw();    
    }
}

Game.randomBoidArray = function(n) {
    var boidArray = []
    for (let i = 0; i < n; i++) {
        boidArray[i] = new Boid(Math.random() * App.width * App.scale, Math.random() * App.height * App.scale);
    }
    return boidArray;
}

Graphics.drawArrow = function(startX, startY, endX, endY, arrowSize) {
    var context = Graphics.context;
    context.fillStyle = Graphics.fg
    // Calculate arrow angle
    var angle = Math.atan2(endY - startY, endX - startX);

    // Draw line
    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    context.stroke();

    // Draw arrowhead
    context.beginPath();
    context.moveTo(endX, endY);
    context.lineTo(endX - arrowSize * Math.cos(angle - Math.PI / 6), endY - arrowSize * Math.sin(angle - Math.PI / 6));
    context.lineTo(endX - arrowSize * Math.cos(angle + Math.PI / 6), endY - arrowSize * Math.sin(angle + Math.PI / 6));
    context.closePath();
    context.fill();
}

Graphics.drawFps = function(fps) {
    Graphics.context.fillStyle = "white";
    //Graphics.context.fillRect(0,0,200,100);
    Graphics.context.font = "15px Arial";
    Graphics.context.fillText(`${fps} fps`, 10, 30);
}

Graphics.background = function(colour = Graphics.bg) {
    Graphics.context.fillStyle = colour;
    Graphics.context.fillRect(0, 0, App.canvas.width, App.canvas.height);
}

Graphics.fillRect = function(x, y, w, h, colour = Graphics.fg) {
    Graphics.context.fillStyle = colour;
    Graphics.context.fillRect(x, y, w, h)
}

App.init();

class Vec {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    // Calculate the magnitude of the vector
    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    // Calculate the squared magnitude of the vector (faster than mag())
    magSq() {
        return this.x * this.x + this.y * this.y;
    }

    // Add another vector to this vector without modifying this vector
    add(v) {
        return new Vec(this.x + v.x, this.y + v.y);
    }

    // Subtract another vector from this vector without modifying this vector
    sub(v) {
        return new Vec(this.x - v.x, this.y - v.y);
    }

    // Multiply this vector by a scalar without modifying this vector
    mult(s) {
        return new Vec(this.x * s, this.y * s);
    }

    // Divide this vector by a scalar without modifying this vector
    div(s) {
        if (s !== 0) {
        return new Vec(this.x / s, this.y / s);
        } else {
        console.error("Cannot divide by zero.");
        return null;
        }
    }

    // Calculate the heading (angle) of the vector in radians
    heading() {
        return Math.atan2(this.y, this.x);
    }

    // Normalize the vector (make it a unit vector) without modifying this vector
    norm() {
        const m = this.mag();
        if (m !== 0) {
        return this.div(m);
        } else {
        console.error("Cannot normalize a zero vector.");
        return null;
        }
    }

    // Return the absolute value of this vector
    abs() {
        return new Vec(Math.abs(this.x), Math.abs(this.y));
    }
}
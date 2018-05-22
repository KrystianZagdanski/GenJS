class Colider
{
    constructor(x, y, w, h)
    {
        this.x = x;
        this.y = y;
        if(h)
        {
            this.w = w;
            this.h = h;
            this.type = "squer";
        }
        else
        {
            this.r = w;
            this.type = "circle";
        }
    }
    update(x, y, w, h)
    {
        this.x = x;
        this.y = y;
        if(h)
        {
            this.w = w;
            this.h = h;
        }
        else
        {
            this.r = w;
        }
    }
    /* 
        Check for colision
    */
    colideWith(other)
    {
        if(this.type == "circle")
        {
            if(this.type == other.colider.type)
            {
                let dx = this.x - other.x;
                let dy = this.y - other.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                return distance <= this.r + other.r;
            }
            else // this circle, other squer
            {
                let deltaX = this.x - Math.max(other.x, Math.min(this.x, other.x + other.w));
                let deltaY = this.y - Math.max(other.y, Math.min(this.y, other.y + other.h));
                return (deltaX * deltaX + deltaY * deltaY) < (this.r * this.r);
            }
        }
        else
        {
            if(this.type == other.colider.type) // this squer, other squer
            {
                let collisionX = rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x;
                let collisionY = rect1.y < rect2.y + rect2.height && rect1.height + rect1.y > rect2.y;
                return collisionX && collisionY;
            }
            else // this squer, oter circle
            {
                let deltaX = other.x - Math.max(this.x, Math.min(other.x, this.x + this.w));
                let deltaY = other.y - Math.max(this.y, Math.min(other.y, this.y + this.h));
                return (deltaX * deltaX + deltaY * deltaY) < (other.r * other.r);
            }
        }
    }

}
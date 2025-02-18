// Canvas and Start Button Elements
const startBtn = document.getElementById('start-btn');
const canvas = document.getElementById('canvas');

// Screen Variables
const startScreen = document.querySelector('.start-screen');
const checkpointScreen = document.querySelector('.checkpoint-screen');

// Checkpoint Screen Inner Element
const checkpointMessage = document.querySelector('.checkpoint-screen > p');

// Using the Canvas API to render graphics in 2D
const ctx = canvas.getContext('2d');

// Defining the canvas width and height
canvas.width = innerWidth;
canvas.height = innerHeight;

// Assigning the player gravity
const gravity = 0.5;

// Creating Collision Detection for Checkpoints
let isCheckpointCollisionDetectionActive = true;

// Ensuring that the size of the elements of the game are proportional and responsive to the screen size changing
const proportionalSize = (size) => {
    return innerHeight < 500 ? Math.ceil((size / 500) * innerHeight) : size;
};

// Making the player class
class Player {
    constructor() {
        // The player's position on the screen ensuring the player can move on any screen size
        this.position = {
            x : proportionalSize(10),
            y : proportionalSize(400)
        };
        // To store the player's speed in the x and y directions
        this.velocity = {
            x : 0,
            y : 0
        };
        // The width of the player proportional to the screen
        this.width = proportionalSize(40);
        // The height of the player proportional to the screen
        this.height = proportionalSize(40);
    }

    // This method will be responsible for creating the player's width, height, position, and fill color
    draw() {
        // Player's Color
        ctx.fillStyle = "#6BCAE2";
        // Player's Shape
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    // Responsible for updating the player's position and velocity as it moves throughout the game
    update() {
        // Continually draws the player onto the screen
        this.draw();
        // Adjusts the velocity when the player moves right
        this.position.x += this.velocity.x;
        // Adjusts the velocity when the player jumps up
        this.position.y += this.velocity.y;
        
        // Condition that prevents the player from moving past the height of the canvas
        if ((this.position.y + this.height + this.velocity.y) <= canvas.height) {
            if (this.position.y < 0) {
                // Sets the y position of the player to zero if it tries to move past the height of the canvas
                this.position.y = 0;
                // Makes the y velocity 0.5 only if the position is less than zero
                this.velocity.y = gravity;
            } 
            // Applies gravity to the y velocity of the player
            this.velocity.y += gravity;
        } else {
            // Sets the default velocity if the player does not try to move
            this.velocity.y = 0;
        }

        // Ensures the player remains within the boundaries of the canvas screen
        if (this.position.x < this.width) {
            // Assigns the proportional width to the player's x position
            this.position.x = this.width;
        }

        // Checks if the player's position has exceeded the right edge of the canvas
        // If it does, set the player's x position to the maximum value so the player doesn't go off the screen
        if (this.position.x >= canvas.width - this.width * 2) {
            this.position.x = canvas.width - this.width * 2;
        }
    }   
}

// Platforms and Platform Logic
class Platform {
    constructor(x, y) {
        // Uses the shorthand syntax property to assign x : x, and y : y in the object
        this.position = {
            x, y 
        };
        // Giving the platform a width of 200px
        this.width = 200;
        // Giving the platform a height of 40px proportional to the screen
        this.height = proportionalSize(40);
    }
    // Same as the player class, creating a method to draw the platform
    draw() {
        // Platform's color
        ctx.fillStyle = "#FE8402";
        // Platform's shape
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}
// Checkpoints and Checkpoint Logic
class CheckPoint {
    constructor(x, y, z) {
        this.position = {
            x, y
        };
        this.width = proportionalSize(40);
        this.height = proportionalSize(70);
        // Claimed property for when a checkpoint has been passed
        this.claimed = false;
    }
    // Method to draw checkpoints
    draw() {
        ctx.fillStyle = "#87E293";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
    // Method for claiming checkpoints
    claim() {
        this.width = 0
        this.height = 0
        this.position.y = Infinity;
        this.claimed = true;
    }
}

// Creates a new instance of the Player object and assigns it to the player variable
const player = new Player();

// Creates a list of positions for the platforms to be placed
const platformPositions = [
    { x: 0, y: proportionalSize(450)},
    { x: 250, y: proportionalSize(200) },
    { x: 580, y: proportionalSize(400) },
    { x: 900, y: proportionalSize(350) },
    { x: 1100, y: proportionalSize(350) },
    { x: 1250, y: proportionalSize(150) },
    { x: 1650, y: proportionalSize(350) },
    { x: 1950, y: proportionalSize(175) },
    { x: 2300, y: proportionalSize(350) },
    { x: 2500, y: proportionalSize(475) },
    { x: 2750, y: proportionalSize(400) },
    { x: 3100, y: proportionalSize(200) },
    { x: 3500, y: proportionalSize(150) }
];

// Creates a list of platform instances using the Platform class
// which we later reference to draw the platforms on the canvas
const platforms = platformPositions.map((platform) => new Platform(platform.x, platform.y));

// Checkpoint position array
const checkpointPositions = [
    {x: 1350, y: proportionalSize(80), z: 1},
    {x: 2350, y: proportionalSize(280), z: 2},
    {x: 3550, y: proportionalSize(80), z: 3}
];

// Creating a list of checkpoint instances
const checkpoints = checkpointPositions.map((checkpoint) => new CheckPoint(checkpoint.x, checkpoint.y, checkpoint.z));

// Adding the functionality for animating the player moving across the screen
const animate = () => {
    // The requestAnimationFrame(callback) web API takes in a callback and is used to update the animation on the screen
    requestAnimationFrame(animate);
    
    // The clearRect() web API is used to clear the canvas frame to render the following frame
    // Syntax: | ctx.clearRect(x, y, width, height) | 
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Drawing the platforms on the canvas by iterating through the platforms array
    platforms.forEach(platform => platform.draw());

    // Drawing the checkpoints on the canvas by iterating through the checkpoints array
    checkpoints.forEach(checkpoint => checkpoint.draw());

    // Using the update() method on player to actively update it's position as it moves (Ref: line 58)
    player.update();

    // Adding logic for increasing or decreasing a player's velocity based on if they move left or right
    if (keys.rightKey.pressed && player.position.x < proportionalSize(400)) {
        // Increases the player's x velocity to 5 if the right key is pressed
        player.velocity.x = 5;
    } else if (keys.leftKey.pressed && player.position.x > proportionalSize(100)) {
        // If the left key is pressed and the player's position is greater than proportional size
        // The player's x velocity is decreased by 5
        player.velocity.x = -5;
    } else {
        // If no keys are pressed, the player does not move
        player.velocity.x = 0;
    }

    // Updating the platform's x position as the player moves across the screen
    if (keys.rightKey.pressed && isCheckpointCollisionDetectionActive) {
        // Since platforms doesn't have an x property we have to call the position constructor of Platform
        // then move the platform on rightkey being pressed
        platforms.forEach(platform => platform.position.x -= 5);
        // Adding in checkpoint input
        checkpoints.forEach(checkpoint => checkpoint.position.x -= 5);
    } else if (keys.leftKey.pressed && isCheckpointCollisionDetectionActive) {
        // Refer to lines 171 and 172
        platforms.forEach(platform => platform.position.x += 5);
        // Adding in checkpoint input
        checkpoints.forEach(checkpoint => checkpoint.position.x += 5);
    }

    // At this point the position of the platforms animate with the player
    // but if you try to jump on the platform you fall right through
    
    // Adding collision detection logic to fix this issue
    platforms.forEach(platform => {
        // Boolean expressions to check if player is over the platform or not
        const collisionDetectionRules = [
            player.position.y + player.height <= platform.position.y,
            player.position.y + player.height + player.velocity.y >= platform.position.y,
            player.position.x >= platform.position.x - player.width / 2,
            player.position.x <= platform.position.x + platform.width - player.width / 3
        ];

        // Conditional statement using the every method to check if collisionDetectionRules is truthy
        // .every() method takes a callback to check every rule
        if (collisionDetectionRules.every(rule => rule)) {
            player.velocity.y = 0
            return;
        }

        // Boolean expressions to check if player is on the platform or not
        const platformDetectionRules = [
            player.position.x >= platform.position.x - player.width / 2,
            player.position.x <= platform.position.x + platform.width - player.width / 3,
            player.position.y + player.height >= platform.position.y,
            player.position.y <= platform.position.y + platform.height,
        ];

        // Conditional statement that checks if the platform detection rules are true
        if (platformDetectionRules.every(rule => rule)) {
            player.position.y = platform.position.y + player.height;
            player.velocity.y = gravity;
        }
    });

    // Updating the animate function to display the checkpoint screen when a player reaches a checkpoint
    checkpoints.forEach((checkpoint, index, checkpoints) => {
        // Detection ruleset for checkpoints | All rules have to return truthy to claim checkpoint
        const checkpointDetectionRules = [
            player.position.x >= checkpoint.position.x,
            player.position.y >= checkpoint.position.y,
            player.position.y + player.height <= checkpoint.position.y + checkpoint.height,
            isCheckpointCollisionDetectionActive,
            // Ensures player is close enough to the checkpoint to claim it
            player.position.x - player.width <= checkpoint.position.x - checkpoint.width + player.width * 0.9,
            // Ensures that the player can only claim the first checkpoint or a checkpoint that has already been claimed
            index === 0 || checkpoints[index - 1].claimed === true
        ];
        // If the every rule is truthy, the checkpoint will be claimed by the player
        if (checkpointDetectionRules.every((rule) => rule)) {
            checkpoint.claim();
            
            // If the last checkpoint is claimed, the showCheckpointScreen is called, and the player stops moving
            if (index === checkpoints.length - 1) {
                isCheckpointCollisionDetectionActive = false;
                showCheckpointScreen("You reached the final checkpoint!");
                movePlayer("ArrowRight", 0, false);
            } else if (player.position.x >= checkpoint.position.x && player.position.x <= checkpoint.position.x + 40) {
                showCheckpointScreen("You reached a checkpoint!");
            }
        }
    });
};




// Creating a variable to monitor when the left and right arrow keys are pressed
const keys = {
    rightKey : {pressed : false},
    leftKey : {pressed : false}
};

// Adding functionality that will be responsible for moving the player across the screen
const movePlayer = (key, xVelocity, isPressed) => {
    // Player will interact with multiple checkpoints, if the collision detection isnt active, the players movements will need to stop
    // (Ref: line 23)
    if (!isCheckpointCollisionDetectionActive) {
        player.velocity.x = 0;
        player.velocity.y = 0;
        return;
    }

    switch(key) {
        // If arrow left is pressed, leftKey.pressed returns true and the player's xVelosity is subtracted, if not, velocity doen't change
        case "ArrowLeft": 
            keys.leftKey.pressed = isPressed;
            if (xVelocity === 0) {
                player.velocity.x = xVelocity;
            }
            player.velocity.x -= xVelocity;
            break;
        
        // If arrow up, " ", or spacebar is pressed player y velocity will decrease by 8
        case "ArrowUp" :
            player.velocity.y -= 8;
            break;
        case " " :
            player.velocity.y -= 8;
            break;
        case "Spacebar" : 
            player.velocity.y -= 8;
            break;

        // If arrow right is pressed, rightKey.pressed returns true and the player's xVelosity is added, if not, velocity doen't change
        case "ArrowRight" :
            keys.rightKey.pressed = isPressed;
            if (xVelocity === 0) {
                player.velocity.x = xVelocity;
            }
            player.velocity.x += xVelocity
    }
};

// Start game function to start the game
const startGame = () => {
    // Displays the game canvas
    canvas.style.display = "block";
    // Hides the start screen
    startScreen.style.display = "none";


    // Draws and animates the player on the canvas as it moves (Ref: line 50, 99)
    animate();
};

// Creating a function to show the checkpoint message when a player has reached one
const showCheckpointScreen = (msg) => {
    checkpointScreen.style.display = "block";
    checkpointMessage.textContent = msg;

    if (isCheckpointCollisionDetectionActive) {
        setTimeout(() => {
            checkpointScreen.style.display = "none";
        }, 2000)
    }
};

// Adding an event listener responsible for starting the game when startBtn is clicked
startBtn.addEventListener('click', startGame);

// Adding an event listener to the window responsible for moving the player when the associated key is pressed
window.addEventListener('keydown', ({ key }) => {
    movePlayer(key, 8, true);
});

// Adding another event listener to the window responsible for stopping movement when a key stops being pressed
window.addEventListener('keyup', ({ key }) => {
    movePlayer(key, 0, false);
});



var x1 = 0;
var y1 = 0;
var x2 = 0;
var y2 = 0;
var px = 0;
var py = 0;
var targetX = 0;
var targetY = 0;
var easing = 0.05;
var weight = 1;

let drawpath = [];
var x_prev = 0;
var y_prev = 0;
var countdown = 1001;
var i = 0;
var restart = false;
var start = false;
var end = false;

playerDrawings = [];
robotDrawings = [];
var drawingCount = 0;

function preload() {
	ThatThenThis = loadFont('./GDThatThenThisVF.ttf');
}

function setup() {
	if (windowWidth > 1000) {
		canvas = createCanvas(windowWidth - 60 - 600, windowHeight - 110);
		playerDrawings.push(createGraphics(windowWidth - 60 - 600, windowHeight - 110));
		robotDrawings.push(createGraphics(windowWidth - 60 - 600, windowHeight - 110));
	} else {
		canvas = createCanvas(windowWidth - 60, windowHeight - 110);
		playerDrawings.push(createGraphics(windowWidth - 60, windowHeight - 110));
		robotDrawings.push(createGraphics(windowWidth - 60, windowHeight - 110));
	}
	canvas.parent('canvas');
	background(255);
	textAlign(LEFT);
	textFont(ThatThenThis);
	textSize(24);
	x1 = width / 2;
	y1 = height / 2;
	x2 = width / 2;
	y2 = height / 2;
	px = width / 2;
	py = height / 2;

	/* Draw start button */
	fill(0);
	text("Click anywhere to start", 10, height - 10);
}

function draw() {

	/* Wait for mouse click to start */
	if (start == true) {
		/* Ending */
		if (drawingCount >= 5 & i < 5) {
			if (i == 0) {
				background(255);
			}
			image(playerDrawings[i], width * i / 5, height / 5, width / 5, height / 5);
			image(robotDrawings[i], width * i / 5, height / 5 * 3, width / 5, height / 5);
			end = true;
			i += 1;
		}
		/* Save canvas as JPG */
		if (drawingCount >= 5 & i == 5) {
			var today = new Date();
			var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
			var time = today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
			var dateTime = date + '_' + time;
			save("TTG_" + dateTime + ".png");
			console.log("test");
			i += 1;
		}

		/* Robot's turn to draw */
		if (countdown <= 0 || restart == true & end == false) {
			if (i == 0) {
				background(255);
				image(playerDrawings[drawingCount], 0, 0);
			}
			robotDrawings[drawingCount].stroke(255, 0, 0);
			robotDrawings[drawingCount].strokeWeight(drawpath[i][2]);
			robotDrawings[drawingCount].line(drawpath[i][0], drawpath[i][1], drawpath[i + 1][0], drawpath[i + 1][1]);
			image(robotDrawings[drawingCount], 0, 0);

			/* UI */
			fill(255, 255, 255, 200);
			noStroke();
			rect(0, height - 36, width, 36);
			textAlign(LEFT);
			fill(0);
			text("Watch the robot trace your drawing!", 10, height - 10);

			restart = true;

			if (i + 2 >= drawpath.length) {

				restart = false;
				i = 0;
				drawingCount += 1;
				countdown = 1001 - drawingCount * 200;
				playerDrawings.push(createGraphics(windowWidth, windowHeight));
				robotDrawings.push(createGraphics(windowWidth, windowHeight));

				background(255);
				image(robotDrawings[drawingCount - 1], 0, 0);
				drawpath = [];
			} else {
				i += 1;
			}
		} else if (end == false) {
			background(255);

			/* Show previous robot drawing */
			if (drawingCount > 0) {
				image(robotDrawings[drawingCount - 1], 0, 0);
			}

			/* Robot Drawing */
			easing = random(0, 2.6);
			targetX = mouseX;
			x1 += (targetX - x1) * easing;
			targetY = mouseY;
			y1 += (targetY - y1) * easing;

			/* Player Drawing */
			targetX = mouseX;
			x2 += (targetX - x2) * 0.15;
			targetY = mouseY;
			y2 += (targetY - y2) * 0.15;
			weight = dist(x2, y2, px, py);
			drawpath.push([x1, y1, weight]); /* Store robot drawing + line weight */
			playerDrawings[drawingCount].stroke(0);
			playerDrawings[drawingCount].strokeWeight(weight);
			playerDrawings[drawingCount].line(x2, y2, px, py);
			px = x2;
			py = y2;
			image(playerDrawings[drawingCount], 0, 0); /* Store player drawing */

			/* UI */
			fill(255, 255, 255, 200);
			noStroke();
			rect(0, height - 36, width, 36);
			textAlign(RIGHT);
			fill(255, 0, 0);
			text(countdown, width - 10, height - 10);
			textAlign(LEFT);
			fill(0);

			if (drawingCount == 0) {
				text("Draw something!", 10, height - 10);
			} else {
				text("Trace the robot's drawing!", 10, height - 10);
			}

			x_prev = mouseX;
			y_prev = mouseY;
			countdown -= 1; /* Run down the clock */
		}

		/* Instructions to restart */
		if (drawingCount >= 5 & i == 6) {
			fill(255);
			noStroke();
			rect(width / 2 - 165, height / 2 - 25, 330, 34);
			fill(0);
			textAlign(LEFT);
			text("Click to restart", 10, height - 10);
			drawpath = [];
			playerDrawings = [];
			robotDrawings = [];
			playerDrawings.push(createGraphics(width, height));
			robotDrawings.push(createGraphics(width, height));
			drawingCount = 0;
			i = 0;
			countdown = 1001;
			start = false;
			restart = false;
			end = false;
		}
	}
}

function mousePressed() {
	if (start == false) {
		x1 = mouseX;
		y1 = mouseY;
		x2 = mouseX;
		y2 = mouseY;
		px = mouseX;
		py = mouseY;
	}
	start = true;
}
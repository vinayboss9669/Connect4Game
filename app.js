var playerRed = "R";
var playerYellow = "Y";
var currPlayer = playerRed;

var gameOver = false;
var board;

var rows = 6;
var columns = 7;

window.onload = function () {
    setGame();
};

function setGame() {
    board = [];
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            row.push(' '); // Initialize each cell as empty
            // Create HTML elements for the board
            let tile = document.createElement("div");
            tile.id = `${r}-${c}`;
            tile.classList.add("tile");
            tile.addEventListener("click", setPiece);
            document.getElementById("board").append(tile);
        }
        board.push(row);
    }
}

function setPiece() {
    if (gameOver) {
        return;
    }

    let coords = this.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);

    // Find the lowest empty row in the column
    r = findLowestEmptyRow(c);
    if (r === -1) {
        return; // Column is full
    }

    board[r][c] = currPlayer; // Update the board
    let tile = document.getElementById(`${r}-${c}`);
    if (currPlayer === playerRed) {
        tile.classList.add("red-piece");
        currPlayer = playerYellow;
    } else {
        tile.classList.add("yellow-piece");
        currPlayer = playerRed;
    }

    checkWinner(r, c);
}

function findLowestEmptyRow(c) {
    for (let r = rows - 1; r >= 0; r--) {
        if (board[r][c] === ' ') {
            return r;
        }
    }
    return -1; // Column is full
}

function checkWinner(r, c) {
    // Check all directions for a win
    if (checkDirection(r, c, 1, 0) || // Horizontal
        checkDirection(r, c, 0, 1) || // Vertical
        checkDirection(r, c, 1, 1) || // Diagonal down-right
        checkDirection(r, c, 1, -1)) { // Diagonal down-left
        gameOver = true;
        let winner = board[r][c] === playerRed ? "Red" : "Yellow";
        document.getElementById("winner").innerText = `${winner} wins!`;
    }
}

function checkDirection(r, c, dr, dc) {
    let color = board[r][c];
    let count = 0;

    // Check in the positive direction
    for (let i = 0; i < 4; i++) {
        let nr = r + dr * i;
        let nc = c + dc * i;
        if (nr < 0 || nr >= rows || nc < 0 || nc >= columns || board[nr][nc] !== color) {
            break;
        }
        count++;
    }

    // Check in the negative direction
    for (let i = 1; i < 4; i++) {
        let nr = r - dr * i;
        let nc = c - dc * i;
        if (nr < 0 || nr >= rows || nc < 0 || nc >= columns || board[nr][nc] !== color) {
            break;
        }
        count++;
    }

    return count >= 4;
}




// Add event listener for the restart button
document.getElementById("restart").addEventListener("click", restartGame);

function restartGame() {
    // Reset the board array
    board = [];
    gameOver = false;
    currPlayer = playerRed;

    // Clear the winner message
    document.getElementById("winner").innerText = "";

    // Clear the board visually
    let tiles = document.querySelectorAll(".tile");
    tiles.forEach(tile => {
        tile.classList.remove("red-piece", "yellow-piece");
    });

    // Reinitialize the board
    setGame();
}
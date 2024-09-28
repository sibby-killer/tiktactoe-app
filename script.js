let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
const cells = document.querySelectorAll('.cell');
let gameWon = false; // Flag to stop the game after someone wins
let gameMode = '';
let difficulty = '';

// Access audio elements
let gameMusic = document.getElementById('gameMusic');
let loadingMusic = document.getElementById('loadingMusic');
let clickSound = document.getElementById('clickSound');

// Function to handle mode selection
function selectMode(mode) {
    gameMode = mode;
    document.getElementById('mode-selection').style.display = 'none';
    if (gameMode === 'computer') {
        document.getElementById('difficulty-selection').style.display = 'flex';
    } else {
        startGame('X'); // Start multiplayer with player X
    }
}

// Function to set difficulty level
function setDifficulty(level) {
    difficulty = level;
    document.getElementById('difficulty-selection').style.display = 'none';
    startGame('X'); // Start game with player X
}

// Function to start the game
function startGame(playerSymbol) {
    currentPlayer = playerSymbol;
    board = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => {
        cell.innerText = '';
        cell.classList.remove('win-line'); // Remove win line classes
    });
    gameWon = false;
    document.getElementById('player-turn').innerText = `${currentPlayer}'s turn`;
    document.getElementById('loading').style.display = 'none';
    document.getElementById('mode-selection').style.display = 'none';
    document.getElementById('difficulty-selection').style.display = 'none';
    document.getElementById('game').style.display = 'flex';
    
    // Play game music
    gameMusic.play();

    // If playing with computer, make the first move if computer goes first
    if (gameMode === 'computer' && currentPlayer === 'O') {
        setTimeout(() => computerMove(), 500); // Delay for the computer move
    }
}

// Function to make a move
function makeMove(index) {
    if (board[index] === '' && !gameWon) {
        board[index] = currentPlayer;
        cells[index].innerText = currentPlayer;
        clickSound.play(); // Play click sound

        if (checkWinner()) {
            endGame(`${currentPlayer} wins!`);
        } else if (board.every(cell => cell !== '')) {
            endGame("It's a draw!");
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            document.getElementById('player-turn').innerText = `${currentPlayer}'s turn`;

            // If playing with computer, make computer move
            if (gameMode === 'computer' && currentPlayer === 'O') {
                setTimeout(() => computerMove(), 500);
            }
        }
    }
}

// Function to make the computer move
function computerMove() {
    let move;
    if (difficulty === 'easy') {
        move = getRandomMove();
    } else if (difficulty === 'medium') {
        move = getMediumMove();
    } else if (difficulty === 'hard') {
        move = getBestMove();
    }

    if (move !== undefined) {
        makeMove(move);
    }
}

// Get a random move for easy difficulty
function getRandomMove() {
    let availableMoves = board.map((cell, index) => cell === '' ? index : null).filter(cell => cell !== null);
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

// Medium move logic
function getMediumMove() {
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            if (checkWinner()) {
                return i; // Block opponent from winning
            }
            board[i] = ''; // Reset if not a winning move
        }
    }

    // Try to win
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            if (checkWinner()) {
                return i; // Winning move
            }
            board[i] = ''; // Reset if not a winning move
        }
    }

    return getRandomMove(); // If no move found, return random move
}

// Minimax algorithm for hard difficulty
function getBestMove() {
    let bestValue = -Infinity;
    let bestMove;
    
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = 'O'; // AI's turn
            let moveValue = minimax(board, 0, false);
            board[i] = ''; // Undo move
            if (moveValue > bestValue) {
                bestMove = i;
                bestValue = moveValue;
            }
        }
    }
    
    return bestMove;
}

// Minimax algorithm implementation
function minimax(board, depth, isMaximizing) {
    const scores = { X: -10, O: 10, draw: 0 };
    const winner = checkWinner(true);

    if (winner !== null) {
        return scores[winner];
    }
    
    if (board.every(cell => cell !== '')) {
        return scores['draw'];
    }

    if (isMaximizing) {
        let bestValue = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'O'; // AI's turn
                bestValue = Math.max(bestValue, minimax(board, depth + 1, false));
                board[i] = ''; // Undo move
            }
        }
        return bestValue;
    } else {
        let bestValue = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'X'; // Player's turn
                bestValue = Math.min(bestValue, minimax(board, depth + 1, true));
                board[i] = ''; // Undo move
            }
        }
        return bestValue;
    }
}

// Check for a winner
function checkWinner(isComputerCheck = false) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical
        [0, 4, 8], [2, 4, 6] // Diagonal
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            if (isComputerCheck) return board[a]; // Return the winner (X or O)
            highlightWinningCells(pattern);
            return true; // Game won
        }
    }

    return null; // No winner
}

// Highlight winning cells
function highlightWinningCells(pattern) {
    pattern.forEach(index => {
        cells[index].classList.add('win-line');
    });
}

// End the game
function endGame(message) {
    gameWon = true; // Set game won flag
    document.getElementById('player-turn').innerText = message;
    document.getElementById('popup-message').innerText = message;
    document.getElementById('message-popup').style.display = 'flex';
    gameMusic.pause(); // Stop game music
}

// Close the popup
function closePopup() {
    document.getElementById('message-popup').style.display = 'none';
    restartGame();
}

// Restart the game
function restartGame() {
    document.getElementById('game').style.display = 'none';
    document.getElementById('loading').style.display = 'flex';
    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('mode-selection').style.display = 'flex';
        gameMusic.pause(); // Stop game music
        loadingMusic.play(); // Play loading music
    }, 5000); // Show loading for 5 seconds
}

// Simulate loading screen
setTimeout(() => {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('mode-selection').style.display = 'flex';
    loadingMusic.pause(); // Stop loading music
    gameMusic.play(); // Start game music
}, 5000);

let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
const cells = document.querySelectorAll('.cell');
let gameWon = false; // Flag to stop the game after someone wins

// Access audio elements
let gameMusic = document.getElementById('gameMusic');
let loadingMusic = document.getElementById('loadingMusic');
let clickSound = document.getElementById('clickSound');

// Function to handle player moves
function makeMove(index) {
    if (board[index] === '' && !gameWon) {
        board[index] = currentPlayer;
        cells[index].innerText = currentPlayer;
        clickSound.play();

        if (checkWin()) {
            gameWon = true;
            drawWinningLine(checkWin()); // Draw line when there is a win
            showPopup(`${currentPlayer} wins! 🎉`);
        } else if (board.every(cell => cell !== '')) {
            showPopup('It\'s a Draw! 🤝');
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        document.getElementById('player-turn').innerText = `Player ${currentPlayer}'s turn`;
    }
}

// Function to restart the game
function restartGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => {
        cell.innerText = '';
        cell.classList.remove('win-line'); // Remove win line classes
    });
    gameWon = false;
    currentPlayer = 'X';
    document.getElementById('player-turn').innerText = `Player ${currentPlayer}'s turn`;
}

// Function to check for win
function checkWin() {
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    // Return the winning pattern if one exists
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] === currentPlayer && board[a] === board[b] && board[a] === board[c]) {
            return pattern; // Return the winning pattern
        }
    }
    return null; // No win yet
}

// Function to draw a line on the winning pattern
function drawWinningLine(pattern) {
    pattern.forEach(index => {
        cells[index].classList.add('win-line'); // Add class to style the winning cells
    });
}

// Function to show the popup message
function showPopup(message) {
    const popup = document.getElementById('message-popup');
    const popupMessage = document.getElementById('popup-message');
    popupMessage.innerText = message;
    popup.style.display = 'flex';
}

// Function to close the popup
function closePopup() {
    const popup = document.getElementById('message-popup');
    popup.style.display = 'none';
}

// Handle loading screen and start game
setTimeout(() => {
    loadingMusic.pause();
    gameMusic.play(); // Start game music after loading

    document.getElementById('loading').style.display = 'none';
    document.getElementById('game').style.display = 'block';
}, 5000);

// Trigger loading music on user interaction (to comply with autoplay restrictions)
document.body.addEventListener('click', () => {
    loadingMusic.play();
}, { once: true });

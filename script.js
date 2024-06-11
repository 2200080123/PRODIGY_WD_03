document.addEventListener('DOMContentLoaded', () => {
    const chooseSideContainer = document.getElementById('choose-side-container');
    const chooseModeContainer = document.getElementById('choose-mode-container');
    const gameContainer = document.getElementById('game-container');
    const chooseXBtn = document.getElementById('choose-x');
    const chooseOBtn = document.getElementById('choose-o');
    const singlePlayerBtn = document.getElementById('single-player');
    const multiplayerBtn = document.getElementById('multiplayer');
    const homeButton = document.getElementById('home'); // New Home Button

    let currentPlayer = 'X';
    const board = Array.from(document.querySelectorAll('.cell'));
    const statusDisplay = document.getElementById('status');
    const resetButton = document.getElementById('reset');
    const modal = document.getElementById('modal');
    const closeModal = document.querySelector('.close');
    const playAgainButton = document.getElementById('play-again');
    const playerXScore = document.getElementById('player-x-score');
    const playerOScore = document.getElementById('player-o-score');
    const drawsCount = document.getElementById('draws-count');
    const modalStatus = document.getElementById('modal-status');
    let isSinglePlayer = false;

    chooseXBtn.addEventListener('click', () => {
        currentPlayer = 'X';
        chooseSideContainer.style.display = 'none';
        chooseModeContainer.style.display = 'block';
    });

    chooseOBtn.addEventListener('click', () => {
        currentPlayer = 'O';
        chooseSideContainer.style.display = 'none';
        chooseModeContainer.style.display = 'block';
    });

    singlePlayerBtn.addEventListener('click', () => {
        isSinglePlayer = true;
        chooseModeContainer.style.display = 'none';
        gameContainer.style.display = 'block';
        startGame();
    });

    multiplayerBtn.addEventListener('click', () => {
        isSinglePlayer = false;
        chooseModeContainer.style.display = 'none';
        gameContainer.style.display = 'block';
        startGame();
    });

    resetButton.addEventListener('click', resetGame);
    closeModal.addEventListener('click', closeModalBox);
    playAgainButton.addEventListener('click', resetGame);
    homeButton.addEventListener('click', goHome); // Event listener for Home button

    board.forEach(cell => cell.addEventListener('click', handleCellClick));

    function startGame() {
        board.forEach(cell => cell.textContent = '');
        statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
        gameContainer.style.display = 'block';
    }

    function handleCellClick(event) {
        const cell = event.target;
        if (cell.textContent !== '') return;

        cell.textContent = currentPlayer;
        if (checkWinner()) {
            endGame(false);
        } else if (board.every(cell => cell.textContent !== '')) {
            endGame(true);
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
            if (isSinglePlayer && currentPlayer === 'O') {
                setTimeout(aiMove, 500);
            }
        }
    }

    function aiMove() {
        const emptyCells = board.filter(cell => cell.textContent === '');
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        randomCell.textContent = 'O';
        if (checkWinner()) {
            endGame(false);
        } else if (board.every(cell => cell.textContent !== '')) {
            endGame(true);
        } else {
            currentPlayer = 'X';
            statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
        }
    }

    function checkWinner() {
        const winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        return winningCombinations.some(combination => {
            return combination.every(index => board[index].textContent === currentPlayer);
        });
    }

    function endGame(isDraw) {
        if (isDraw) {
            modalStatus.textContent = "It's a draw!";
            drawsCount.textContent = parseInt(drawsCount.textContent) + 1;
        } else {
            modalStatus.textContent = `Player ${currentPlayer} wins!`;
            if (currentPlayer === 'X') {
                playerXScore.textContent = parseInt(playerXScore.textContent) + 1;
            } else {
                playerOScore.textContent = parseInt(playerOScore.textContent) + 1;
            }
            const winningCombinations = [
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
                [0, 3, 6],
                [1, 4, 7],
                [2, 5, 8],
                [0, 4, 8],
                [2, 4, 6]
            ];
            for (const combination of winningCombinations) {
                const [a, b, c] = combination;
                if (board[a].textContent === currentPlayer && board[b].textContent === currentPlayer && board[c].textContent === currentPlayer) {
                    board[a].classList.add('winner');
                    board[b].classList.add('winner');
                    board[c].classList.add('winner');
                    break;
                }
            }
        }
        modal.style.display = 'block';
    }
    

    function resetGame() {
        // Remove the 'winner' class from all cells
        board.forEach(cell => cell.classList.remove('winner'));
        // Reset other game-related variables
        board.forEach(cell => cell.textContent = '');
        currentPlayer = 'X';
        statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
        modal.style.display = 'none';
    }
    

    function closeModalBox() {
        modal.style.display = 'none';
    }

    function goHome() {
        modal.style.display = 'none';
        gameContainer.style.display = 'none';
        chooseModeContainer.style.display = 'none';
        chooseSideContainer.style.display = 'block';
    }
});

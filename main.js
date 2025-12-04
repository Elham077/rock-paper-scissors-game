// Game Variables
let playerScore = 0;
let computerScore = 0;
let roundWinner = '';
let totalRounds = 0;
let tiesCount = 0;
let winStreak = 0;
let maxWinStreak = 0;

// DOM Elements
const scoreInfo = document.getElementById('scoreInfo');
const scoreMessage = document.getElementById('scoreMessage');
const playerScoreEl = document.getElementById('playerScore');
const computerScoreEl = document.getElementById('computerScore');
const playerSign = document.getElementById('playerSign');
const computerSign = document.getElementById('computerSign');
const rockBtn = document.getElementById('rockBtn');
const paperBtn = document.getElementById('paperBtn');
const scissorsBtn = document.getElementById('scissorsBtn');
const endgameModal = document.getElementById('endgameModal');
const endgameMsg = document.getElementById('endgameMsg');
const overlay = document.getElementById('overlay');
const restartBtn = document.getElementById('restartBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const totalRoundsEl = document.getElementById('totalRounds');
const tiesCountEl = document.getElementById('tiesCount');
const winStreakEl = document.getElementById('winStreak');
const finalScoreEl = document.getElementById('finalScore');
const gameSummaryEl = document.getElementById('gameSummary');
const modalIcon = document.getElementById('modalIcon');
const currentYear = document.getElementById('currentYear');

// Initialize
currentYear.textContent = new Date().getFullYear();

// Event Listeners
rockBtn.addEventListener('click', () => handleClick('ROCK'));
paperBtn.addEventListener('click', () => handleClick('PAPER'));
scissorsBtn.addEventListener('click', () => handleClick('SCISSORS'));
restartBtn.addEventListener('click', restartGame);
closeModalBtn.addEventListener('click', closeEndgameModal);
overlay.addEventListener('click', closeEndgameModal);

// Game Logic
function playRound(playerSelection, computerSelection) {
    totalRounds++;
    updateStats();
    
    if (playerSelection === computerSelection) {
        roundWinner = 'tie';
        tiesCount++;
        winStreak = 0;
        return;
    }
    
    if (
        (playerSelection === 'ROCK' && computerSelection === 'SCISSORS') ||
        (playerSelection === 'SCISSORS' && computerSelection === 'PAPER') ||
        (playerSelection === 'PAPER' && computerSelection === 'ROCK')
    ) {
        playerScore++;
        roundWinner = 'player';
        winStreak++;
        maxWinStreak = Math.max(maxWinStreak, winStreak);
    } else {
        computerScore++;
        roundWinner = 'computer';
        winStreak = 0;
    }
    
    updateScoreMessage(roundWinner, playerSelection, computerSelection);
}

function getRandomChoice() {
    const choices = ['ROCK', 'PAPER', 'SCISSORS'];
    const randomIndex = Math.floor(Math.random() * 3);
    return choices[randomIndex];
}

function isGameOver() {
    return playerScore === 5 || computerScore === 5;
}

// UI Functions
function handleClick(playerSelection) {
    if (isGameOver()) {
        openEndgameModal();
        return;
    }
    
    // Clear previous selections
    clearSelections();
    
    // Highlight selected button
    const selectedBtn = document.querySelector(`[data-move="${playerSelection}"]`);
    selectedBtn.classList.add('selected');
    
    const computerSelection = getRandomChoice();
    playRound(playerSelection, computerSelection);
    updateChoices(playerSelection, computerSelection);
    updateScore();
    
    if (isGameOver()) {
        setTimeout(() => {
            openEndgameModal();
            setFinalMessage();
        }, 1000);
    }
}

function clearSelections() {
    document.querySelectorAll('.move-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
}

function updateChoices(playerSelection, computerSelection) {
    // Update player choice
    playerSign.innerHTML = getIconForChoice(playerSelection);
    playerSign.classList.remove('winner');
    
    // Update computer choice
    computerSign.innerHTML = getIconForChoice(computerSelection);
    computerSign.classList.remove('winner');
    
    // Highlight winner
    setTimeout(() => {
        if (roundWinner === 'player') {
            playerSign.classList.add('winner');
        } else if (roundWinner === 'computer') {
            computerSign.classList.add('winner');
        } else if (roundWinner === 'tie') {
            playerSign.classList.add('winner');
            computerSign.classList.add('winner');
        }
    }, 300);
}

function getIconForChoice(choice) {
    switch(choice) {
        case 'ROCK': return '<i class="fas fa-hand-rock"></i>';
        case 'PAPER': return '<i class="fas fa-hand-paper"></i>';
        case 'SCISSORS': return '<i class="fas fa-hand-scissors"></i>';
        default: return '<i class="fas fa-question"></i>';
    }
}

function updateScore() {
    playerScoreEl.textContent = playerScore;
    computerScoreEl.textContent = computerScore;
    
    // Update score info with animation
    scoreInfo.innerHTML = getScoreMessage();
    
    // Highlight winning score
    document.querySelectorAll('.player-score, .computer-score').forEach(el => {
        el.classList.remove('winner');
    });
    
    if (roundWinner === 'player') {
        document.querySelector('.player-score').classList.add('winner');
    } else if (roundWinner === 'computer') {
        document.querySelector('.computer-score').classList.add('winner');
    }
}

function getScoreMessage() {
    if (roundWinner === 'tie') {
        return '<i class="fas fa-handshake"></i> <span>It\'s a Tie!</span>';
    } else if (roundWinner === 'player') {
        return '<i class="fas fa-trophy"></i> <span>You Won!</span>';
    } else if (roundWinner === 'computer') {
        return '<i class="fas fa-robot"></i> <span>Computer Won!</span>';
    }
    return '<i class="fas fa-crosshairs"></i> <span>Choose Your Move</span>';
}

function updateScoreMessage(winner, playerSelection, computerSelection) {
    if (winner === 'player') {
        scoreMessage.textContent = `${capitalizeFirstLetter(playerSelection)} beats ${computerSelection.toLowerCase()}`;
    } else if (winner === 'computer') {
        scoreMessage.textContent = `${capitalizeFirstLetter(playerSelection)} is beaten by ${computerSelection.toLowerCase()}`;
    } else {
        scoreMessage.textContent = `${capitalizeFirstLetter(playerSelection)} ties with ${computerSelection.toLowerCase()}`;
    }
}

function updateStats() {
    totalRoundsEl.textContent = totalRounds;
    tiesCountEl.textContent = tiesCount;
    winStreakEl.textContent = winStreak;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function openEndgameModal() {
    endgameModal.classList.add('active');
    overlay.classList.add('active');
}

function closeEndgameModal() {
    endgameModal.classList.remove('active');
    overlay.classList.remove('active');
}

function setFinalMessage() {
    if (playerScore > computerScore) {
        endgameMsg.textContent = 'VICTORY!';
        modalIcon.innerHTML = '<i class="fas fa-trophy"></i>';
        gameSummaryEl.textContent = `Congratulations! You defeated the computer with a ${maxWinStreak} win streak!`;
    } else {
        endgameMsg.textContent = 'DEFEAT!';
        modalIcon.innerHTML = '<i class="fas fa-robot"></i>';
        gameSummaryEl.textContent = 'Better luck next time! The AI has proven superior this round.';
    }
    finalScoreEl.textContent = `Final Score: ${playerScore} - ${computerScore}`;
}

function restartGame() {
    playerScore = 0;
    computerScore = 0;
    totalRounds = 0;
    tiesCount = 0;
    winStreak = 0;
    maxWinStreak = 0;
    
    playerScoreEl.textContent = '0';
    computerScoreEl.textContent = '0';
    scoreInfo.innerHTML = '<i class="fas fa-crosshairs"></i> <span>Choose Your Move</span>';
    scoreMessage.textContent = 'First to score 5 points wins the game';
    playerSign.innerHTML = '<i class="fas fa-question"></i>';
    computerSign.innerHTML = '<i class="fas fa-question"></i>';
    playerSign.classList.remove('winner');
    computerSign.classList.remove('winner');
    
    document.querySelectorAll('.player-score, .computer-score').forEach(el => {
        el.classList.remove('winner');
    });
    
    clearSelections();
    updateStats();
    closeEndgameModal();
}

// Initialize stats
updateStats();
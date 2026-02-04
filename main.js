const gameContainer = document.getElementById('game-container');
const flipCount = document.getElementById('flip-count');
const timerDisplay = document.getElementById('timer');
const restartBtn = document.getElementById('restart-btn');
const blurr = document.getElementById('blurr');
const victoryText = document.getElementById('victory-text');
const gameOverText = document.getElementById('game-over-text');
const webPos = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
//front appearance
const symbols = ['Q', 'W', 'O', 'X', 'S', 'H', 'L', 'D', 'Z'];
const frontValues = [...symbols, ...symbols];
//shuffle
frontValues.sort(() => Math.random() - 0.5);
//game state
let flippedCards = [];
let matchedPairs = 0;
let canFlip = true;
let totalPairs = symbols.length;
let timeLeft = Number(timerDisplay.textContent);
let timerInterval = null;
let gameStarted = false;
let gameOver = false;

function resetGame() {
  gameOverText.style.display = 'none';
  victoryText.style.display = 'none';
  restartBtn.style.display = 'none';
  blurr.style.display = 'none';
  timerDisplay.textContent = '60';
  flipCount.textContent = '0';
  flippedCards = [];
  matchedPairs = 0;
  gameOver = false;
  gameStarted = false;
  timerInterval = null;
  timeLeft = Number(timerDisplay.textContent);
  canFlip = true;
  //unflip and reshuffle cards
  const cards = document.querySelectorAll('.card');
  frontValues.sort(() => Math.random() - 0.5);
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const cardFront = card.querySelector('.card-front');
    
    setTimeout(() => cardFront.textContent = frontValues[i], 200);
    card.dataset.symbol = frontValues[i];
    
    card.classList.remove('flipped');
    card.style.opacity = '1';
  }
}

function startTimer() {
  if (gameStarted) return;
  gameStarted = true;

  timerInterval = setInterval(() => {
    timerDisplay.textContent = timeLeft - 1;
    timeLeft -= 1;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      gameOver = true;
      gameOverText.style.display = 'inline-block'
      restartBtn.style.display = 'inline-block';
      blurr.style.display = 'block';
    }
  }, 1000);
}

for (let i = 1; i <= 18; i++) {
  const card = document.createElement('div');
  card.className = 'card visible';
  card.dataset.symbol = frontValues[i - 1];

  const cardBack = document.createElement('div');
  cardBack.className = 'card-back card-face';
  //cobweb imgs
  webPos.forEach(pos => {
    const cobwebImg = document.createElement('img');
    cobwebImg.src = 'assets/cobweb.png';
    cobwebImg.className = `cob-web cobweb-${pos}`;
    cardBack.appendChild(cobwebImg);
  });
  //spider img
  const spiderImg = document.createElement('img');
  spiderImg.src = 'assets/spider.png';
  spiderImg.className = 'spider';
  cardBack.appendChild(spiderImg);

  const cardFront = document.createElement('div');
  cardFront.className = 'card-front card-face';
  cardFront.textContent = frontValues[i - 1];

  card.addEventListener('click', function() {
    if (!gameStarted) startTimer();
    
    if (
      this.classList.contains('flipped') ||
      flippedCards.length >= 2 ||
      !canFlip ||
      gameOver
    ) return;
    flipCount.textContent = Number(flipCount.textContent) + 1;
    //flip the card
    this.classList.add('flipped');
    flippedCards.push(this);
    //check for match
    if (flippedCards.length === 2) {
      canFlip = false;

      const card1 = flippedCards[0];
      const card2 = flippedCards[1];

      if (card1.dataset.symbol === card2.dataset.symbol) {
        matchedPairs++;

        setTimeout(() => {
          card1.style.opacity = '0.7';
          card2.style.opacity = '0.7';
        }, 100);

        flippedCards = [];
        canFlip = true;

        if (matchedPairs === totalPairs) {
          gameOver = true;
          clearInterval(timerInterval);
          victoryText.style.display = 'inline-block';
          restartBtn.style.display = 'inline-block';
          blurr.style.display = 'block';
        }
      } else {
          setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');

            flippedCards = [];
            canFlip = true;
          }, 800);
        }
    } 
  });

  card.appendChild(cardBack);
  card.appendChild(cardFront);
  gameContainer.appendChild(card);
}

restartBtn.addEventListener('click', resetGame);
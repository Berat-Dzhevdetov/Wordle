const guessGrid = document.querySelector("[data-guess-grid]");
const WORD_LENGHT = 5;
const FLIP_ANIMATION_DURATION = 500;
const DANCE_ANIMATION_DURATION = 500;
const maxLength = targetWords.length;
let targetWord = targetWords[getRandomInt(maxLength)];
const alertContainer = document.querySelector("[data-alert-container]");
const keyboard = document.querySelector("[data-keyboard]");

function restartGame(e) {
    resetTiles();
    resetKeyboard();
    targetWord = targetWords[getRandomInt(maxLength)];
    startInteraction();
    let alert = e.target.parentNode.parentNode;
    alert.classList.add('hide');
    alert.addEventListener('transitionend',() => {
        alert.remove();
    })
}

function resetTiles(){
    guessGrid.querySelectorAll('[data-letter]').forEach(tile =>{
        delete tile.dataset.letter;
        delete tile.dataset.state;
        tile.textContent = "";
    })
}

function resetKeyboard(){
    keyboard.querySelectorAll('.correct').forEach(key => {
        key.classList.remove('correct');
    });
    keyboard.querySelectorAll('.wrong').forEach(key => {
        key.classList.remove('wrong');
    });
    keyboard.querySelectorAll('.wrong-location').forEach(key => {
        key.classList.remove('wrong-location');
    });
}

startInteraction();

function startInteraction() {
    document.addEventListener('click', handleMouseClick);
    document.addEventListener('keydown', handleKeyPress);
}

function stopInteraction() {
    document.removeEventListener('click', handleMouseClick);
    document.removeEventListener('keydown', handleKeyPress);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function handleMouseClick(e) {
    if (e.target.matches("[data-key]")) {
        pressKey(e.target.dataset.key);
        return;
    }

    if (e.target.matches("[data-enter]")) {
        submitGuess();
        return;
    }

    if (e.target.matches("[data-delete]")) {
        deleteKey();
        return;
    }
}

function handleKeyPress(e) {
    if (e.key == "Enter") {
        submitGuess();
        return;
    }

    if (e.key == "Backspace" || e.key == "Delete") {
        deleteKey();
        return;
    }

    let results = new RegExp('^[a-z]$', 'i').exec(e.key);

    if (results) {
        pressKey(e.key);
        return;
    }
}

function pressKey(key) {
    const activeTiles = getActiveTiles();

    if (activeTiles.length >= WORD_LENGHT) {
        return;
    }

    const nextTile = guessGrid.querySelector(":not([data-letter])");
    nextTile.dataset.letter = key.toLowerCase();
    nextTile.textContent = key;
    nextTile.dataset.state = "active";
}

function deleteKey() {
    const activeTiles = getActiveTiles();
    const lastTile = activeTiles[activeTiles.length - 1];
    if (lastTile == null) return;
    lastTile.textContent = "";
    delete lastTile.dataset.state
    delete lastTile.dataset.letter
}

function submitGuess() {
    const activeTiles = Array.from(getActiveTiles());

    if (activeTiles.length != WORD_LENGHT) {
        showAlert("Not enough letters");
        shakeTiles(activeTiles);
        return;
    }

    const guess = activeTiles.reduce((word, tile) => {
        return word + tile.dataset.letter;
    }, "");

    if (!dictionary.includes(guess)) {
        showAlert("Not in dictionary");
        shakeTiles(activeTiles);
        return;
    }

    stopInteraction()

    activeTiles.forEach((...params) => flipTile(...params, guess));
}

function flipTile(tile, index, array, guess) {
    const letter = tile.dataset.letter;
    const key = keyboard.querySelector(`[data-key="${letter}"i]`);

    setTimeout(() => {
        tile.classList.add("flip");
    }, (index * FLIP_ANIMATION_DURATION) / 2);

    tile.addEventListener("transitionend", () => {
        tile.classList.remove('flip');
        if (targetWord[index] === letter) {
            tile.dataset.state = "correct";
            key.classList.add("correct");
        } else if (targetWord.includes(letter)) {
            tile.dataset.state = "wrong-location";
            key.classList.add("wrong-location");
        } else {
            tile.dataset.state = "wrong";
            key.classList.add("wrong");
        }

        if (index === array.length - 1) {
            startInteraction();
            checkWinLose(guess, array);
        }
    }, { once: true })
}

function getActiveTiles() {
    return guessGrid.querySelectorAll('[data-state="active"]');
}

function showAlert(msg, duration = 1000) {
    const alert = document.createElement("div");
    alert.innerHTML = msg;
    alert.classList.add("alert");
    alertContainer.prepend(alert);
    if (duration == null) return;
    setTimeout(() => {
        alert.classList.add('hide');
        alert.addEventListener('transitionend', () => {
            alert.remove();
        })
    }, duration);
}

function shakeTiles(tiles) {
    tiles.forEach(tile => {
        tile.classList.add('shake');
        tile.addEventListener('animationend', () => {
            tile.classList.remove('shake');
        }, { once: true })
    })
}

function checkWinLose(guess, tiles) {
    if (guess === targetWord) {
        showAlert(`You won! Play again?<button class='restart-btn' onclick='restartGame(event);'><i class='fa fa-refresh' aria-hidden='true'></i></button>`, null);
        danceTiles(tiles);
        stopInteraction();
        return;
    }

    const remaingTiles = guessGrid.querySelectorAll(":not([data-letter])");

    if (remaingTiles.length == 0) {
        stopInteraction();
        showAlert(`You lost! The word was <span class='bold'>${targetWord}</span>. Try again?<button class='restart-btn' onclick='restartGame(event);'><i class='fa fa-refresh' aria-hidden='true'></i></button>`, null);
    }
}

function askPlayerToPlayAgain() {
    targetWordSpan.textContent = targetWord;
    modalContainer.classList.add('dark');
    modal.classList.add('show');
}

function danceTiles(tiles) {
    tiles.forEach((tile, index) => {
        setTimeout(() => {
            tile.classList.add('dance');
            tile.addEventListener('animationend', () => {
                tile.classList.remove('dance');
            }, { once: true })
        }, (index * DANCE_ANIMATION_DURATION) / 5);
    })
}
const guessGrid = document.querySelector("[data-guess-grid]");
const WORD_LENGHT = 5;

startInteraction();

function startInteraction() {
    document.addEventListener('click', handleMouseClick);
    document.addEventListener('keydown', handleKeyPress);
}

function stopInteraction(){
    document.removeEventListener('click', handleMouseClick);
    document.removeEventListener('keydown', handleKeyPress);
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
        return
    }

    if(e.key == "Backspace" || e.key == "Delete"){
        deleteKey();
        return;
    }

    if(e.key.match(/^[a-z]$/)){
        pressKey(e.key);
        return;
    }
}

function pressKey(key){
    const activeTiles = getActiveTiles();

    if(activeTiles.length >= WORD_LENGHT){
        return;
    }

    const nextTile = guessGrid.querySelector(":not([data-letter])");
    nextTile.dataset.letter = key.toLowerCase();
    nextTile.textContent = key;
    nextTile.dataset.state = "active";
}

function getActiveTiles(){
    return guessGrid.querySelectorAll('[data-state="active"]');
}
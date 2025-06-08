const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById('score_points')
    },
    cardsSprits: {
        avatar: document.getElementById('card-image'),
        name: document.getElementById('card-name'),
        type: document.getElementById('card-type'),
    },
    fieldCards: {
        player: document.getElementById('player-field-card'),
        computer: document.getElementById('computer-field-card')
    },
    actions: {
        button: document.getElementById('next-duel')
    }
};

const playerSides = {
    player1:'player-cards',
    computer:'computer-cards'
}

const cardData = [
    {
        id: 0,
        name: 'Blue Eyes White Dragon',
        type: 'Paper📋',
        img: `./src/assets/icons/dragon.png`,
        winOf: [1],
        loseOf: [2]
    },
        {
        id: 1,
        name: 'Dark Magician',
        type: 'Rock 🪨',
        img: `./src/assets/icons/magician.png`,
        winOf: [2],
        loseOf: [0]
    },
        {
        id: 2,
        name: 'Exodia',
        type: 'Scissors✂️',
        img: `./src/assets/icons/exodia.png`,
        winOf: [0],
        loseOf: [1]
    },
    

]
//getRandomCardId
async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random()*cardData.length);
    return cardData[randomIndex].id
}
//creatCardImage
async function creatCardImage(IdCard, fieldSide) {
    const cardImage = document.createElement('img');
    cardImage.setAttribute('height','100px');
    cardImage.setAttribute('src','./src/assets/icons/card-back.png');
    cardImage.setAttribute('data-id', IdCard)
    cardImage.classList.add('card');

    if(fieldSide === playerSides.player1){
        cardImage.addEventListener('click', async () => {
            await setCardsField(cardImage.getAttribute('data-id'))
        })

        cardImage.addEventListener('mouseover',()=>{
        drawSelectCards(IdCard)
    })
    }

    return cardImage
}

//setCardsField
async function  setCardsField(cardId) {
    await removeAllCards()

    let computerCardId = await getRandomCardId()

    state.fieldCards.player.style.display = 'block'
    state.fieldCards.computer.style.display = 'block'

    state.cardsSprits.avatar.src = ''
    state.cardsSprits.name.innerText = ''
    state.cardsSprits.type.innerText = ''
    
    state.fieldCards.player.src = cardData[cardId].img
    state.fieldCards.computer.src = cardData[computerCardId].img

    let duelResults = await checkDuelResults(cardId, computerCardId)

    await updateScore()
    await drawButton(duelResults)
}
//updateScore
async function updateScore() {
    state.score.scoreBox.innerText = `Win:${state.score.playerScore} | Lose:${state.score.computerScore}`
}
//drawButton
async function drawButton(text) {
    state.actions.button.innerText= text
    state.actions.button.style.display = 'block'
}

//checkDuelResults
async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults  = 'Empate'
    let playerCard = cardData[playerCardId]
    if(playerCard.winOf.includes(computerCardId)){
        duelResults = 'Ganhou'
        await playAudio('Win.wav')
        state.score.playerScore ++
    }

    if(playerCard.loseOf.includes(computerCardId)){
        duelResults = 'Perdeu'
        await playAudio('pixel-death-66829.mp3')
        state.score.computerScore ++
    }

    if(duelResults === 'Empate'){
        await playAudio('sword-35999.mp3')
    }
    return duelResults
}
//removeAllcards
async function removeAllCards() {
    let cards = document.querySelector('#computer-cards')
    let imageElements = cards.querySelectorAll('img')
    imageElements.forEach((image)=> image.remove() )

    cards = document.querySelector('#player-cards')
    imageElements = cards.querySelectorAll('img')
    imageElements.forEach((image)=> image.remove() )
}
//drawSelectCards
async function drawSelectCards(index) {
    state.cardsSprits.avatar.src = cardData[index].img
    state.cardsSprits.name.innerText = cardData[index].name
    state.cardsSprits.type.innerText = `Attibute: ${cardData[index].type}`
}
// função  drawcards
async function drawCards(cardNumbers, fieldSide) {
    for(let i = 0 ; i < cardNumbers; i++){
        const randomIdCard = await getRandomCardId();
        const cardImage = await creatCardImage(randomIdCard,fieldSide)
        document.getElementById(fieldSide).appendChild(cardImage)
    }
}

const resetDuel = () =>{
    state.cardsSprits.avatar.src = ''
    state.actions.button.style.display = 'none'
    state.fieldCards.player.style.display = 'none'
    state.fieldCards.computer.style.display = 'none'
    init()
}

//playAudio
async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}`)
    audio.play()
}
function init() {

    drawCards(5, playerSides.player1)
    drawCards(5, playerSides.computer)

    const bgm = document.getElementById('bgm')
    bgm.play()
    

}

init()
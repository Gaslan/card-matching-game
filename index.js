var cards = [
    'clubs',
    'diamond',
    'dices', 
    'ghost',
    'hearts',
    'ingot'
]

var CardState = {
    opened: 1,
    closed: 2,
    matched: 3
}

function Card(content, game) {
    this.game = game
    this.content = content
    this.value = content
    this.state = CardState.closed
    this.templateClosed = `<div class="m-card-body closed"></div>`
    this.templateOpen = `<div class="m-card-body opened"><img src="./images/${this.content}.svg" /></div>`
    this._id = Math.random() * (800 + 1)
}

Card.prototype.handleClick = function() {
    if (this.state == CardState.closed) {
        this.showCard()
    }
}

Card.prototype.createCard = function() {
    var _this = this
    this.element = document.createElement('div')
    this.element.classList.add('m-card')
    this.element.innerHTML = this.templateClosed
    this.element.addEventListener('click', _this.handleClick.bind(_this))
    return this.element
}

Card.prototype.showCard = function() {
    var _this = this
    var openedCard = this.game.state.openedCard
    this.game.state.openedCard = undefined
    this.element.innerHTML = this.templateOpen
    this.state = CardState.opened
    this.game.state.stepCount++
    this.game.element.stepCount.innerHTML = this.game.state.stepCount

    if (!openedCard) {
        this.game.state.openedCard = this
        return
    }

    var isMatched = this.controlMatching(openedCard.value)
    if (!isMatched) {
        setTimeout(function() {
            _this.hideCard()
            openedCard.hideCard()
        }, 600)
    } else {
        this.state = CardState.matched
        openedCard.state = CardState.matched
        this.element.removeEventListener('click', _this.handleClick)
        openedCard.element.removeEventListener('click', _this.handleClick)
    }
}

Card.prototype.hideCard = function() {
    this.state = CardState.closed
    this.element.innerHTML = this.templateClosed
}

Card.prototype.controlMatching = function(value) {
    return value === this.value
}


function MatchingCardGame(options) {
    this.options = options
    this.state = {
        openedCard: undefined,
        stepCount: 0
    }
    this.element = {
        stepCount: document.querySelector('.app .step-count')
    }
}

MatchingCardGame.prototype.init = function() {
    var _this = this
    var cardElements = []
    for (let i = 0; i < this.options.count; i++) {
        var card = new Card(cards[i], this)
        var cardElement = card.createCard();
        cardElements.push(card)
        card._id
        
        var card = new Card(cards[i], this)
        var cardElement = card.createCard();
        cardElements.push(card)
    }

    var restartButton = document.createElement('button')
    restartButton.classList.add('game-restart')
    restartButton.innerText = 'Yeniden Başlat'
    restartButton.addEventListener('click', function() {
        _this.init()
    })
    app.appendChild(restartButton)

    var gameBody = document.querySelector('.game-body')

    if (gameBody) {
        gameBody.remove()
    }

    var gameBody = document.createElement('div')
    gameBody.classList.add('game-body')
    app.appendChild(gameBody)
    

    cardElements.sort(function(a, b) {
        return a._id - b._id
    })

    cardElements.forEach(function(card) {
        gameBody.appendChild(card.element)
    })
}

var app = document.querySelector('.app')
window.addEventListener('load', function() {
    var game = new MatchingCardGame({
        count: 6
    });
    game.init();
})
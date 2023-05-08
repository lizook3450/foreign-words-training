class Words {
    constructor(englishWords, russianWords, example) {
        this.englishWords = englishWords;
        this.russianWords = russianWords;
        this.example = example;
    }
}

const words1 = new Words('lynx', 'рысь', 'The spotted skin of the lynx helps it to hide among the trees, as it resembles sun glare on the ground.');
const words2 = new Words('zebra', 'зебра', 'The only continent where zebras live in the wild is Africa.');
const words3 = new Words('hedgehog', 'ёжик', 'The needles of hedgehogs reach a length of two centimeters.');
const words4 = new Words('bear', 'медведь', 'Bears really like to destroy bee hives to feast on honey.');
const words5 = new Words('wolf', 'волк', 'The leader of the wolf pack always goes first, tail held high, thus demonstrating his position.');

const arr = [words1, words2, words3, words4, words5];
function randomInteger(max) {
    let rand = Math.random() * (max + 1);
    return Math.floor(rand);
}

const currentWord = document.getElementById('current-word'); //текущее слово
const totalWord = document.getElementById('total-word'); //общее слово
const wordsProgress = document.getElementById('words-progress'); // слова прогресс
const shuffleWords = document.getElementById('shuffle-words'); //кнопка "перемешать слова"
const examProgress = document.getElementById('exam-progress'); // прогресс по тестированию
const slider = document.querySelector('.slider'); //ползунок
const flipCard = document.querySelector('.flip-card'); //подбросить карточку, нужно добавить класс active
const cardFront = document.getElementById('card-front'); //карточка, которая содержит иностранное слово
const cardFrontH1 = cardFront.querySelector('h1'); //иностранное слово
const cardBack = document.getElementById('card-back'); //карточка, которая содержит перевод и пример использования
const cardBackH1 = cardBack.querySelector('h1'); //перевод
const example = cardBack.querySelector('span'); //пример использования
const buttonBack = document.getElementById('back'); //кнопка назад
const buttonTesting = document.getElementById('exam'); //кнопка тестирования
const buttonNext = document.getElementById('next'); //кнопка вперёд

slider.addEventListener("click", () => { // по клику переварачиваются карточки
    flipCard.classList.toggle('active'); // добавили класс active
});

let currentIndex = 0; //текущий индекс

function createCard(showText) { //функция создать карточку (показать текст)
    cardFrontH1.textContent = showText.englishWords; //карточка содержит иностранное слово
    cardBackH1.textContent = showText.russianWords; //карточка содержит перевод
    example.textContent = showText.example; //карточка содержит пример использования
    currentWord.textContent = currentIndex + 1; //текущему слову присволи текущий индекс и плюс 1. Это для того, чтобы отображался номер текущего слова.1 из 5. 5 из 5 и т.д.
    wordsProgress.value = (currentIndex + 1) / arr.length * 100; //переменная wordsProgress.значение = текущий индекс + 1 /длинну массива *100.  Это для того, чтобы отсчёт начинался с единицы
}
createCard(arr[currentIndex]); //вызвали функцию создать карточку в параметрах с массивом и текущим индексом

buttonNext.addEventListener('click', () => {
    currentIndex++; //текущий индекс..шаг вперёд
    createCard(arr[currentIndex]); //вызвали функцию создать карточку в параметрах с массивом и текущим индексом
    buttonBack.removeAttribute('disabled'); //удалили атрибут
    if (currentIndex == arr.length - 1) { //если текущий индекс равен длине массива-1
        buttonNext.disabled = true; //кнопка "следущий" добавить атрибут блокировки доступа
    }
})

buttonBack.addEventListener('click', () => {
    currentIndex--; //текущий индекс.. шаг назад
    createCard(arr[currentIndex]); //вызвали функцию создать карточку в параметрах с массивом и текущим индексом
    buttonNext.removeAttribute('disabled'); //удалили атрибут
    if (currentIndex == 0) { //если текущий индекс равен нулю
        buttonBack.disabled = true; //кнопка "назад" добавить атрибут блокировки доступа
    }
})

shuffleWords.addEventListener('click', () => { //навесили обработчик клика на перетосовку слов (перемешали карточки случайным образом)
    arr.sort(() => Math.random() - 0.5); //сортируем массив рандомно
    createCard(arr[currentIndex]); //вызвали функцию создать карточку в параметрах с массивом и текущим индексом
})

totalWord.textContent = arr.length; //на общее слово получили содержимое длины массива

//РЕЖИМ ПРОВЕРКИ ЗНАНИЙ

const studyCards = document.querySelector('.study-cards'); //контейнер для хранения учебных карточек
const examCards = document.getElementById('exam-cards'); // контейнер для хранения экзаменационных карточек

let selectedCard;

function creatingTestCard(object) { // функция создания в вёрстке карточек для тестирования
    const divElement = document.createElement('div'); //создали элемент div
    divElement.classList.add('card'); //элементу div добавили класс
    const pElement = document.createElement('p'); //создали элемент p
    pElement.textContent = object; //получаем текстовое содержимое 
    divElement.append(pElement); //вставка в конец контейнера
    divElement.addEventListener('click', () => checkTranslationsHandler(divElement))
    return divElement;
}


function cardInsert() {
    //функция для вставки, отрисовки карточек
    const fragment = new DocumentFragment(); //множественная вставка, временная обёртка
    const newArray = []; //создали пустой массив
    arr.forEach((array) => {
        newArray.push(creatingTestCard(array.russianWords));
        newArray.push(creatingTestCard(array.englishWords)); //получили отдельный массив с русскими и анлийскими словами
    });
    fragment.append(...newArray.sort(() => Math.random() - 0.5));
    examCards.innerHTML = "";
    examCards.append(fragment);
}

buttonTesting.addEventListener('click', () => { //на кнопку тестирование добавили обработчик события по клику
    studyCards.classList.add('hidden'); //на учебные карточки дообавили класс .скрытый(спрятанный)
    cardInsert() //вызвали функция вставки карточек;
})

function checkTranslationsHandler(currentCard) {
    if (!selectedCard) {
        const allCards = document.querySelectorAll('.card');
        allCards.forEach(card => {
            card.classList.remove('correct');
            card.classList.remove('wrong');
        })
        currentCard.style.pointerEvents = "none";
        currentCard.classList.add('correct');
        selectedCard = currentCard;
    } else {
        const wordObject = arr.find(word => word.russianWords === selectedCard.textContent || word.englishWords === selectedCard.textContent);
        if (wordObject.russianWords === currentCard.textContent || wordObject.englishWords === currentCard.textContent) {
            currentCard.style.pointerEvents = "none";
            currentCard.classList.add('correct');
            currentCard.classList.add('fade-out');
            selectedCard.classList.add('fade-out');
            const allCards = document.querySelectorAll('.card');
            let allCardsFaded = true;
            allCards.forEach(card => {
                if (!card.classList.contains('fade-out')) {
                    allCardsFaded = false;
                }
            });
            if (allCardsFaded) {
                setTimeout(() => {
                    alert('Молодец! Ты справилась!');
                }, 500);
            }
        } else {
            currentCard.classList.add('wrong');
            currentCard.style.pointerEvents = "all";
            selectedCard.style.pointerEvents = "all";
        }
        selectedCard = null;
    }
}

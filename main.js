//const playerName = prompt("Будь ласка, введіть ваше ім'я для початку гри:");
//const playerName = document.getElementById('playerName');
const petImages = document.querySelectorAll('.pet-image');
const playBtn = document.getElementById('playBtn');
const gameArea = document.getElementById('game-area');
const selectedPetArea = document.getElementById('selected-pet');
const foodImageArea = document.getElementById('food-images');
const counter = document.getElementById('counter');
const playerNameInput = document.getElementById('playerName');
const homeLink = document.getElementById('homeLink');
//const playerName = playerNameInput.value.trim();

const rulesLink = document.getElementById('rulesLink');
const resultsLink = document.getElementById('resultsLink');
//const greetingMessage = document.getElementById('greetingMessage');
//greetingMessage.textContent = `Привіт, ${playerName}!`;
const difficultySection = document.querySelector('.difficulty');
const difficultySlider = document.getElementById('difficultySlider');
const difficultyDisplay = document.getElementById('difficulty');

let selectedPetImageUrl = '';
let foodCounter = 0;
let targetFood = 20;
let currentFood = 0;
let animationSpeed = 60; //Default speed
let startTime; // Початковий час гри
let endTime; // Кінцевий час гри
let timerInterval; // Інтервал таймера

function playGame(playerName) {
    startTime = new Date(); // Запускаємо таймер
    timerInterval = setInterval(updateTime, 1000); //Оновлення часу кожну секунду

    // Приховуємо слайдер і повідомлення про складність
    difficultySection.style.display = 'none';

    // Оновлення привітання з іменем гравця
    //const greetingMessage = document.getElementById('greetingMessage');
    //greetingMessage.textContent = `Привіт, ${playerName}!`;

    setDifficulty(parseInt(difficultySlider.value)); 

    const foodImages = document.querySelectorAll('#food-images img');
    foodImages.forEach(foodImg => {
        foodImg.style.animationDuration = `${animationSpeed}s`;
    });
}

function updateTime() {
    const now = new Date(); //поточний час
    const timeDiff = now - startTime; // різниця між поточним часом і початковим часом
    const seconds = Math.floor(timeDiff/1000); //переводимо мілісекунди в секунди

    // Вивід часу у форматі годин:хвилини:секунди
    const formattedTime = new Date(seconds * 1000).toISOString().substr(11, 8);
    
    // Оновлення лічильника часу на сторінці
    document.getElementById('counter').textContent = `${currentFood} / ${targetFood}`;

    // Оновлення таймера часу на сторінці
    document.getElementById('timer').textContent = `Час: ${formattedTime}`;
}

petImages.forEach(image => {
    image.addEventListener('click', () => {
        petImages.forEach(img => {
            img.classList.remove('selected');
        });

        image.classList.add('selected');
        selectedPetImageUrl = image.getAttribute('src');
    });
});

playBtn.addEventListener('click', () => {
    if (!selectedPetImageUrl) {
        alert('Будь ласка, оберіть тваринку!');
        return;
    }
    //const playerNameInput = document.getElementById('playerName');
    if (!playerNameInput.value) {
        alert('Будь ласка, введіть ваше ім\'я!');
        return;
    }
    const playerName = playerNameInput.value.trim();

    document.querySelectorAll('.pet-image, div[name="chooseImg"], #playBtn').forEach(div => {
        div.style.display = 'none';
    });

    selectedPetArea.innerHTML = `<img src="${selectedPetImageUrl}" id="pet" class="pet-image">`;
    
    const foods = [
        "./images/monkey-banana.png",
        "./images/dog-bone.png",
        "./images/mouse-cheeze.png",
        "./images/snail-leaf.png",
        "./images/cat-milk.png"
    ];

    let allFoods = [];
    foods.forEach(food => {
        for (let i = 0; i < 5; i++) {
            allFoods.push(food);
        }
    });

    const shuffledFoods = shuffle(allFoods);

    let foodImageHTML = '';
    for (let i = 0; i < 200; i++) {
        const randomFood = shuffledFoods[i % shuffledFoods.length];
        foodImageHTML += `<img src="${randomFood}" id="food${i}" class="food-images">`;
    }

    foodImageArea.innerHTML = foodImageHTML;

    gameArea.style.display = 'block';

    playGame(playerName); // Початок гри, запуск таймера. Передача імені гравця до функції playGame()

    const foodImages = document.querySelectorAll('#food-images img');
    foodImages.forEach(foodImg => {
        foodImg.addEventListener('click', (event) => {
            const foodId = event.target.id;
            const foodElement = document.getElementById(foodId);

            // Перевіряємо, чи картинка їжі відповідає тварині
            if (foodElement && isFoodMatch(foodElement.src, selectedPetImageUrl)) {
                foodElement.style.display = 'none';
                foodCounter++;
                currentFood++;
                counter.textContent = `${currentFood} / ${targetFood}`; 

                // Перевіряємо, чи досягли цілі
                if (currentFood === targetFood) {
                    finishGame(playerName); // Завершення гри, зупинка таймера
                }
            }      
        });
    });
});

// Обробка зміни рівня складності
difficultySlider.addEventListener('input', () => {
    const value = parseInt(difficultySlider.value);
    setDifficulty(value);
});

function setDifficulty(value) {
    switch (value) {
        case 1:
            difficultyDisplay.textContent = "Легкий";
            animationSpeed = 120;
            targetFood = 15;
            break;
        case 2:
            difficultyDisplay.textContent = "Нормальний";
            animationSpeed = 60;
            targetFood = 20;
            break;
        case 3:
            difficultyDisplay.textContent = "Складний";
            animationSpeed = 30;
            targetFood = 25;
            break;
        default:
            break;
    }

    //Оновлення швидкості анімації
    const foodImages = document.querySelectorAll('#food-images img');
    foodImages.forEach(foodImg => {
        foodImg.style.animationDuration = `${animationSpeed}s`;
    });
}

function isFoodMatch(foodSrc, petSrc) {
    const foodFileName = getFileNameFromPath(foodSrc);
    const petFileName = getFileNameFromPath(petSrc);
    return foodFileName.includes(petFileName);
}

function getFileNameFromPath(path) {
    const parts = path.split('/');
    const fileName = parts[parts.length - 1];
    return fileName.split('.')[0];
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Обробник кліку на "Правила"
rulesLink.addEventListener('click', () => {
    // Відображення модального вікна з правилами
    alert('Тут будуть правила гри!');
});
// Обробник кліку на "Результати"
resultsLink.addEventListener('click', () => {
    // Відображення рекордів гравців
    showPlayerRecords();
});

// Функція для збереження рекорду гравця
function savePlayerRecord(playerName, score) {
    let playerRecords = JSON.parse(localStorage.getItem('playerRecords')) || [];
    playerRecords.push({name: playerName, score: score });
    localStorage.setItem('playerRecords', JSON.stringify(playerRecords));
}

// Функція для відображення рекордів гравця
function showPlayerRecords() {
    let playerRecords =JSON.parse(localStorage.getItem('playerRecords')) || [];
    playerRecords.sort((a, b) => b.score - a.score); //Сортуємо за результатами
    playerRecords.forEach((record, index) => {
        console.log(`${index+1}. ${record.name}: ${record.score}`);
    });
}

function finishGame(playerName) {
    clearInterval(timerInterval); // Зупиняємо таймер
    endTime = new Date(); // Встановлюємо кінцевий час гри
    const timeDiff = endTime - startTime; // Різниця між кінцевим та початковим часом
    const seconds = Math.floor(timeDiff / 1000); // Переведення мілісекунд в секунди
    const formattedTime = new Date(seconds * 1000).toISOString().substr(11, 8); // Форматуємо час

    // Виводимо повідомлення з результатом гравця
    gameArea.innerHTML = `
        <h2>Вітаю, ${playerName}!</h2>
        <p>Ти накормив свою тваринку!</p>
        <p>Твій результат:</p>
        <p>Час: ${formattedTime}</p>
    `;
}

homeLink.addEventListener('click', () => {
    window.location.href="main.html";
});
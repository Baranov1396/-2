async function loadData(url) {
    return fetch(url)
        .then(response => response.text())
        .then(data => data)
        .catch(error => console.error('Error loading data:', error));
}

async function loadSection(sectionId) {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = 'Загрузка...';

    const data = await loadData('mod.html');
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, 'text/html');
    const section = doc.getElementById(sectionId);

    contentDiv.innerHTML = '';
    if (section) {
        contentDiv.appendChild(section.cloneNode(true));
    } else {
        contentDiv.innerHTML = '<p>Секция не найдена.</p>';
    }
}

document.addEventListener("DOMContentLoaded", function() {
    let textChanged = false;
    let isBlinking = false;
    let isTeleported = false;
    let originalText = "Этот текст изменится при нажатии на кнопку.";
    let newText = "Новый текст";

    function changeStyle(elementId, property, value) {
        const element = document.getElementById(elementId);
        if (element) {
            if (element.style[property] === value) {
                element.style[property] = '';
            } else {
                element.style[property] = value;
            }
        }
    }

    function changeText(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            if (textChanged) {
                element.innerText = originalText;
            } else {
                element.innerText = newText;
            }
            textChanged = !textChanged;
        }
    }

    function toggleBlink(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            if (isBlinking) {
                element.style.animation = '';
            } else {
                element.style.animation = 'blink 1s steps(1, start) infinite';
            }
            isBlinking = !isBlinking;
        }
    }

    function teleportText(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            if (isTeleported) {
                element.style.transform = ''; 
            } else {
                element.style.transform = 'translateX(100px)';
            }
            isTeleported = !isTeleported;
        }
    }

    // Attach functions to the window object for global access
    window.changeStyle = changeStyle;
    window.changeText = changeText;
    window.toggleBlink = toggleBlink;
    window.teleportText = teleportText;
    window.startQuiz = startQuiz;
    window.clearResults = clearResults;

    updateQuizResults(); // Initial call to populate results on page load
});

// Викторина
const quizQuestions = [
    {
        question: "Как сделать текст жирным?",
        options: ["element.style.fontWeight = 'bold';", "element.style.color = 'bold';", "element.style.background = 'bold';", "element.style.fontSize = 'bold';"],
        correctOption: 0
    },
    {
        question: "Как сделать текст мигающим?",
        options: ["element.style.animation = 'blink 1s steps(1, start) infinite';", "element.style.fontWeight = 'blink';", "element.style.color = 'blink';", "element.style.display = 'blink';"],
        correctOption: 0
    },
    {
        question: "Как изменить цвет текста на красный?",
        options: ["element.style.color = 'blue';", "element.style.color = 'red';", "element.style.background = 'red';", "element.style.fontSize = 'red';"],
        correctOption: 1
    },
    {
        question: "Как изменить размер шрифта на 20px?",
        options: ["element.style.fontSize = '20px';", "element.style.fontWeight = '20px';", "element.style.color = '20px';", "element.style.display = '20px';"],
        correctOption: 0
    },
    {
        question: "Как изменить фон элемента на желтый?",
        options: ["element.style.color = 'yellow';", "element.style.fontWeight = 'yellow';", "element.style.backgroundColor = 'yellow';", "element.style.display = 'yellow';"],
        correctOption: 2
    },
    {
        question: "Как добавить отступы внутри элемента сверху и снизу по 10px, а справа и слева по 15px?",
        options: ["element.style.padding = '10px 15px';", "element.style.margin = '10px 15px';", "element.style.padding = '10px 15px 10px';", "element.style.border = '10px 15px';"],
        correctOption: 0
    }
];

// Запуск викторины
function startQuiz() {
    const userName = prompt("Введите ваше имя:");
    if (!userName) return;

    let correctAnswers = 0;
    let incorrectAnswers = 0;

    quizQuestions.forEach((question, index) => {
        let optionsStr = question.options.map((option, i) => `${i + 1}: ${option}`).join('\n');
        const userAnswer = parseInt(prompt(`${index + 1}. ${question.question}\n${optionsStr}`));

        if (!isNaN(userAnswer) && (userAnswer - 1) === question.correctOption) {
            correctAnswers++;
        } else {
            incorrectAnswers++;
        }
    });

    // Сохранение в localStorage
    let results = JSON.parse(localStorage.getItem('quizResults')) || [];
    results.push({ name: userName, correct: correctAnswers, incorrect: incorrectAnswers });
    localStorage.setItem('quizResults', JSON.stringify(results));

    updateQuizResults();

    alert(`Спасибо за игру, ${userName}! Правильных ответов: ${correctAnswers}. Неправильных ответов: ${incorrectAnswers}`);
}

// Вывод результатов викторины
function updateQuizResults() {
    const resultsDiv = document.getElementById('quizResults');
    const results = JSON.parse(localStorage.getItem('quizResults')) || [];

    resultsDiv.innerHTML = '';
    if (results.length === 0) {
        resultsDiv.innerHTML = '<p>Нет результатов.</p>';
    } else {
        results.forEach(result => {
            const resultElement = document.createElement('div');
            resultElement.innerText = `Имя: ${result.name}, Правильных ответов: ${result.correct}, Неправильных ответов: ${result.incorrect}`;
            resultsDiv.appendChild(resultElement);
        });
    }
}

// Очистка результатов викторины
function clearResults() {
    localStorage.removeItem('quizResults');
    updateQuizResults();
    alert('Результаты викторины очищены.');
}
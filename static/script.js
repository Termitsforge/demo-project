let vertex = {},
    answerNO = {},
    answerYES = {},
    text = document.querySelector("#text"),
    buttons = document.querySelectorAll("button");

vertex = {
    1: "Кот",
    2: "Он мяукает",
    3: "Собака",
    4: "У него большие зубы",
    5: "Волк",
    6: "У него большие лапы",
    7: "Медведь",
    8: "Он живет в Африке",
    9: "Бегемот"
};

answerYES = {
    1:null,
    2:1,
    3:null,
    4:8,
    5:null,
    6:7,
    8:9,
    9:null
};

answerNO = {
    1:null,
    2:4,
    3:null,
    4:6,
    5:null,
    6:3,
    8:5,
    9:null
};

let xhrVertex = new XMLHttpRequest();
xhrVertex.open(
    'GET',
    'http://localhost:3000/getVertex',
    true
);
xhrVertex.send();
xhrVertex.onreadystatechange = function () {
    if (xhrVertex.readyState != 4) {
        return
    }
    if (xhrVertex.status === 200) {
        let result = JSON.parse(xhrVertex.responseText);
        vertex = result;
        console.log(result);
    } else {
        console.log('err', xhrVertex.responseText);
    }
};
let xhrAnswerYES = new XMLHttpRequest();
xhrAnswerYES.open(
    'GET',
    'http://localhost:3000/getAnswerYES',
    true
);
xhrAnswerYES.send();
xhrAnswerYES.onreadystatechange = function () {
    if (xhrAnswerYES.readyState != 4) {
        return
    }
    if (xhrAnswerYES.status === 200) {
        let result = JSON.parse(xhrAnswerYES.responseText);
        answerYES = result;
        console.log(result);
    } else {
        console.log('err', xhrAnswerYES.responseText);
    }
};
let xhrAnswerNO = new XMLHttpRequest();
xhrAnswerNO.open(
    'GET',
    'http://localhost:3000/getAnswerNO',
    true
);
xhrAnswerNO.send();
xhrAnswerNO.onreadystatechange = function () {
    if (xhrAnswerNO.readyState != 4) {
        return
    }
    if (xhrAnswerNO.status === 200) {
        let result = JSON.parse(xhrAnswerNO.responseText);
        answerNO = result;
        console.log(result);
    } else {
        console.log('err', xhrAnswerNO.responseText);
    }
};

function printLine(text, HTMLobject) {
    let count = 0;
    let result = '';
    HTMLobject.textContent = "";

    function typeLine() {
        let interval = setTimeout(
            () => {
                result += text[count]
                HTMLobject.innerHTML = result + '|';
                count++;
                if (count >= text.length) {
                    clearTimeout(interval);
                    HTMLobject.innerHTML = result;
                    return true;
                }
                typeLine();
            }, 80);
    }
    typeLine();

}
let count = 0;
const firstLetter = (string) => {
    let str = string.toLowerCase();
    return str[0].toUpperCase() + str.slice(1);
};
const checkName = (strName) => {
    if (Object.values(vertex).indexOf(strName) === -1) return true;
    else return false;
};
/* Стартовая страница */
const start = () => {
    count = 2;
    printLine("Привет, загадай животное", text);
    buttons[0].textContent = "Старт";
    buttons[1].textContent = "Сбросить все";

    buttons[0].onclick = function () {
        i = 0;
        question();
    };
    buttons[1].onclick = function () {
        if (confirm("Вы серьёзно ? ")) {
            vertex = {};
            answerYES = {};
            answerNO = {};
            alert("Все животные удалены");
        }
    };
};
/*Добавление нового животного*/
const AddNewAnimal = () => {
    let mainBox = document.querySelector(".main__box"),
        addAnimalBox = document.querySelector(".addNewAnimal"),
        inputsText = document.querySelectorAll("input"),
        radioButtuns = document.getElementsByName("answer"),
        addText = document.querySelector(".add__h1");

    mainBox.style.display = "none";
    addAnimalBox.style.display = "block";
    printLine("Расскажи о животном ", addText);
    buttons[2].onclick = function () {
        if (!(inputsText[0].value === "") && !(inputsText[1].value === "")) {
            if (checkName(inputsText[0].value)) {
                /*Добавление нового животного и вопроса */
                vertex[Object.keys(vertex).length + 1] = firstLetter(inputsText[1].value);
                vertex[Object.keys(vertex).length + 1] = firstLetter(inputsText[0].value);

                if (radioButtuns[0].checked) {
                    /*Добавление и изменение значений ответов */
                    answerYES[Object.keys(vertex).length - 1] = Object.keys(vertex).length;
                    answerNO[Object.keys(vertex).length - 1] = count;
                    if (Object.values(answerYES).indexOf(count) !== -1) {
                        let indexValues = Object.values(answerYES).indexOf(count);
                        let key = Object.keys(answerYES)[indexValues];
                        answerYES[key] = Object.keys(vertex).length - 1;
                    } else {
                        let indexValues = Object.values(answerNO).indexOf(count);
                        let key = Object.keys(answerNO)[indexValues];
                        answerNO[key] = Object.keys(vertex).length - 1;
                    }
                    radioButtuns[0].checked = false;
                } else {
                    /*Добавление и изменение значений ответов */
                    answerYES[Object.keys(vertex).length - 1] = count;
                    answerNO[Object.keys(vertex).length - 1] = Object.keys(vertex).length;
                    if (Object.values(answerYES).indexOf(count) !== -1) {
                        let indexValues = Object.values(answerYES).indexOf(count);
                        let key = Object.keys(answerYES)[indexValues];
                        answerYES[key] = count;
                    } else {
                        let indexValues = Object.values(answerNO).indexOf(count);
                        let key = Object.keys(answerNO)[indexValues];
                        answerNO[key] = count;
                    }
                    radioButtuns[1].checked = false;
                }
                /*Выставление у животных null */
                answerNO[Object.keys(vertex).length] = null;
                answerYES[Object.keys(vertex).length] = null;
                inputsText[0].value = "";
                inputsText[1].value = "";
                mainBox.style.display = "block";
                addAnimalBox.style.display = "none";
                start();
            } else {
                printLine("Такое живоное уже есть", addText);
                setTimeout(() => printLine("Расскажи о животном", addText), 6000);
            }

        } else {
            printLine("Ошибка ввода", addText);
            setTimeout(() => printLine("Расскажи о животном", addText), 6000);
        }


    };

    buttons[3].onclick = function () {
        inputsText[0].value = "";
        inputsText[1].value = "";
        mainBox.style.display = "block";
        addAnimalBox.style.display = "none";
        start();
    };

};
const isEmpty = (obj) => {
    for (let key in obj) {
        return false;
    }
    return true;
}
const addOnlyAnimal = () => {
    let mainBox = document.querySelector(".main__box"),
        addAnimalBox = document.querySelector(".addNewAnimal"),
        addOnlyBox = document.querySelector(".add__only__animal"),
        inputsText = document.querySelectorAll("input"),
        addText = document.querySelector(".add__only__h1");

    mainBox.style.display = "none";
    addAnimalBox.style.display = "none";
    addOnlyBox.style.display = "block";

    printLine("Расскажи о животном ", addText);
    buttons[4].onclick = function () {
        if (!(inputsText[4].value === "")) {
            vertex[Object.keys(vertex).length + 1] = inputsText[4].value;
            answerNO[Object.keys(vertex).length] = null;
            answerYES[Object.keys(vertex).length] = null;
            inputsText[4].value = "";
            mainBox.style.display = "block";
            addAnimalBox.style.display = "none";
            addOnlyBox.style.display = "none";
            start();
        } else {
            printLine("Ошибка ввода", addText);
            setTimeout(() => printLine("Расскажи о животном", addText), 6000);
        }
    };
    buttons[5].onclick = function () {
        inputsText[4].value = "";
        mainBox.style.display = "block";
        addAnimalBox.style.display = "none";
        addOnlyBox.style.display = "none";
        start();
    };
};
/*Станица с перечислением вопросов*/
const question = () => {
    function printCorrectAnswer(animal) {
        printLine(`Это ${animal} ?`, text);
        buttons[0].textContent = "Верно";
        buttons[1].textContent = "Не верно";

        buttons[0].onclick = function () {
            start();
        };
        buttons[1].onclick = function () {
            AddNewAnimal();
        };
    }

    if (isEmpty(vertex)) {
        printLine("Я не знаю ни одного животного. Расскажи)", text);
        buttons[0].textContent = "Слушай";
        buttons[1].textContent = "Пока";
        buttons[0].onclick = function () {
            addOnlyAnimal();
        };
        buttons[1].onclick = function () {
            start();
        }
    } else if (vertex[count] === undefined) {
        printCorrectAnswer(vertex[1]);
        count = 1;
    } else {
        if (answerYES[count] === null) printCorrectAnswer(vertex[count]);
        else {
            printLine(`${vertex[count]} ?`, text);
            buttons[0].textContent = "Да";
            buttons[1].textContent = "Нет";
            buttons[0].onclick = function () {
                count = answerYES[count];
                question();
            };
            buttons[1].onclick = function () {
                count = answerNO[count];
                question();
            };

        }
    }


    /*Проверка на пустой массив */
    // let animal = arrayAnimals[i];
    // if (arrayAnimals.length === 0) {
    //     printLine("Я не знаю ни одного животного. Расскажи)", text);
    //     buttons[0].textContent = "Слушай";
    //     buttons[1].textContent = "Пока";
    //     buttons[0].onclick = function () {
    //         i = 0;
    //         addOnlyAnimal();
    //     };
    //     buttons[1].onclick = function () {
    //         i = 0;
    //         start();
    //     };
    // } else if (arrayAnimals.length === 1) {
    //     printCorrectAnswer(animal);
    // } else {
    //     if (animal.checkNumVet()) {
    //         printCorrectAnswer(animal);
    //     } else {
    //         let questionObject = animal.arrayQuestionsOfAnimal[animal.countGoVet];
    //         printLine(questionObject.question, text);
    //         buttons[0].textContent = "Да";
    //         buttons[1].textContent = "Нет";
    //         questionObject.getAnimal(true).countGoVet++;
    //         questionObject.getAnimal(false).countGoVet++;
    //         buttons[0].onclick = function () {
    //             i = questionObject.getAnimal(true).i;
    //             question();
    //         };
    //         buttons[1].onclick = function () {
    //             i = questionObject.getAnimal(false).i;
    //             question();
    //         };
    //     }
    // }
};

start();
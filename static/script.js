let vertex = {},
    text = document.querySelector("#text"),
    buttons = document.querySelectorAll("button"),
    count = 0;

vertex = {
    1: ["Кот", null, null],
    2: ["Он мяукает", 1, 4],
    3: ["Собака", null, null],
    4: ["У него большие зубы", 8, 6],
    5: ["Волк", null, null],
    6: ["У него большие лапы", 7, 3],
    7: ["Медведь", null, null],
    8: ["Он живет в Африке", 9, 5],
    9: ["Бегемот", null, null]
};
// let xhrVertex = new XMLHttpRequest();
// xhrVertex.open(
//     'GET',
//     'http://localhost:3000/getVertex',
//     true
// );
// xhrVertex.send();
// xhrVertex.onreadystatechange = function () {
//     if (xhrVertex.readyState != 4) {
//         return
//     }
//     if (xhrVertex.status === 200) {
//         let result = JSON.parse(xhrVertex.responseText);
//         vertex = result;
//         console.log(result);
//     } else {
//         console.log('err', xhrVertex.responseText);
//     }
// };
// let xhrAnswerYES = new XMLHttpRequest();
// xhrAnswerYES.open(
//     'GET',
//     'http://localhost:3000/getAnswerYES',
//     true
// );
// xhrAnswerYES.send();
// xhrAnswerYES.onreadystatechange = function () {
//     if (xhrAnswerYES.readyState != 4) {
//         return
//     }
//     if (xhrAnswerYES.status === 200) {
//         let result = JSON.parse(xhrAnswerYES.responseText);
//         answerYES = result;
//         console.log(result);
//     } else {
//         console.log('err', xhrAnswerYES.responseText);
//     }
// };
// let xhrAnswerNO = new XMLHttpRequest();
// xhrAnswerNO.open(
//     'GET',
//     'http://localhost:3000/getAnswerNO',
//     true
// );
// xhrAnswerNO.send();
// xhrAnswerNO.onreadystatechange = function () {
//     if (xhrAnswerNO.readyState != 4) {
//         return
//     }
//     if (xhrAnswerNO.status === 200) {
//         let result = JSON.parse(xhrAnswerNO.responseText);
//         answerNO = result;
//         console.log(result);
//     } else {
//         console.log('err', xhrAnswerNO.responseText);
//     }
// };

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
const firstLetter = (string) => {
    let str = string.toLowerCase();
    return str[0].toUpperCase() + str.slice(1);
};
const checkName = (strName) => {
    let arrayNames = [];
    for (let i = 1; i < Object.keys(vertex).length; i++) {
        arrayNames.push(vertex[i][0]);
    }
    if (arrayNames.indexOf(strName) === -1) return true;
    else return false;
};
/* Стартовая страница */
const start = () => {
    count = 2;
    printLine("Привет, загадай животное", text);
    buttons[0].textContent = "Старт";
    buttons[1].textContent = "Сбросить все";

    buttons[0].onclick = function () {
        question();
    };
    buttons[1].onclick = function () {
        if (confirm("Вы серьёзно ? ")) {
            vertex = {};
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
                vertex[Object.keys(vertex).length + 1] = [];
                vertex[Object.keys(vertex).length][0] = inputsText[1].value;
                vertex[Object.keys(vertex).length + 1] = [];
                vertex[Object.keys(vertex).length][0] = inputsText[0].value;
                vertex[Object.keys(vertex).length][1] = null;
                vertex[Object.keys(vertex).length][2] = null;
                for (let i = 1; i < Object.keys(vertex).length; i++) {
                    if (vertex[i][1] === count) {
                        vertex[i][1] = Object.keys(vertex).length - 1;
                        break;
                    }
                    if (vertex[i][2] === count) {
                        vertex[i][2] = Object.keys(vertex).length - 1;
                        break;
                    }
                }
                if (radioButtuns[0].checked) {
                    /*Добавление и изменение значений ответов если ответ да*/
                    vertex[Object.keys(vertex).length - 1][1] = Object.keys(vertex).length;
                    vertex[Object.keys(vertex).length - 1][2] = count;
                    radioButtuns[0].checked = false;
                } else {
                    /*Добавление и изменение значений ответов если ответ нет*/
                    vertex[Object.keys(vertex).length - 1][1] = count;
                    vertex[Object.keys(vertex).length - 1][2] = Object.keys(vertex).length;

                    radioButtuns[1].checked = false;
                }
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
            vertex[Object.keys(vertex).length + 1] = [];
            vertex[Object.keys(vertex).length][0] = inputsText[4].value;
            vertex[Object.keys(vertex).length][1] = null;
            vertex[Object.keys(vertex).length][2] = null;

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
        printCorrectAnswer(vertex[1][0]);
        count = 1;
    } else {
        if (vertex[count][1] === null) printCorrectAnswer(vertex[count][0]);
        else {
            printLine(`${vertex[count][0]} ?`, text);
            buttons[0].textContent = "Да";
            buttons[1].textContent = "Нет";
            buttons[0].onclick = function () {
                count = vertex[count][1];
                question();
            };
            buttons[1].onclick = function () {
                count = vertex[count][2];
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
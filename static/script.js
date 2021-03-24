let vertices = [],
    text = document.querySelector("#text"),
    buttons = document.querySelectorAll("button"),
    count = 0;

// vertices = [
//     {name: "Кот"},
//     {name: "Он мяукает", answerYes: 1,	answerNo: 4},
//     {name: "Собака"},
//     {name: "У него большие зубы", answerYes: 8, answerNo: 6},
//     {name: "Волк"},
//     {name: "У него большие лапы", answerYes: 7,	answerNo: 3},
//     {name: "Медведь"},
//     {name: "Он живет в Африке", answerYes: 9, answerNo: 5},
//     {name: "Бегемот"}
// ];

/*Получение данных из БД*/
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
        vertices = result;
    } else {
        console.log('err', xhrVertex.responseText);
    }
};

/*Функция печати*/
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
/*Функция преобразования строки в нормальный вид*/
const firstLetter = (string) => {
    let str = string.toLowerCase();
    return str[0].toUpperCase() + str.slice(1);
};
/*Проверка на одиннаковое имя*/
const checkName = (strName) => {
    let arrayNames = [];
    for (let i = 1; i < vertices.length; i++) {
        arrayNames.push(vertices[i].name);
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
            vertices = [];
            xhrTRUNCATE();
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
                vertices[vertices.length] = {};
                vertices[vertices.length - 1].name = inputsText[1].value;
                vertices[vertices.length] = {};
                vertices[vertices.length - 1].name = inputsText[0].value;
                vertices[vertices.length - 1].answerYes = null;
                vertices[vertices.length - 1].answerNo = null;
                for (let i = 1; i < vertices.length; i++) {
                    if (vertices[i].answerYes === count) {
                        vertices[i].answerYes = vertices.length - 2;
                        xhrUPDATE(i, vertices.length - 2, true);
                        break;
                    }
                    if (vertices[i].answerNo === count) {
                        vertices[i].answerNo = vertices.length - 2;
                        xhrUPDATE(i, vertices.length - 2, false);
                        break;
                    }
                }
                if (radioButtuns[0].checked) {
                    /*Добавление и изменение значений ответов если ответ да*/
                    vertices[vertices.length - 2].answerYes = vertices.length - 1;
                    vertices[vertices.length - 2].answerNo = count;
                    radioButtuns[0].checked = false;
                } else {
                    /*Добавление и изменение значений ответов если ответ нет*/
                    vertices[vertices.length - 2].answerYes = count;
                    vertices[vertices.length - 2].answerNo = vertices.length - 1;

                    radioButtuns[1].checked = false;
                }
                xhrINSERT(vertices.length - 2, vertices[vertices.length - 2].name, vertices[vertices.length - 2].answerYes, vertices[vertices.length - 2].answerNo);
                xhrINSERT(vertices.length - 1, vertices[vertices.length - 1].name, vertices[vertices.length - 1].answerYes, vertices[vertices.length - 1].answerNo);
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
/*Проверка объекта на пустоту*/
// const isEmpty = (obj) => {
//     if (vertices === []) return true;
//     else return false;
// };
/*Добавление первого животного*/
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
            vertices[vertices.length + 1] = {};
            vertices[vertices.length - 1].name = inputsText[4].value;
            vertices[vertices.length - 1].answerYes = null;
            vertices[vertices.length - 1].answerNo = null;
            xhrINSERT(vertices.length - 1, inputsText[4].value, null, null);
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

    if (vertices.length === 0) {
        printLine("Я не знаю ни одного животного. Расскажи)", text);
        buttons[0].textContent = "Слушай";
        buttons[1].textContent = "Пока";
        buttons[0].onclick = function () {
            addOnlyAnimal();
        };
        buttons[1].onclick = function () {
            start();
        }
    } else if (vertices[count] === undefined) {
        printCorrectAnswer(vertices[1].name);
        count = 1;
    } else {
        if (vertices[count].answerYes === null) printCorrectAnswer(vertices[count].name);
        else {
            printLine(`${vertices[count].name} ?`, text);
            buttons[0].textContent = "Да";
            buttons[1].textContent = "Нет";
            buttons[0].onclick = function () {
                count = vertices[count].answerYes;
                question();
            };
            buttons[1].onclick = function () {
                count = vertices[count].answerNo;
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
/*Функция xhr запроса на добавление данных в БД */
const xhrINSERT = (ID, name, answerYes, answerNo) => {
    let xhrPOST = new XMLHttpRequest();
    let send = {
        "ID": ID,
        "name": firstLetter(name),
        "answerYes": answerYes,
        "answerNo": answerNo
    };
    let sendString = JSON.stringify(send);
    xhrPOST.open(
        'POST',
        'http://localhost:3000/serverINSERT',
        true
    );
    xhrPOST.setRequestHeader("Content-Type", "application/json");
    xhrPOST.send(sendString);
};
/*Функция xhr запроса на изменение данных в БД */
const xhrUPDATE = (ID, update, boolAnswer) => {
    let xhrPOST = new XMLHttpRequest();
    let send = {
        "ID": ID,
        "update": update,
        "boolAnswer": boolAnswer
    };
    let sendString = JSON.stringify(send);
    xhrPOST.open(
        'POST',
        'http://localhost:3000/serverUPDATE',
        true
    );
    xhrPOST.setRequestHeader("Content-Type", "application/json");
    xhrPOST.send(sendString);
};
/*Функция очищения таблицы в БД */
const xhrTRUNCATE = () => {
    let xhrPOST = new XMLHttpRequest();
    
    xhrPOST.open(
        'POST',
        'http://localhost:3000/serverTRUNCATE',
        true
    );
    xhrPOST.send();
};



start();
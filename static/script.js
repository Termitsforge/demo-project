let mainVertex = {},
    dopVertex,
    text = document.querySelector("#text"),
    buttons = document.querySelectorAll("button");
/*Проверка на пустой объект */
function isEmpty(obj) {
    for (let key in obj) {
        // если тело цикла начнет выполняться - значит в объекте есть свойства
        return false;
    }
    return true;
}
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
/* Стартовая страница */
const start = () => {
    xhrGET();
    printLine("Привет, загадай животное", text);
    buttons[0].textContent = "Старт";
    buttons[1].textContent = "Сбросить все";

    buttons[0].onclick = function () {
        question();
    };
    buttons[1].onclick = function () {
        if (confirm("Вы серьёзно ? ")) {
            xhrDELETE();
            xhrGET();
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
            /*Добавление нового животного и вопроса */
            mainVertex.question = inputsText[1].value;
            if (radioButtuns[0].checked) {
                /*Добавление и изменение значений ответов если ответ да*/
                mainVertex.answerYes = {
                    name: inputsText[0].value
                };
                mainVertex.answerNo = {
                    name: mainVertex.name
                };
                radioButtuns[0].checked = false;
            } else {
                /*Добавление и изменение значений ответов если ответ нет*/
                mainVertex.answerYes = {
                    name: mainVertex.name
                };
                mainVertex.answerNo = {
                    name: inputsText[0].value
                };
                radioButtuns[1].checked = false;
            }
            delete mainVertex.name;
            inputsText[0].value = "";
            inputsText[1].value = "";
            mainBox.style.display = "block";
            addAnimalBox.style.display = "none";
            xhrSEND();
            start();
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
            mainVertex.name = inputsText[4].value;
            xhrSEND();
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
    if (isEmpty(mainVertex)) {
        printLine("Я не знаю ни одного животного. Расскажи)", text);
        buttons[0].textContent = "Слушай";
        buttons[1].textContent = "Пока";
        buttons[0].onclick = function () {
            addOnlyAnimal();
        };
        buttons[1].onclick = function () {
            start();
        }
    } else if (mainVertex.name !== undefined) {
        printCorrectAnswer(mainVertex.name);
    } else {
        printLine(`${mainVertex.question} ?`, text);
        buttons[0].textContent = "Да";
        buttons[1].textContent = "Нет";
        buttons[0].onclick = function () {
            mainVertex = mainVertex.answerYes;
            question();
        };
        buttons[1].onclick = function () {
            mainVertex = mainVertex.answerNo;
            question();
        };
    }
};
/*Отправка данных на сервер */
const xhrSEND = () => {
    let xhrPOST = new XMLHttpRequest();
    let sendString = JSON.stringify(dopVertex);
    xhrPOST.open(
        'POST',
        'http://localhost:3000/serverSEND',
        true
    );
    xhrPOST.setRequestHeader("Content-Type", "application/json");
    xhrPOST.send(sendString);
};
/*Удаление данных из файла */
const xhrDELETE = () => {
    let xhrPOST = new XMLHttpRequest();
    xhrPOST.open(
        'POST',
        'http://localhost:3000/serverDEL',
        true
    );
    xhrPOST.setRequestHeader("Content-Type", "application/json");
    xhrPOST.send();
};
/*Получение данных с файла */
const xhrGET = () => {
    let xhrPOST = new XMLHttpRequest();
    xhrPOST.open(
        'POST',
        'http://localhost:3000/serverGET',
        true
    );
    xhrPOST.send();
    xhrPOST.onreadystatechange = function () {
        if (xhrPOST.readyState != 4) {
            return
        }
        if (xhrPOST.status === 200) {
            let result = JSON.parse(xhrPOST.responseText);
            dopVertex = result;
            mainVertex = result;
        } else {
            console.log('err', xhrPOST.responseText);
        }
    };
};




start();
let xhr = new XMLHttpRequest();
xhr.open(
    'GET',
    'http://localhost:3000/getAnimals',
    true
);
xhr.send();
xhr.onreadystatechange = function () {
    if (xhr.readyState != 4) {
        return
    }

    if (xhr.status === 200) {
        let result = JSON.parse(xhr.responseText);
        for (let i = 0; i < result.length; i++) {
            objectFactoryAnimal(firstLetter(result[i].name));
        }
    } else {
        console.log('err', xhr.responseText);
    }
}



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
            }, 80)
    }
    typeLine();

}

let text = document.querySelector("#text"),
    buttons = document.querySelectorAll("button"),
    arrayAnimals = [],
    arrayQuestions = [];
let i = 0;

/* Класс Животное */
class Animal {
    constructor(name, numberVet, countGoVet) {
        this.name = name;
        this.numberVet = 0;
        this.countGoVet = 0;
        this.arrayQuestionsOfAnimal = [];
        this.i = arrayAnimals.length;
    }
    addQuestion(question) {
        this.arrayQuestionsOfAnimal.push(question);
    }
    /*Проверка не является ли животное свободной вершиной
    Если является, то возвращает true */
    checkNumVet() {
        if (this.numberVet === this.countGoVet) return true;
        else return false;
    }
    getQuestions() {
        return this.arrayQuestionsOfAnimal[this.countGoVet];
    }
}
class Question {
    constructor(question, animalTrue, animalFalse) {
        this.question = question;
        this.animalTrue = animalTrue;
        this.animalFalse = animalFalse;
    }
    getAnimal(bool) {
        if (bool) return this.animalTrue;
        else return this.animalFalse;
    }

}
/*Функция создание объекта и добавление его в массив
Если животное с таким именем уже созданно, то он просто добавляет ему вопрос*/
const objectFactoryAnimal = (name) => {
    arrayAnimals.push(new Animal(name));
};
const firstLetter = (string) => {
    let str = string.toLowerCase();
    return str[0].toUpperCase() + str.slice(1);
};
const objectFactoryQuestion = (question, animalTrue, animalFalse) => {
    arrayQuestions.push(new Question(question, animalTrue, animalFalse));
    animalTrue.arrayQuestionsOfAnimal.push(arrayQuestions[arrayQuestions.length - 1]);
    animalTrue.numberVet++;
    animalFalse.arrayQuestionsOfAnimal.push(arrayQuestions[arrayQuestions.length - 1]);
    animalFalse.numberVet++;
};
const defaultSittings = () => {
    for (let i = 0; i < arrayAnimals.length; i++) {
        arrayAnimals[i].countGoVet = 0;
    }
};
const checkName = (strName) => {
    let set = 0;
    for (let i = 0; i < arrayAnimals.length; i++) {
        if (arrayAnimals[i].name === strName) set++;
    }
    if (set === 0) return true;
    else return false;
};
/* Стартовая страница */
const start = () => {
    defaultSittings();
    printLine("Привет, загадай животное", text);
    buttons[0].textContent = "Старт";
    buttons[1].textContent = "Сбросить все";

    buttons[0].onclick = function () {
        i = 0;
        question();
    };
    buttons[1].onclick = function () {
        if (confirm("Вы серьёзно ? ")) {
            arrayAnimals = [];
            arrayQuestions = [];
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
        let animalTrue,
            animalFalse;
        if (!(inputsText[0].value === "") && !(inputsText[1].value === "")) {
            if (checkName(inputsText[0].value)) {
                objectFactoryAnimal(inputsText[0].value);

                let xhttp = new XMLHttpRequest();
                xhttp.open('POST', '/server', true);
                xhttp.setRequestHeader("Content-type", "application/json");
                let send = {};
                send.name = inputsText[0].value;
                let sendString = JSON.stringify(send);
                xhttp.send(sendString);


                if (radioButtuns[0].checked) {
                    animalTrue = arrayAnimals[arrayAnimals.length - 1];
                    animalFalse = arrayAnimals[i];
                    radioButtuns[0].checked = false;
                } else {
                    animalFalse = arrayAnimals[arrayAnimals.length - 1];
                    animalTrue = arrayAnimals[i];
                    radioButtuns[1].checked = false;
                }
                objectFactoryQuestion(inputsText[1].value, animalTrue, animalFalse);
                inputsText[0].value = "";
                inputsText[1].value = "";
                mainBox.style.display = "block";
                addAnimalBox.style.display = "none";
                arrayQuestionAsked = {};


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
        arrayQuestionAsked = {};
        start();
    };

};
const addOnlyAnimal = () => {
    let mainBox = document.querySelector(".main__box"),
        addAnimalBox = document.querySelector(".addNewAnimal"),
        addOnlyBox = document.querySelector(".add__only__animal"),
        inputsText = document.querySelectorAll("input"),
        addText = document.querySelector(".add__only__h1");

    mainBox.style.display = "none";
    addAnimalBox.style.display = "none";
    addOnlyBox.style.display = "block";
    buttons[4].onclick = function () {
        if (!(inputsText[4].value === "")) {
            objectFactoryAnimal(inputsText[4].value);
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

    printLine("Расскажи о животном ", addText);
};
/*Станица с перечислением вопросов*/

const question = () => {
    function printCorrectAnswer(animal) {
        printLine(`Это ${animal.name} ?`, text);
        buttons[0].textContent = "Верно";
        buttons[1].textContent = "Не верно";

        buttons[0].onclick = function () {
            start();
        };
        buttons[1].onclick = function () {
            AddNewAnimal();
        };
    }




    /*Проверка на пустой массив */
    let animal = arrayAnimals[i];
    if (arrayAnimals.length === 0) {
        printLine("Я не знаю ни одного животного. Расскажи)", text);
        buttons[0].textContent = "Слушай";
        buttons[1].textContent = "Пока";
        buttons[0].onclick = function () {
            i = 0;
            addOnlyAnimal();
        };
        buttons[1].onclick = function () {
            i = 0;
            start();
        };
    } else if (arrayAnimals.length === 1) {
        printCorrectAnswer(animal);
    } else {
        if (animal.checkNumVet()) {
            printCorrectAnswer(animal);
        } else {
            let questionObject = animal.arrayQuestionsOfAnimal[animal.countGoVet];
            printLine(questionObject.question, text);
            buttons[0].textContent = "Да";
            buttons[1].textContent = "Нет";
            questionObject.getAnimal(true).countGoVet++;
            questionObject.getAnimal(false).countGoVet++;
            buttons[0].onclick = function () {
                i = questionObject.getAnimal(true).i;
                question();
            };
            buttons[1].onclick = function () {
                i = questionObject.getAnimal(false).i;
                question();
            };
        }
    }
};
start();
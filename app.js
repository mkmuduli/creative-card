const cards = [];

const creationColorButtonSelector = ".creation-container .color__body .color__btn";
const filterColorButtonSelector = ".filter-box .color__body .color__btn";

function debounce(func, timeout = 300){
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
  }

const fetchColors = () => {
    const colorUrl = "https://random-flat-colors.vercel.app/api/random?count=5";
    return fetch(colorUrl).then(resp => {
        return resp.json();
    }).then((data) => data.colors).catch((err) => {
        return []
    })
}

const addColorBtn = (parentNode, colors) => {
    colors.forEach(eachColor => {
        const btn = document.createElement('button');
        btn.className = "color__btn";
        btn.style.backgroundColor = eachColor;
        parentNode.appendChild(btn)
    });
}

const onAddCreation = (e) => {
    e.target.setAttribute("disabled", "");

    const creationEle = document.querySelector(".creation-container");
    creationEle.classList.remove('d-none');
}

const onCloseCreation = () => {
    const creationEle = document.querySelector(".creation-container");
    creationEle.classList.add('d-none');

    const addCreativeBtn = document.querySelector(".present-body .button-1");
    addCreativeBtn.removeAttribute("disabled");

}

const getSelectedColor = (query) => {
    const buttons = document.querySelectorAll(query);
    let color;
    buttons.forEach(eachBtn => {
        if (null !== eachBtn.getAttribute("active")) {
            color = eachBtn.style.backgroundColor;
        }
    })
    return color;
}

const filterCards = () => {
    const color = getSelectedColor(filterColorButtonSelector);
    const inputEle = document.querySelector(".filter-box .search__input");
    const text = inputEle.value;

    const cardContainer = document.querySelector('.card-container');
    cardContainer.innerHTML ="";
    cards.forEach((eachCard)=>{
        if(color && color !== eachCard.color) return;
        if(text && !eachCard.title.toLowerCase().includes(text.toLowerCase()) && !eachCard.subtitle.toLowerCase().includes(text.toLowerCase())) return;

        const elem = document.createElement("div");
        elem.classList.add('creative-card');
        elem.innerHTML = `<h2 class="creative-card__heading">${eachCard.title}</h2><h4 class="creative-card__subheading">${eachCard.subtitle}</h4>`;
        elem.style.backgroundColor = eachCard.color;
        cardContainer.appendChild(elem);
    })
}

const resetColor = (query) => {
    const buttons = document.querySelectorAll(query);
    buttons.forEach(eachBtn => {
        eachBtn.removeAttribute("active");
    })
}

const addCards = (card) => {
    filterCards();
    const progressEle = document.querySelector('.progress__body');
    const prevValue = progressEle.getAttribute("value");
    progressEle.setAttribute("value", parseInt(prevValue, 10) + 1);

    const ele = document.getElementById("progressValue");
    ele.innerHTML = parseInt(prevValue, 10) + 1;
}

const clearCreationField = () => {
    const creationInputs = document.querySelectorAll(".creation-container .search__input");
    creationInputs[0].value = "";
    creationInputs[1].value = "";
    resetColor(creationColorButtonSelector);
    document.querySelector('.cross__btn').click();
}

const onDoneClick = () => {
    if (cards.length === 5) return;
    const creationInputs = document.querySelectorAll(".creation-container .search__input");
    const color = getSelectedColor(creationColorButtonSelector);
    if (!creationInputs[0].value || !creationInputs[1].value || !color) {
        window.alert("please fill all field");
    } else {
        const card = {
            title: creationInputs[0].value,
            subtitle: creationInputs[1].value,
            color
        };
        cards.push(card);
        if (cards.length === 5) {
            const addCreativeBtn = document.querySelector(".present-body .button-1");
            addCreativeBtn.setAttribute("disabled", "");
        }
        addCards(card);
        clearCreationField();
    }
}

const addListenerOnButtons = (query, cb) => {
    const elements = document.querySelectorAll(query);
    elements.forEach(eachBtn => {
        eachBtn.addEventListener("click", (e) => {
            cb(e, elements);
            if (query === filterColorButtonSelector) filterCards();
        });
    });
}

const onColorSelect = (e, buttons) => {
    buttons.forEach(eachBtn => {
        if (eachBtn === e.target) {
            if (null == eachBtn.getAttribute("active")) eachBtn.setAttribute("active", "");
            else eachBtn.removeAttribute("active");
        }
        else eachBtn.removeAttribute("active");
    });
}

const onFilterInoutChange = () => {
    filterCards();
}


(async function () {
    const filterBtnContainer = document.querySelector(".filter-box .color__body");
    const creationBtnContainer = document.querySelector(".creation-container .color__body");
    const closeCreationBtn = document.querySelector('.cross__btn');
    const doneBtn = document.querySelector('.button-1--done');

    const colors = await fetchColors();
    addColorBtn(filterBtnContainer, colors);
    addColorBtn(creationBtnContainer, colors);

    const addCreativeBtn = document.querySelector(".present-body .button-1");

    addCreativeBtn.addEventListener("click", onAddCreation);
    closeCreationBtn.addEventListener("click", onCloseCreation);
    doneBtn.addEventListener("click", onDoneClick);

    addListenerOnButtons(creationColorButtonSelector, onColorSelect);

    addListenerOnButtons(filterColorButtonSelector, onColorSelect);
    const filterInputEle = document.querySelector(".filter-box .search__input");
    filterInputEle.addEventListener('keyup', debounce(onFilterInoutChange));


})();
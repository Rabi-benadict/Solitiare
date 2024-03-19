
// var root = document.querySelector(':root');
// var rootStyle = getComputedStyle(root);
// var topValue = rootStyle.getPropertyValue('--top');
// // document.getElementById(`${selected.id}`)



// Creating cards with id //

// varisble declarations //
var newDiv, element, sel, child, lastCard, tableNo;
var stock = document.getElementById('stock');
var stockReveal = document.getElementById('stockRevealer');
var sortTable = document.querySelectorAll('.sortingTable');
let par;
var kingCards = ['card13', 'card26', 'card39', 'card52'];
var win;
var reloadButton = document.getElementById('shuffleCont');
let aud = document.querySelector('#pass audio');
var gtaEl = document.getElementById("pass");
var winEl = document.getElementById('winTxt');
var iconCont = document.getElementById('iconCont');


var parArr = ['table1', 'table2', 'table3', 'table4', 'table5', 'table6', 'table7'];
var selected = null;
createCard();



function createCard() {
    var k = 1;
    for (let i = 1; i <= 4; i++) {
        for (let j = 1; j <= 13; j++) {
            newDiv = document.createElement('div');
            newDiv.id = `card${k}`;
            var specialCards = j == 1 ? 'ace' : j == 13 ? 'king' : j == 12 ? 'queen' : j == 11 ? 'jack' : j; // for portrait cards
            newDiv.style.backgroundImage = i == 1 ? `url(source/cards/${specialCards}_of_spades.svg)` : i == 2 ? `url(source/cards/${specialCards}_of_clubs.svg)` : i == 3 ? `url(source/cards/${specialCards}_of_hearts.svg)` : `url(source/cards/${specialCards}_of_diamonds.svg)`;
            if (i == 1 || i == 2) {
                newDiv.classList.add('black', 'card');
            }
            else if (i == 3 || i == 4) {
                newDiv.classList.add('red', 'card');
            }
            newDiv.draggable = true;
            stock.appendChild(newDiv);
            k++;
        }
    }
    window.addEventListener('beforeunload', reload);
    dragAndDrop();
    // shuffle();
    arrange();
    addClickForStock();
    conditionForAppendAnswer();
    announceWinner();
}

function reload(event) {
    event.preventDefault();
    event.returnValue = '';
}


// Remove click function
// function removeClick(sel, element) {
//     sel.removeEventListener('click', );
// }

function transfer() {
    if (stock.childNodes.length == 0) {
        for (let i = stockReveal.childElementCount - 1; i >= 0; i--) {
            stock.appendChild(stockReveal.childNodes[i]);
        }
    }
}

function addClicking() {
    var clickable = document.querySelectorAll('#stock div');
    clickable.forEach(element => {
        element.addEventListener('click', clickHandler);
    });
}


// Handler for click

function clickHandler(element) {
    stockReveal.appendChild(element);
}




// function for arranging cards in table // 

function arrange() {
    for (let i = 7; i > 0; i--) {
        let idx = 1;
        let check = 0;
        for (let j = i; j > 0; j--) {
            lastCardFromStock = document.querySelector('#stock :last-child'); // last card from stock table
            tableNo = document.getElementById(`table${i}`);          // table preference
            if (check == 0) {
                child = lastCardFromStock;
                document.getElementById(child.id).style.top = calculateIntend(`table${i}`) + 'px';
                document.getElementById(child.id).style.zIndex = idx;
                tableNo.appendChild(child);
                child.classList.add('back');
                check = 1;
                idx++;
            }
            else {
                console.log(tableNo);
                child = lastCardFromStock;
                document.getElementById(child.id).style.top = calculateIntend(`table${i}`) + 'px';
                document.getElementById(child.id).style.zIndex = idx;
                tableNo.appendChild(child);
                child.classList.add('back');
                idx++;
            }
            if (j == 1) {
                child.classList.add(`lastCardOfTable${i}`);
                child.classList.remove('back');
            }
        }
    }
}


// Drag and drop functions //

function dragAndDrop() {
    var elements = document.getElementsByClassName('card');
    for (let element of elements) {
        element.addEventListener('dragstart', function (event) {
            selected = event.target;
            console.log(selected);
            console.log(selected.id);
        });
    }

    stockReveal.addEventListener('dragover', function (e) {
        e.preventDefault();
    });

    stockReveal.addEventListener('drop', function () {
        if (selected.parentElement == stock) {
            stockReveal.appendChild(selected);
        }
    });

    sortTable.forEach(sel => {
        let parent;

        sel.addEventListener('dragover', function (e) {
            e.preventDefault();
        });

        sel.addEventListener('drop', function () {
            parArr.includes(sel.id) ? par = sel : par = sel.parentElement;
            if (sel.hasChildNodes() == true) {
                console.log(sel);
                console.log(par, 'parent');  // parent table
                if (par.lastChild.hasChildNodes()) {
                    while (par.lastChild.hasChildNodes()) {
                        par = par.lastChild;
                    }
                }

                if (isConsecutive(colorAndID(par), selected)) {
                    let consecutiveParent = document.querySelector(`#${par.id} :last-child`);
                    selected.style.top = calculateIntend(consecutiveParent.id) + 50 + 'px';
                    consecutiveParent.appendChild(selected);
                }
            }
            else {
                if (kingCards.includes(selected.id)) {
                    console.log(sel.id)
                    selected.style.top = calculateIntend(`${sel.id}`) + 'px';
                    sel.insertAdjacentElement("beforeend", selected);
                    // selected = null;
                }
            }
            changeBehavior();
            console.log(sel); //table
        });
    });
}


// To find the last child //
function getLastCardOf(el) {  // parent param //
    while (el.hasChildNodes()) {
        el = document.querySelector(`#${el.id} :last-child`);
    }
    return el;   // It will return the last child element //
}


// Function to calculate the intendation //
function calculateIntend(parentID) {            // can we use table id ? //
    let parent = document.getElementById(`${parentID}`);
    let count = parent.childElementCount;
    console.log(count);
    (selected == null) ? console.log('selected illapa') : selected.style.zIndex = count;;
    return (+count * 50);  // It will return the intend count from top ---> (parent) //
}


// append condition //
function conditionForHavingChild(tableID) {
    let table = document.getElementById(tableID);
    if (table.hasChildNodes()) {
        let tableLastCard = document.querySelector(`#${table.id} :last-child`);
        console.log('hii');
        if (tableLastCard.hasChildNodes()) {
            return true;
        }
    }
    else {
        return false;
    }
}


// click event listener // 
function addClickForStock() {
    var clickable = document.getElementsByClassName('card');
    for (let card of clickable) {
        card.addEventListener('click', () => {
            if (card.parentElement == stock) {
                stockReveal.append(card);
            }
        })
    }
}








function changeBehavior() {
    let lastCardForChnge;
    for (let table of sortTable) {
        console.log(table);
        Object.values(table.children).forEach(x => x.classList.add('idle'));
        lastCardForChnge = getLastCardOf(table);
        lastCardForChnge.classList.remove('back');
        lastCardForChnge.classList.remove('idle');
        console.log(lastCardForChnge);
        console.log('line 240 ley');
        console.log('line 243 ley');
        let lastCardd = table.lastChild;
        if (lastCardd == null || lastCardd == undefined) {
            continue;
        }
        while (lastCardd.hasChildNodes()) {
            lastCardd.classList.remove('idle');
            lastCardd = lastCardd.lastChild;
        }
        lastCardForChnge.parentElement.classList.remove('idle');
    }
}



function shuffle() {
    let elArr = document.querySelectorAll('#stock div');
    let collectionOfId = [];
    for (let el of elArr) {
        collectionOfId.push(el.id);
    }
    let i = collectionOfId.length;
    while (--i > 0) {
        let x = Math.floor(Math.random() * (i + 1));
        [collectionOfId[x], collectionOfId[i]] = [collectionOfId[i], collectionOfId[x]];
    }
    for (let el of collectionOfId) {
        stock.append(document.getElementById(el));
    }
}


function conditionForAppendAnswer() {
    var i = 1, j = 14, k = 27, l = 40;
    let ansCont = document.querySelectorAll('.ans');
    console.log(ansCont);
    for (let el of ansCont) {
        el.addEventListener('dragover', function (e) {
            e.preventDefault();
        });

        el.addEventListener('drop', function () {
            console.log(el);                        // el ---> ans-table //
            if (`${el.id}` == 'deckForSpade' && selected.id == `card${i}` && i < 14) {
                el.appendChild(selected);
                selected.style.top = '0px';
                selected.style.zIndex = 0;
                i++;
                changeBehavior();
                announceWinner();
            }
            if (`${el.id}` == 'deckForClub' && selected.id == `card${j}` && j < 27) {
                el.appendChild(selected);
                selected.style.top = '0px';
                selected.style.zIndex = 0;
                j++;
                changeBehavior();
                announceWinner();
            }
            if (`${el.id}` == 'deckForHeart' && selected.id == `card${k}` && k < 52) {
                el.appendChild(selected);
                selected.style.top = '0px';
                selected.style.zIndex = 0;
                k++;
                changeBehavior();
                announceWinner();
            }
            if (`${el.id}` == 'deckForDiamond' && selected.id == `card${l}`) {
                el.appendChild(selected);
                selected.style.top = '0px';
                selected.style.zIndex = 0;
                l++;
                changeBehavior();
                announceWinner();
            }
        });
    }
}





// To find last element's color and id with <parent element>//
// par //  ---- use it-uh
function colorAndID(parent) {
    let lastEl = getLastCardOf(parent);
    return [+(lastEl.id.match(/\d+/)) % 13, lastEl.classList[0]]; // It will return number and card color //
}


// To find consecutive //
// func colorAndID will give last element value and color //
// This function will return the boolean value // 
function isConsecutive(lastEl, selected) { // call lastEl with colrAndID //
    lastEl[0] == 0 ? lastEl[0] = 13 : '';
    let colorOfsel = selected.classList[0];
    let selectedVal = +selected.id.match(/\d+/) % 13;
    if (selectedVal == lastEl[0] - 1 && lastEl[1] != colorOfsel) {
        return true;
    }
    else {
        return false;
    }
}

function colorAndIDForParent(el) {
    return [+(el.id.match(/\d+/)) % 13, el.classList[0]]; // It will return number and card color //
}

// add reload event //
reloadButton.addEventListener('click', () => {
    window.location.reload();
})


function announceWinner() {
    let check = 0;
    let arrOfAnsCont = document.getElementsByClassName('ans');
    if (win == 'lost') {
        window.removeEventListener('beforeunload', reload);
        gtaEl.classList.remove('dispNone');
        setTimeout(() => {
            gtaEl.classList.add('dispNone');
            winEl.classList.remove('dispNone');
            setTimeout(() => {
                iconCont.classList.remove('dispNone');
            }, 2500)
            // window.location.href = "win.html";
        }, 6000);
        aud.play();
    }
    for (let cont of arrOfAnsCont) {
        if (cont.childElementCount < 13) {
            break;
        }
        window.removeEventListener('beforeunload', reload);
        gtaEl.classList.remove('dispNone');
        setTimeout(() => {
            gtaEl.classList.add('dispNone');
            winEl.classList.remove('dispNone');
            setTimeout(() => {
                iconCont.classList.remove('dispNone');
            }, 2500)
            // window.location.href = "win.html";
        }, 6000);
        aud.play();
    }
    return false;
}

const winn = () => {
    window.removeEventListener('beforeunload', reload);
    gtaEl.classList.remove('dispNone');
    setTimeout(() => {
        gtaEl.classList.add('dispNone');
        winEl.classList.remove('dispNone');
        setTimeout(() => {
            iconCont.classList.remove('dispNone');
        }, 2500)
        // window.location.href = "win.html";
    }, 6000);
    aud.play();
}

function goToHome() {
    window.location.href = 'intro.html';
    winEl.classList.add('dispNone');
}

function retry() {
    window.location.reload();
}

function goToPlay() {
    window.location.href = 'sol.html';
    createCard();
}

function toggleNone() {
    let inBox = document.getElementById('instructionBox');
    inBox.classList.toggle('dispNone');
}





































































































































































































// function createCard() {
//     for (let i = 0; i < 52; i++) {
//         newDiv = document.createElement('div');
//         newDiv.addEventListener('click', function () {
//             stockReveal.appendChild(newDiv); // Move the div to stockReveal
//         });
//         if (i < 13) {
//             newDiv.classList.add('black', 'card');
//             newDiv.style.backgroundImage = 'url(source/cards/ace_of_spades.svg)';
//         }
//         else if (i < 26) {
//             newDiv.classList.add('black', 'card');
//             newDiv.style.backgroundImage = 'url(source/cards/ace_of_spades.svg)';
//         }
//         else if (i < 39) {
//             newDiv.classList.add('red', 'card');
//             newDiv.style.backgroundImage = 'url(source/cards/ace_of_spades.svg)';
//         }
//         else {
//             newDiv.classList.add('red', 'card');
//             newDiv.style.backgroundImage = 'url(source/cards/ace_of_spades.svg)';
//         }
//         newDiv.draggable = true;
//         stock.appendChild(newDiv);
//     }
// }












// for (let i = 1; i <= 4; i++) {
//     let specialCards = i == 1 ? 'ace' : i == 4 ? 'king' : i == 3 ? 'queen' : i == 2 ? 'jack' : i; // for portrait cards
//     for (let j = 0; j < 13; j++) {
//         let newDiv = document.createElement("div");
//         newDiv.classList.add('card');

//         // Determine the suit based on 'i'
//         let suit;
//         if (i == 1) {
//             suit = 'spades';
//             newDiv.classList.add('black');
//         } else if (i == 2) {
//             suit = 'clubs';
//             newDiv.classList.add('black');
//         } else if (i == 3) {
//             suit = 'hearts';
//             newDiv.classList.add('red');
//         } else {
//             suit = 'diamonds';
//             newDiv.classList.add('red');
//         }

//         newDiv.style.backgroundImage = `url(source/cards/${specialCards}_of_${suit}.svg)`;
//         newDiv.draggable = true;
// newDiv.addEventListener('click', function () {
//     stockReveal.appendChild(newDiv); // Move the div to stockReveal
// });
// stock.appendChild(newDiv);
// newDiv = null;
//     }
// }




// 17-oct
// //creating cards with id//
// var newDiv, element, sel;
// var stock = document.getElementById('stock');
// var stockReveal = document.getElementById('stockRevealer');
// var sortTable = document.querySelectorAll('.sortingTable');
// var root = document.querySelector(':root');
// var rootStyle = getComputedStyle(root);
// var top = rootStyle.getPropertyValue('--top');
// var selected = null;
// createCard();
// function createCard() {
//     var k = 1;
//     for (let i = 1; i <= 4; i++) {
//         for (let j = 1; j <= 13; j++) {
//             newDiv = document.createElement('div');
//             newDiv.id = `card${k}`;
//             var specialCards = j == 1 ? 'ace' : j == 13 ? 'king' : j == 12 ? 'queen' : j == 11 ? 'jack' : j; // for portrait cards
//             newDiv.style.backgroundImage = i == 1 ? `url(source/cards/${specialCards}_of_spades.svg)` : i == 2 ? `url(source/cards/${specialCards}_of_clubs.svg)` : i == 3 ? `url(source/cards/${specialCards}_of_hearts.svg)` : `url(source/cards/${specialCards}_of_diamonds.svg)`;
//             if (i == 1 || i == 2) {
//                 newDiv.classList.add('black', 'card');
//             }
//             else if (i == 3 || i == 4) {
//                 newDiv.classList.add('red', 'card');
//             }

//             newDiv.draggable = true;
//             stock.appendChild(newDiv);
//             // newDiv = null;
//             k++;
//         }
//     }
//     addClicking();
//     dragAndDrop();
// }



// function addClicking() {
//     var clickable = document.querySelectorAll('#stock div');
//     clickable.forEach(element => {              // Move the div to stockReveal
//         // element.addEventListener('click', () => clickHandler(element))
//         element.addEventListener('click', handle);


//         function handle() {
//             clickHandler(element)
//         }

//         // element.removeEventListener('click', function() {
//         //     clickHandler(element);
//         // });
//     })
// }




// // drag and drop functions //

// function dragAndDrop() {
//     var elements = document.getElementsByClassName('card');
//     for (let element of elements) {
//         element.addEventListener('dragstart', function (event) {
//             selected = event.target;
//             console.log(selected);
//             console.log(selected.id);
//         })
//     }
//     stockReveal.addEventListener('dragover', function (e) {
//         e.preventDefault();
//     })
//     stockReveal.addEventListener('drop', function () {
//         stockReveal.appendChild(selected);
//         removeClick(selected);
//         // selected = null;
//     })
//     sortTable.forEach(sel => {
//         sel.addEventListener('dragover', function (e) {
//             e.preventDefault();
//         })
//         sel.addEventListener('drop', function () {
//             if (sel.hasChildNodes() == true && !sel.contains(selected)) {
//                 sel = sel.id;
//                 sel = document.querySelector(`#${sel} :last-child`);
//                 sel.append(selected);
//                 selected = null;
//             }
//             else {

//                 sel.append(selected);
//                 selected = null;
//             }

//             // removeClick(sel, selected);
//             console.log(sel)
//             console.log('wertdfygu');
//             // selected = null;
//         })
//     })
// }

// // function removeClick(sel, element) {
// //     sel.removeEventListener('click', );
// // }


// function transfer() {
//     if (stock.childNodes.length == 0) {
//         for (let i = stockReveal.childElementCount - 1; i >= 0; i--) {
//             stock.appendChild(stockReveal.childNodes[i]);
//         }
//     }
// }



// thursday //
// // function for arranging cards in table // 

// function arrange() {
//     for (let i = 7; i > 0; i--) {
//         let check = 0;
//         let tempParent;
//         topValue
//         for (let j = i; j > 0; j--) {
//             lastCardFromStock = document.querySelector('#stock :last-child'); // last card from stock table
//             tableNo = document.getElementById(`table${i}`);          // table preference
//             if (check == 0) {
//                 child = lastCardFromStock;
//                 tempParent = child;                                  // It will help to make child as parent
//                 tableNo.appendChild(child);
//                 child.classList.add('back');
//                 check = 1;
//             }
//             else {
//                 console.log(tableNo);
//                 child = lastCardFromStock;
//                 tempParent.append(child);
//                 child.classList.add('back');
//                 tempParent = child;
//             }
//             if (j == 1) {
//                 child.classList.add(`lastCardOfTable${i}`);
//                 child.classList.remove('back');
//             }
//         }
//     }
// }



// // Friday
// function dragNdrop() {
//     console.log(sortTable, 'so')
//     sortTable.forEach(sel => {
//         sel.addEventListener('dragover', function (e) {
//             e.preventDefault();
//         });

//         sel.addEventListener('drop', function () {
//             let tableID = sel.parentElement;
//             // let table = sel.parentElement.id;
//             console.log(tableID, 'tab');
//             console.log(sel, 'naanu');
//             if (sel.hasChildNodes() == true) {
//                 console.log(sel.id)
//                 sel = sel.id;                       // Table - ID //
//                 let lastEl = document.querySelector(`#${sel} :last-child`);
//                 selected.style.top = calculateIntend(sel.id) + 'px';
//                 console.log(sel.id, 'ithu');
//                 lastEl.insertAdjacentElement("beforeend", selected);
//                 // selected = null;
//             }
//             else {
//                 console.log(sel.id);
//                 selected.style.top = calculateIntend(sel.id) + 'px';
//                 sel.insertAdjacentElement("beforeend", selected);
//                 // selected = null;
//             }
//             console.log(sel);
//         });
//     });
// }
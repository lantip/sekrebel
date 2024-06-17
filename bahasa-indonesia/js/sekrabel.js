let get = (tag) => document.querySelector(tag);
let gets = (tag) => document.querySelectorAll(tag);
let draggingTarget = null;
let hint = get('.hint');
let resetBtn = get('.reset');
let playBtn = get('.play');
let nextBtn = get('.next');
let displayBoxes = gets('.display-box');
let alphabox = gets('.alphabets-block>div>img');
let displayRow = get('.display-row');
let hintsSection = get('#hints');
let alphabetsSection = get('.alphabets-block');
let empty = Array.from(document.querySelectorAll('.display-box'));
let hintAnswer = get('.hintAnswer');
let scoreBox = get('.scorebox');
let scbener = get('.bener');
let scsalah = get('.salah');
let scscore = get('.sekor');
let sckoreksi = get('.koreksi');
let itemAppend = null;
let drag = null;

function titleCase(str) {
    return str.toLowerCase().split(' ').map(function(word) {
      return word.replace(word[0], word[0].toUpperCase());
    }).join(' ');
}

function countScore(item, value) {
    console.log(item, value);
    let nilai = localStorage.getItem("score-hewan");
    let koreksi = localStorage.getItem("koreksi-hewan");
    let sumnil = {};
    let koreksis = [];
    if (koreksi) {
        koreksis = JSON.parse(koreksi);
    }
    let beners = 0;
    let salahs = 0;
    let scores = 0;
    if (nilai) {
        sumnil = JSON.parse(nilai);
        if (item in sumnil) {
            koreksis.push(item);
            if (value == true) {
                sumnil[item] = value;
            }
        } else {
            sumnil[item] = value;
        }
    } else {
        sumnil[item] = value;
    }
    localStorage.setItem("score-hewan", JSON.stringify(sumnil));
    localStorage.setItem("koreksi-hewan", JSON.stringify(koreksis));
    
    for (const [key, val] of Object.entries(sumnil)) {
        let num = wordDetails[key].noOfBoxes;
        if (val == true) {
            if (key in koreksis) {
                scores = parseInt(scores) + (parseInt(num) * 3);
            } else {
                scores = parseInt(scores) + (parseInt(num) * 5);
            }
            beners = parseInt(beners) + 1;
        } else {
            scores = parseInt(scores) - (parseInt(num) * 1);
            salahs = parseInt(salahs) + 1;
        }
    }
    scscore.innerHTML = scores;
    scbener.innerHTML = beners;
    scsalah.innerHTML = salahs;
    sckoreksi.innerHTML = koreksis.length;
    scoreBox.style.display = "block";
}

const writeToPage = () => {
    let i = 1; 
    nextBtn.addEventListener('click',function(){
        hintAnswer.innerHTML = " ";
        get('.result').innerHTML = "";
        while(displayRow.firstChild){
            displayRow.removeChild(displayRow.firstChild);
        }
        if(i < wordDetails.length){
            hint.src = "binatang/"+wordDetails[i].hint;
            let num = wordDetails[i].noOfBoxes;
            for(let x = 0; x < num; x++){
                let divBox = document.createElement("div");
                divBox.className = 'display-box';
                displayRow.appendChild(divBox);
            }
            displayRow.id = i;
            displayRow.style.width = (num * 85)+"px";
        }
        else{
            //console.log('Sampun rampung!');            
            hintsSection.style.display ='none';
            alphabetsSection.style.display ='none';            
            nextBtn.style.visibility ='hidden';
            playBtn.style.visibility ='hidden';
        }
        i++;
        listenTo('display-box');
        displayBoxes = gets('.display-box');
    });
};

const evaluateBoxes = () => {
    let isEmpty = 0;    
    displayBoxes.forEach(function(displayBox){        
        if(displayBox.childNodes.length === 0){
            isEmpty = 1;  
        }
    });
    if(isEmpty === 1){
        get('.toast-item.warning').style.display = "block";
        setTimeout(function(){
            get('.toast-item.warning').style.display = "none";
        }, 6000);
    }
    else{
        checkAnswer();
    }
        
};

function checkAnswer(){
    let isCorrect = false;
    let arrCheck = [];
    let currentArrayIndex = parseInt(displayRow.id);
    let currentWordArray = wordDetails[currentArrayIndex].word;

    for(let x = 0; x < displayBoxes.length; x++){
        let challenge = rot13(displayBoxes[x].childNodes[0].alt);
        let master = rot13(currentWordArray[x]);
        //console.log(challenge, master);
        if( challenge === master ){
            arrCheck.push(true);
        } else {
            arrCheck.push(false);
        }
    }
    //console.log(arrCheck);
    let checker = arr => arr.every(v => v === true);
    if (checker(arrCheck)) {
        isCorrect = true;
    }
    countScore(currentArrayIndex, isCorrect);
    if(isCorrect === true){
        get('.toast-item.success').style.display = "block";
        setTimeout(function(){
            get('.toast-item.success').style.display = "none";
        }, 6000);
    } else{
        hintAnswer.innerHTML = "";
        get('.toast-item.error').style.display = "block";
        get('.showHint').addEventListener('click', function(){
            hintAnswer.innerHTML = `<div style="padding: 10px 15px; text-align: left">Nama hewan ini adalah ${wordDetails[currentArrayIndex].hint.replace("__","/").replace("--", " ").replace(".png","")} ( <span class="hintJawa">${wordDetails[currentArrayIndex].word.join('')}</span> ). <br>Cara menulis: <span class="hintJawa">${wordDetails[currentArrayIndex].word.join('&#x200C; + ‌&#x200C;')}</span></div>`
            get('.toast-item.error').style.display = "none";
            get('.toast-item.help').style.display = "block";
            setTimeout(function(){
                get('.toast-item.help').style.display = "none";
            }, 6000);
        });
        setTimeout(function(){
            get('.toast-item.error').style.display = "none";
        }, 5000);
    }
    
};

resetBtn.addEventListener('click', () => location.reload());
playBtn.addEventListener('click',function(){
    evaluateBoxes();
})

function listenTo(cls) {
    gets("."+cls).forEach(el => {
        el.addEventListener("dragover", function (event) {
            event.preventDefault();
        });
        el.addEventListener("drop", function (event) {
            let newTarget = draggingTarget.cloneNode(true);
            this.appendChild(newTarget);
            newTarget.addEventListener("click", function(){
                newTarget.parentNode.innerHTML = "";
                writeOutput();
            });
            writeOutput();
        });        
    });
}

function touchMove(event) {
    event.preventDefault();
    let wrapper = event.targetTouches[0].target.closest('.box-cell');
    let touch = event.targetTouches[0];
    let drag = event.targetTouches[0].target;
    drag.style.top = `${touch.pageY - (wrapper.offsetTop) - (drag.offsetWidth / 2)}px`;
    drag.style.left = `${touch.pageX - (wrapper.offsetLeft) - (drag.offsetHeight / 2)}px`;
    empty.map(item => {
        if (
            drag.getBoundingClientRect().top + drag.offsetWidth / 2 < item.getBoundingClientRect().bottom &&
            drag.getBoundingClientRect().right - drag.offsetWidth / 2 > item.getBoundingClientRect().left &&
            drag.getBoundingClientRect().bottom - drag.offsetWidth / 2 > item.getBoundingClientRect().top &&
            drag.getBoundingClientRect().left + drag.offsetWidth / 2 < item.getBoundingClientRect().right
        ) {
            item.classList.add('active');
            itemAppend = item;
        }
        else {
            item.classList.remove('active');
        }
    });
}

function touchEnd() {
    let wrapper = this.closest('.box-cell');
    //console.log(wrapper);
    if (itemAppend) {
        if (itemAppend.classList.contains('active')) {
            let newTarget = this.cloneNode(true);
            itemAppend.append(newTarget);
            newTarget.addEventListener("click", function(){
                newTarget.parentNode.innerHTML = "";
                writeOutput();
            });
            writeOutput();
        }
    }
    this.style.top = '0px';
    this.style.left = '0px';
}

if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
    let dragElm = gets('img[draggable="true"]');
    dragElm.forEach(function(drag) {
        drag.addEventListener('touchmove', touchMove, {capture: true});
        drag.addEventListener('touchend', touchEnd, {capture: true});
    });
    let i = 1; 
    nextBtn.addEventListener('click',function(){
        get('.result').innerHTML = "";
        while(displayRow.firstChild){
            displayRow.removeChild(displayRow.firstChild);
        }
        if(i < wordDetails.length){
            hint.src = "binatang/"+wordDetails[i].hint;
            let num = wordDetails[i].noOfBoxes;
            for(let x = 0; x < num; x++){
                let divBox = document.createElement("div");
                divBox.className = 'display-box';
                displayRow.appendChild(divBox);
            }
            displayRow.id = i;
            displayRow.style.width = (num * 85)+"px";
            empty = Array.from(document.querySelectorAll('.display-box'));
        }
        else{
            //console.log('Sampun rampung!');            
            hintsSection.style.display ='none';
            alphabetsSection.style.display ='none';            
            nextBtn.style.visibility ='hidden';
            playBtn.style.visibility ='hidden';
        }
        dragElm.forEach(function(drag) {
            drag.addEventListener('touchmove', touchMove, {capture: true});
            drag.addEventListener('touchend', touchEnd, {capture: true});
        });
        i++;
        displayBoxes = gets('.display-box');
    });
} else {    
    document.addEventListener("dragstart", function (event) {
    draggingTarget = event.target;
    });

    listenTo('display-box');    
    writeToPage();

}



function writeOutput() {
    let char = "";
    let dBoxes = gets('.display-box');
    for(let x = 0; x < dBoxes.length; x++){
        if (dBoxes[x].childNodes[0]) {
            char += dBoxes[x].childNodes[0].alt;
        }        
    }
    get('.result').innerHTML = char;
}

function rot13(str) {
    var strSplit = str.split('');
    var rss = strSplit.map(l => l.charCodeAt());
    let res = rss.join();
    return res;
}

const modals = document.querySelectorAll("[data-modal]");

modals.forEach(function (trigger) {
  trigger.addEventListener("click", function (event) {
    event.preventDefault();
    const modal = document.getElementById(trigger.dataset.modal);
    modal.classList.add("open");
    const exits = modal.querySelectorAll(".modal-exit");
    exits.forEach(function (exit) {
      exit.addEventListener("click", function (event) {
        event.preventDefault();
        modal.classList.remove("open");
      });
    });
  });
});
function closeMenu() {
    get('.checkbox-toggle').click();
}
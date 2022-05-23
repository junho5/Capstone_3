const emInput = document.querySelector("#id-input");
const pwInput = document.querySelector("#pw-input");
const loginBtn = document.querySelector("#loginBtn");

const ph_id = document.querySelector(".phTxt_id");
const ph_pw = document.querySelector(".phTxt_pw");
const ph_style_set = ph_id.style;


emInput.addEventListener('focus', (e)=>{
    e.target.parentElement.children[1].style.fontSize = '9px';
    e.target.parentElement.children[1].style.top = '12px';
    e.target.parentElement.children[1].style.left = '7px';
});

emInput.addEventListener('blur', (e)=>{
    if(emInput.value === ''){
        e.target.parentElement.children[1].style = ph_style_set;
    }
});

pwInput.addEventListener('focus', (e)=>{
    e.target.parentElement.children[1].style.fontSize = '9px';
    e.target.parentElement.children[1].style.top = '12px';
    e.target.parentElement.children[1].style.left = '7px';
});

emInput.addEventListener('blur', (e)=>{
    if(emInput.value === ''){
        e.target.parentElement.children[1].style = ph_style_set;
    }
});

pwInput.addEventListener('blur', (e)=>{
    if(pwInput.value === ''){
        e.target.parentElement.children[1].style = ph_style_set;
    }
});

ph_id.addEventListener('click', (e)=>{
    e.target.parentElement.children[0].focus();
});
ph_pw.addEventListener('click', (e)=>{
    e.target.parentElement.children[0].focus();
});
loginBtn.addEventListener('click', (e)=>{
    e.preventDefault();
});
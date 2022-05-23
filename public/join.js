const emInput = document.querySelector("#id-input");
const pwInput = document.querySelector("#pw-input");
const pwReInput = document.querySelector("#pw-re-input");
const emailInput = document.querySelector("#email-input");
const joinBtn = document.querySelector("#joinBtn");

const ph_id = document.querySelector("#phTxt_id");
const ph_pw = document.querySelector("#phTxt_pw");
const ph_re_pw = document.querySelector("#phTxt_re_pw");
const ph_email = document.querySelector("#phTxt_email");
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

pwInput.addEventListener('blur', (e)=>{
    if(pwInput.value === ''){
        e.target.parentElement.children[1].style = ph_style_set;
    }
});
pwReInput.addEventListener('focus', (e)=>{
    e.target.parentElement.children[1].style.fontSize = '9px';
    e.target.parentElement.children[1].style.top = '12px';
    e.target.parentElement.children[1].style.left = '7px';
});

pwReInput.addEventListener('blur', (e)=>{
    if(pwReInput.value === ''){
        e.target.parentElement.children[1].style = ph_style_set;
    }
});
emailInput.addEventListener('focus', (e)=>{
    e.target.parentElement.children[1].style.fontSize = '9px';
    e.target.parentElement.children[1].style.top = '12px';
    e.target.parentElement.children[1].style.left = '7px';
});

emailInput.addEventListener('blur', (e)=>{
    if(emailInput.value === ''){
        e.target.parentElement.children[1].style = ph_style_set;
    }
});
ph_id.addEventListener('click', (e)=>{
    e.target.parentElement.children[0].focus();
});
ph_pw.addEventListener('click', (e)=>{
    e.target.parentElement.children[0].focus();
});
ph_re_pw.addEventListener('click', (e)=>{
    e.target.parentElement.children[0].focus();
});
ph_email.addEventListener('click', (e)=>{
    e.target.parentElement.children[0].focus();
});
joinBtn.addEventListener('click', (e)=>{
    e.preventDefault();
});
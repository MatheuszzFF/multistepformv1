const step1Box = document.querySelector('.step1Box');
const step2Box = document.querySelector('.step2Box');
const step3Box = document.querySelector('.step3Box');

//left side
const step1 = document.querySelector('.formSteps__list[type="info"]');
const step2 = document.querySelector('.formSteps__list[type="plans"]');

let emailTemplate = {
    'name': "",
    'email': "",
    'phone': ""
};

function validateName(input) {
    const nameRegex = /^[a-zA-Zá-ú ]+$/
    let name = input.value;
    let errors = { //error spans from HTML
        'notFilled': document.getElementById('nameError1'),
        'length' : document.getElementById('nameError2'),
        'specialCharacters' : document.getElementById('nameError3'),
    }
    errors['notFilled'].classList.remove('show');
    errors['length'].classList.remove('show');
    errors['specialCharacters'].classList.remove('show');


    if(!nameRegex.test(name)) {
        errors['specialCharacters'].classList.add('show');
    } else {
        if (name == "")
        errors['notFilled'].classList.add('show');
        else if (name.length < 3) 
            errors['length'].classList.add('show');
        else return name;
        
    }  
}

function validateEmail(input) {
    const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    let email = input.value;
    let error_el = document.getElementById('emailError')
    email.toLowerCase();

    if(!email.match(regexEmail) || email == "") {
        error_el.classList.add('show');
        return false;

    } else {
        error_el.classList.remove('show');
        return email;
    }
}

function validatePhone(input) {
    const regexPhone = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    let phone = input.value;
    let error_el = document.getElementById('phoneError');

    if(!phone.match(regexPhone) || phone.length < 8 || phone == "") {
        error_el.classList.add('show');
        return false;
    } else {
        error_el.classList.remove('show');
        return phone
    }
}


function validateStep1() {
    const nameInput = document.querySelector('.step1[name="name"]');
    const emailInput = document.querySelector('.step1[name="email"]');
    const phoneInput = document.querySelector('.step1[name="phone"]');
    let validateStepArray = [];
    emailTemplate['name'] = validateName(nameInput);
    emailTemplate['email'] = validateEmail(emailInput);
    emailTemplate['phone'] = validatePhone(phoneInput);

    for(let info in emailTemplate) {
        emailTemplate[info] ? validateStepArray.push(true) : validateStepArray.push(false);
    }

    if(validateStepArray.includes(false)) 
        return false
    else {
        return emailTemplate
    }
}
function goBackListener(actualStep, actualStepLeft, backStep, backStepLeft) {
    let goBack_el = document.querySelector('.step2Box .goBack');
    goBack_el.addEventListener('click', () => {
        actualStep.classList.add('d-none');
        actualStepLeft.classList.remove('active');
        backStep.classList.remove('d-none');
        backStepLeft.classList.add('active');
        console.log(actualStepLeft.classList.remove('active'));

        initForm();
    })
}

function activeStep2() {
    step1Box.classList.add('d-none');
    step2Box.classList.remove('d-none');
    step1.classList.remove('active');
    step2.classList.add('active');
}

function validateStep2() {
    let chosedPlan = getThePlanChoosed();
    return switchYearlyMonthly(chosedPlan);
}

function getThePlanChoosed() {
    let plansTemplate = {
        plan: "arcade",
        payment: 'monthly',
    }
    let plansCheckboxes = document.querySelectorAll('.plans input[type="checkbox"]:not(#monthly)');
    plansCheckboxes[0].setAttribute('status','choosed');
    plansCheckboxes[0].checked = true;
   
    plansCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change',  () => {
            for(let i = 0; i < plansCheckboxes.length; i++) {
                plansCheckboxes[i].checked = false;
                plansCheckboxes[i].removeAttribute('status');
            }
            checkbox.setAttribute('status','choosed')
            checkbox.checked = true;
            plansTemplate.plan = checkbox.id;
            return plansTemplate;
        })
    })
    return plansTemplate;
}

function switchYearlyMonthly(template) {
    let monthlyRadioBtn = document.querySelector('#monthly');
    monthlyRadioBtn.addEventListener('change', () => {
        const regexPrices = /\$([0-9]+)\/([a-z]+)/;
        let prices_el = document.querySelectorAll('.plans__box span');
        template.payment === 'monthly' ? template.payment = 'yearly' : template.payment = 'monthly';
        prices_el.forEach(price => {
            let regexExpression = price.innerHTML.match(regexPrices);
            let priceText = regexExpression[1] > 15 ? regexExpression[1] / 12 : regexExpression[1] * 12;
            let yearOrMonth = regexExpression[2] === "month" ? "year" : "month";
            price.innerHTML = `$${priceText}/${yearOrMonth}`;
            return template;
        })
    })
    return template
}

function initForm() {
    let step1NextButton = document.getElementById('nextStep1');
    step1NextButton.addEventListener('click', () => {
        let emailInfos = validateStep1();
        if(emailInfos) {
            let plansInfos = validateStep2();
            activeStep2();
            goBackListener(step2Box,step2 ,step1Box, step1);

            if(plansInfos) {
                let finish_el = document.getElementById('finish');
                finish_el.addEventListener('click', () => {
                    window.alert('Check the console!');
                    console.log(emailInfos, plansInfos);
                })
                
            } else {
                console.log('ops,error');
            }
        } else {
            console.log('error');
        }
    });
}
initForm();
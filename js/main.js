const step1Box = document.querySelector('.step1Box');
const step1 = document.querySelector('.formSteps__list[type="info"]');

const step2Box = document.querySelector('.step2Box');
const step2 = document.querySelector('.formSteps__list[type="plans"]');

const step3Box = document.querySelector('.step3Box');
const step3 = document.querySelector('.formSteps__list[type="addOns"]');

//left side

let addOns = {
    'online' : {
        name: 'online',
        price: '$2',
        choosed: false
    },
    'storage' : {
        name: 'storage',
        price: '$2',
        choosed: false
    },
    'customise' : {
        name: 'customise',
        price: '$1',
        choosed: false
    }
};

function validateName(input) {
        if (input.validity.tooShort) input.setCustomValidity('Name must have three or more letters');
        else if(input.validity.patternMismatch)  input.setCustomValidity('Cannot have special characters');
        else input.setCustomValidity("");
        input.reportValidity();
}

function validatePhone(input) {
        if (input.validity.tooShort) input.setCustomValidity('Number must have 10 or more numbers');
        else input.setCustomValidity("");
        input.reportValidity();
}

function validateStep1(emailTemplate) {
    let validateStepArray = [];
    for(let info in emailTemplate) emailTemplate[info] ? validateStepArray.push(true) : validateStepArray.push(false);
    if(!validateStepArray.includes(false)) return emailTemplate
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

function activeStep3() {
    step2Box.classList.add('d-none');
    step3Box.classList.remove('d-none');
    step2.classList.remove('active');
    step3.classList.add('active');
}

function addOnsChoose() {
    let checkboxes = document.querySelectorAll('.add-ons input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('click', (e) => {
            checkbox.parentNode.parentNode.classList.toggle('active');
            addOns[checkbox.id].choosed = checkbox.checked;
        })
    })
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
            checkbox.setAttribute('status','choosed');
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
        })
    })
}

function validateStep2() {
    let chosedPlan = getThePlanChoosed();
    return switchYearlyMonthly(chosedPlan);
}

function initForm() {
    const nameInput = document.querySelector('.step1[name="name"]');
    const emailInput = document.querySelector('.step1[name="email"]');
    const phoneInput = document.querySelector('.step1[name="phone"]');
    let formInfos = document.querySelector('form.info');
    
    formInfos.addEventListener('submit', (e) => {
        e.preventDefault();
        let emailTemplate = {
        'name': nameInput.value,
        'email': emailInput.value,
        'phone': phoneInput.value
    };
        let emailInfos = validateStep1(emailTemplate);
        if(emailInfos) {
            let plansInfos = validateStep2();
            activeStep2();
            goBackListener(step2Box,step2 ,step1Box, step1);

            if(plansInfos) {
                let nextStep2Btn = document.getElementById('nextStep2');
                nextStep2Btn.addEventListener('click', () => {
                    activeStep3();
                    addOnsChoose();
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
const toggleClass = (element) => element.parentNode.classList.contains('formSteps') ? element.classList.toggle('active') : element.classList.toggle('d-none');


function activeStep(step) {
    let step_els = [document.querySelectorAll('.js-step1-box'), document.querySelectorAll('.js-step2-box'), document.querySelector('.js-step3-box')];
    step_els[step - 1].forEach(step_El => toggleClass(step_El));
    step_els[step].forEach(step_El => toggleClass(step_El))
}

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
        console.log(input.validity);
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
    plansCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change',  () => {
            for(let i = 0; i < plansCheckboxes.length; i++) plansCheckboxes[i].checked = false;
            checkbox.checked = true;
            plansTemplate.plan = checkbox.id;
            return plansTemplate;
        })
    })
    return plansTemplate;
}

function changeTextInSwitch(regex) {
    let prices_el = document.querySelectorAll('.plans__box span');
    prices_el.forEach(price => {
        let regexExpression = price.innerHTML.match(regex);
        let priceText = regexExpression[1] > 15 ? regexExpression[1] / 12 : regexExpression[1] * 12;
        let yearOrMonth = regexExpression[2] === "month" ? "year" : "month";
        price.innerHTML = `$${priceText}/${yearOrMonth}`;
    })
}

function switchYearlyMonthly(template) {
    let monthlyRadioBtn = document.querySelector('#monthly');
    let regexPrices = /\$([0-9]+)\/([a-z]+)/;
    monthlyRadioBtn.addEventListener('change', () => {
        template.payment === 'monthly' ? template.payment = 'yearly' : template.payment = 'monthly';
        changeTextInSwitch(regexPrices);
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
        let emailTemplate = {};
        emailTemplate = {
        'name': nameInput.value,
        'email': emailInput.value,
        'phone': phoneInput.value
    };
        activeStep(1);
        let emailInfos = validateStep1(emailTemplate);
        let plansInfos = validateStep2();
    });
}
initForm();

// Utilizar os activate steps para resetar as infos através do goBack, declarando o template do email dentro de cada devido step
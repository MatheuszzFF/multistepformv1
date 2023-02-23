const toggleClass = (element) => element.parentNode.classList.contains('formSteps') ? element.classList.toggle('active') : element.classList.toggle('d-none');

function activeStep(step) {
    let step_els = [document.querySelectorAll('.js-step1-box'), document.querySelectorAll('.js-step2-box'), document.querySelectorAll('.js-step3-box')];
    console.log(step_els[1]);
    step_els[step - 1].forEach(step_El => toggleClass(step_El));
    step_els[step].forEach(step_El => toggleClass(step_El));
}



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

function getThePlanChoosed() {
    let plansCheckboxes = document.querySelectorAll('.plans input[type="checkbox"]:not(#monthly)');
    let plansTemplate = {
        plan: "arcade",
        payment: 'monthly',
    }
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
        return template;
    })
    return template;
}

function validateStep2() {
    let chosedPlan = getThePlanChoosed();
    return switchYearlyMonthly(chosedPlan);
}

function addOnsChoose() {
    let checkboxes = document.querySelectorAll('.add-ons input[type="checkbox"]');
    let addOns = [];
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            checkbox.parentNode.parentNode.classList.toggle('active');
            checkbox.checked ? addOns.push(checkbox.id) : addOns.splice(addOns.indexOf(checkbox.id), 1);
        })
    })
    return addOns;
}

function initForm() {
    const nameInput = document.querySelector('.step1[name="name"]');
    const emailInput = document.querySelector('.step1[name="email"]');
    const phoneInput = document.querySelector('.step1[name="phone"]');
    let formInfos = document.querySelector('form.info');
    let formPlans = document.querySelector('form.plans');
    let formAddons = document.querySelector('form.addOns');

    
    formInfos.addEventListener('submit', (e) => {
        let emailTemplate = {
            'name': nameInput.value,
            'email': emailInput.value,
            'phone': phoneInput.value
        };
        let plansInfos = validateStep2();
        e.preventDefault();
        activeStep(1);
        
        formPlans.addEventListener('submit', (e) => {
            let addOns = addOnsChoose();
            e.preventDefault();
            activeStep(2);

            formAddons.addEventListener('submit', (e) => {
                let finalTemplate = {
                    'infos' : emailTemplate,
                    'plan' : plansInfos,
                    'addons' : addOns
                }
                e.preventDefault();
                console.log(finalTemplate);
            })
        })
    });
}
initForm();

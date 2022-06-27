const FORM = document.forms[0];
const jobRole = FORM.elements["title"];
const designInput = FORM.elements["design"];
const paymentOption = FORM.elements["payment"];
const activities = FORM.elements["activities"];
const activitiesCost = document.getElementById('activities-cost');
const userName = FORM.elements["name"];
const userEmail = FORM.elements["email"];
const userCard = FORM.elements['cc-num'];
const zip = FORM.elements['zip'];
const cvv = FORM.elements['cvv'];





/*********************************** 
           Page load Setup
*****************************************/
document.addEventListener('DOMContentLoaded', e => {
    let userName =   FORM.elements["user-name"];
            userName.focus();

    // hide elements on load of the page
      const hideOnLoad = [
                          "#other-job-role",
                          "#paypal",
                          "#bitcoin"
                          ];  
        
                hideOnLoad.forEach(item => hideElement(item));                 
    
    // disable element on load of the page
    const disableOnLoad = ["#color" ]; 
            disableOnLoad.forEach(item => disableElement(item)); 

    // select Credit card as default option
    paymentOption.value = "credit-card"
       
       
});

/********************************************* 
 *  EVENT Listeners
 * ********************************************/
//Job Role display Other role input
jobRole.addEventListener("change", e => {
    if(jobRole.value === "other"){
        displayElement('[name="other-job-role"]');
    } else {
        hideElement('[name="other-job-role"]');
    } 
    }
);

// Color Theme dropdown
designInput.addEventListener('change', e => {
    const colorTheme = document.querySelector("#color") 
    const isthemeDisabled = colorTheme.hasAttribute('disabled');

// enable dropdown if disabled
    if(isthemeDisabled){
            enableElement("#color");
        }

// first hide all and then display relevant selection based on designInput value       
    hideElementsAll('#color option');
    dipsplayElementsAll(`#color option[data-theme = "${designInput.value}"]`);
    colorTheme.querySelector('option').selected = true;
});

// Activities
// Get total price
activities.addEventListener('click', e => {
    activitiesCost.textContent = `Total: $${getTotalPrice()}`;
});

//disable activity which is at the same time as selected one
let activityItems = activities.querySelectorAll('label');
for(const activity of activityItems){
    activity.addEventListener('click', e =>{
    let inp = activity.querySelector('input');

//search for activity with same dataset but not checked    
    if(inp.hasAttribute('data-day-and-time')){

        let sameTimeActivities = [...document.querySelectorAll(`input[data-day-and-time="${inp.dataset.dayAndTime}"]`)];
                    
            sameTimeActivities = sameTimeActivities.filter(item => !item.checked);

// add disable class to parent and disable input of that sameTime activity
// remove disable class to parent and enable when deselected            
            if(inp.checked){
                sameTimeActivities.forEach(item => {
                    item.parentElement.classList.add('disabled');
                disableElement(`input[name="${item.name}"]`)
                });
            } else {
                sameTimeActivities.forEach(item => {
                    item.parentElement.classList.remove('disabled');
                    enableElement(`input[name="${item.name}"]`);
                });
            };
    }
});
}


//   Payment type selection
paymentOption.addEventListener('change', e => {
    //first hide all fields and then display one based on selection
    let paymentOptionsFields = [ "#paypal", "#bitcoin", "#credit-card"];
                paymentOptionsFields.forEach(item => hideElement(item));
    displayElement(`#${paymentOption.value}`)
});

// activities - add focus
activities.addEventListener("focusin", e =>{
    if(e.target.tagName === "INPUT"){
        
    addFocusToActivity(e.target);
    }
})

activities.addEventListener("focusout", e =>{
    if(e.target.tagName === "INPUT"){
        
    removeFocusFromActivity(e.target);
    }
})


/**    ------------   HELPER  FUNCTIONS   --------------- */
// DISPLAY AND HIDE FUNCTIONS
function hideElement( elemSelector ){
    const elem = document.querySelector(elemSelector);
    return elem.style.display = "none";
}

function hideElementsAll( elemSelector ){
    const elems = document.querySelectorAll(elemSelector);
            for (const elem of elems){ elem.style.display = "none" };    
}

function displayElement( elementId ){
    const elem = document.querySelector(elementId);
    return elem.style.display = "inherit";
}

function dipsplayElementsAll( elemSelector ){
    const elems = document.querySelectorAll(elemSelector);
            for (const elem of elems){ elem.style.display = "inherit" };    
}
//---------------------------------------------------------------
// DISABLE-ENABLE FIELDS FUNCTIONS
function disableElement( elemSelector ){
    const elem = document.querySelector(elemSelector);
     elem.setAttribute("disabled", "disabled");
     elem.parentElement.style.pointerEvents = "none";
}

function enableElement( elemSelector ){
    const elem = document.querySelector( elemSelector );
     elem.removeAttribute("disabled");
     elem.parentElement.style.pointerEvents = "inherit"
}

function disableDropdownEfect( elemSelector ){
    const elem = document.querySelector(elemSelector);
    return elem.removeAttribute("disabled", true)
}

 addFocusToActivity = (elem)=> elem.parentElement.classList.add("focus");
 removeFocusFromActivity = (elem)=> elem.parentElement.classList.remove("focus");

/*------------------------------------------------------------------
            CALCULATIONS                                       */

function getTotalPrice(){
    const priceOfSelectedAtivities = [...activities.querySelectorAll('input')]
                                            .reduce(( acc, item) => {
                                                    if(item.checked){
                                                    acc += parseInt(item.dataset.cost);            
                                                    }
                                                return acc;
                                        }, 0);
        return priceOfSelectedAtivities;
}

/*************************************************************
 *              FORM VALIDATION
 *********************************************************/
let formIsValid = false;

const field = (elemId, hint)=>({
    //hint-className, elemId 
                elemId,
                hint,  
                });
const emailField = field("email","email-hint");
const nameField = field("name","name-hint");
const cardNumField = field('cc-num', 'cc-hint');
const zipField = field("zip","zip-hint");
const cvvField = field('cvv', 'cvv-hint');
const activitiesFields = field('activities-box', 'activities-hint');


// validate form on submit
FORM.addEventListener('submit', e => {
    e.preventDefault();

    validateElement(nameField);
    validateElement(emailField);
    validateElement(activitiesFields);
    if (paymentOption.value === "credit-card"){
        validateElement(cardNumField);
        validateElement(zipField);
        validateElement(cvvField);
    }
  // after validation check for errors
    let validationErrors = document.getElementsByClassName('error');

// if all valid submit the form = reload page
// valid if no errors
    formIsValid = !validationErrors.length ? true : false;
    if (formIsValid){
        location.reload();
    }
     
})



/* check if required fields are not empty
   search for different types of input field => then select a type of value
   @ RETURN true/false if field is Valid, not empty*/ 
function isRequiredFieldValidated(field){
    let isValid = false;
    let formInputTypes = ["input", "select"];
    let inputValues = { text : "value", 
                    "select-one" : "value", 
                    checkbox : "checked", 
                    email : "value"};
    // first check for the type of field                
    let elemTag = field.tagName.toLowerCase();
    let isInputType = formInputTypes.includes(elemTag);
    // if field type => check if value exists or not
    if(isInputType){
        let propertyName = field.type;  
        isValid = field[inputValues[propertyName]] ? true : false;

    } else {
    // if not in defined types validate with checkboxes function 
    //   isValid result to add/remove not-valid class     
         isValid = isCheckboxesRequired(field);
         if(!isValid){
            field.parentElement.classList.add("not-valid");
         } else {
            field.parentElement.classList.remove("not-valid");
         }
    }

    return isValid;

    }

    function isCheckboxesRequired(fieldWithCheckboxes){
        //find out if any of the checkboxes is checked or not
        let checkboxesRequired = [...fieldWithCheckboxes.querySelectorAll('input')]
                                        .reduce((acc, item) => {                        
                  return    acc = [...acc, isRequiredFieldValidated(item)];
            }, []);
    
        return checkboxesRequired.includes(true);
    }   



// regex expressions to test   
    const regex = {
        name : /[^a-z\s$]/i,
        email : /^[^_@\.\s]\w+@+[^@.]+.com$/,
        ccNum : /^(\d{13,16})$/,
        ccZip : /^(\d{5})$/,
        ccCVV : /^(\d{3})$/,
        errorMessage:{
            name: "Please use only leters A-Z",
            email : "Email address must be formatted correctly"
                    },
            
    }

    const fieldValidation = {
        "name" :      ()=>{   
                                    // test that there are not special characters              
                                    let isNameValid = regex.name.test(userName.value) ? false : true;
                                    let isNotEmpty = isRequiredFieldValidated(userName);
                                    let hint = document.querySelector(`.${nameField.hint}`);
                                    //change hint based on validation error
                                        if(!isNameValid){ hint.textContent = regex.errorMessage.name}
                                        if(!isNotEmpty){ hint.textContent = "Name field cannot be blank."}
                                    return isNotEmpty && isNameValid;
                                },
        "email"    :     ()=>{ 
                                    //test that there are required characters and groups                
                                    let isEmailValid = regex.email.test(userEmail.value);
                                    let isNotEmpty = isRequiredFieldValidated(userEmail);
                                    let hint = document.querySelector(`.${emailField.hint}`);
                                    //change hint based on validation error
                                        if(!isEmailValid){ hint.textContent = regex.errorMessage.email}
                                        if(!isNotEmpty){ hint.textContent = "Email field cannot be blank."}

                                    return isNotEmpty && isEmailValid;
                            },
        "cc-num"   : ()=> {     
                                let isCcNumValid = regex.ccNum.test(userCard.value);
                                let isNotEmpty = isRequiredFieldValidated(userCard);

                                return isNotEmpty && isCcNumValid;
                            },     
                           
        "zip"   : ()=> {
                                let isNotEmpty = isRequiredFieldValidated(zip);
                                let isZipValid = regex.ccZip.test(zip.value);
                                return isNotEmpty && isZipValid;
                            }, 
        
        "cvv"   : ()=> {
                                let isNotEmpty = isRequiredFieldValidated(cvv);
                                let isCvvValid = regex.ccCVV.test(cvv.value);

                                return isNotEmpty && isCvvValid;
                            },                    

        "activities-box":        ()=>{
            //find out if any of the checkboxes is checked or not
            let checkboxesRequired = [...activities.querySelectorAll('input')]
                                            .reduce((acc, item) => {                        
                      return    acc = [...acc, isRequiredFieldValidated(item)];
                }, []);
        
            return checkboxesRequired.includes(true);
        }  
    } 



//Name field Validation
userName.addEventListener('blur', e=>{
    validateElement(nameField);
});

// Email field validation
userEmail.addEventListener('blur', e=>{
    validateElement(emailField);
});



function validateElement(field) {
    const {elemId, hint} = field;
    const elemField = document.getElementById(elemId);
    const hintField = document.querySelector(`.${hint}`);


    if (!fieldValidation[elemId]()) {
        //if not valid display hint, add error class to input, add not-valid class to field label
        replaceClass(hintField, "hint");
        elemField.classList.add("error");
        elemField.parentElement.classList.add('not-valid');
        //console.log('not valid email');
    } else {
        //if valid hide hint, input remove error class, label => valid class
        hintField.classList.add('hint');
        elemField.classList.remove("error");
        replaceClass(elemField.parentElement, "not-valid", "valid");
    }
}

// Activities field validation

function replaceClass(element, remove, add=""){
    // remove and or replace class from selected element
    // default values are empty
        element.classList.remove(remove);
        add? element.classList.add(add) : undefined;
}



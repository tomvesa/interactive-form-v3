const FORM = document.forms[0];
const jobRoleOther = FORM.elements["user-title"];
const designInput = FORM.elements["user-design"];
const paymentOption = FORM.elements["user-payment"];
const activities = FORM.elements["activities"];
const activitiesCost = document.getElementById('activities-cost');


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
jobRoleOther.addEventListener("change", e => {
    if(jobRoleOther.value = "other"){
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
    return elem.setAttribute("disabled", "disabled");
}

function enableElement( elemSelector ){
    const elem = document.querySelector( elemSelector );
    return elem.removeAttribute("disabled")
}

function disableDropdownEfect( selectElement ){
    const elem = document.querySelector(elemSelector);
    return elem.removeAttribute("disabled", true)
}

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

// required fields make sure they are not empty
let requiredFields = document.querySelectorAll('.error-border');
let formInputTypes = ["input", "select"];
let inputValues = { text : "value", 
                    "select-one" : "value", 
                    checkbox : "checked", 
                    email : "value"};
let formIsValid = false;
FORM.addEventListener('submit', e => {
    e.preventDefault();

    [...requiredFields].forEach(item => {
        //console.log(item);
        //console.log(isRequiredFieldValidated(item))
        if( !isRequiredFieldValidated(item)){
            item.classList.add("error");

        } else { 
            item.classList.remove("error");
        };
    });

    let validationErrors = document.getElementsByClassName('error');
 //   console.log(validationErrors);
    if (!validationErrors.length){
        location.reload();
    }
    
     
})




function isRequiredFieldValidated(field){
    let isValid = false;
    let elemTag = field.tagName.toLowerCase();
    let isInputType = formInputTypes.includes(elemTag);

    if(isInputType){
        let propertyName = field.type;
  //      console.log(propertyName);        
        isValid = field[inputValues[propertyName]] ? true : false;
        if ( !isValid){
        //console.log(field);
        //console.log(isValid);
        }
    } else {

         //console.log(field);
         isValid = isCheckboxesRequired(field);
         console.log(field.parentElement);
         console.log(isValid)
         if(!isValid){

            field.parentElement.classList.add("not-valid");

         } 
    }

    return isValid;

    }

    function isCheckboxesRequired(fieldWithCheckboxes){
        //find out if any of the checkboxes is checked
        let checkboxesRequired = [...fieldWithCheckboxes.querySelectorAll('input')].reduce((acc, item) => {                        
                  return    acc = [...acc, isRequiredFieldValidated(item)];
            }, []);
    
        return checkboxesRequired.includes(true);
    }   


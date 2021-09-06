function Validator(formSelector){

    function getParent(element,selector){
        while(element.parentElement){
            if(element.parentElement.matches(selector)){
                return element.parentElement;
            }
            element = element.parentElement;
        }

    }
    

    var formRules = {};

    var validatorRules = {
        required: function(value){
            return value ? undefined : 'Vui long nhap truong nay !';
        },
        email: function(value){
            var check = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; 
            return check.test(value) ? undefined : 'Truong nay phai la Email !';
        },
        min: function(min){
            return function(value){
                return value.length >= min ? undefined : `Vui long nhap it nhat ${min} ky tu !`
            }
            
        }
    }

    var formElement = document.querySelector(formSelector);

    if(formElement){
        var inputs = formElement.querySelectorAll('[name][rule]');

        for(var input of inputs){
            var rules = input.getAttribute('rule').split('|');

            for(var rule of rules){
                var ruleInfo;

                var isRuleHasValue = rule.includes(':');

                if(isRuleHasValue){
                    ruleInfo = rule.split(':');
                    rule = ruleInfo[0];
                }

                var ruleFunc = validatorRules[rule];

                if(isRuleHasValue){
                    ruleFunc = ruleFunc(ruleInfo[1]);
                }

                if(Array.isArray(formRules[input.name])){
                    formRules[input.name].push(ruleFunc);
                }else{
                    formRules[input.name]=[ruleFunc];
                }
            }
            input.onblur = checkError;
            input.oninput = clearError;
        }
        function checkError(e){
            var rules = formRules[e.target.name];
            var errorMessage;
            
            for(var rule of rules){
                errorMessage = rule(e.target.value);
                if(errorMessage) break;
            }

            if(errorMessage){
                var parentSelector = getParent(e.target,'.form-main');
                if(parentSelector){
                    parentSelector.classList.add('invalid');
                    var errorElement = parentSelector.querySelector('.form-message');
                    if(errorElement){
                        errorElement.innerText = errorMessage;
                    }
                }
            }
            return !errorMessage;
        }

        function clearError(e){
            var parentSelector = getParent(e.target,'.form-main');
            if(parentSelector.classList.contains('invalid')){
                parentSelector.classList.remove('invalid');
                var errorElement = parentSelector.querySelector('.form-message');
                if(errorElement){
                    errorElement.innerText = '';
                }
            }
        }
    }
    formElement.querySelector('.login-btn').onclick = function(e){
        e.preventDefault();
        var inputs = formElement.querySelectorAll('[name][rule]');
        var isValid = true;
        for(var input of inputs){
            if(!checkError({target: input})){
                isValid = false;
            }
        }
        if(isValid){
            formElement.submit();
        }
        
        
    }
}
//đối tượng validator
function Validator(options) {
    // lấy element của form cần validate
  
    this. DSDK=[]
    var element = document.querySelector(options.form)
    function getElement(parElement, selector) {
        while (parElement.parentElement) {
            if (parElement.parentElement.matches(selector)) {
                return parElement.parentElement
            }
            parElement = parElement.parentElement
        }
    }
  
    function validate(inputElment, rule) {
        var errorElement = getElement(inputElment, options.selectform).querySelector(options.error)
        var message = rule.test(inputElment.value)
        // in ra boder màu đỏ
        if (message) {
            errorElement.innerText = message;
            getElement(inputElment, options.selectform).classList.add('invalid');
  
        } else {
            errorElement.innerText = ''
            getElement(inputElment, options.selectform).classList.remove('invalid');
        }
        return !message // trả về giá trị phủ định của mess
    }
    if (element) {
        element.onsubmit = function (e) {
            e.preventDefault();//hủy bỏ chuyeenr trang mặc định
            var DSDK = []
            var isformValid = true
            options.rules.forEach((rule) => {
                var inputElment = element.querySelector(rule.selector)
  
                var isValid = validate(inputElment, rule)
                if (!isValid) {// nếu giá trị nhập vào rỗng
                    return isformValid = false
                }
            })
            if (isformValid) {// nếu nhập hết các input
                if (typeof options.onSubmit === 'function') {
                    var enableInputs = element.querySelectorAll('[name]')
                    //đổi enableInputs thành array
                    var formList = Array.from(enableInputs).reduce(function (value, input) {
                        switch (input.type) {
                            case 'file':
                                value[input.name] = input.files;
                                break;
                            default:
                                value[input.name] = input.value;
                        }
                        return value;
                    }, {})
                    options.onSubmit(formList)
  
                }
                
                
            }
          //   var jsonDanhSachDangKy = JSON.stringify(formList);
          //       localStorage.setItem("DanhSachDKY", jsonDanhSachDangKy)
        }
  
        //lặp qua từng rule
        options.rules.forEach((rule) => {
            var inputElment = element.querySelector(rule.selector)
  
            if (inputElment) {
                inputElment.onblur = function () {
                    validate(inputElment, rule)
                }//mỗi khi người dùng nhập vào input sẽ mất màu đỏ
                inputElment.oninput = function () {
                    var errorElement = getElement(inputElment, options.selectform).querySelector(options.error)
                    errorElement.innerText = ''
                    getElement(inputElment, options.selectform).classList.remove('invalid');
                }
            }
        });
    }
  }
  //các  rule
  Validator.isRequired = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined : "Vui lòng nhập trường này"
        }
    }
  }
  Validator.isEmail = function (selector) {
    return {
        selector: selector,
        test: function (value) {
  
            if (value.trim()) {
                var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (re.test(value.toLowerCase())) {
                    return undefined
                }
                else return "Nhập đúng định dạng email"
            }
            else {
                return "Vui lòng nhập email "
            }
        }
    }
  }
  
  Validator.isNewPassWord = function (selector) {
      return {
          selector: selector,
          test: function (value) {
              return value.trim() ? undefined : "Vui lòng nhập trường này"
          }
      }
    }
  Validator.isPassWord = function (selector, key) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= key ? undefined : `Vui lòng nhập ít nhất ${key} ký tự `
        }
    }
  }
  Validator.isConfirmation = function (selector, getValue) {
    return {
        selector: selector,
        test: function (value) {
  
            if (value.trim() == false) {
                return ' Vui lòng nhập mật khẩu'
            }
            return value === getValue() ? undefined : `Vui lòng nhập đúng mật khẩu `
        }
    }
  
  }
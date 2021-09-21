// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
})();

function showHide() {
    var replydiv = document.getElementById('replydiv');
    if (replydiv.style.display == 'none') {
        replydiv.style.display = 'block';
    } else {
        replydiv.style.display = 'none';
    }
}
function copyid() {
    var copyText = document.getElementById("myInput");
    copyText.select();
    copyText.setSelectionRange(0, 99999);//for mobile devices
    navigator.clipboard.writeText(copyText.value);
}

function createNewElement() {
    // First create a DIV element.
    var txtNewInputBox = document.createElement('div');

    // Then add the content (a new input box) of the element.
    txtNewInputBox.innerHTML = "<div class='d-flex justify-content-around align-items-center'><div class='form-floating mb-3'><input type='text' name='divisions' class='form-control  bg-warning bg-gradient' id='floatingInput'><label for='floatingInput'>Division name</label></div><div class='form-floating mb-3'><input type='text' name='divisions' class='form-control  bg-warning bg-gradient' id='floatingInput'><label for='floatingInput'>Division head</label></div></div>"

    // Finally put it where it is supposed to appear.
    document.getElementById("newElementId").appendChild(txtNewInputBox);
}
function createElement() {
    var txtNewInput = document.createElement('div');
    txtNewInput.innerHTML = "<div class='d-flex justify-content-around align-items-center'><div class='form-floating mb-3'><input type='text' name='links' class='form-control  bg-warning bg-gradient' id='floatingInputt'><label for='floatingInputt'>Link :</label></div></div>"
    document.getElementById("newelementId").appendChild(txtNewInput);
}

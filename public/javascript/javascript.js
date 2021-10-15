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
function createOneElement() {
    var txtNewInputBox = document.createElement('div');
    txtNewInputBox.innerHTML = "<div class='mb-2 mt-2'><input type='url' class='form-control bg-gradient bg-warning' name='links' id='exampleInputEmail1'></div>"
    document.getElementById("newelement").appendChild(txtNewInputBox);
}
function createAnElement() {
    var txtNewInputBox = document.createElement('div');
    txtNewInputBox.innerHTML = "<div class='mb-2 mt-2 p-1'><ul><li><input placeholder='name' type='text' class='form-control mb-3' name='programmes' id='exampleInputEmail1'><input placeholder='description' type='text' class='form-control mb-3' name='details' id='exampleInputEmail1'></li></ul></div>"
    document.getElementById("newelement5").appendChild(txtNewInputBox);
}
function createTheElement() {
    var txtNewInputBox = document.createElement('div');
    txtNewInputBox.innerHTML = "<div class='mb-2 mt-2 p-1'><ul><li><input placeholder='name' type='text' class='form-control mb-3' name='programmes' id='exampleInputEmail1'><input placeholder='description' type='text' class='form-control mb-3' name='details' id='exampleInputEmail1'></li></ul></div>"
    document.getElementById("newelement3").appendChild(txtNewInputBox);
}
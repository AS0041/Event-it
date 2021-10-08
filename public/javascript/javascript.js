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
    // First create a DIV element.
    var txtNewInputBox = document.createElement('div');

    // Then add the content (a new input box) of the element.
    txtNewInputBox.innerHTML = "<div class='mb-2 mt-2'><input type='url' class='form-control bg-gradient bg-warning' name='links' id='exampleInputEmail1'></div>"

    // Finally put it where it is supposed to appear.
    document.getElementById("newelement").appendChild(txtNewInputBox);
}
var x = setInterval(function () {
    var value = new Date(document.getElementById("value").value).getTime();
    var presentTime = new Date().getTime();
    var distance = value - presentTime;
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    document.getElementById("demo").innerText = days + "d " + hours + "h "
        + minutes + "m " + seconds + "s ";
    if (distance < 0) {
        clearInterval(x);
        document.getElementById("demo").innerHTML = "<h3 class='is-size-2 live'>Event is Live Now!</h3>";
    }
}, 1000);

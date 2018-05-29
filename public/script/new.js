var addOption = document.getElementById('add-option');
var optionsInput = document.getElementById('options-input');
var i = 2;

addOption.addEventListener('click', function() {
    $('#options-input').append('<input type="text" class="form-control" name="options[' + i + ']">');
    i++;
});
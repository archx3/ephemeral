 $(document).ready(function() {
        var readURL = function(input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    $('.profile-pic').attr('src', e.target.result);
                };

                reader.readAsDataURL(input.files[0]);
            }
        };


        $(".file-upload").on('change', function(){
            readURL(this);
        });

        $(".upload-button").on('click', function() {
            $(".file-upload").click();
        });
     $('button.ui.basic.button.add').on('click',function(){
         $('div.ui.modal').modal('show');
     });

     //bottom add button
     $('button.circular.ui.basic.icon.button.adder').on('click', function () {
         $('div.ui.modal').modal('show');
     });

     //drop down
     $('.ui.fluid.dropdown.warehouse').dropdown({show: false});
    });

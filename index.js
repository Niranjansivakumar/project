$(document).ready(function(){
    $("#main-load").hide();
    $("#login-load").load("templates/login-page.html");

    $(document).on("click","#login-sign-up", function (e){
        $("#login-load").load("templates/sign-up.html");
        //$("#bdy").css("background-color", "white");
        //$("#bdy").attr("style", "background-color:white;");
        //$("#bdy").css({"background-color":"white"});
        //$("#bdy").removeClass("bck-clr");
        setTimeout(function(){
            $.ajax({
                type: "Get",
                url: "data/country.json",
                dataType: "json",
                success: function(data) {
                    var country_names = Object.keys(data);
                    country_names.sort();
                    // for (var i=0;i < country_names.length;i++){
                    //     console.log(country_names[i], data[country_names[i]]);
                    // }
                    var option_d = "<option disabled selected>Select Country</option>";
                    country_names.map((country_n)=>{
                        option_d += `<option value="${country_n.toLowerCase()}-${data[country_n]}" code-dt="${data[country_n]}">${country_n}</option>`
                    });
                    //console.log(option_d);
                    $("#country-select").html(option_d);
                    // country_names.map(function(dt){
                    //     console.log(dt, data[dt]);
                    // });
                },
                error: function(){
                    alert("File not present");
                }
            });
        },5000);
    });
    $(document).on("click","#login-submit",function(){
        var user_name = $("#usr-name").val();
        var ps = document.getElementById("usr-password");
        var passsword = ps.value;

        //using jquery
        if (user_name == ""){
            $("#usr-name").addClass("red-border");
        }else{
            $("#usr-name").removeClass("red-border");
        }

        //using javascript
        if (passsword == ""){
            ps.className = "red-border";
        }else{
            ps.className = "";
        }

        setTimeout(function(){
            $("#usr-name").removeClass("red-border"); //jquery method to remove red border for username
            ps.className = ""; //javascript method to remove red border for password.
        },3000);
    });

    $(document).on("change","#pincode-select", function(){
        var selected_pin = $(this).val();
        $.ajax({
            type: "Get",
            url: `data/pincode-town.json`,
            dataType: "json",
            success:function(data){
                $("#sign-up-town").text(data[selected_pin]);
                var x = document.getElementById("sign-up-town");
                x.value = data[selected_pin];
            },
            error:function(){

            }
        });
    });

    $(document).on("change","#district-select", function(e){
        var selected_district = $(this).val();
        $.ajax({
            type: "Get",
            url: `data/${selected_district}-pincodes.json`,
            dataType: "json",
            success:function(data){
                var option_d = "<option disabled selected>Select Pincode</option>";
                data.map((pin)=>{
                    option_d += `<option ${pin}>${pin}</option>`;
                });
                $("#pincode-select").html(option_d);
            },  
            error:function(){
                alert("File not found");
            }
        });
    });

    $(document).on("change", "#state-select", function(e){
        var state_name = $(this).val();
        var selected_country = $("#country-select option:selected").val().split("-")[0];
        $.ajax({
            type: "Get",
            url: `data/${selected_country}-districts.json`,
            dataType: "json",
            success:(dt)=>{
                var district_list = dt[state_name];
                district_list.sort();
                var option_d = "<option disabled selected>Select District</option>";
                district_list.map((dist)=>{
                    option_d += `<option value="${dist.toLowerCase()}">${dist}</option>`;
                });
                $("#district-select").html(option_d);
            },
            error:function(){
                alert("File not found");
            }
        });
    });

    $(document).on("change","#country-select",function(e){
        var country_code = $(this).val().split("-")[1];
        $.ajax({
            type: "Get",
            url: "data/country-states.json",
            dataType: "json",
            success:(data)=>{
                var state_list = data[country_code];
                state_list.sort();
                var option_d = "<option disabled selected>Select State</option>";
                state_list.map((state)=>{
                    option_d += `<option value="${state}">${state}</option>`;
                });
                $("#state-select").html(option_d);
            },
            error:function(){
                alert("File not found");
            }
        });
    });


    $(document).on("keypress","#sign-up-password1",function(e) {
        setTimeout(function(){
            var dt = $("#sign-up-password1").val();
            console.log(dt);
            if (dt != ""){
                $("#sign-up-password2").removeAttr("disabled");
            }else{
                $("#sign-up-password2").attr("disabled","true");
            }
        },1000);
        
    });
    $(document).on("mouseleave","#sign-up-password1",function(e){
        var dt = $("#sign-up-password1").val();
        if (dt != ""){
            $("#sign-up-password2").removeAttr("disabled");
        }else{
            $("#sign-up-password2").attr("disabled","true");
        }
    });
    $(document).on("focusout","#sign-up-password1",function(e){
        var dt = $("#sign-up-password1").val();
        if (dt != ""){
            $("#sign-up-password2").removeAttr("disabled");
        }else{
            $("#sign-up-password2").attr("disabled","true");
        }
    });

    $(document).on("click","#signup_submit", function(){
        var id_list = [
            "sign-up-firstname",
            "sign-up-middlename",
            "sign-up-lastname",
            "sign-up-usrname",
            "sign-up-password1",
            "sign-up-password2",
            "sign-up-dob",
            "sign-up-email",
            "sign-up-mobile",
            "sign-up-address1",
            "sign-up-town"
        ];
        
        var count_v = 0;
        var data_load = {
            "sign-up-firstname":"",
            "sign-up-middlename":"",
            "sign-up-lastname":'',
            "sign-up-usrname":"",
            "sign-up-password1":"",
            "sign-up-password2":"",
            "sign-up-dob":"",
            "sign-up-email":"",
            "sign-up-mobile":"",
            "sign-up-address1":"",
            "sign-up-town":""
        };
        id_list.map((id)=>{
            if ($(`#${id}`).val() == ""){
                $(`#${id}`).addClass("red-border");
                $(`#${id}-req`).removeAttr("hid");
                $(`#${id}-req`).addClass("shw");
                if (count_v == 0){
                    toastr.error('Please fill the required field!');
                }
                count_v += 1;
            }else{
                var dm = {};
                data_load[`${id}`] = $(`#${id}`).val();
                $(`#${id}`).removeClass("red-border");
                $(`#${id}-req`).removeAttr("shw");
                $(`#${id}-req`).addClass("hid");
            }
        });
        var gender = $("input:radio.sgn-radio:checked").val();
        if (gender == ""){
            toastr.error('Please fill the required field!');
        }

        $.ajax({
            type: "Get",
            url: "data/authentication_data.json",
            dataType: "json",
            success:(data_n)=>{
                console.log(data_n);
                data_n.push(data_load);
                $.ajax
                ({
                    type: "GET",
                    dataType : 'json',
                    async: false,
                    url: 'save_json.php',
                    data: { data: JSON.stringify(data_n) },
                    success: function () {console.log("Thanks!"); },
                    failure: function() {console.log("Error!");}
                });
            },
            error:function(){
                var dt = [data_load]
                toastr.error('File not found');
                $.ajax
                ({
                    type: "GET",
                    dataType : 'json',
                    async: false,
                    url: 'save_json.php',
                    data: { data: JSON.stringify(dt) },
                    success: function () {console.log("Thanks!"); },
                    failure: function() {console.log("Error!");}
                });
            }
        });

            
        
        toastr.success('Data saved');
    });
    $(document).on("click", "#login-submit", function(e){
        var user_n = $("#usr-name").val();
        var user_pass = $("#usr-password").val();
        $.ajax({
            type: "Get",
            url: "data/authentication_data.json",
            dataType: "json",
            success:(data_n)=>{
                // console.log(data_n);
                // var mail_exist_checker_flag = 0;
                // var user_exist_checker_flag = 0;
                // data_n.map((dta) => {
                //     if (dta["sign-up-email"] == email_d){
                //         mail_exist_checker_flag = 1;
                //     }
                //     if (dta["sign-up-usrname"] == user_d){
                //         user_exist_checker_flag = 1;
                //     }
                // });
                // if (mail_exist_checker_flag == 1 && user_exist_checker_flag == 1){
                //     toastr.error('Mail Id and user name exists already.  Please enter a different.');
                // }
                // else if (user_exist_checker_flag == 1 && mail_exist_checker_flag == 0){
                //     toastr.error('User name exists already.  Please enter a different User name.');
                // } 
                // else if (user_exist_checker_flag == 0 && mail_exist_checker_flag == 1){
                //     toastr.error('Mail ID exists already.  Please enter a different Mail ID.');
                // }

                var user_checker = 0;
                var pass_checker = 0;
                data_n.map((dta) => {
                    if (dta["sign-up-usrname"] == user_n){
                        user_checker = 1;
                    }
                    if (dta["sign-up-password1"] == user_pass){
                        pass_checker = 1;
                    }
                });
                if (user_checker == 1 && pass_checker == 1){
                    $("#main-load").load("templates/main-page.html");
                    $("#login-load").hide();
                    $("#main-load").show();
                    setTimeout(function(){
                        $("#lgd-usr-nm").html(user_n);
                    },1000);
                }else{
                    toastr.error('Either Username or password is invalid! Please enter a valid one.');
                }
            },
            error:function(){
                toastr.error('File not found!');
            }
        });
    });
});

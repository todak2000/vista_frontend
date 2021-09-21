let base_url = "https://vista-api.herokuapp.com/api/v1"

$(document).ready(function() { 
    // playSuccessSound2();
    // playSound("powerup")
    window.navigator.geolocation.getCurrentPosition(function(pos) { 
      // console.log(pos); 
      let lat = pos.coords.latitude;
      let lon = pos.coords.longitude;
      let edit_email = document.getElementById('edit_email').value
      console.log("latitude: ", lat)
      console.log("longitude: ", lon)
      let data={
        latitude: lat,
        longitude: lon,
        email: edit_email
    }
      $.ajax({
        url:base_url+'/location',
        type:'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data:JSON.stringify(data),
        success:function(response){
  
            console.log(response);
        },
        error:function(e){
            console.log(e);

        },
    });
    })
});
$(function(){
    $('#back_form').on('click', function (e) {
        window.location.reload();
    
    })});
$(function(){
    $('#cancel').on('click', function (e) {
        window.location.reload();
    
    })});
// SIGN UP API
$(function(){
    $('#signup_submit_button').on('click', function (e) {
        e.preventDefault();
        console.log("signup clicked");
        let firstname = document.getElementById("firstname").value;
        let lastname = document.getElementById("lastname").value;
        let email = document.getElementById("email").value;
        let phonenumber = document.getElementById("phonenumber").value;
        let password = document.getElementById("password").value;
        let service = null;
        let address = document.getElementById("address").value;
        let role = document.getElementById("role").value;
        if (role =="service_provider"){
            enumRole = 0;
            service = document.getElementById("sp_jobs").value;
        }
        else{ enumRole = 1}

        let terms_conditions = document.getElementById("terms_conditions");
        let state = document.getElementById("state").value;
        
        let data={
            firstName: firstname,
            lastName: lastname,
            email: email,
            phoneNumber: phonenumber,
            password: password,
            address: address,
            role: enumRole,
            state: state,
            service: service
        }
        document.getElementById("spinner").style.display = "block";
        if (terms_conditions.checked == false){
            document.getElementById("spinner").style.display = "none";
            document.getElementById('server_message_error').classList.add("alert-danger");
            document.getElementById('server_message_error').innerHTML = "Sorry! you need to agree to the Terms and Conditions to proceed.";
            document.getElementById("server_message_error").style.display = "block";
            setTimeout(function(){ 
                document.getElementById("server_message_error").style.display = "none"; 
            }, 3000);
        }
        
        else{
            $.ajax({
                url:base_url+'/signup',
                type:'POST',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data:JSON.stringify(data),
                success:function(response){
                    console.log(response)
                    document.getElementById("spinner").style.display = "none";
                    if(response.success == false){
                        document.getElementById('server_message_error').classList.add("alert-danger");
                        document.getElementById('server_message_error').innerHTML = response.message;
                        document.getElementById("server_message_error").style.display = "block";
                        setTimeout(function(){ 
                            document.getElementById("server_message_error").style.display = "none";   
                        }, 3000);
                        
                    }
                    else{
                        window.location.href = '/verify/'+response.user_id;
                    }
                    console.log(response);
                },
                error:function(e){
                    console.log(e);
                    $("#spinner").hide();
                },
            });
        }
    });
});

// SIGN IN API
$(function(){
    $('#signin_submit_button').on('click', function (e) {
        e.preventDefault();
        console.log("signin clicked");

        let email = document.getElementById("email_login").value;
        let password = document.getElementById("password_login").value;
        
        let data={
            email: email,
            password: password,
        }
        document.getElementById("spinner").style.display = "block";
        $.ajax({
            url:base_url+'/signin',
            type:'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            // headers: {"Authorization": localStorage.getItem('token')},
            data:JSON.stringify(data),
            success:function(response){
                
                
                if(response.status == 205){
                    window.location.href = '/verify/'+response.user_id;
                    document.getElementById('server_message_error').innerHTML = response.message;
                }
                if(response.success == true && response.status == 200){
                    sessionStorage.setItem("token", response.token);
                    sessionStorage.setItem("user_id", response.user_id);
                    token = sessionStorage.getItem("token");
                    console.log(response);
                    // playSuccessSound();
                    if (response.role == 1 && token !== ''){
                        window.location.href = '/client_dashboard/'+token;
                    }
                    else if (response.role == 0 && token !== ''){
                        window.location.href = '/sp_dashboard/'+token;
                    }
                    else{
                        window.location.href = '/signin';
                    }
                    document.getElementById("spinner").style.display = "none";
                    
                }
                else{
                    document.getElementById("spinner").style.display = "none";
                    document.getElementById('server_message_error').innerHTML = response.message;
                }
            },
            error:function(e){
                console.log(e);
                $("#spinner").hide();
            },
        });
        
    });
});

// VERIFY API
$(function(){
    $('#verify_submit').on('click', function (e) {
        e.preventDefault();
        let user_id = document.getElementById("user_id_verify").value;
        let code = document.getElementById("code_verify").value;
        document.getElementById("spinner").style.display = "block";
        $.ajax({
            url:base_url+'/verify',
            type:'POST',
            data:{
                code: code,
                user_id: user_id,
            },
            success:function(response){
                console.log(response)
                document.getElementById("spinner").style.display = "none";
                if(response.success == false){
                    document.getElementById('server_message_error').classList.add("alert-danger");
                    document.getElementById('server_message_error').innerHTML = response.message;
                    document.getElementById("server_message_error").style.display = "block";
                    setTimeout(function(){ 
                        document.getElementById("server_message_error").style.display = "none"; 
                        
                    }, 3000);  
                }
                else{
                    if (response.role == 1){
                        window.location.href = '/client_dashboard/'+user_id;
                    document.getElementById('p_id').innerHTML = user_id;
                    }else{
                        window.location.href = '/sp_dashboard/'+user_id;
                    }
                    
                    // window.location.href = '/signin';
                    // document.getElementById('server_message_success').innerHTML = response.message;
                }
                console.log(response);
            },
            error:function(e){
                console.log(e);
                $("#spinner").hide();
            },
        });
        
        
    });
});

// RESEND CODE API
$(function(){
    $('#resend_submit').on('click', function (e) {
        e.preventDefault();
        let user_id = document.getElementById("user_id_verify").value;
        document.getElementById("spinner").style.display = "block";
        $.ajax({
            url:base_url+'/resend_code',
            type:'POST',
            data:{
                user_id: user_id,
            },
            success:function(response){
                document.getElementById("spinner").style.display = "none";
                if(response.success == false){
                    document.getElementById('server_message_error').classList.add("alert-danger");
                    document.getElementById('server_message_error').innerHTML = response.message;
                    document.getElementById("server_message_error").style.display = "block";
                    setTimeout(function(){ 
                        document.getElementById("server_message_error").style.display = "none"; 
                    }, 3000);
                    
                }
                else{
                    document.getElementById('server_message_success').classList.add("alert-primary");
                    document.getElementById('server_message_success').innerHTML = response.message;
                    document.getElementById("server_message_success").style.display = "block";
                    document.getElementById("verify_form").reset()
                    // setTimeout(function(){  
                    //     window.location.href = '/signin';
                    // }, 2000);
                }
                console.log(response);
            },
            error:function(e){
                $("#spinner").hide();
                console.log(e);
            },
        });
    });
});

// FORGOT- SEND RESED CODE CODE API
$(function(){
    $('#forgot_submit').on('click', function (e) {
        e.preventDefault();
        let email = document.getElementById("forgot_email").value;
        // let $crf_token = $('[name="csrfmiddlewaretoken"]').attr('value');
        document.getElementById("spinner").style.display = "block";
        $.ajax({
            url:base_url+'/forgot_password',
            type:'POST',
            // headers:{"X-CSRFToken": $crf_token},
            data:{
                email: email,
            },
            success:function(response){
                // $("#loader").hide();
                document.getElementById("spinner").style.display = "none";
                if(response.success == false){
                    document.getElementById('server_message_error').classList.add("alert-danger");
                    document.getElementById('server_message_error').innerHTML = response.message;
                    document.getElementById("server_message_error").style.display = "block";
                    setTimeout(function(){ 
                        document.getElementById("server_message_error").style.display = "none"; 
                    }, 3000);
                    
                }
                else{
                    document.getElementById('server_message_success').classList.add("alert-primary");
                    document.getElementById('server_message_success').innerHTML = response.message;
                    document.getElementById("server_message_success").style.display = "block";
                    setTimeout(function(){ 
                        document.getElementById("server_message_success").style.display = "none"; 
                        window.location.href = '/verify_password/'+response.user_id;
                    }, 3000);
                }
                console.log(response);
            },
            error:function(e){
                console.log(e);
                $("#loader").hide();
            },
        });
        
        
    });
});

// VERIFY PASSOWRD CHANGE API
$(function(){
    $('#verify_password_submit').on('click', function (e) {
        e.preventDefault();
        let user_id = document.getElementById("verify_user_id").value;
        let code = document.getElementById("code").value;
        document.getElementById("spinner").style.display = "block";
        $.ajax({
            url:base_url+'/confirm_user_password',
            type:'POST',
            data:{
                code: code,
                user_id: user_id
            },
            success:function(response){
                $("#loader").hide();
                document.getElementById("spinner").style.display = "none";
                if(response.success == false){
                    document.getElementById('server_message_error').classList.add("alert-danger");
                    document.getElementById('server_message_error').innerHTML = response.message;
                    document.getElementById("server_message_error").style.display = "block";
                    setTimeout(function(){ 
                        document.getElementById("server_message_error").style.display = "none"; 
                        
                    }, 3000);
                    
                }
                else{
                    window.location.href = '/reset_password/'+response.user_id;
                }
                console.log(response);
            },
            error:function(e){
                $("#spinner").hide();
                console.log(e);
            },
        });
    });
});

// CHANGE PASSWORD API
$(function(){
    $('#change_password_submit').on('click', function (e) {
        e.preventDefault();
        let user_id = document.getElementById("reset_user_id").value;
        let password = document.getElementById("password").value;
        let confirm_password = document.getElementById("confirm_password").value;
        // let $crf_token = $('[name="csrfmiddlewaretoken"]').attr('value');
        document.getElementById("spinner").style.display = "block";
        $.ajax({
            url:base_url+'/change_password',
            type:'POST',
            // headers:{"X-CSRFToken": $crf_token},
            data:{
                password: password,
                user_id: user_id,
                confirm_password: confirm_password,
            },
            success:function(response){
                document.getElementById("spinner").style.display = "none";
                if(response.success == false){
                    document.getElementById('server_message_error').classList.add("alert-danger");
                    document.getElementById('server_message_error').innerHTML = response.message;
                    document.getElementById("server_message_error").style.display = "block";
                    setTimeout(function(){ 
                        document.getElementById("server_message_error").style.display = "none"; 
                    }, 3000);
                    
                }
                else{
                    document.getElementById('server_message_success').classList.add("alert-primary");
                    document.getElementById('server_message_success').innerHTML = response.message;
                    document.getElementById("server_message_success").style.display = "block";
                    setTimeout(function(){ 
                        document.getElementById("server_message_success").style.display = "none"; 
                        window.location.href = '/signin';
                    }, 2000);
                }
                console.log(response);
            },
            error:function(e){
                $("#spinner").hide();
                console.log(e);
            },
        });
        
        
    });
});

// EDIT BIO API
$(function(){
    $('#update_bio_submit_button').on('click', function (e) {
        e.preventDefault();
        let edit_state = document.getElementById("edit_state").value;
        let edit_address = document.getElementById("edit_address").value;
        let edit_phone = document.getElementById("edit_phone").value;
        document.getElementById("spinner").style.display = "block";
        $.ajax({
            url:base_url+'/edit_bio',
            type:'PUT',
            data:{
                state: edit_state,
                address: edit_address,
                phone: edit_phone,
            },
            success:function(response){
                document.getElementById("spinner").style.display = "none";
                if(response.success == false){
                    document.getElementById('edit_bio_error').classList.add("alert-danger");
                    document.getElementById('edit_bio_error').innerHTML = response.message;
                    document.getElementById("edit_bio_error").style.display = "block";
                    setTimeout(function(){ 
                        document.getElementById("edit_bio_error").style.display = "none"; 
                    }, 3000);
                    
                }
                else{
                    document.getElementById('edit_bio_success').classList.add("alert-purple");
                    document.getElementById('edit_bio_success').innerHTML = response.message;
                    document.getElementById("edit_bio_success").style.display = "block";
                }
                console.log(response);
            },
            error:function(e){
                $("#spinner").hide();
                console.log(e);
            },
        });
        
        
    });
});

// EDIT ACCOUNT API
$(function(){
    $('#update_acc_submit_button').on('click', function (e) {
        e.preventDefault();
        let edit_phone = document.getElementById("edit_phone").value;
        let edit_acc_name = document.getElementById("edit_acc_name").value;
        let edit_acc_no = document.getElementById("edit_acc_no").value;
        let edit_bank = document.getElementById("edit_bank").value;
        document.getElementById("spinner").style.display = "block";
        $.ajax({
            url:base_url+'/edit_account',
            type:'PUT',
            data:{
                bank: edit_bank,
                acc_no: edit_acc_no,
                acc_name: edit_acc_name,
                phone: edit_phone,
            },
            success:function(response){
                document.getElementById("spinner").style.display = "none";
                if(response.success == false){
                    document.getElementById('edit_acc_error').classList.add("alert-danger");
                    document.getElementById('edit_acc_error').innerHTML = response.message;
                    document.getElementById("edit_acc_error").style.display = "block";
                    setTimeout(function(){ 
                        document.getElementById("edit_acc_error").style.display = "none"; 
                    }, 3000);
                    
                }
                else{
                    document.getElementById('edit_acc_success').classList.add("alert-purple");
                    document.getElementById('edit_acc_success').innerHTML = response.message;
                    document.getElementById("edit_acc_success").style.display = "block";
                }
                console.log(response);
            },
            error:function(e){
                $("#spinner").hide();
                console.log(e);
            },
        });
        
        
    });
});

// EDIT PASSOWRD API
$(function(){
    $('#update_pass_submit_button').on('click', function (e) {
        e.preventDefault();
        let edit_phone = document.getElementById("edit_phone").value;
        let old_password = document.getElementById("edit_old_password").value;
        let new_password = document.getElementById("edit_new_password").value;
        let confirm_password = document.getElementById("edit_confirm_new_password").value;
        document.getElementById("spinner").style.display = "block";
        if (new_password != confirm_password){
            document.getElementById("spinner").style.display = "none";
            document.getElementById("edit_pass_error").classList.add("alert-danger");
            document.getElementById('edit_pass_error').innerHTML = "Sorry! New Password do not match";
            document.getElementById("edit_pass_error").style.display = "block";
            setTimeout(function(){ 
                document.getElementById("edit_pass_error").style.display = "none"; 
            }, 2000);
       }
       else{
            $.ajax({
                url:base_url+'/edit_password',
                type:'PUT',
                data:{
                    old_password: old_password,
                    new_password: new_password,
                    phone: edit_phone,
                },
                success:function(response){
                    console.log(response);
                    document.getElementById("spinner").style.display = "none";
                    if(response.success == true){
                        document.getElementById("edit_pass_success").classList.add("alert-purple");
                        document.getElementById('edit_pass_success').innerHTML = response.message;
                        document.getElementById("edit_pass_success").style.display = "block";        
                    }
                    else{
                        document.getElementById("edit_pass_error").classList.add("alert-danger");
                        document.getElementById('edit_pass_error').innerHTML = response.message;
                        document.getElementById("edit_pass_error").style.display = "block";
                        setTimeout(function(){ 
                            document.getElementById("edit_pass_error").style.display = "none"; 
                        }, 2000);
                    }
                },
                error:function(e){
                    document.getElementById("spinner").style.display = "none";
                    console.log(e);
                },
            });
       }
    });  
});

// withdrawal function
$(function(){
    $('#withdraw_submit_button').on('click', function (e) {
        e.preventDefault();
        document.getElementById("spinner").style.display = "block";
        document.getElementById("withdraw_submit_button").style.display = "none";
        let edit_phone = document.getElementById("edit_phone").value;
        let amount = document.getElementById("withdraw_amount").value;
        let balance = document.getElementById("edit_balance").value;
        
        let withdraw_accountname_filled = document.getElementById("withdraw_accountname_filled").value;
        if (withdraw_accountname_filled === "Account Name"){
            withdraw_accountname = document.getElementById("withdraw_accountname").value;
            withdraw_accountno = document.getElementById("withdraw_accountno").value;
            withdraw_bank = document.getElementById("withdraw_bank").value;
            save_bank_details = document.getElementById("save_bank_details");
            if (save_bank_details.checked == true && withdraw_accountname == "" || withdraw_accountno == "" || withdraw_bank == ""){
                document.getElementById("withdraw_submit_button").style.display = "block";
                document.getElementById("spinner").style.display = "none";
                document.getElementById("edit_withdraw_error").innerHTML = "Sorry! Your account details is incomplete. Kindly fill the account form again and save again";
                setTimeout(function(){ 
                    document.getElementById("edit_withdraw_error").innerHTML = "";
                    }, 2000);
            }
            else if (save_bank_details.checked == false && withdraw_accountname == "" || withdraw_accountno == "" || withdraw_bank == ""){
                document.getElementById("withdraw_submit_button").style.display = "block";
                document.getElementById("spinner").style.display = "none";
                document.getElementById("edit_withdraw_error").innerHTML = "Please! Kindly enter your account details";
                setTimeout(function(){ 
                    document.getElementById("edit_withdraw_error").innerHTML = "";
                    }, 2000);
            }
            
            else{
                console.log(save_bank_details.checked)
                $.ajax({
                    url:base_url+'/withdrawal',
                    type:'POST',
                    data:{
                        phone: edit_phone,
                        amount: amount,
                        account_name: withdraw_accountname,
                        account_no: withdraw_accountno,
                        bank: withdraw_bank,
                        save_account_details:save_bank_details.checked
                    },
                    success:function(response){
                        document.getElementById("spinner").style.display = "none";
                        console.log(response);
                        if(response.success == false){
                            document.getElementById("verification_div2").style.display = "block";
                            document.getElementById("failure_div2").style.display = "block";
                            document.getElementById("error_p").innerHTML = response.message;
                            document.getElementById("saving").style.display = "none"; 
                        }
                        if(response.success == true){
                            document.getElementById("verification_div2").style.display = "block";
                          document.getElementById("success_div2").style.display = "block"; 
                          document.getElementById("saving").style.display = "none";          
                        }
                        setTimeout(function(){ 
                            window.location.reload();  
                        }, 2000);
                    },
                    error:function(e){
                        console.log(e);
                    },
                });
            }
        }
        if ( parseFloat(amount) > parseFloat(balance)){
            document.getElementById("spinner").style.display = "none";
            document.getElementById("withdraw_submit_button").style.display = "block";
            document.getElementById("edit_withdraw_error").innerHTML = "Sorry! you have Insufficient Balance";
            setTimeout(function(){ 
                document.getElementById("edit_withdraw_error").innerHTML = "";
              }, 2000);
        }
        else if (parseFloat(amount) <= 0 || amount ==""){
            document.getElementById("withdraw_submit_button").style.display = "block";
            document.getElementById("spinner").style.display = "none";
            document.getElementById("edit_withdraw_error").innerHTML = "Sorry! Kindly enter a non-zero amount";
            setTimeout(function(){ 
                document.getElementById("edit_withdraw_error").innerHTML = "";
              }, 2000);
        }
        
        else if (withdraw_accountname_filled !== "Account Name"){
            
            $.ajax({
                url:base_url+'/withdrawal',
                type:'POST',
                data:{
                    phone: edit_phone,
                    amount: amount,
                },
                success:function(response){
                    document.getElementById("spinner").style.display = "none";
                    console.log(response);
                    if(response.success == false){
                        document.getElementById("verification_div2").style.display = "block";
                        document.getElementById("failure_div2").style.display = "block";
                        document.getElementById("error_p").innerHTML = response.message;
                    }
                    if(response.success == true){
                        document.getElementById("verification_div2").style.display = "block";
                      document.getElementById("success_div2").style.display = "block";          
                    }
                    setTimeout(function(){ 
                        window.location.reload();  
                    }, 2000);
                },
                error:function(e){
                    console.log(e);
                },
            });
            
        }
        
    });
});

// top-up api (paystack callback function)
$(function(){
    $('#verify_payment_button').on('click', function (e) {
        e.preventDefault();
        document.getElementById("spinner").style.display = "block";
        document.getElementById("verify_payment_button").style.display = "none";
        let amount = document.getElementById("tt_amount").value;
        let edit_phone = document.getElementById("edit_phone").value;
        $.ajax({
            url:base_url+'/fund',
            type:'POST',
            data:{
                phone: edit_phone,
                amount: amount,
            },
            success:function(response){
                document.getElementById("spinner").style.display = "none";
                console.log(response);
                if(response.success == false){
                    document.getElementById("failure_div").style.display = "block";
                }
                if(response.success == true){
                  document.getElementById("success_div").style.display = "block";          
                }
                setTimeout(function(){ 
                    window.location.reload();
                }, 2000);
            },
            error:function(e){
                console.log(e);
            },
        });
        
    });
});

// SP home
function sp_home(token) {
    if (token){
        window.location.href = '/sp_dashboard/'+token;
    }
    else{
        window.location.href = '/signin';
    }
    // window.location.href = '/sp_dashboard/'+token;
}
// SP Profile
function sp_profile(token) {
    if (token){
        window.location.href = '/sp_profile/'+token;
    }
    else{
        window.location.href = '/signin';
    }
    // window.location.href = '/sp_profile/'+token;
}
// SP Jobs
function sp_job(token) {
    if (token){
        window.location.href = '/sp_job/'+token;
    }
    else{
        window.location.href = '/signin';
    }
    // window.location.href = '/sp_job/'+token;
}
// Client home
function client_home(token) {
    if (token){
        window.location.href = '/client_dashboard/'+token;
    }
    else{
        window.location.href = '/signin';
    }
    // playSuccessSound();
}
// Client profile
function client_profile(token) {
    if (token){
        window.location.href = '/client_profile/'+token;
    }
    else{
        window.location.href = '/signin';
    }
    // window.location.href = '/client_profile/'+token;
}
// Client Wallet
function client_wallet(token) {
    if (token){
        window.location.href = '/client_wallet/'+token;
    }
    else{
        window.location.href = '/signin';
    }
    // window.location.href = '/client_wallet/'+token;
} 
// Client Job
function client_job(token) {
    if (token){
        window.location.href = '/client_job/'+token;
    }
    else{
        window.location.href = '/signin';
    }
    // window.location.href = '/client_job/'+token;
} 

function signout() {
    sessionStorage.clear()
    window.location.href = '/signin';
}

function request_form(id) {
    
    document.getElementById('service_type').value = id;
    if (id !== "Carpentry-"){
        document.getElementById('service_form').style.display = "none";
        document.getElementById('formo').style.display = "block";
        document.getElementById('description').style.display = "none";
        // document.getElementById('text_amount').style.display = "none";
        // document.getElementById('amount').style.display = "none";
        document.getElementById('des_text').style.display = "none";
        document.getElementById('service_list').style.display = "block";
        document.getElementById('service_list_text').style.display = "block";
    }
    $.ajax({
        url:base_url+'/service_list/'+id,
        type:'GET',
        success:function(response){

            console.log(response);
            if(response.success == true){
                $.each(response.list, function(x, data){

                    $('#service_list').append($('<option>', {value: data.type+" - N"+data.amount, text:data.type+" - N"+data.amount}));
     
               });
            }
            
            else{}
        },
        error:function(e){
            console.log(e);
        },
    });
    $('#requestModal').modal('show');
}

function job_details(id) {
    console.log(id);
    $.ajax({
        url:base_url+'/job_details/'+id,
        type:'GET',
        success:function(response){
            // console.log(response);
            document.getElementById('d_service_type').value = response.job_details.service_type;
            if (response.job_details.details !== null){
                document.getElementById('d_details').value = response.job_details.details;
            }
            else{
                document.getElementById('d_details').style.display= "none";
            }
            // document.getElementById('d_tools').value = response.job_details.tools;
            // document.getElementById('d_budget').value = response.job_details.budget;

            document.getElementById('d_job_id').value = response.job_details.job_id;
            document.getElementById('d_client_id').value = response.job_details.client_id;
            document.getElementById('d_sp_id').value = response.job_details.sp_id;
            if(response.job_details.isTaken === false && response.job_details.isCompleted === false && response.job_details.isRejectedSP === false){
                document.getElementById('request_details_button').value = "Cancel";
                document.getElementById("note").innerHTML = "Kindly wait for the Service Provider to Accept the Job";
                document.getElementById("request_details_button").style.background = "red";
            }
            else if(response.job_details.isTaken === false && response.job_details.isCompleted === false && response.job_details.isRejectedSP === true){
                document.getElementById("request_details_button").style.display = "none";
                document.getElementById("note").style.color = "red";
                document.getElementById("note").innerHTML = "Sorry, the job has been rejected/canceled by the Service Provider";
            }
            else if(response.job_details.isTaken === true && response.job_details.isCompleted === false && response.job_details.isRejectedSP === false){
                document.getElementById('request_details_button').value = "Confirm Job Completed";
                document.getElementById("note").innerHTML = "";
                document.getElementById("star_div").style.display = "flex";
                document.getElementById("request_details_button").style.background = "#3EBC91";
            }
            else if(response.job_details.isTaken === true && response.job_details.isCompleted === true && response.job_details.isRejectedSP === false){
                document.getElementById("request_details_button").style.display = "none";
                document.getElementById("note").style.color = "#3EBC91";
                document.getElementById("note").innerHTML = "Job done!";
            }
            $('#detailsModal').modal('show');
        },
        error:function(e){
            console.log(e);
        },
    });
    
}
// sp collected cash

$(function(){
    $('#s_cash_button').on('click', function (e) {
        e.preventDefault();
        let email = document.getElementById("edit_email").value;
        document.getElementById("s_cash_button").disabled = true;
        let job_id = document.getElementById("s_job_id").value;
        console.log(job_id)
        $.ajax({
            url:base_url+'/cash_collected/'+job_id,
            type:'POST',
            success:function(response){
                // document.getElementById("spinner").style.display = "none";
                console.log(response);
                if(response.success == false){
                    document.getElementById("s_cash_button").disabled = false;
                }
                
                else{
                    document.getElementById("s_cash_button").text= "Thank you!"
                }
            },
            error:function(e){
                console.log(e);
            },
        });
    })
})
// job request function
$(function(){
    $('#request_submit_button').on('click', function (e) {
        e.preventDefault();
        document.getElementById("spinner").style.display = "block"; 
        
        // document.getElementById("request_submit_button").style.display = "none";
        if (document.getElementById("request_final_div").style.display = "block"){
            document.getElementById("request_final_div").style.display = "none";
            document.getElementById("r_success_div").style.display = "none"; 
            document.getElementById("sp_name").innerHTML = "";
            document.getElementById("sp_address").innerHTML = ""
            document.getElementById("sp_phone").innerHTML = ""
            document.getElementById("sp_id").innerHTML = ""
            document.getElementById("rating_divi").innerHTML = ""
        };
        let service_type = document.getElementById("service_type").value; 
        // let address = document.getElementById("address").value;
        // let service_form = document.getElementById("service_form").value;
        // let specific_service = document.getElementById("service_list").value;
        // let unit = document.getElementById("unit").value;
        // let specific_amount = document.getElementById("specific_amount").value;
        // let amount = unit * specific_amount;
        // let payment_mode = document.getElementById("payment_mode").value;
        let phone = document.getElementById("edit_phone").value;
        // let description
        // if ( service_form === "fix" ){
        //     description = "";
        // }
        // else if ( service_form === "build" ){
        //     description = document.getElementById("description").value;
        // }
        
        
            $.ajax({
                url:base_url+'/request',
                type:'POST',
                data:{
                    service_type: service_type,
                    // service_form: service_form,
                    // address: address,
                    // amount: amount,
                    // payment_mode: payment_mode,
                    phone: phone,
                    // specific_service: specific_service,
                    // unit: unit,
                    // description:description
                },
                success:function(response){
                    document.getElementById("spinner").style.display = "none";
                    console.log(response);
                    if(response.success == false){
                        document.getElementById("request_final_div").style.display = "block";
                        document.getElementById("r_message").innerHTML = response.message;
                        document.getElementById("r_failure_div").style.display = "block";
                        setTimeout(function(){ 
                            window.location.reload();
                        }, 5000);
                    }
                    else if(response.success == true && response.message){
                        document.getElementById("map_search").style.display = "block";
                        document.getElementById("map_search_h1").style.display = "block";
                        document.getElementById("request_final_div").style.display = "block";
                        setTimeout(function(){ 
                            document.getElementById("map_search").style.display = "none";
                            document.getElementById("map_search_h1").style.display = "none";
                            document.getElementById("r_message").innerHTML = response.message;
                            document.getElementById("r_failure_div").style.display = "block";
                        }, 5000);
                        setTimeout(function(){ 
                            window.location.reload();
                        }, 5000);
                        
                    }
                    else if(response.success == true && response.status == 200){
                        document.getElementById("map_search").style.display = "block";
                        document.getElementById("map_search_h1").style.display = "block";
                        document.getElementById("request_final_div").style.display = "block";
                        response.serviceProviders.reduce(function(prev, curr) {
                            return prev.distance < curr.distance ? prev : curr;
                        });
                        console.log(response.serviceProviders)
                        setTimeout(function(){ 
                            document.getElementById("map_search_h1").style.display = "none";
                            document.getElementById("map_search").style.display = "none";
                            document.getElementById("sp_name").innerHTML = response.serviceProviders[0].sp_firstname +" "+ response.serviceProviders[0].sp_lastname ;
                            document.getElementById("sp_address").innerHTML = response.serviceProviders[0].sp_address+", "+response.serviceProviders[0].sp_state
                            document.getElementById("sp_phone").innerHTML = response.serviceProviders[0].sp_phone
                            document.getElementById("sp_id").value = response.serviceProviders[0].sp_id
                            document.getElementById("job_id").value = response.job_id
                            let i=0,length=response.serviceProviders[0].sp_ratings;
                            for(i; i<=length-1;i++){
                                $('.rating_div').append($('<span class="fa fa-star" style="color:#FFDF8C;"></span>')); 
                            }
                            document.getElementById("r_success_div").style.display = "block"; 
                            document.getElementById("request_submit_button").style.display = "none";
                            document.getElementById("request_submit_button").value = "Find Another" 
                        }, 5000);
                                 
                    }
                    else{}
                },
                error:function(e){
                    console.log(e);
                },
            });
        

    })
});

// client accept sp update function
$(function(){
    $('#client_accept_sp_submit_button').on('click', function (e) {
        e.preventDefault();
        document.getElementById("spinner").style.display = "block";
        let sp_id = document.getElementById("sp_id").value;
        let service_type = document.getElementById("service_type").value; 
        let address = document.getElementById("address").value;
        let service_form = document.getElementById("service_form").value;
        let specific_service = document.getElementById("service_list").value;
        let unit = document.getElementById("unit").value;
        let specific_amount = document.getElementById("specific_amount").value;
        let amount = unit * specific_amount;
        let payment_mode = document.getElementById("payment_mode").value;
        let phone = document.getElementById("edit_phone").value;
        let description
        if ( service_form === "fix" ){
            description = "";
        }
        else if ( service_form === "build" ){
            description = document.getElementById("description").value;
        }
        else{
            description = "No description given";
        }
        // let job_id = document.getElementById("job_id").value;
        console.log(sp_id)
        // console.log(job_id)
        $.ajax({
            url:base_url+'/accept_sp',
            type:'POST',
            data:{
                sp_id: sp_id,
                service_type: service_type,
                service_form: service_form,
                address: address,
                amount: amount,
                payment_mode: payment_mode,
                phone: phone,
                specific_service: specific_service,
                unit: unit,
                description:description
                // job_id: job_id
            },
            success:function(response){
                
                document.getElementById("spinner").style.display = "none";
                if(response.success == false){
                    console.log(response);
                }
                if(response.success == true){
                    token = sessionStorage.getItem("token");
                    window.location.href = '/client_job/'+token;       
                }
            },
            error:function(e){
                console.log(e);
            },
        });
    })})

    // star ratings click function
    $(function(){
     
        // star rating
        $('#star_one').on('click', function (e) {
            e.preventDefault();
            console.log("star_one");
            document.getElementById("star_one").style.color = "orange";
            document.getElementById("d_rating").value =1;
        
            // make them unclicable 
            document.getElementById("star_one").style.pointerEvents = "none";
            document.getElementById("star_two").style.pointerEvents = "none";
            document.getElementById("star_three").style.pointerEvents = "none";
            document.getElementById("star_four").style.pointerEvents = "none";
            document.getElementById("star_five").style.pointerEvents = "none";
        });
        $('#star_two').on('click', function (e) {
            e.preventDefault();
            console.log("star_two");
            document.getElementById("star_one").style.color = "orange";
            document.getElementById("star_two").style.color = "orange";
            document.getElementById("d_rating").value =2;
        
            // make them unclicable 
            document.getElementById("star_one").style.pointerEvents = "none";
            document.getElementById("star_two").style.pointerEvents = "none";
            document.getElementById("star_three").style.pointerEvents = "none";
            document.getElementById("star_four").style.pointerEvents = "none";
            document.getElementById("star_five").style.pointerEvents = "none";
        });
        $('#star_three').on('click', function (e) {
            e.preventDefault();
            console.log("star_three");
            document.getElementById("star_one").style.color = "orange";
            document.getElementById("star_two").style.color = "orange";
            document.getElementById("star_three").style.color = "orange";
            document.getElementById("d_rating").value =3;
        
            // make them unclicable 
            document.getElementById("star_one").style.pointerEvents = "none";
            document.getElementById("star_two").style.pointerEvents = "none";
            document.getElementById("star_three").style.pointerEvents = "none";
            document.getElementById("star_four").style.pointerEvents = "none";
            document.getElementById("star_five").style.pointerEvents = "none";
        });
        $('#star_four').on('click', function (e) {
            e.preventDefault();
            console.log("star_four");
            document.getElementById("star_one").style.color = "orange";
            document.getElementById("star_two").style.color = "orange";
            document.getElementById("star_three").style.color = "orange";
            document.getElementById("star_four").style.color = "orange";
            document.getElementById("d_rating").value =4;
        
            // make them unclicable 
            document.getElementById("star_one").style.pointerEvents = "none";
            document.getElementById("star_two").style.pointerEvents = "none";
            document.getElementById("star_three").style.pointerEvents = "none";
            document.getElementById("star_four").style.pointerEvents = "none";
            document.getElementById("star_five").style.pointerEvents = "none";
        });
        $('#star_five').on('click', function (e) {
            e.preventDefault();
            console.log("star_five");
            document.getElementById("star_one").style.color = "orange";
            document.getElementById("star_two").style.color = "orange";
            document.getElementById("star_three").style.color = "orange";
            document.getElementById("star_four").style.color = "orange";
            document.getElementById("star_five").style.color = "orange";
            document.getElementById("d_rating").value =5;
        
            // make them unclicable 
            document.getElementById("star_one").style.pointerEvents = "none";
            document.getElementById("star_two").style.pointerEvents = "none";
            document.getElementById("star_three").style.pointerEvents = "none";
            document.getElementById("star_four").style.pointerEvents = "none";
            document.getElementById("star_five").style.pointerEvents = "none";
        });
    });

    // client job update function
$(function(){
    $('#request_details_button').on('click', function (e) {
        e.preventDefault();
        let button = document.getElementById("request_details_button")
        let sp_id = document.getElementById("d_sp_id").value;
        let job_id = document.getElementById("d_job_id").value;
        let client_id = document.getElementById("d_client_id").value;
        document.getElementById("spinner").style.display = "block";
        if(button.value === "Cancel"){
            button.disabled
            $.ajax({
                url:base_url+'/client_cancel',
                type:'POST',
                data:{
                    client_id: client_id,
                    job_id: job_id,
                    sp_id: sp_id,
                },
                success:function(response){
                    document.getElementById("spinner").style.display = "none";
                    console.log(response);
                    if(response.success == false){
                        button.enabled
                        // button.value === "Cancel"
                    }
                    if(response.success == true){
                        token = sessionStorage.getItem("token");
                        window.location.href = '/client_job/'+token;       
                    }
                },
                error:function(e){
                    console.log(e);
                    document.getElementById("spinner").style.display = "none";
                },
            });
        }
        else if(button.value === "Confirm Job Completed"){
            let ratings = document.getElementById("d_rating").value;
            button.text === "Confirming Job Completion ..."
            $.ajax({
                url:base_url+'/client_confirm',
                type:'POST',
                data:{
                    client_id: client_id,
                    job_id: job_id,
                    sp_id: sp_id,
                    ratings: ratings
                },
                success:function(response){
                    document.getElementById("spinner").style.display = "none";
                    if(response.success == false){
                        console.log(response);
                        button.value === "Confirm Job Completed"
                    }
                    if(response.success == true){
                        token = sessionStorage.getItem("token");
                        window.location.href = '/client_job/'+token;       
                    }
                },
                error:function(e){
                    document.getElementById("spinner").style.display = "none";
                    console.log(e);
                },
            });
        }else{}
    })})

    // create sp job details from job details funtion above

    function sp_job_details(id) {
        console.log(id);
        $.ajax({
            url:base_url+'/job_details/'+id,
            type:'GET',
            success:function(response){
                console.log(response);
                // console.log(response.job_details.unit)
                document.getElementById('s_service_type').value = response.job_details.service_type;
                
                if (response.job_details.unit !== null){
                    document.getElementById('s_unit').value = response.job_details.unit;
                }
                
                else{
                    document.getElementById('s_unit').value = 1;
                }
                if (response.job_details.details !== null || ""){
                    document.getElementById('s_details').value = response.job_details.details;
                }
                else{
                    document.getElementById('s_service_list').value = response.job_details.specific_service;
                    document.getElementById('s_details').style.display="none";
                    document.getElementById('s_service_list').style.display="block";
                }
                if(response.job_details.payment_mode === 'cash' && response.job_details.isTaken == true && response.job_details.isCompleted == false){
                    document.getElementById('s_cash_button').style.display="block";
                    document.getElementById('s_cash_button').value="I collected Cash sum of "+"(N"+response.job_details.amount+")";
                }
                // document.getElementById('s_unit').value = 1;
                document.getElementById('s_phone').value = response.job_details.client_phone;
                document.getElementById('s_location').value = response.job_details.clientAddress;
    
                document.getElementById('s_job_id').value = response.job_details.job_id;
                document.getElementById('s_client_id').value = response.job_details.client_id;
                document.getElementById('s_sp_id').value = response.job_details.sp_id;
                if(response.job_details.isTaken === false && response.job_details.isCompleted === false && response.job_details.isRejectedSP === false){
                    document.getElementById("note").innerHTML = "Kindly look through the job details and accept or reject. Thanks";
                    document.getElementById("reject_button").style.display="block";
                    document.getElementById("accept_button").style.display="block";
                    document.getElementById("s_note").innerHTML = ""
                }
                else if(response.job_details.isTaken === false && response.job_details.isCompleted === false && response.job_details.isRejectedSP === true){
                    document.getElementById("note").style.color = "red";
                    document.getElementById("reject_button").style.display="none";
                    document.getElementById("accept_button").style.display="none";
                    document.getElementById("s_note").style.color="red";
                    document.getElementById("s_note").innerHTML = "You rejected/canceled the Job";
                }
                else if(response.job_details.isTaken === true && response.job_details.isCompleted === false && response.job_details.isRejectedSP === false){
                    document.getElementById('accept_button').value = "Confirm you have completed the Job";
                    document.getElementById("s_note").innerHTML = "";
                    document.getElementById("accept_button").style.display="block";
                    document.getElementById("accept_button").style.background = "#3EBC91";
                }
                else if(response.job_details.isTaken === true && response.job_details.isCompleted === true && response.job_details.isRejectedSP === false){
                    document.getElementById("reject_button").style.display="none";
                    document.getElementById("accept_button").style.display="none";
                    document.getElementById("s_note").style.color = "#3EBC91";
                    document.getElementById("s_note").innerHTML = "Completed";
                }
                $('#detailspModal').modal('show');
            },
            error:function(e){
                document.getElementById("spinner").style.display = "none";
                console.log(e);
            },
        });
        
    }


// sp accept client offer update function
$(function(){
    $('#accept_button').on('click', function (e) {
        e.preventDefault();
        let button = document.getElementById("accept_button")
        let sp_id = document.getElementById("s_sp_id").value;
        let job_id = document.getElementById("s_job_id").value;
        document.getElementById("spinner").style.display = "block";
        // let client_id = document.getElementById("s_client_id").value;
        if(button.value === "Confirm you have completed the Job"){
            button.disabled = true;
            $.ajax({
                url:base_url+'/complete_job',
                type:'POST',
                data:{
                    job_id: job_id,
                    sp_id: sp_id,
                },
                success:function(response){
                    document.getElementById("spinner").style.display = "none";
                    console.log(response);
                    if(response.success == false){
                        button.enabled
                        button.value === "Confirm you have completed the Job"
                    }
                    if(response.success == true){
                        token = sessionStorage.getItem("token");
                        window.location.href = '/sp_job/'+token;       
                    }
                },
                error:function(e){
                    document.getElementById("spinner").style.display = "none";
                    console.log(e);
                },
            });
        }
        else if(button.value === "Accept Job"){
            $.ajax({
                url:base_url+'/accept_job',
                type:'POST',
                data:{
                    job_id: job_id,
                    sp_id: sp_id,
                },
                success:function(response){
                    document.getElementById("spinner").style.display = "none";
                    if(response.success == false){
                        console.log(response);
                        button.value === "Accept Job"
                    }
                    if(response.success == true){
                        token = sessionStorage.getItem("token");
                        window.location.href = '/sp_job/'+token;       
                    }
                },
                error:function(e){
                    document.getElementById("spinner").style.display = "none";
                    console.log(e);
                },
            });
        }else{}
    })})


    // sp reject client offer update function
$(function(){
    $('#reject_button').on('click', function (e) {
        e.preventDefault();
        document.getElementById("spinner").style.display = "block";
        let sp_id = document.getElementById("s_sp_id").value;
        let job_id = document.getElementById("s_job_id").value;
        console.log(sp_id)
        console.log(job_id)
        $.ajax({
            url:base_url+'/reject_job',
            type:'POST',
            data:{
                sp_id: sp_id,
                job_id: job_id
            },
            success:function(response){
                
                document.getElementById("spinner").style.display = "none";
                if(response.success == false){
                    console.log(response);
                }
                if(response.success == true){
                    token = sessionStorage.getItem("token");
                    window.location.href = '/sp_job/'+token;       
                }
            },
            error:function(e){
                console.log(e);
            },
        });
    })})


    // sound notification js
 
    // function playSound() {
    //     console.log("sound hu")
    //     let url = "https://drive.google.com/file/d/1Ders--xfDkmkuOpQ-laQRQHBPZNKVz6T/view?usp=sharing"
    //     const audio = new Audio(url);
    //     audio.play();
    //   }

    var context = new AudioContext();
    // Play oscillators at certain frequency and for a certain time
var playNote = function (frequency, startTime, duration) {
    var osc1 = context.createOscillator(),
        osc2 = context.createOscillator(),
        volume = context.createGain();
 
    // Set oscillator wave type
    osc1.type = 'triangle';
    osc2.type = 'triangle';
 
    volume.gain.value = 0.1;    
 
    // Set up node routing
    osc1.connect(volume);
    osc2.connect(volume);
    volume.connect(context.destination);
 
    // Detune oscillators for chorus effect
    osc1.frequency.value = frequency + 1;
    osc2.frequency.value = frequency - 2;
 
    // Fade out
    volume.gain.setValueAtTime(0.1, startTime + duration - 0.05);
    volume.gain.linearRampToValueAtTime(0, startTime + duration);
 
    // Start oscillators
    osc1.start(startTime);
    osc2.start(startTime);
 
    // Stop oscillators
    osc1.stop(startTime + duration);
    osc2.stop(startTime + duration);
};

var playSuccessSoundOld = function () {
    // Play a 'B' now that lasts for 0.116 seconds
    playNote(493.883, context.currentTime, 0.116);
 
    // Play an 'E' just as the previous note finishes, that lasts for 0.232 seconds
    playNote(659.255, context.currentTime + 0.116, 0.232);
};

var playSuccessSound = function () {
    // Play a 'B' now that lasts for 0.116 seconds
    playNote(890, context.currentTime, 0.116);
 
    // Play an 'E' just as the previous note finishes, that lasts for 0.232 seconds
    playNote(990, context.currentTime + 0.116, 0.232);
};


    setInterval(function(){ 
        // console.clear();
        let email = document.getElementById("edit_email").value;
        user_id = sessionStorage.getItem("user_id");
        $.ajax({
            url:base_url+'/notification/'+email,
            type:'GET',
            success:function(response){
                
                if(response.success == false){
                    // console.log(response);
                }
                if(response.success == true){
                    console.log(response);
                    
                    // playSuccessSound();
                    playSound("powerup")
                    // playSound()
                    $('#notificationModal').modal('show');
                    // setInterval(function(){ 
                    //     playSuccessSound(); 
                    // }, 5000);
                }
            },
            error:function(e){
                // console.log(e);
            },
            
        });
    }, 2000);
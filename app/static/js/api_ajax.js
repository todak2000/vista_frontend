let base_url = "https://vista-api.herokuapp.com/api/v1"
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
                    if (response.role == 1){
                        window.location.href = '/client_dashboard/'+token;
                    }
                    else{
                        window.location.href = '/sp_dashboard/'+token;
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
    window.location.href = '/sp_dashboard/'+token;
}
// SP Profile
function sp_profile(token) {
    window.location.href = '/sp_profile/'+token;
}
// SP Jobs
function sp_job(token) {
    window.location.href = '/sp_job/'+token;
}
// Client home
function client_home(token) {
    window.location.href = '/client_dashboard/'+token;
}
// Client profile
function client_profile(token) {
    window.location.href = '/client_profile/'+token;
}
// Client Wallet
function client_wallet(token) {
    window.location.href = '/client_wallet/'+token;
} 
// Client Job
function client_job(token) {
    window.location.href = '/client_job/'+token;
} 

function signout() {
    sessionStorage.clear()
    window.location.href = '/signin';
}

function request_form(id) {
    console.log(id);
    document.getElementById('service_type').value = id;
    $('#requestModal').modal('show');
}

// job request function
$(function(){
    $('#request_submit_button').on('click', function (e) {
        e.preventDefault();
        document.getElementById("spinner").style.display = "block";
        document.getElementById("request_submit_button").style.display = "none";
        let service_type = document.getElementById("service_type").value;
        let details = document.getElementById("details").value;
        let tools = document.getElementById("tools").value;
        let budget = document.getElementById("budget").value;
        let balance = document.getElementById("edit_balance").value;

        if ( budget === "" || budget === null ){
            document.getElementById("spinner").style.display = "none";
            document.getElementById("request_submit_button").style.display = "block";
            document.getElementById("request_error").innerHTML = "Sorry! Kindly fill the budget amount to proceed";
            setTimeout(function(){ 
                document.getElementById("request_error").innerHTML = "";
              }, 4000);
        }
        else if ( parseFloat(budget) > parseFloat(balance) ){
            document.getElementById("spinner").style.display = "none";
            document.getElementById("request_submit_button").style.display = "block";
            document.getElementById("request_error").innerHTML = "Sorry! you have N"+parseFloat(balance)+" and it is Insufficient to proceed. Kindly top up your balance";
            setTimeout(function(){ 
                document.getElementById("request_error").innerHTML = "";
              }, 4000);
        }
        
        else{
            $.ajax({
                url:base_url+'/request',
                type:'POST',
                data:{
                    service_type: service_type,
                    details: details,
                    tools: tools,
                    budget: budget,
                },
                success:function(response){
                    document.getElementById("spinner").style.display = "none";
                    console.log(response);
                    // if(response.success == false){
                    //     document.getElementById("verification_div2").style.display = "block";
                    //     document.getElementById("failure_div2").style.display = "block";
                    //     document.getElementById("error_p").innerHTML = response.message;
                    //     document.getElementById("saving").style.display = "none"; 
                    // }
                    // if(response.success == true){
                    //     document.getElementById("verification_div2").style.display = "block";
                    //   document.getElementById("success_div2").style.display = "block"; 
                    //   document.getElementById("saving").style.display = "none";          
                    // }
                    // setTimeout(function(){ 
                    //     window.location.reload();  
                    // }, 2000);
                },
                error:function(e){
                    console.log(e);
                },
            });
        }

    })
});
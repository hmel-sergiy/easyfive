jQuery(document).ready(function($) {
	
	$('body').on('click', '#form-create-link #phone', function() {
		$(this).removeClass('error');
	})
	
	// Submit create link form
	$('#form-create-link').on('submit', function(e) {
		e.preventDefault()
		var phone = $('#form-create-link').find('#phone').val();
		if(phone.length == 13) {
			let data = $(this).serialize()

			$.ajax({
				url: referral_system_ajax.ajax_url,
				type: 'POST',
				data: {
					action: 'referral_system_ajax_action',
					referral_system_action: 'invite_create_link',
					data: data
				},
				//success: function(response) {
				//	window.location.href = '/invite/?code='+response
				//}
                
                success: function(response) {
                // response РјРѕР¶РµС‚ Р±С‹С‚СЊ РїСЂРѕСЃС‚Рѕ РєРѕРґРѕРј (goexujcf)
                const code = response.trim();

                // Р·Р°РєСЂС‹РІР°РµРј РїРµСЂРІСѓСЋ РјРѕРґР°Р»РєСѓ
                $('#modal-create-link').modal('hide');

                // РІСЃС‚Р°РІР»СЏРµРј РєРѕРґ РІ РїРѕР»Рµ РєРѕРїРёСЂРѕРІР°РЅРёСЏ
                $('#modal-copy-link #input_copy').val(window.location.origin + '/?ref=' + code);

                // РѕС‚РєСЂС‹РІР°РµРј РїРѕРїР°Рї СЃ РєРѕРїРёСЂРѕРІР°РЅРёРµРј
                $('#modal-copy-link').modal({
                    fadeDuration: 200,
                    escapeClose: false,
                    clickClose: false,
                    showClose: false
                });
            }

			})
		}
		else $('#form-create-link').find('#phone').addClass('error');
	})

	// Submit create link form
	$('#form-save-link').on('submit', function(e) {
		e.preventDefault()

		let data = $(this).serialize()

		$.ajax({
			url: referral_system_ajax.ajax_url,
			type: 'POST',
			data: {
				action: 'referral_system_ajax_action',
				referral_system_action: 'invite_save_link',
				data: data
			},
			success: function(response) {
				//let json = JSON.parse(response)
				if (response.status == false) {
					toastr.warning(response.msg, '', 
						{
							timeOut: 5000
						}
					);
				} else {
					//window.location.href = '/invite/?action=success'
                    window.location.href = '/?action=success'
				}
			}
		})		
	})
    
    // NEW CODE
    $(document).ready(function() {
        const urlParams = new URLSearchParams(window.location.search);

        if (urlParams.has('ref')) {
            $('#modal-save-link').modal({
                fadeDuration: 200,
                escapeClose: false,
                clickClose: false,
                showClose: false
            });
        }

        if (urlParams.has('action') && urlParams.get('action') === 'success') {
            $('#modal-success-link').modal({
                fadeDuration: 200,
                escapeClose: false,
                clickClose: false,
                showClose: false
            });
        }
    });
    
    // Р’С–РґРєСЂРёС‚С‚СЏ РіРѕР»РѕРІРЅРѕС— СЃС‚РѕСЂС–РЅРєРё Р· СЃС‚РѕСЂС–РЅРєРё ?action=success + РІС–РґРєСЂРёС‚С‚СЏ РїРѕРїР°РїР°
    $(document).ready(function() {
        const urlParams = new URLSearchParams(window.location.search);

        if (urlParams.has('action') && urlParams.get('action') === 'open_modal_create_link') {
            $('#modal-create-link').modal({
                fadeDuration: 200,
                escapeClose: false,
                clickClose: false,
                showClose: false
            });
            history.replaceState(null, '', '/');
        }
        
       if (urlParams.has('action') && urlParams.get('action') === 'open_modal_contact') {
            $('#modal-contact').modal({
                fadeDuration: 200,
                escapeClose: false,
                clickClose: false,
                showClose: false
            });
            history.replaceState(null, '', '/');
        }
    });

	// Login form send code
	$(document).on('submit', '#form-login', function(e) {
		e.preventDefault()

		let data = $(this).serialize()

		$.ajax({
			url: referral_system_ajax.ajax_url,
			type: 'POST',
			data: {
				action: 'referral_system_ajax_action',
				referral_system_action: 'send_login_code',
				data: data
			},
			success: function(response) {
				let json = JSON.parse(response)
				if (json.status == true) {
					$('input[name=record_id]').val(json.record_id)
					$('.send-code-wrapper').hide()
					$('.confirm-code-wrapper').show();
					var success_text = $('#success_text').val();
					var error_text = $('#error_text').val();
					toastr.success(success_text, '', 
						{
							timeOut: 5000
						}
					);
				} else {
					toastr.warning(error_text, '', 
						{
							timeOut: 5000
						}
					);
				}
			}
		})
	})

	// Login form confirm code
	$(document).on('submit', '#form-login-confirm', function(e) {
		e.preventDefault()

		let data = $(this).serialize()

		$.ajax({
			url: referral_system_ajax.ajax_url,
			type: 'POST',
			data: {
				action: 'referral_system_ajax_action',
				referral_system_action: 'confirm_login_code',
				data: data
			},
			success: function(response) {
				let json = JSON.parse(response)
				if (json.status == true) {
					window.location.href = '/profile/'
				} else {
					var error_text2 = $('#error_text2').val();
					toastr.error(error_text2, '', 
						{
							timeOut: 5000
						}
					);
				}
			}
		})		
	})

	// Resend code
	$(document).on('click', '#resend-code', function(e) {
		e.preventDefault()

		let data = $('#form-login').serialize()

		$.ajax({
			url: referral_system_ajax.ajax_url,
			type: 'POST',
			data: {
				action: 'referral_system_ajax_action',
				referral_system_action: 'send_login_code',
				data: data
			},
			success: function(response) {
				let json = JSON.parse(response)
				if (json.status == true) {
					$('input[name=record_id]').val(json.record_id)
					$('.send-code-wrapper').hide()
					$('.confirm-code-wrapper').show();
					var success_text = $('#success_text').val();
					var error_text = $('#error_text').val();
					toastr.success(success_text, '', 
						{
							timeOut: 5000
						}
					);
				} else {
					toastr.warning(error_text, '', 
						{
							timeOut: 5000
						}
					);
				}
			}
		})
	})


	
	// Profile
	// Withdrawal
	$(document).on('submit', '#form-withdrawal', function(e) {
		e.preventDefault()

		let data = $(this).serialize()
		
		$.ajax({
			url: referral_system_ajax.ajax_url,
			type: 'POST',
			data: {
				action: 'referral_system_ajax_action',
				referral_system_action: 'withdrawal',
				data: data
			},
			success: function(response) {
				let json = JSON.parse(response)
				$('#modal-withdrawal').modal({
					fadeDuration: 200,
					escapeClose: false,
					clickClose: false,
					showClose: false
				})
			}
		})
	})
	
	$('.paymets__more').on('click', function(e) {
		e.preventDefault()
		$('#modal-stat').modal({
			fadeDuration: 200,
			escapeClose: false,
			clickClose: false,
			showClose: false
		})
	})


	// Send SMS to friend
	$(document).on('submit', '#send_sms_friend_form', function(e) {
		e.preventDefault()

		let data = $(this).serialize()

		$.ajax({
			url: referral_system_ajax.ajax_url,
			type: 'POST',
			data: {
				action: 'referral_system_ajax_action',
				referral_system_action: 'send_sms_friend',
				data: data
			},
			success: function(response) {
				let json = JSON.parse(response)
				if (json.status == true) {
					toastr.success(json.msg, '', 
						{
							timeOut: 5000
						}
					);
				}
			}
		})
	})
})
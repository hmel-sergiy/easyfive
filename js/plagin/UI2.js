jQuery(document).ready(function ($) {
    var switcher_links = document.querySelectorAll('.language-chooser a.qtranxs_short_ua');
    switcher_links.forEach(function (link) {
        link.href = link.href.replace('/ua/', '/');
    });
    // Burger action
    $('.hl-burger').on('click', function () {
        $('.header-wrapper').addClass('open-menu')
        $('.header-sidemenu').addClass('active')
    })

    $('.ts-close').on('click', function () {
        $('.header-wrapper').removeClass('open-menu')
        $('.header-sidemenu').removeClass('active')
    })

    $('.promocode__wrapper span').on('click', function () {
        $(this).hide();
        $('.promocode__input').fadeIn(300);
    })

    // Home accordion
    let faqItems = $(".servicefaq-right-item")
    faqItems.on('click', function () {
        if ($(this).hasClass("faq-active")) {
            $(this).removeClass("faq-active")
            $(this).find(".servicefaq-right-item__text").slideUp()
        } else {
            faqItems.removeClass("faq-active");
            faqItems.find(".servicefaq-right-item__text").slideUp()
            $(this).addClass("faq-active")
            $(this).find(".servicefaq-right-item__text").slideDown()
        }
    })

    $('.sub-menu').after('<span class="arrow"></span>')
    $('ul#primary-menu li.menu-item.menu-item-has-children span.arrow').on('click', function () {
        $(this).toggleClass('open');
        $(this).siblings('ul.sub-menu').toggleClass('open');
    })

    //
    $(window).on('load resize', function () {
        $height = $('.header-wrapper').outerHeight(true);
        // $('.new-header').css('height', $height);
        if ($(window).width() < 1023) {
            $(".hr-btn-cashback .module div").html("РџРѕР»СѓС‡РёС‚СЊ РєРµС€Р±РµРє")
        }
    })

    // Modals
    let langSelected = document.querySelector("#language-chooser > li.active > a")
    if (langSelected) {
        langSelected.removeAttribute("href")
    }

    /* equivalent height */
    // let equivalent = function (elements) {
    // 	let maxHeigh = 0;
    // 	elements.css("min-height", "0");
    // 	elements.each(function () {
    // 		maxHeigh = $(this).height() > maxHeigh ? $(this).height() : maxHeigh
    // 	});
    // 	elements.css("min-height", maxHeigh);
    // }
    // if ($(window).width() > 1300) {
    // 	equivalent($('.workstep-item__title'));
    // }
    // if ($(window).width() > 576) {
    // 	equivalent($('.workstep-item__text'));
    // }
    // $(window).on("resize", function () {
    // 	if ($(window).width() > 1300) {
    // 		equivalent($('.workstep-item__title'));
    // 	}
    // 	if ($(window).width() > 576) {
    // 		equivalent($('.workstep-item__text'));
    // 	}
    // });

    //
    $(document).on('click', '.gsb-main-action-button .cta-button', function (e) {
        e.preventDefault()
        $('.button-list').addClass('ginger-menu-none')
        $('.main-button.channel-btn.active-tooltip').removeClass('active-tooltip')
        $('.main-button.channel-btn').addClass('hide-tooltip')
        $('.gsb-main-action-button').hide()
        $('.main-button .close-gsb-button').css({
            opacity: '1',
            pointerEvents: 'all'
        });
        $('.close-gsb-action-button').show()
    })

    $(document).on('click', '.close-gsb-action-button .close-gsb-button', function (e) {
        e.preventDefault()
        $('.button-list').removeClass('ginger-menu-none')
        $('.main-button.channel-btn.hide-tooltip').removeClass('hide-tooltip')
        $('.main-button.channel-btn').addClass('active-tooltip')
        $('.gsb-main-action-button').show()
        $('.main-button .close-gsb-button').css('opacity', '0');
        $('.close-gsb-action-button').hide()
    })

    // Woo
    $('.input-text.qty').before('<span class="decrease"></span><span class="increase"></span>')
    $(document).on('click', 'span.increase', function (e) {
        let current = Number($('.input-text.qty').val())
        $('.input-text.qty').val(current + 1)
    })
    $(document).on('click', 'span.decrease', function (e) {
        let current = Number($('.input-text.qty').val())
        if (current > 1) {
            $('.input-text.qty').val(current - 1)
        }
    })
    // $('#tab-description h2, #tab-additional_information h2').remove()

    // Lazyload all img
    // $('img').addClass('lazy')
    // $(function() {
    //     $('.lazy').lazy()
    // })

    // Modals
    $(document).on('click', '#open-modal-contact, .open-modal-contact', function (e) {
        e.preventDefault()

        $("#modal-contact").modal({
            fadeDuration: 200,
            escapeClose: false,
            clickClose: false,
            showClose: false
        })
    })

    $(document).on('click', '.open-modal-create-link', function (e) {
        e.preventDefault();

        $("#modal-create-link").modal({
            fadeDuration: 200,
            escapeClose: false,
            clickClose: false,
            showClose: false
        });
    });

    $(document).on('click', '#open-modal-nps, .open-modal-nps', function (e) {
        e.preventDefault()

        $("#modal-nps").modal({
            fadeDuration: 200,
            escapeClose: false,
            clickClose: false,
            showClose: false
        })
    })


    $('.modal-close-button, .modal-submit-button').on('click', function (e) {
        $.modal.close()
    })

    /*$('.wpcf7').on( 'wpcf7mailsent ', function(e) {
        if ( '14432' == e.detail.contactFormId ) {
            $.modal.close()
            $('.modal-thanks').modal({
                fadeDuration: 200,
                escapeClose: false,
                clickClose: false,
                showClose: false
            })
        }
    })*/


    // Custom select
    $('.wpcf7-select, select[name="meeting"]').each(function () {
        let $this = $(this),
            numberOfOptions = $(this).children('option').length;
        $this.addClass('s-hidden');
        $this.wrap('<div class="select"></div>');
        $this.after('<div class="styledSelect"></div>');
        let $styledSelect = $this.next('div.styledSelect');
        $styledSelect.text($this.children('option').eq(0).text());
        let $list = $('<ul />', {
            'class': 'options'
        }).insertAfter($styledSelect);
        for (let i = 0; i < numberOfOptions; i++) {
            if (i != 0) {
                $('<li />', {
                    text: $this.children('option').eq(i).text(),
                    rel: $this.children('option').eq(i).val()
                }).appendTo($list);
            }
        }
        let $listItems = $list.children('li');
        $styledSelect.click(function (e) {
            e.stopPropagation();
            $('div.styledSelect.active').each(function () {
                $(this).removeClass('active').next('ul.options').hide();
            });
            $(this).toggleClass('active').next('ul.options').toggle();
        });
        $listItems.click(function (e) {
            e.stopPropagation();
            $styledSelect.text($(this).text()).removeClass('active');
            $this.val($(this).attr('rel'));
            $list.hide();
            /* alert($this.val()); Uncomment this for demonstration! */
        });
        $(document).click(function () {
            $styledSelect.removeClass('active');
            $list.hide();
        });
    });
})
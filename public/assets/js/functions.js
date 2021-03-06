jQuery(function($) {

	//#main-slider
	$(function(){
		$('#main-slider.carousel').carousel({
			interval: 8000
		});
	});

	
	
	
	//Initiat WOW JS
	new WOW().init();
	
	$(window).scroll(function(){
		if ($(this).scrollTop() > 100) {
			$('.scrollup').fadeIn();
			} else {
				$('.scrollup').fadeOut();
			}
		});
		$('.scrollup').click(function(){
			$("html, body").animate({ scrollTop: 0 }, 1000);
				return false;
		});
	
	// portfolio filter
	$(window).load(function(){'use strict';
		var $portfolio_selectors = $('.portfolio-filter >li>a');
		var $portfolio = $('.portfolio-items');
		$portfolio.isotope({
			itemSelector : '.portfolio-item',
			layoutMode : 'fitRows'
		});
		
		$portfolio_selectors.on('click', function(){
			$portfolio_selectors.removeClass('active');
			$(this).addClass('active');
			var selector = $(this).attr('data-filter');
			$portfolio.isotope({ filter: selector });
			return false;
		});
	});



   
   $(window).scroll(function(){
		if ($(this).scrollTop() > 520) {
           $('.navigation').addClass('compressed'); 
            $('.menu').addClass('centered-menu');
        } else {
        $('.navigation').removeClass('compressed');
          $('.menu').removeClass('centered-menu');
        }
    });

});

function scroll_to(id) {
            $('html,body').animate({
            scrollTop: $('#'+id).offset().top - 52
            },'slow');
      }
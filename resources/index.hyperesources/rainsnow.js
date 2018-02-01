// JavaScript Document
jQuery.fn.RainSnow = function( options ) {
    var defaults = {
        effect_name: 'rain',
		drop_appear_speed: 100,
		drop_falling_speed: 7000,
		wind_direction: 3,
		drop_rotate_angle : '-10deg',
		drop_count_width_height:[[2,10], [2,15], [2,20]],
		lighting_effect : [true, 50],
		drop_left_to_right : false,
		balloon_effect : true
    };
    var settings = $.extend( {}, defaults, options );
	return this.each(function() {
		var _this = $(this)
		var effect_name = options['effect_name'];
		var drop_appear_speed = options['drop_appear_speed'];
		var drop_falling_speed = options['drop_falling_speed'];
		var wind_direction = options['wind_direction'];
		var drop_rotate_angle = options['drop_rotate_angle'];
		var drop_count_width_height = options['drop_count_width_height'];
		var drop_length = drop_count_width_height.length;
		var lighting_effect = options['lighting_effect'];
		var drop_left_to_right = options['drop_left_to_right'];
		var balloon_effect = options['balloon_effect'];
		var lighting_count = 1;
		_this.addClass(effect_name);
		var incriment = 0;
		var win_hei = $(window).height();
		var drop = new Array();
		for(i in drop_count_width_height) {
			drop[i] = i;
		}
		var on_scroll_top = 0;
		$(document).scroll(function(e){
			on_scroll_top = $(window).scrollTop();
		});
		var drop_effect = setInterval(function() {
			incriment = incriment + 1;
			var top_position = -200;
			var left_val = Math.floor((Math.random()*100)+1);
			var left_val_ani = left_val + (wind_direction);
			if(effect_name == 'balloon' || effect_name == 'snow') {
				if(drop_left_to_right == true) {
					left_val = -10;
				}
			}
			if(effect_name == 'rain') {
				if(lighting_effect[0] == true) {
					if((incriment % lighting_effect[1]) == 0) {
						lighting_count++;
						if((lighting_count % 2) == 0) {
							var lighting_code = "<span class='lighting_effect'></span>";
						} else {
							var lighting_code = "<span class='lighting_effect right'></span>";
						}
						_this.append(lighting_code);
						$('.lighting_effect').animate({
							opacity : 1
						}, 100, function() {
							$('.lighting_effect').animate({
								opacity : 0
							}, 100, function() {
								$('.lighting_effect').animate({
									opacity : 1
								}, 100, function() {
									$('.lighting_effect').remove();
								});	
							});
						});
					}
				}
			}
			var rand_no = Math.floor(Math.random() * drop.length);
			if(effect_name == 'balloon' && balloon_effect == true) {
				var html_code = '<span class="drop drop'+rand_no+' incriment'+incriment+'" style="bottom:1px; left:'+left_val+'%; width:'+drop_count_width_height[rand_no][0]+'px; height:'+drop_count_width_height[rand_no][1]+'px; transform: rotate('+drop_rotate_angle+'); -ms-transform:rotate('+drop_rotate_angle+'); -moz-transform: rotate('+drop_rotate_angle+'); -webkit-transform: rotate('+drop_rotate_angle+');"></span>';
				_this.append(html_code);
				var this_hei = $('.incriment'+incriment+'').outerHeight();
				$('.incriment'+incriment+'').animate({
					bottom : (win_hei - this_hei) + on_scroll_top,
					left : left_val_ani + '%'
				}, drop_falling_speed, function() {
					$(this).remove();
				});
			} else {
				var html_code = '<span class="drop drop'+rand_no+' incriment'+incriment+'" style="top:'+top_position+'px; left:'+left_val+'%; width:'+drop_count_width_height[rand_no][0]+'px; height:'+drop_count_width_height[rand_no][1]+'px; transform: rotate('+drop_rotate_angle+'); -ms-transform:rotate('+drop_rotate_angle+'); -moz-transform: rotate('+drop_rotate_angle+'); -webkit-transform: rotate('+drop_rotate_angle+');"></span>';
				_this.append(html_code);
				var this_hei = $('.incriment'+incriment+'').outerHeight();
				$('.incriment'+incriment+'').animate({
					top : (win_hei - this_hei) + on_scroll_top,
					left : left_val_ani + '%'
				}, drop_falling_speed, function() {
					$(this).remove();
				});	
			}
		}, drop_appear_speed);
    });
};
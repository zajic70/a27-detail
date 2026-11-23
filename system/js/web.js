jQuery(document).ready(function()
{
    
 // Resizing
    
    function loadResize()
    {
        // Obecna vyska iframe videa 4:3
        if(jQuery('iframe.text-video').length > 0){ jQuery('.text-video').css({'height': Math.ceil(parseInt(jQuery('.text-video').css('width'))*0.550338983)+'px'}); }
        if(jQuery('iframe.karta-video').length > 0){ jQuery('.karta-video').css({'height': Math.ceil(parseInt(jQuery('.karta-video').css('width'))*0.550338983)+'px'}); }
        if(jQuery('iframe.mk-karta-video').length > 0){ jQuery('.mk-karta-video').css({'height': Math.min( Math.ceil(parseInt(jQuery('.mk-karta-video').css('width'))*0.550338983), 280)+'px'}); }
        
        // Zobrazit TOP BTN
        if(jQuery(document).scrollTop() > 200){ jQuery('.wbbTopPage').css({'display':'inline-block'}); }
        else{ jQuery('.wbbTopPage').hide(); }
    }
    
    setTimeout(loadResize(), 24);
    jQuery(window).scroll(function(){ setTimeout(loadResize(), 24); });
    jQuery(window).resize(function(){ setTimeout(loadResize(), 24); });
    
 // Posun TOP
    
    jQuery('.wbbTopPage').click(function(e)
    {
        jQuery('html,body').animate({ scrollTop: 0 }, 'slow');
    });
    
 // Magnific Popup CSS
    
    if(jQuery('.jsGP').length > 0)
    {
        jQuery('.jsGP').magnificPopup(
        {
            delegate: 'a',
            type: 'image',
            overflowY:'scroll',
            gallery:
            {
              enabled:true,
              tCounter: '%curr% / %total%'
            }
        });
    }
    
    if(jQuery('.jsGPsingle').length > 0)
    {
        jQuery('.jsGPsingle').magnificPopup(
        {
            delegate: 'a',
            type: 'image',
            overflowY:'scroll',
            gallery:
            {
              enabled:false
            }
        });
    }
    
 // Slider
    
    if(jQuery('#slider').length > 0)
    {
        jQuery('#slider').flexslider(
        {
            slideshowSpeed: 4000,
            animationSpeed: 200,
            controlNav: true,
            directionNav: false
        });
    }
    
 // Menu webu - BURGER
    
    jQuery('.menu > span').click(function(e)
    {
        if(jQuery('.menu > section').is(':visible'))
        {
            jQuery('.menu > section').hide();
            jQuery('.menu > span').removeClass('active');
        }
        else
        {
            jQuery('.menu > section').css({'display':'flex'});
            jQuery('.menu > span').addClass('active');
        }
    });
    
 // Top menu
    
    jQuery('.tpanel span.tbtpm').click(function(e)
    {
        var gid = jQuery(this).parent().prop('id');
        
        if(gid.length > 0)
        {
            if(jQuery('#'+gid+' .tpm').hasClass('active'))
            {
                jQuery('#'+gid+' .tbtpm').removeClass('active');
                jQuery('#'+gid+' .tpm').removeClass('active').hide();
            }
            else
            {
                jQuery('.tbtpm.active').removeClass('active');
                jQuery('.tpm.active').removeClass('active').hide();
                
                jQuery('#'+gid+' .tbtpm').addClass('active');
                jQuery('#'+gid+' .tpm').addClass('active').css({'display':'inline-block'});
                
                     if(gid == 'tpHledani'){ jQuery('#'+gid+' input[type=text]').focus(); }
                else if(gid == 'tpMailing'){ jQuery('#'+gid+' input[type=text]').focus(); }
            }
        }
        else
        {
            jQuery('.tbtpm.active').removeClass('active');
            jQuery('.tpm.active').removeClass('active').hide();
        }
    });
    
    jQuery('.tpanel i.closeMe').click(function(e)
    {
        var gid = jQuery(this).parent().parent().parent().prop('id');
        
        if(gid.length > 0)
        {
            if(jQuery('#'+gid+' .tpm').hasClass('active'))
            {
                jQuery('#'+gid+' .tbtpm').removeClass('active');
                jQuery('#'+gid+' .tpm').removeClass('active').hide();
            }
        }
    });
    
 // Produktove menu
    
    if(jQuery('.pmenu').length > 0)
    {
        var pmenuSlide = 0;
        
        jQuery('span.lvlbtn a').click(function(e){ pmenuSlide = 1; });
        
        jQuery('span.lvlbtn').click(function(e)
        {
            var btnid = jQuery(this).attr('id').split('-');
                btnid = parseInt(btnid[1]);
            
            if(btnid > 0)
            {
                if(jQuery('#lvl-'+btnid).is(':visible'))
                {
                    if(!jQuery('#lvl-'+btnid).hasClass('.lvl-open')){ jQuery('#lvl-'+btnid).slideUp(50); }
                }
                else
                {
                    if(!pmenuSlide){ jQuery('#lvl-'+btnid).slideDown(200); jQuery('#lvl-'+btnid).addClass('lvl-open'); }
                }
            }
        });
    }
    
 // Struktura produktu
    
    if(jQuery(".mkPr").length > 0 || jQuery("#km-souprod").length > 0)
    {
        function resetProdsys()
        {
            jQuery('.mkPr').each(function(key, item)
            {
                var sliderIdName = 'slider' + key;
                var sliderNavIdName = 'sliderNav' + key;
                
                var sliderId = '#' + sliderIdName;
                var sliderNavId = '#' + sliderNavIdName;
                
                if(jQuery(this).hasClass('slicked'))
                {
                    jQuery(this).removeClass('slicked');
                    jQuery(sliderId).slick('unslick');
                }
                
                jQuery(this).addClass('slicked');
                jQuery(this).find('.sld').prop('id', sliderIdName);
                jQuery(this).find('.ctrl').prop('id', sliderNavIdName);
                
                // touchMove:false,
                
                jQuery(sliderId).slick(
                {
                    autoplay:false,
                    slidesToShow:1,
                    slidesToScroll:1,
                    arrows:false,
                    speed:100,
                    fade:true,
                    cssEase:'linear',
                    lazyLoad:'ondemand',
                    zIndex: 50,
                    
                    arrows:true,
                    prevArrow:jQuery(sliderNavId+' .btn-left'),
                    nextArrow:jQuery(sliderNavId+' .btn-right'),
                });
                
                jQuery(sliderId).on('afterChange', function(event, slick, currentSlide, nextSlide)
                {
                    var cntSlider = parseInt(jQuery(sliderNavId).data('slider'));
                    jQuery(sliderNavId+' .cnt-sld').html((currentSlide+1)+'/'+cntSlider);
                });
                
                if(jQuery(this).find('.goto-video').length > 0)
                {
                    jQuery(this).find('.goto-video').click(function(e)
                    {
                        var slideNo = jQuery(this).data('fslide');
                        jQuery(sliderId).slick('slickGoTo', slideNo);
                    });
                }
                
                if(jQuery(this).find('.goto-barva').length > 0)
                {
                    jQuery(this).find('.goto-barva').click(function(e)
                    {
                        var slideNo = jQuery(this).data('cslide');
                        jQuery(sliderId).slick('slickGoTo', slideNo);
                    });
                }
            });
        }
        
        resetProdsys();
    }
    
 // Accordion - karta produktu (mobil)
    
    if(jQuery('.km-menu').length > 0)
    {
        jQuery('.kb-acc-h2').click(function(e)
        {
            var btnid = jQuery(this).attr('id').split('-');
                btnid = parseInt(btnid[2]);
            
            if(btnid > 0 && jQuery('#kb-acch2-'+btnid+' span').is(':visible'))
            {
                if(jQuery('#kb-acch2-'+btnid+' span').hasClass('open'))
                {
                    jQuery('#kb-acch2-'+btnid+' span').removeClass('open');
                    
                    if(btnid == 4)  // 3d model - rotoskop
                    {
                        jQuery('#kb-accdiv-'+btnid).css({'width':'1px', 'height':'1px', 'padding-bottom':'0px'});
                        jQuery('#kb-3dmodel').attr('style', 'width:100% !important;height:36px !important');
                    }
                    else
                    {
                        jQuery('#kb-accdiv-'+btnid).slideUp(50);
                    }
                }
                else
                {
                    jQuery('#kb-acch2-'+btnid+' span').addClass('open');
                    
                    if(btnid == 4)  // 3d model - rotoskop
                    {
                        jQuery('#kb-3dmodel').attr('style', 'width:100% !important;height:auto !important');
                        jQuery('#kb-accdiv-'+btnid).css({'width':'100%', 'height':'auto', 'padding-bottom':'15px'});
                    }
                    else
                    {
                        if(btnid == 9){ resetProdsys(); }  // doplnkova vybava
                        
                        jQuery('#kb-accdiv-'+btnid).slideDown(200);
                        jQuery(window).trigger('resize');
                    }
                }
            }
        });
    }
    
 // Accordion - obchodnici (mobil)  
    
    if(jQuery('#m-obchodnici-tab').length > 0)
    {
        jQuery('.prod-acc-h2').click(function(e)
        {
            var btnid = jQuery(this).attr('id').split('-');
                btnid = parseInt(btnid[2]);
            
            if(btnid > 0 && jQuery('#prod-acch2-'+btnid+' span').is(':visible'))
            {
                if(jQuery('#prod-acch2-'+btnid+' span').hasClass('open'))
                {
                    jQuery('#prod-acch2-'+btnid+' span').removeClass('open');
                    jQuery('#prod-acctab-'+btnid).slideUp(50);
                }
                else
                {
                    jQuery('#prod-acch2-'+btnid+' span').addClass('open');
                    jQuery('#prod-acctab-'+btnid).slideDown(200);
                }
            }
        });
    }
    
 // Reklamni system v obsahu - SLICK
    
    // Konfigurace BLOK
    if(jQuery(".sldRklB").length > 0)
    {
        jQuery(".sldRklB").slick(
        {
            infinite:true, autoplay:false, swipe:true, autoplaySpeed:1500,
            speed:400, slidesToShow:1, slidesToScroll:1,
            arrows:true,
        });
    }
    
    // Konfigurace RADEK
    if(jQuery(".sldRklR").length > 0)
    {
        jQuery(".sldRklR").slick(
        {
            infinite:true, autoplay:false, swipe:true, autoplaySpeed:1500,
            speed:400, slidesToShow:4, slidesToScroll:1,
            responsive: [{ breakpoint:1040, settings: { slidesToShow:3 } }, 
                         { breakpoint:740,  settings: { slidesToShow:2 } },
                         { breakpoint:540,  settings: { slidesToShow:1 } }],
            arrows:true,
        });
    }
    
    // Konfigurace RADEK + CLANEK
    if(jQuery(".sldRklRC").length > 0)
    {
        jQuery(".sldRklRC").slick(
        {
            infinite:true, autoplay:false, swipe:true, autoplaySpeed:1500,
            speed:200, slidesToShow:1, slidesToScroll:1,
            arrows:false,
        });
    }
    
 // Karta produktu
    
    function formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",")
    {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
    
        const negativeSign = amount < 0 ? "-" : "";
    
        let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
        let j = (i.length > 3) ? i.length % 3 : 0;
    
        return negativeSign +
          (j ? i.substr(0, j) + thousands : '') +
          i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
          (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    }
    
    // Katalog price range
    if(jQuery('#price-range').length > 0)
    {
        jQuery('#price-range').slider(
        {
            range: true,
            min: 0,
            step: 100,
            
            slide: function(event, ui)
            {
                var delay = function()
                {
                    var handleIndex = jQuery(ui.handle).index();
                    jQuery('#price-range span:nth-of-type('+handleIndex+') s u').html(formatMoney(ui.value,0,',',' ') + '');
                };
                
                setTimeout(delay, 12);
            },
            
            stop: function( event, ui )
            {
                var delay = function()
                {
                    var handleIndex = jQuery(ui.handle).index();
                    
                    jQuery('#price-'+(handleIndex==2?'max':'min')+'-hidden').val(formatMoney(ui.value,0,',',' '));
                    jQuery('#price-min-max-form').submit();
                };
                
                setTimeout(delay, 12);
            }
        });
        
        var delay_handle = function()
        {
            jQuery('#price-range span:nth-of-type(1) s u').html(formatMoney(jQuery('#price-range').slider('values', 0),0,',',' ') + '');
            jQuery('#price-range span:nth-of-type(2) s u').html(formatMoney(jQuery('#price-range').slider('values', 1),0,',',' ') + '');
        }
        
        setTimeout(delay_handle, 12);
    }
    
    // Rotoskop
    if(jQuery('.k-roto').length > 0)
    {
        var reelState = 0;
        
        jQuery('#rotoskopStartStop').click(function(e)
        {
            if(!reelState)
            {
                jQuery('#image').data('backwards', false);
                jQuery('#image').trigger('play');
                reelState = 1;
            }
            else
            {
                jQuery('#image').trigger('pause');
                reelState = 0;
            }
            
            change3dIcon();
        });
        
        function change3dIcon()
        {
            if(!reelState){ jQuery('#rotoskopStartStop').css({ 'background-image':'url(system/img/ico_rotace_off.png)' }); }
            else{           jQuery('#rotoskopStartStop').css({ 'background-image':'url(system/img/ico_rotace_on.png)' }); }
        }
        
        jQuery('#image').bind("frameChange", function()
        {
            if(jQuery('#image').data('playing'))
            {
                reelState = 1;
                change3dIcon();
            }
        });
        
        jQuery('#image').bind('reelingChange', function(evnt, nothing, reeling)
        {
            if(reeling){ reelState = 1; }
            else{        reelState = 0; }
        });
        
        window.setInterval(function(){ jQuery('#image').trigger('reelingChange'); }, 800);
        window.setInterval(function(){ change3dIcon(); }, 1000);
        
        change3dIcon();
    }
    
    
    // Konfigurace SLIDER - KARTA PRODUKTU
    if(jQuery(".sldLypiMI").length > 0)
    {
        jQuery(".sldLypiMI").slick(
        {
            infinite:true, autoplay:false, swipe:true, autoplaySpeed:1500,
            speed:400, slidesToShow:1, slidesToScroll:1,
            arrows:true, adaptiveHeight:true,
        });
    }
    
    if(jQuery('.sldLypiNV .goto-lypi-img').length > 0)
    {
        jQuery('.sldLypiNV .goto-lypi-img').click(function(e)
        {
            var slideNo = jQuery(this).data('cslide');
            jQuery('#sldKartaID').slick('slickGoTo', slideNo);
        });
    }
    
    if(jQuery('.lyp-info .goto-lypi-barva').length > 0)
    {
        jQuery('.lyp-info .goto-lypi-barva').click(function(e)
        {
            var slideNo = jQuery(this).data('cslide');
            jQuery('#sldKartaID').slick('slickGoTo', slideNo);
        });
    }
    
    if(jQuery('#katalog-move-govideo').length > 0 && jQuery('.goto-lypi-vid').length > 0)
    {
        jQuery('#katalog-move-govideo').click(function(e)
        {
            var slideNo = jQuery('.goto-lypi-vid').data('cslide');
            jQuery("#sldKartaID").slick('slickGoTo', slideNo);
        });
    }
    
    
    // Load location - hledani
    if(jQuery('.hld .hldbtn').length > 0)
    {
        jQuery('.hld span.hldbtn').click(function(e)
        {
            e.preventDefault();
            var bID = jQuery(this).attr('id').split('-'); bID = bID[1];
            
            if(bID.length > 0)
            {
                var prevID = jQuery('.hld span.hldbtn.active').attr('id').split('-');
                    prevID = prevID[1];
                
                if(prevID != bID)
                {
                    jQuery('#hldbtn-'+prevID).removeClass('active');
                    jQuery('#hldskc-'+prevID).removeClass('active');
                    
                    jQuery('#hldbtn-'+bID).addClass('active');
                    jQuery('#hldskc-'+bID).addClass('active');
                }
            }
        });
    }
    
    
    // Zmena barevneho pruhu
    if(jQuery('.barva-pruh-bic').length > 0 && jQuery('#karta-big-photo').length > 0)
    {
        jQuery('.barva-pruh-bic').click(function(e)
        {
            var tstroto = parseInt(jQuery('.barva-pruh-bic[data-roto=1]').length);
            
            if(!jQuery(this).hasClass('active'))
            {
                jQuery('.clrlist, .clrheader').css({'display':'none'});
                
                var grel = jQuery(this).attr('rel');
                var gsecset = jQuery(this).data('srcset');
                var groto = parseInt(jQuery(this).attr('data-roto'));
                var galt = jQuery(this).attr('alt');
                
                if(grel.length > 0)
                {
                    if(tstroto > 0 && groto == 1)
                    {
                        jQuery('#karta-big-photo').hide();
                        jQuery('#karta-big-photo img').prop('src', '');
                        jQuery('#karta-big-roto').show().css({'width':'100%'});
                        jQuery('#rotoskopStartStop').show();
                        
                        jQuery('#rotoskopStartStop').trigger('click');
                    }
                    else
                    {
                        jQuery('#karta-big-photo img').prop('src', grel);
                        jQuery('#karta-big-photo img').prop('srcset', gsecset);
                        jQuery('#karta-big-roto').hide();
                        jQuery('#rotoskopStartStop').hide();
                        jQuery('#karta-big-photo').show();
                    }
                        
                    jQuery('.barva-pruh-bic.active').removeClass('active');
                    jQuery(this).addClass('active');
                    
                    if(jQuery('.'+galt).length > 0)
                    {
                        jQuery('.clrheader').css({'display':'block'});
                        jQuery('.'+galt).css({'display':'block'});
                    }
                }
            }
        });
    }
    
    // Load location - karta
    if(jQuery('.pkarta .km-menu').length > 0)
    {
        jQuery('.pkarta .km-menu a').click(function(e)
        {
            e.preventDefault();
            var bID = jQuery(this).attr('id').split('-'); bID = bID[1];
            var urlID = jQuery(this).attr('href').split('!'); urlID = urlID[1];
            
            if(bID.length > 0 && urlID.length > 0)
            {
                var prevID = jQuery('.pkarta .km-menu a.active').attr('id').split('-');
                    prevID = prevID[1];
                
                if(prevID != bID)
                {
                    jQuery('#kb-'+prevID).removeClass('active');
                    jQuery('#km-'+prevID).removeClass('active');
                    
                    jQuery('#kb-'+bID).addClass('active');
                    jQuery('#km-'+bID).addClass('active');
                    
                    location.hash = '#!'+urlID;
                }
                
                if(urlID == 'video-modelu'){ jQuery('.karta-video').css({'height': Math.ceil(parseInt(jQuery('.karta-video').css('width'))*0.620338983)+'px'}); }
                
                if(bID == 'souprod'){ resetProdsys(); }
                
                if(bID == '3dmodel')
                {
                    jQuery('#kb-3dmodel').css({'width':'100%', 'height':'auto'});
                }
                else
                {
                    jQuery('#kb-3dmodel').css({'width':'1px', 'height':'1px'});
                }
            }
        });
        
        var lh = location.hash;
        var hID = '';
        var fID = '';
        var countID = 0;
        
        jQuery('.km-menu a').each(function(i)
        {
            var bID = jQuery(this).attr('id').split('-'); bID = bID[1];
            var urlID = jQuery(this).attr('href').split('!'); urlID = urlID[1];
            
            if(countID == 0){ fID = bID; }
            countID++;
            
            if('#!'+urlID == lh)
            {
                hID = bID;
                return false;
            }
        });
        
        if(fID.length > 0 && hID.length == 0)
        {
            jQuery('#km-'+fID).trigger('click');
            if(lh.length > 0){ jQuery('html, body').animate({ scrollTop: jQuery('#km-'+fID).offset().top-10 }, 200); }
        }
        else if(hID.length > 0)
        {
            jQuery('#km-'+hID).trigger('click');
            if(lh.length > 0){ jQuery('html, body').animate({ scrollTop: jQuery('#km-'+hID).offset().top-10 }, 200); }
        }
        
        // ---
        
        jQuery('#katalog-move-kestazeni').click(function(e)
        {
            if(document.documentElement.clientWidth <= 840)
            {
                jQuery('#kb-kestazeni .kb-acc-h2').trigger('click');
                jQuery('html, body').animate({ scrollTop: jQuery("#kb-kestazeni .kb-acc-h2").offset().top-10 }, 200);
            }
            else
            {
                jQuery('#km-kestazeni').trigger('click');
                jQuery('html, body').animate({ scrollTop: jQuery("#km-kestazeni").offset().top-10 }, 200);
            }
        });
        
        jQuery('#katalog-move-koupitted').click(function(e)
        {
            if(document.documentElement.clientWidth <= 840)
            {
                jQuery('#kb-dostupnost .kb-acc-h2').trigger('click');
                jQuery('html, body').animate({ scrollTop: jQuery("#kb-dostupnost .kb-acc-h2").offset().top-10 }, 200);
            }
            else
            {
                jQuery('#km-dostupnost').trigger('click');
                jQuery('html, body').animate({ scrollTop: jQuery("#km-dostupnost").offset().top-10 }, 200);
            }
        });
        
        jQuery('#katalog-move-kdekoupit').click(function(e)
        {
            if(document.documentElement.clientWidth <= 840)
            {
                jQuery('#kb-dostupnost .kb-acc-h2').trigger('click');
                jQuery('html, body').animate({ scrollTop: jQuery("#kb-dostupnost .kb-acc-h2").offset().top-10 }, 200);
            }
            else
            {
                jQuery('#km-dostupnost').trigger('click');
                jQuery('html, body').animate({ scrollTop: jQuery("#km-dostupnost").offset().top-10 }, 200);
            }
        });
        
        jQuery('#katalog-move-video').click(function(e)
        {
            if(document.documentElement.clientWidth <= 840)
            {
                jQuery('#kb-video .kb-acc-h2').trigger('click');
                jQuery('html, body').animate({ scrollTop: jQuery("#kb-video .kb-acc-h2").offset().top-10 }, 200);
            }
            else
            {
                jQuery('#km-video').trigger('click');
                jQuery('html, body').animate({ scrollTop: jQuery("#km-video").offset().top-10 }, 200);
            }
        });
        
        jQuery('#katalog-move-3dmodel').click(function(e)
        {
            if(document.documentElement.clientWidth <= 840)
            {
                jQuery('#kb-3dmodel .kb-acc-h2').trigger('click');
                jQuery('html, body').animate({ scrollTop: jQuery("#kb-3dmodel .kb-acc-h2").offset().top-10 }, 200);
            }
            else
            {
                jQuery('#km-3dmodel').trigger('click');
                jQuery('html, body').animate({ scrollTop: jQuery("#km-3dmodel").offset().top-10 }, 200);
            }
        });
        
        jQuery('#katalog-move-fotogalerie').click(function(e)
        {
            if(document.documentElement.clientWidth <= 840)
            {
                jQuery('#kb-galerie .kb-acc-h2').trigger('click');
                jQuery('html, body').animate({ scrollTop: jQuery("#kb-galerie .kb-acc-h2").offset().top-10 }, 200);
            }
            else
            {
                jQuery('#km-galerie').trigger('click');
                jQuery('html, body').animate({ scrollTop: jQuery("#km-galerie").offset().top-10 }, 200);
            }
        });
        
        jQuery('#katalog-move-souprod').click(function(e)
        {
            if(document.documentElement.clientWidth <= 840)
            {
                jQuery('#kb-souprod .kb-acc-h2').trigger('click');
                jQuery('html, body').animate({ scrollTop: jQuery("#kb-souprod .kb-acc-h2").offset().top-10 }, 200);
            }
            else
            {
                jQuery('#km-souprod').trigger('click');
                jQuery('html, body').animate({ scrollTop: jQuery("#km-souprod").offset().top-10 }, 200);
            }
        });
    }
    
    if(jQuery('#changeHreflang').length > 0)
    {
        jQuery('#changeHreflang').change(function()
        {
            var url = jQuery(this).find('option:selected').val();
            if(url.length > 0){ window.location = url; }
        });
    }
    
    // Karta - geometrie
    if(jQuery('#ks-slider').length > 0)
    {
        function setTableColBg(val)
        {
            for(var i=0;i<geo_tabulka.length;i++)
            {
                if(geo_tabulka[i][0] <= val && val <= geo_tabulka[i][1])
                {
                    jQuery('table.jqSC tr td:nth-of-type('+(i+1)+')').addClass('bghv');
                }
                else
                {
                    jQuery('table.jqSC tr td:nth-of-type('+(i+1)+')').removeClass('bghv');
                }
            }
        }
        
        jQuery('#ks-slider').slider(
        {
            orientation: 'vertical',
            max: geo_max,
            min: geo_min,
            value: geo_max,
            slide: function(event, ui)
            {
                jQuery('#kb-geometrie .ui-slider .ui-slider-handle').html('<s><u>'+ui.value+' cm</u></s>');
                setFigureHeight( geo_max, geo_min, ui.value );
            },
        });
        
        var slpos = jQuery('#ks-slider').slider('value');
        jQuery('#kb-geometrie .ui-slider .ui-slider-handle').html('<s><u>'+slpos+' cm</u></s>');
        
        jQuery('#ks-figure').css({'max-height':354+'px', 'min-height':134+'px'});
        
        function setFigureHeight(max, min, val)
        {
            setTableColBg(val);
            
            var onePcs = 220/(geo_max-geo_min);
            jQuery('#ks-figure').css({'height':Math.ceil(134+((val-geo_min)*onePcs))+'px'});
        }
        
        setFigureHeight( geo_max, geo_min, slpos );
    }
    
    if(jQuery('.k-perex.k-perex-low .over-ctrl').length > 0)
    {
        jQuery('.k-perex.k-perex-low .over-ctrl').click(function(e)
        {
            jQuery('.over-ctrl').remove();
            jQuery('.k-perex.k-perex-low').removeClass('k-perex-low');
        });
    }
    
    if(jQuery('.dstp-varianta').length > 0)
    {
        jQuery('.dstp-varianta').click(function(e)
        {
            var gid = jQuery(this).attr('id').split('-');
                gid = gid[1];
            
            if(gid > 0)
            {
                if(jQuery(this).attr('data-stav') == 1)
                {
                    jQuery(this).attr('data-stav', 0);
                    // jQuery(this).find('.dstp-sign').html('+');
                    jQuery(this).find('.dstp-sign').removeClass('active');
                    jQuery('.dstp-prodejce-'+gid).hide();
                }
                else
                {
                    jQuery(this).attr('data-stav', 1);
                    // jQuery(this).find('.dstp-sign').html('-');
                    jQuery(this).find('.dstp-sign').addClass('active');
                    jQuery('.dstp-prodejce-'+gid).css({'display':'table-row'});
                }
            }
        });
    }
    
    if(jQuery('.pfltr-btn').length > 0)
    {
        jQuery('.pfltr-btn span').click(function(e)
        {
            console.log(jQuery('.pfltr-btn').data('gs'));
            if(jQuery('.pfltr-btn').data('gs') == 1)
            {
                jQuery('.pfltr-btn').data('gs', 0);
                jQuery('.pfltr-btn span').html(jQuery('.pfltr-btn').data('show'));
                jQuery('.pfltr').slideUp(30);
            }
            else
            {
                jQuery('.pfltr-btn').data('gs', 1);
                jQuery('.pfltr-btn span').html(jQuery('.pfltr-btn').data('hide'));
                jQuery('.pfltr').slideDown(100);
            }
        });
    }
    
    /**/
    
    jQuery('#xPsPage .tinyPageNext a').click(function(e)
    {
        e.preventDefault();
        
        var check = jQuery('#xPsPage').data('check');
        var sid = parseInt(jQuery('#xPsPage').data('sid'));
        
        if(check.length > 0 && sid > 0)
        {
            console.log('./system/ajax/produkty_ndp.php?c='+check+'&s='+sid+'&qr='+Math.random());
            
            jQuery.ajax(
            {
                type: "GET",
                url: './system/ajax/produkty_ndp.php?c='+check+'&s='+sid+'&qr='+Math.random(),
                dataType: 'json',
                success: function(data)
				{
					console.log(data);
                    
                    if(data.stav == 1)
                    {
                        jQuery('#xPsMini .mika').append(data.html);
                        
                        // Posun strankovani
                        var pgmax = parseInt(jQuery('#xPsPage').data('max'));
                        var pgact = parseInt(jQuery('#xPsPage').attr('data-act'));
                        
                        pgact = pgact+1;
                        
                        jQuery('#xPsPage .tinyPage .tpp').removeClass('active');
                        jQuery('#xPsPage .tinyPage .tpp_'+pgact).addClass('active');
                        
                        if(pgact == pgmax-1){ jQuery('#xPsPage .tinyPageNext').hide(); }
                        
                        jQuery('#xPsPage').attr('data-act', pgact);
                        
                        // Prepocet slideru
                        setTimeout(function(){ resetProdsys(); }, 200);
                    }
                },
				error: function(data, e){ alert(e); }
            });
        }
    });
    
});
/*!
 * gdpr-cookie - A jQuery plugin to manage cookie settings in compliance with EU law, Copyright (c) 2018 Martijn Saly, Version: 0.2.0
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 */

;(function(root, factory)
{
    if (typeof define === "function" && define.amd){ define([ "jquery" ], factory); }
    else if (typeof module === "object" && module.exports)
    {
        module.exports = function( root, jQuery )
        {
            if(jQuery === undefined)
            {
                if(typeof window !== "undefined"){ jQuery = require("jquery"); }
                else{ jQuery = require("jquery")(root); }
            }
            factory(jQuery);
            return jQuery;
        };
    }
    else{ factory(root.jQuery); }
}

(this, function($)
{
    "use strict";
    
    var settings, showing = false, display, isAdvanced = false, seenAdvanced = false;

    var setCookie = function(name, value, expires)
    {
        var d = new Date();
        d.setTime(d.getTime() + expires * 24 * 60 * 60 * 1000);
        document.cookie = name + "=" + value + ";expires=" + d.toUTCString() + ";path=/";
        return getCookie(name);
    };

    var getCookie = function(name)
    {
        var ca = decodeURIComponent(document.cookie).split(";");
        name += "=";
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == " "){ c = c.substring(1); }
            if (c.indexOf(name) === 0){ return c.substring(name.length, c.length); }
        }
    };
    
    // Cookie name may consist of \u0021-\u007e, excluding whitespace and characters , ; =
    var validateCookieName = function(name)
    {
        return name.replace(/[^\u0021-\u007e]|[,;=\s]/g, "");
    };
    
    var getPreferences = function()
    {
        var preferences = getCookie(settings.cookieName);
        
        try{ preferences = JSON.parse(preferences); }
        catch(ex){ return; }

        if(!Array.isArray(preferences) || !preferences.length){ return; }
        
        var knownTypes = settings.cookieTypes.map(function(type){ return type.value; });
        preferences = preferences.filter(function(pref){ return knownTypes.indexOf(pref) >= 0; });
        
        return preferences;
    };
    
    $.gdprcookie = { };
    
    $.gdprcookie.init = function(options)
    {
        // Define defaults
        var defaultSettings = {
            cookieTypes: [
                { type: "Nezbytné cookies", value: "essential", description: "Soubory naprosto nezbytné pro správné fungování webu (základní a bezpečnostní funkce).", checked: true },
                { type: "Analytické cookies", value: "analytics", description: "Analytické cookies poskytující informace o návštěvnících webu, zdroji návštěvnosti a pohybu na stránkách (např. Google analytics).", checked: false },
                { type: "Reklamní cookies", value: "marketing", description: "Reklamní cookies slouží k lepšímu zacílení reklam a marketingových kampaní (např. sociální sítě).", checked: false }
            ],
            title: "Cookies & ochrana údajů",
            subtitle: "Vyberte soubory cookie",
            message: "Používáme nezbytně nutné soubory cookie pro činnost webu a analýzu návštěv. Kliknutím na &quot;Přijmout a uložit&quot; souhlasíte s používáním všech souborů cookie. Pro přizpůsobení seznamu povolených cookies klikněte na &quot;Nastavení cookies&quot;.",
            submessage: "",
            delay: 500,
            expires: 365,
            cookieName: "cookieControlPrefs",
            acceptReload: false,
            acceptBeforeAdvanced: [ "essential","analytics","marketing" ],
            acceptAfterAdvanced: [ "essential" ],
            allowUnadvanced: false,
            switchAdvanced: false,
            acceptBtnLabel: "Přijmout a uložit",
            advancedBtnLabel: "Nastavení cookies",
            unadvancedBtnLabel: "Zpět",
            customShowMessage: undefined,
            customHideMessage: undefined,
            customShowChecks: undefined,
            customHideChecks: undefined
        };

        // Set defaults
        settings = $.extend(defaultSettings, window.GdprCookieSettings, options);
        
        // Coerce into a string because this is poured into innerHTML
        settings.message = String(settings.message);
        
        // Coerce into a positive number because it is passed to setTimeout
        settings.delay = Math.max(0, +settings.delay) || 0;
        
        // Coerce into a positive whole number between 0 and 730 (2-ish years), to ensure a well-formed cookie value
        settings.expires = Math.round(Math.min(Math.max(0, +settings.expires), 730)) || 0; 
        
        // Coerce cookieTypes into an array containing plain objects
        if(Array.isArray(settings.cookieTypes))
        {
            settings.cookieTypes = settings.cookieTypes.filter(function(cookieType){ return $.isPlainObject(cookieType); });
            if (!settings.cookieTypes.length){ settings.cookieTypes = defaultSettings.cookieTypes; }
        }
        else{ settings.cookieTypes = defaultSettings.cookieTypes; }
        
        // Coerce into a string and valid cookie name
        settings.cookieName = validateCookieName(String(settings.cookieName || "")) || "cookieControlPrefs";
        
        // Coerce acceptBeforeAdvanced and acceptAfterAdvanced into arrays of strings, that exist in settings.cookieTypes[].value
        var coerce = (function() {
            var values = settings.cookieTypes.map(function(cookieType) { return cookieType.value; }),
                exists = function(item) { return values.indexOf(item) >= 0; };
            
            return function(setting) {
                // Convert a single string into an array of 1
                setting = typeof setting === "string" ? [ setting ] : setting;

                // If it's an array, make sure it only contains known cookie types
                return Array.isArray(setting) ? setting.map(String).filter(exists) : undefined;
            };
        }());
        settings.acceptBeforeAdvanced = coerce(settings.acceptBeforeAdvanced);
        settings.acceptAfterAdvanced = coerce(settings.acceptAfterAdvanced);
        
        $(function() { display(); });
    };
    
    display = function(alwaysShow) {
        if (showing) {
            return;
        }
        
        var body = $("body"),
            myCookiePrefs = getPreferences();
        
        var elements = {
            container: undefined,
            introContainer: undefined,
            types: undefined,
            typesContainer: undefined,
            buttons: { 
                accept: undefined, 
                advanced: undefined 
            },
            allChecks: [ ],
            nonessentialChecks: [ ]
        };
            
        var hide = function(canreload) {
            if (elements.container) {
                if ($.isFunction(settings.customHideMessage)) {
                    settings.customHideMessage.call(elements.container, elements.container);
                    showing = false;
                }
                else {
                    elements.container.fadeOut("fast", function() {
                        $(this).remove();
                        showing = false;
                    });
                }
            }
            if (canreload && settings.acceptReload) {
                document.location.reload();
            }
        };
        
        if (!Array.isArray(myCookiePrefs) || !myCookiePrefs.length) {
            myCookiePrefs = undefined;
        }

        if (alwaysShow || !myCookiePrefs) {
            elements.types = $("<ul/>").append(
                $.map(settings.cookieTypes, function(field, index) {
                    if (!field.type || !field.value) {
                        return;
                    }
                    var isEssential = field.value === "essential",
                        isChecked;
                    
                    if (Array.isArray(myCookiePrefs)) {
                        isChecked = myCookiePrefs.indexOf(field.value) >= 0;
                    }
                    else {
                        isChecked = field.checked === true;
                    }
                    
                    var input = $("<input/>", {
                        type: "checkbox",
                        id: "gdpr-cookietype-" + index,
                        name: "gdpr[]",
                        value: field.value,

                        // The essential cookies checkbox is checked and cannot be unchecked
                        checked: isEssential || isChecked,
                        disabled: isEssential
                    });
                    
                    elements.allChecks.push(input.get(0));
                    if (!isEssential) {
                        elements.nonessentialChecks.push(input.get(0));
                    }
                    
                    var label = $("<label/>", {
                        "for": "gdpr-cookietype-" + index,
                        text: field.type,
                        title: field.description
                    });

                    return $("<li/>").append([
                        input.get(0),
                        label.get(0)
                    ]).get(0);
                })
            );
            elements.allChecks = $(elements.allChecks);
            elements.nonessentialChecks = $(elements.nonessentialChecks);
            
            // When accept button is clicked drop cookie
            var acceptClick = function() {
                var prefsFromCheckboxes = function() {
                    return elements.allChecks
                        .filter(function() { return this.checked || this.disabled; })
                        .map(function() { return this.value; })
                        .get();
                };
                var prefsOutsideAdvanced = function(where) {
                    var setting = "accept" + where + "Advanced";
                    return Array.isArray(settings[setting]) ? settings[setting] : prefsFromCheckboxes();
                };
                
                // Hide the cookie message
                hide(true);

                // Save user cookie preferences (in a cookie!)
                var prefs = isAdvanced ? prefsFromCheckboxes() : prefsOutsideAdvanced(seenAdvanced ? "After" : "Before");
                setCookie(settings.cookieName, JSON.stringify(prefs), settings.expires);

                // Trigger cookie accept event
                body.trigger("gdpr:accept");
            };
            
            // Toggle advanced cookie options
            var advancedClick = function() {
                var showAdvanced = function() {
                    if (!settings.allowUnadvanced) {
                        elements.buttons.advanced.prop("disabled", true);
                    }

                    if ($.isFunction(settings.customShowChecks)) {
                        settings.customShowChecks.call(elements.typesContainer, elements.typesContainer, elements.introContainer);
                    }
                    else {
                        if (settings.switchAdvanced) {
                            elements.introContainer.slideUp("fast");
                        }
                        elements.typesContainer.slideDown("fast");
                    }

                    isAdvanced = seenAdvanced = true;
                    if (settings.allowUnadvanced && settings.unadvancedBtnLabel && settings.advancedBtnLabel !== settings.unadvancedBtnLabel) {  
                        elements.buttons.advanced.text(settings.unadvancedBtnLabel);
                    }

                    // Trigger advanced show event
                    body.trigger("gdpr:advanced");
                };
                var hideAdvanced = function() {
                    if ($.isFunction(settings.customHideChecks)) {
                        settings.customHideChecks.call(elements.typesContainer, elements.typesContainer, elements.introContainer);
                    }
                    else {
                        if (settings.switchAdvanced) {
                            elements.introContainer.slideDown("fast");
                        }
                        elements.typesContainer.slideUp("fast");
                    }

                    isAdvanced = false;
                    if (settings.allowUnadvanced && settings.unadvancedBtnLabel && settings.advancedBtnLabel !== settings.unadvancedBtnLabel) {  
                        elements.buttons.advanced.text(settings.advancedBtnLabel);
                    }
                    
                    // Trigger advanced show event
                    body.trigger("gdpr:unadvanced");
                };
                
                if (isAdvanced) {
                    if (settings.allowUnadvanced) {
                        hideAdvanced();
                    }
                }
                else {
                    showAdvanced();
                }
            };
            
            // Build cookie message to display later on
            var cookieMessage = (elements.container = $("<div class=gdprcookie>")).append([
                (elements.introContainer = $("<div class=gdprcookie-intro>")).append([
                    settings.title ? $("<h1/>", { text: settings.title }).get(0) : undefined,
                    settings.message ? $("<p/>", { html: settings.message + settings.submessage }).get(0) : undefined
                ]).get(0),
                (elements.typesContainer = $("<div class=gdprcookie-types>")).hide().append([
                    settings.subtitle ? $("<h2/>", { text: settings.subtitle }).get(0) : undefined,
                    elements.types.get(0)
                ]).get(0),
                $("<div class=gdprcookie-buttons>").append([
                    (elements.buttons.accept = $("<button/>", { type: "button", text: settings.acceptBtnLabel, click: acceptClick })).get(0),
                    (elements.buttons.advanced = $("<button/>", { type: "button", text: settings.advancedBtnLabel, click: advancedClick })).get(0)
                ]).get(0)
            ]);
            
            var show = function() {
                body.append(cookieMessage);
                showing = true;
                isAdvanced = seenAdvanced = false;
                if ($.isFunction(settings.customShowMessage)) {
                    settings.customShowMessage.call(elements.container, elements.container);
                }
                else {
                    elements.container.hide().fadeIn("slow");
                }
                
                // Trigger container show event
                body.trigger("gdpr:show");
            };
            
            if (!settings.delay || alwaysShow) {
                show();
            }
            else {
                window.setTimeout(show, settings.delay);
            }
        }
        else {
            hide(false);
        }
    };
    
    $.gdprcookie.display = function(){ display(true); };

    // Method to check if user cookie preference exists
    $.gdprcookie.preference = function(value)
    {
        var preferences = getPreferences();
        
             if(value === "essential"){ return true; }
        else if(!preferences){ return false; }
        else if(value !== undefined){ return preferences.indexOf(value) >= 0; }
        
        return preferences;
    };
    
    // Protection against malicious scripts, e.g. monkey patching
    $.gdprcookie = Object.freeze($.gdprcookie);

}));

(function ($) {

    let settings_control = {
        "total_items": 0,
        "current_item": 0
    };

    let items = [];

    let settings = {
        "navigations_sides": false,
        "navigations_circles": false,
        "animation": false,
        "sequential": false,
        "time": 2000
    };

    let Carrousel = function (__, options) {
        settings.time = typeof options.time === 'number' ? options.time : 2000;
        settings.navigations_sides = typeof options.navigations_sides === 'boolean' ? options.navigations_sides : false;
        settings.navigations_circles = typeof options.navigations_circles === 'boolean' ? options.navigations_circles : false;
        settings.animation = typeof options.animation === 'boolean' ? options.animation : false;
        settings.sequential = typeof options.sequential === 'boolean' ? options.sequential : false;

        _init();
    };

    $.fn.carrousel = function (options, callback) {
        if (typeof options === 'object') {
            let thisPlugin = new Carrousel($(this), options, callback);
            $(this).data('WizardPlugin', thisPlugin);
            return thisPlugin;
        } else return false;
    };

    function _init() {
        _getItems();
        _create_controls();
        _manage_carrousel();
        if (settings.sequential) {
            _sequential();
        }
    }

    function _manage_carrousel() {
        for (let i = 0; i < items.length; i++) {
            if (i === settings_control.current_item) {
                if (settings.animation) {
                    items[i].style.opacity = 0;
                    _animation(items[i], 0, 'ASC');
                }
                items[i].style.display = "block";
                if (settings.navigations_circles) {
                    _mark_circle();
                }
            } else {
                items[i].style.display = 'none'
            }
        }
    }

    function _sequential() {
        setInterval(()=>{
            if (settings_control.current_item +1 > settings_control.total_items-1) {
                settings_control.current_item = 0;
            }
            else {
                settings_control.current_item ++;
            }
            _manage_carrousel();
        }, settings.time);
    }

    function _mark_circle() {
        let circles = document.getElementsByClassName('carrousel-n-b-l');

        let c = Array.prototype.slice.call(circles);

        for (let i in c) {
            if (parseInt(c[i].getAttribute('data-navigation')) === settings_control.current_item) {
                c[i].classList.add('c-active');
            }
            else {
                c[i].classList.remove('c-active');
            }

        }
    }

    function _animation(element, opacity, direcction) {

        setInterval(()=>{
            if (direcction === 'DESC' && opacity !== 0) {
                opacity--;
            }
            if (direcction === 'ASC' && opacity !== 10) {
                opacity++;
            }


            if (direcction === 'DESC' && opacity <= 0 || direcction === 'ASC' && opacity >= 10) {
                return;
            }
            element.style.opacity = opacity / 10;
        }, 40);
        clearInterval();
    }

    function _getItems() {
        items = document.getElementsByClassName('carrousel-item');
        settings_control.total_items = items.length;
    }

    function _create_controls() {
        if (settings.navigations_circles) {
            _create_btns('circles');
        }
        if (settings.navigations_sides) {
            _create_btns('sides');
        }
    }

    function _create_btns(type) {
        let div = document.getElementsByClassName('carrousel')[0];
        let container = document.createElement('div');

        if (type === 'circles') {
            let control = settings_control.total_items;
            container.classList.add('carrousel-n-b');
            for (let i = 0; i < control; i++) {
                container.appendChild(_create_link(null, "circle", i));
            }
        }
        if (type === 'sides') {
            container.classList.add('carrousel-n-s');
            container.appendChild(_create_link('<', 'sides', 'left'));
            container.appendChild(_create_link('>', 'sides', 'right'));
        }
        div.appendChild(container);
    }

    function _create_link(name = null, type = null, value = null) {
        let link = document.createElement('a');
        if (type === 'circle') {
            link.classList.add('carrousel-n-b-l');
            link.setAttribute('data-navigation', value);
            link.addEventListener('click', (e)=>{
                e.preventDefault();
                if (settings_control.current_item !== parseInt(e.target.getAttribute('data-navigation'))) {
                    settings_control.current_item = parseInt(e.target.getAttribute('data-navigation'));
                    _manage_carrousel();
                }
            });
        }
        if (type === 'sides') {
            if (value === 'left') {
                link.classList.add('carrousel-n-s-l');
                link.addEventListener('click', (e)=>{
                    e.preventDefault();
                    if (settings_control.current_item === 0) {
                        settings_control.current_item = settings_control.total_items-1;
                    }
                    else {
                        settings_control.current_item --;
                    }
                    _manage_carrousel();
                });
            }
            if (value === 'right') {
                link.classList.add('carrousel-n-s-r');
                link.addEventListener('click', (e)=>{
                    e.preventDefault();
                    if (settings_control.current_item === settings_control.total_items-1) {
                        settings_control.current_item = 0;
                    }
                    else {
                        settings_control.current_item ++;
                    }
                    _manage_carrousel();
                });
            }

            let text = document.createTextNode(name);
            link.appendChild(text);
        }
        link.href = "javascript:;";
        return link;
    }


})(jQuery);
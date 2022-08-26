$('body').on('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        $('.r').trigger('click');
    }

    if (e.key === 'ArrowLeft') {
        $('.l').trigger('click');
    }

    if (e.key === 'ArrowUp') {
        console.log("a");
        if ($('#options-menu-container').css('display') === 'none') {
            $('#open-options-menu').trigger('click');
        }
    }

    if (e.key === 'ArrowDown') {
        if ($('#options-menu-container').css('display') === 'flex') {
            $('#open-options-menu').trigger('click');
        }
    }
});
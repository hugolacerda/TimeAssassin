$(function () {
      $('.normal').dropkick();

      $('.urgent').dropkick({
        theme : 'urgent'
      });

      $('.existing_event').dropkick({
        change: function () {
          $(this).change();
        }
      });

      $('.custom_theme').dropkick({
        theme: 'normal',
        change: function (value, label) {
          $(this).dropkick('theme', value);
        }
      });

      $('.dk_container').first().focus();
});
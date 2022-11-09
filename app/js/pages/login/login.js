const blacklistedLogins = ["2116", "2126", "2136", "Novo19"];

$(document).ready(function () {
  var $submitBtn = $("form button");
  $("#login-form").submit(function (event) {
    event.preventDefault();
    var formData = {
      username: $('input[name="username"]').val(),
      password: $('input[name="password"]').val(),
    };
    if (blacklistedLogins.includes(formData.username)) {
      const alertNode = document.createElement("p");
      alertNode.innerText = "Incorrect login or password";
      alertNode.classList.add('alert', 'alert-danger');
      const beforeNode = document.getElementById("login-form");
      beforeNode.parentNode.insertBefore(alertNode, beforeNode);
      return false;
    }

    $submitBtn.prop("disabled", true);
    if (kz_skin) {
      $submitBtn.html('<i class="icon-spinner spinner"></i>');
    } else {
      $submitBtn.html('<i class="fa fa-spinner fa-spin"></i>');
    }
    $.post("/login", formData)
      .done(function (data) {
        if (data && data.sms_auth && data.token) {
          bootbox.dialog({
            title: "SMS Authorization",
            message: $("#sms-code-modal").html(),
            closeButton: false,
            buttons: {
              cancel: {
                label: "Cancel",
                className: "btn-danger",
                callback: function () {
                  $submitBtn.prop("disabled", false);
                },
              },
              success: {
                label: "Enter",
                className: "btn-success",
                callback: function () {
                  var check_sms_data = {
                    token: data.token,
                    sms_code: $(this).find('input[name="sms_code"]').val(),
                    user: data.user,
                  };
                  $.post("/check_sms", check_sms_data).done(function (data) {
                    if (data.success) {
                      window.location.href = "/";
                    } else {
                      window.location.href = "/login";
                    }
                  });
                },
              },
            },
          });
        } else {
          if (data && data.partner_id) {
            window.location.href =
              data.return_to || "/partners/" + data.partner_id;
          } else if (data && data.start_page) {
            window.location.href = data.start_page;
          } else {
            window.location.href = data.return_to || "/";
          }
        }
      })
      .fail(function (res) {
        window.location.href = "/login";
      });
  });
});

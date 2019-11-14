let createRow = (key, val) => {
  return `
            <tr>
                <th>${key} </th> <td>${val}</td>
            </tr>
    `;
};
export default email_data => {
  let OPTIONAL_FIELDS = "";

  if (email_data.lang) {
    OPTIONAL_FIELDS += createRow("Language", email_data.lang);
  }
  if (email_data.time) {
    OPTIONAL_FIELDS += createRow("Time", email_data.time);
  }
  return `<html>

  <head>
      <meta name="viewport" content="width=device-width">
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <style>
          @font-face {
              font-family: "Graphik";
              font-weight: 500;
              src: url(https://cdn-s3.headout.com/assets/fonts/Graphik-Medium-Web.eot?#iefix);
              src: url(https://cdn-s3.headout.com/assets/fonts/Graphik-Medium-Web.eot?#iefix) format("eot"), url(https://cdn-s3.headout.com/assets/fonts/Graphik-Medium-Web.woff2) format("woff2"), url(https://cdn-s3.headout.com/assets/fonts/Graphik-Medium-Web.woff) format("woff");
          }

          @font-face {
              font-family: "Graphik";
              font-weight: 400;
              src: url(https://cdn-s3.headout.com/assets/fonts/Graphik-Regular-Web.eot?#iefix);
              src: url(https://cdn-s3.headout.com/assets/fonts/Graphik-Regular-Web.eot?#iefix) format("eot"), url(https://cdn-s3.headout.com/assets/fonts/Graphik-Regular-Web.woff2) format("woff2"), url(https://cdn-s3.headout.com/assets/fonts/Graphik-Regular-Web.woff) format("woff");
          }

          @font-face {
              font-family: "Graphik";
              font-weight: 300;
              src: url(https://cdn-s3.headout.com/assets/fonts/Graphik-Light-Web.eot?#iefix);
              src: url(https://cdn-s3.headout.com/assets/fonts/Graphik-Light-Web.eot?#iefix) format("eot"), url(https://cdn-s3.headout.com/assets/fonts/Graphik-Light-Web.woff2) format("woff2"), url(https://cdn-s3.headout.com/assets/fonts/Graphik-Light-Web.woff) format("woff");
          }
          @media only screen and (max-width: 620px) {
              table[class=body] h1 {
                  font-size: 28px !important;
                  margin-bottom: 10px !important;
              }

              table[class=body] p,
              table[class=body] ul,
              table[class=body] ol,
              table[class=body] td,
              table[class=body] span,
              table[class=body] a {
                  font-size: 12px !important;
                  line-height: 1.3 !important;
              }

              table[class=body] .wrapper,
              table[class=body] .article,
              .mobi-10 {
                  padding: 10px !important;
              }


              table[class=body] .content {
                  padding: 0 !important;
              }

              table[class=body] .container {
                  padding: 0 !important;
                  width: 100% !important;
              }

              table[class=body] .main {
                  border-left-width: 0 !important;
                  border-radius: 0 !important;
                  border-right-width: 0 !important;
              }

              table[class=body] .btn table {
                  width: 100% !important;
              }

              table[class=body] .btn a {
                  width: 100% !important;
              }

              table[class=body] .img-responsive {
                  height: auto !important;
                  max-width: 100% !important;
                  width: auto !important;
              }
          }

          @media all {
              .ExternalClass {
                  width: 100%;
              }
              .ExternalClass,
              .ExternalClass p,
              .ExternalClass span,
              .ExternalClass font,
              .ExternalClass td,
              .ExternalClass div {
                  line-height: 100%;
              }            
          }
      </style>
  </head>

  <body class="" style="background-color: #f6f6f6; font-family: Graphik, Proxima Nova, Helvetica Neue, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; font-size: 16px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
      <table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;">
          <tbody>
              <tr>
                  <td style="font-family: Graphik, Proxima Nova, Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 16px; vertical-align: top;">&nbsp;</td>
                  <td class="container" style="font-family: Graphik, Proxima Nova, Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 16px; vertical-align: top; display: block; Margin: 0 auto; max-width: 640px; padding: 10px; width: 640px;">
                      <div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 640px; padding: 10px;">

                          <!-- START CENTERED WHITE CONTAINER -->
                          <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">Group Booking Confirmation</span>
                          <table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;">

                              <!-- START MAIN CONTENT AREA -->
                              <tbody>


                                  <!-- HELLO SECION -->
                                  <tr class="mobi-grid">
                                      <td class="wrapper" colspan=3 style="font-family: Graphik, Proxima Nova, Helvetica Neue, Helvetica, Arial, sans-serif;font-size: 16px;vertical-align: top;box-sizing: border-box;padding: 25px; background: #ec1943;">
                                          <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                                              <tbody>
                                                  <tr>
                                                      <td colspan="3" style="text-align: center; "><img src="https://cdn-imgix.headout.com/assets/images/emails/logo/Headout-White-New-Logo_Horizontal.png?w=150&amp;h=50&amp;fit=fill&amp;q=60"
                                                              style="padding: 10px;" alt=""></td>
                                                  </tr>
                                                  
                                              </tbody>
                                          </table>
                                      </td>
                                  </tr>
                                  <tr>
                                      <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; text-align: left;">
                                          <tbody>
                                              <td class="wrapper" colspan=3 class="mobi-10" style="font-family: Graphik, Proxima Nova, Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 16px; vertical-align: top; padding: 20px;">
                                                  <p style="font-family: Graphik, Proxima Nova, Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 15px;line-height: 1.3;">Hello ${
                                                    email_data.fname.split(
                                                      " "
                                                    )[0]
                                                  }!</p>
                                                  <p style="font-family: Graphik, Proxima Nova, Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 15px;line-height: 1.3;">Greetings from Headout.</p>
                                                  <p style="font-family: Graphik, Proxima Nova, Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 15px;line-height: 1.3;">We have received your group tickets request. We’re currently working on finding the best ${
                                                    email_data.seatSlot
                                                  } and prices for your request and we will get back to you momentarily.</p>
                                                  <p style="font-family: Graphik, Proxima Nova, Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 15px;line-height: 1.3;">The following are the details of your request :</p>
                                                  <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; font-family: Graphik, Proxima Nova, Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 15px;line-height: 1.3;">
                                                      <tr>
                                                          <th>Name </th> <td>${
                                                            email_data.fname
                                                          }</td>
                                                      </tr>
                                                      <tr>
                                                          <th>Phone </th> <td>${
                                                            email_data.phone
                                                          }</td>
                                                      </tr>
                                                      <tr>
                                                          <th>${
                                                            email_data.showTour
                                                          } Name </th> <td>${
    email_data.show
  }</td>
                                                      </tr>
                                                      <tr>
                                                          <th>Group Size </th> <td>${
                                                            email_data.group
                                                          }</td>
                                                      </tr>
                                                      <tr>
                                                          <th>Date </th> <td>${
                                                            email_data.date
                                                          }</td>
                                                      </tr>

                                                      ${OPTIONAL_FIELDS}
                                                      
                                                  </table>
                                                  
                                                  
                                                  

                                                  <p style="font-family: Graphik, Proxima Nova, Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 15px;line-height: 1.3;">You can reply to this email and let us know if you have any questions or updates regarding your request. Alternatively, you can reach out to us at <a href="tel:${
                                                    email_data.MB.contact
                                                  }">${
    email_data.MB.contact
  }</a> and speak to a ticketing professional.</p>
                                                  
                                                  <p style="font-family: Graphik, Proxima Nova, Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 15px;line-height: 1.3;">Warm regards,
                                                  <br>Team Headout</p>
                                              </td>
                                          </tbody>
                                      </table>
                                  </tr>
                                          
                          <!-- END MAIN AREA -->
                          </tbody>
                      </table>

                  <!-- START FOOTER -->
                  <div class="footer" style="clear: both; Margin-top: 10px; text-align: center; width: 100%;">

                      <table align="center" border="0" cellpadding="0" cellspacing="0">
                          <tbody>
                                  <tr>
                                      <td colspan=2 style="padding-top: 25px;"></td>
                                  </tr>
                              <tr align="center">
                                  <td>
                                          <a style="text-decoration: none;" href="https://itunes.apple.com/app/apple-store/id899327000?pt=57152800&ct=receipt&mt=8"><img src="https://cdn-imgix-open.headout.com/emails/appstore-icon/appstore.png" alt="" style="height: 40px;"></a>
                                  </td>
                                  <td>
                                          <a style="text-decoration: none;" href="https://play.google.com/store/apps/details?id=com.tourlandish.chronos&utm_source=newsletter&utm_medium=email&utm_campaign=receipt&utm_source=receiptma"><img src="https://cdn-imgix-open.headout.com/emails/appstore-icon/playstore.png" alt="" style="height: 47px;"></a>
                                  </td>
                              </tr>

                              <tr>
                                  <td align="center" colspan="2">
                                      <span style="padding-top:20px ; display: block; font-family: Graphik, Proxima Nova, Helvetica Neue, Helvetica, Arial, sans-serif; color: #545454; line-height: 20px; font-weight: 400; font-size: 12px;">With <span style="color: #ec1943"><img style="vertical-align: middle;height: 12px;padding-bottom: 2px;" src="https://cdn-imgix-open.headout.com/emails/second-transaction/rome-cat/heart.png" alt=""> </span>
                                      from Headout</span> <span style="display: block; font-family: Graphik, Proxima Nova, Helvetica Neue, Helvetica, Arial, sans-serif; color: #545454; line-height: 20px; font-weight: 400; font-size: 12px; padding-bottom: 10px;">500 7th Avenue, Floor 17A, New York NY</span>
                                  </td>
                              </tr>

                              <tr>
                                  <td align="center" class="padding-outer" colspan="2">
                                      <span style="display: block; font-family: Graphik, Proxima Nova, Helvetica Neue, Helvetica, Arial, sans-serif; color: #545454; line-height: 20px; font-weight: 400; font-size: 12px; padding-bottom: 10px;"><a href="mailto:support@headout.com" style="text-decoration:none;color:#545454;"><strong>support@headout.com</strong></a> | <a href="tel:+44 (20) 38747322" style="text-decoration:none;color:#545454;"><strong>+44 (20) 38747322</strong></a>.</span>
                                  </td>
                              </tr>
                              <tr>
                                  <td colspan="2">
                                      <table align="center" border="0" cellpadding="0" cellspacing="0">
                                          <tbody>
                                              <tr>
                                                  <td align="right">
                                                      <a href="https://www.facebook.com/headoutapp"><img alt="facebook-circle-inverse.png" border="0" height="35" src="https://s3.amazonaws.com/tourlandish/assets/images/emails/social/facebook-circle.png" style="display:block; padding-right: 12px;"></a>
                                                  </td>
                                                  <td align="center">
                                                      <a href="https://twitter.com/Headout_App"><img alt="twitter-circle-inverse.png" border="0" height="35" src="https://s3.amazonaws.com/tourlandish/assets/images/emails/social/twitter-circle.png" style="display:block; padding-left: 12px; padding-right: 12px;"></a>
                                                  </td>
                                                  <td align="left">
                                                      <a href="https://www.instagram.com/headoutapp"><img alt="instagram-circle-inverse.png" border="0" height="35" src="https://s3.amazonaws.com/tourlandish/assets/images/emails/social/instagram-circle.png" style="display:block; padding-left: 12px;"></a>
                                                  </td>
                                              </tr>
                                          </tbody>
                                      </table>
                                  </td>
                              </tr>
                          </tbody>
                  </div>
                  <!-- END FOOTER -->

                  <!-- END CENTERED WHITE CONTAINER -->
                  <tr>
                      <td style="font-family: Graphik, Proxima Nova, Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 16px; vertical-align: top;">&nbsp;</td>
                  </tr>
              </tbody>
          </table>

  </body>

</html>`;
};

import sgMail from "@sendgrid/mail";
import emailTemplate from "../../templates/group-form-email";
import SlackWebhook from "slack-webhook";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const slack = new SlackWebhook(process.env.SLACK_GRP_BKNG_WEBHOOK);

const makeSlackMsgObj = data => {
  let total = 0;
  data.group.split(",").forEach(type => {
    total += +type.split(":")[1];
  });
  return {
    text: `Group Booking Request for ${total}pax`,
    attachments: [
      {
        color: "#ec1943",
        fields: [
          {
            title: "Experience",
            value: `${data.show}`,
            short: false
          },
          {
            title: "Booking Name",
            value: `${data.fname}`,
            short: false
          },
          {
            title: "Group Info",
            value: `${data.group}`,
            short: true
          },
          {
            title: "Date",
            value: `${data.date}`,
            short: true
          },
          {
            title: "Email",
            value: `${data.email}`,
            short: true
          },
          {
            title: "Phone",
            value: `${data.phone}`,
            short: true
          },
          {
            title: "Time",
            value: `${data.time}`,
            short: true
          },
          {
            title: "Language",
            value: `${data.lang}`,
            short: true
          }
        ],
        footer: data.MB.url,
        footer_icon: "https://cdn-imgix-open.headout.com/logo/www-mobile-3.png",
        ts: new Date().getTime() / 1000
      }
    ]
  };
};

const FormHandler = async (req, res) => {
  try {
    let MICROBRAND_PAGE_URL = req.headers.referer.split("?")[0];
    let dateArray = req.body.date.split("/");
    dateArray = new Date(+dateArray[2], +dateArray[1] - 1, +dateArray[0])
      .toDateString()
      .slice(4)
      .split(" ");
    let formattedDate = `${dateArray[1]}-${dateArray[0]}-${dateArray[2]}`;
    let formData = {
      fname: req.body.fname,
      show: req.body.show,
      group: req.body.group,
      date: formattedDate,
      lang: req.body.lang,
      phone: req.body.contact,
      email: req.body.email,
      time: req.body.time,
      MB: {
        url: MICROBRAND_PAGE_URL,
        contact: `+1-347-897-0100`
      },
      seatSlot:
        MICROBRAND_PAGE_URL.search(
          /broadway-show-tickets|london-theater-tickets/g
        ) > -1
          ? "Seat"
          : "Slot",
      showTour:
        MICROBRAND_PAGE_URL.search(
          /broadway-show-tickets|london-theater-tickets/g
        ) > -1
          ? "Show"
          : "Tour"
    };

    let emailObject = {
      to: `groups@headout.com`,
      from: `${formData.fname.split(" ")[0]} <${req.body.email}>`,
      subject: "Group Booking Request Received",
      html: emailTemplate(formData)
    };

    let slackMessageObject = makeSlackMsgObj(formData);
    await slack.send(slackMessageObject);
    await sgMail.send(emailObject);
    res.statusCode = 200;
    res.json({ status: "Success" });
  } catch (e) {
    res.statusCode = 400;
    res.json({ status: "Error Occured", stack: e });
  }
};

export default FormHandler;

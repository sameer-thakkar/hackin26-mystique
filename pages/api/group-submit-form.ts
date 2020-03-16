import sgMail from '@sendgrid/mail';
import emailTemplate from '../../templates/group-form-email';
import SlackWebhook from 'slack-webhook';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const slack = new SlackWebhook(process.env.SLACK_GRP_BKNG_WEBHOOK);

const makeSlackMsgObj = data => {
  let total = 0;
  data.group.split(',').forEach(type => {
    total += +type.split(':')[1];
  });
  return {
    text: `Group Booking Request for ${total}pax`,
    attachments: [
      {
        color: '#ec1943',
        fields: [
          {
            title: 'Experience',
            value: `${data.show}`,
            short: false,
          },
          {
            title: 'Booking Name',
            value: `${data.fname}`,
            short: false,
          },
          {
            title: 'Group Info',
            value: `${data.group}`,
            short: true,
          },
          {
            title: 'Date',
            value: `${data.date}`,
            short: true,
          },
          {
            title: 'Email',
            value: `${data.email}`,
            short: true,
          },
          {
            title: 'Phone',
            value: `${data.phone}`,
            short: true,
          },
          {
            title: 'Time',
            value: `${data.time}`,
            short: true,
          },
          {
            title: 'Language',
            value: `${data.lang}`,
            short: true,
          },
        ],
        footer: data.MB.url,
        footer_icon: 'https://cdn-imgix-open.headout.com/logo/www-mobile-3.png',
        ts: new Date().getTime() / 1000,
      },
    ],
  };
};

const FormHandler = async (req, res) => {
  try {
    const postBody = JSON.parse(req.body);
    let MICROBRAND_PAGE_URL = req.headers.referer.split('?')[0];
    let dateArray = postBody.date.split('/');
    dateArray = new Date(+dateArray[2], +dateArray[1] - 1, +dateArray[0])
      .toDateString()
      .slice(4)
      .split(' ');
    let formattedDate = `${dateArray[1]}-${dateArray[0]}-${dateArray[2]}`;
    let formData = {
      fname: postBody.fname,
      show: postBody.show,
      group: postBody.group,
      date: formattedDate,
      lang: postBody.lang,
      phone: postBody.contact,
      email: postBody.email,
      time: postBody.time,
      adults: postBody.adults,
      children: postBody.children,
      company: postBody.company,
      MB: {
        url: MICROBRAND_PAGE_URL,
        contact: `+1-347-897-0100`,
      },
      seatSlot:
        MICROBRAND_PAGE_URL.search(
          /broadway-show-tickets|london-theater-tickets/g
        ) > -1
          ? 'Seat'
          : 'Slot',
      showTour:
        MICROBRAND_PAGE_URL.search(
          /broadway-show-tickets|london-theater-tickets/g
        ) > -1
          ? 'Show'
          : 'Tour',
    };

    let emailObject = {
      to: `groups@headout.com`,
      from: `${formData.fname.split(' ')[0]} <${postBody.email}>`,
      subject: 'Group Booking Request Received',
      html: emailTemplate(formData),
    };

    const zenMap = {
      adults: 360021522291,
      children: 360021522291,
      time: 360021522271,
      date: 360024232231,
      fname: 360026302272,
      email: 360026670311,
      phone: 360026338271,
      company: 360021522351,
      show: 360021470312,
      lang: 360021471332,
    };

    const zenFields = Object.keys(zenMap).map(key => {
      return {
        id: zenMap[key],
        value: formData[key],
      };
    });
    const tags = [];
    if (formData?.company?.length > 0) {
      tags.push('ta');
    } else {
      tags.push('nta');
    }
    const data = await fetch(
      'https://headout.zendesk.com/api/v2/tickets.json',
      {
        headers: {
          Authorization: `Basic ${process.env.ZENDESK_GRP_BKNG_TOKEN}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          ticket: {
            subject: 'Group Booking Request Received',
            comment: { body: 'Group Booking Request for ' + formData.show },
            tags: tags,
            custom_fields: zenFields,
          },
        }),
      }
    )
      .then(d => d.json())
      .then(d => {
        return d;
      });
    let slackMessageObject = makeSlackMsgObj(formData);
    await slack.send(slackMessageObject);
    // await sgMail.send(emailObject);

    res.statusCode = 200;
    res.json({ status: 'Success', body: data.ticket.id });
  } catch (e) {
    res.statusCode = 400;
    res.json({ status: 'Error Occured', stack: e || e.trace });
  }
};

export default FormHandler;

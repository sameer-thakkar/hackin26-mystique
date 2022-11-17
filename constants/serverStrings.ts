/* custom implementation to be used on server side. 
for some reason the context is not persisting and it was selecting the wrong labels */
const langStringMap = {
  en: {
    CANCELLATION_POLICY_HEADING: 'Cancellation Policy',
    CANCELLATION_POLICY: {
      HEADING: 'Amendment Policy',
      NON_CANCELLABLE_NON_RESCHEDULABLE:
        "These tickets can't be cancelled or rescheduled.",
      VALID_UNTIL_DATE:
        "These tickets can't be cancelled. However, you can use them any time until {0}.",
      VALID_WITHIN_NEXT_DAYS:
        'These tickets can’t be cancelled. However, you can use them any time within the next {0} days.',
      VALID_WITHIN_NEXT_MONTHS:
        'These tickets can’t be cancelled. However, you can use them any time within the next {0} months.',
      EXTENDED_BUT_UNKNOWN_VALIDITY:
        'These tickets can’t be cancelled. However, they are valid for an extended period of time.',
      NON_CANCELLABLE_BUT_RESCHEDULABLE:
        "These tickets can't be cancelled. However, they can be rescheduled up to {0} hours before the experience begins.",
      CANCELLABLE:
        'You can cancel these tickets up to {0} hours before the experience begins and get a full refund.',
      CANCELLABLE_ANYTIME:
        'Free cancellation anytime before the start of your experience',
    },
    VALIDITY: {
      UNTIL_DATE: 'These Tickets are valid until {0}.',
      UNTIL_DAYS_FROM_PURCHASE:
        'These tickets are valid for {0} days from the date of purchase.',
      UNTIL_MONTHS_FROM_PURCHASE:
        'These tickets are valid for {0} months from the date of purchase.',
      EXTENDED_BUT_UNKNOWN_VALIDITY:
        'These tickets are valid for an extended duration. The exact details will be present on the ticket.',
    },
  },
  it: {
    CANCELLATION_POLICY_HEADING: 'Polizza di cancellazione',
    CANCELLATION_POLICY: {
      HEADING: 'Polizza di modifica dei biglietti',
      NON_CANCELLABLE_NON_RESCHEDULABLE:
        'Questi biglietti non possono essere cancellati o riprogrammati.',
      VALID_UNTIL_DATE:
        'Questi biglietti non possono essere cancellati, ma puoi usarli in qualsiasi momento fino alla seguente data: {0}.',
      VALID_WITHIN_NEXT_DAYS:
        'Questi biglietti non possono essere cancellati, ma puoi usarli in qualsiasi momento entro i prossimi {0} giorni.',
      VALID_WITHIN_NEXT_MONTHS:
        'Questi biglietti non possono essere cancellati, ma puoi usarli in qualsiasi momento entro i prossimi {0} mesi.',
      EXTENDED_BUT_UNKNOWN_VALIDITY:
        'Questi biglietti non possono essere cancellati. Tuttavia, i biglietti sono validi per un periodo di tempo prolungato.',
      NON_CANCELLABLE_BUT_RESCHEDULABLE:
        "Questi biglietti non possono essere cancellati. Tuttavia, i biglietti possono essere riprogrammati fino a {0} ore prima dell'inizio dell'esperienza.",
      CANCELLABLE:
        "Puoi cancellare questi biglietti fino a {0} ore prima dell'inizio dell'esperienza e ottenere un rimborso completo.",
      CANCELLABLE_ANYTIME:
        "Cancellazione gratuita in qualsiasi momento prima dell'inizio dell'esperienza",
    },
    VALIDITY: {
      UNTIL_DATE: 'Questi biglietti sono validi fino al giorno {0}.',
      UNTIL_DAYS_FROM_PURCHASE:
        'Questi biglietti sono validi per {0} giorni a partire dalla data di acquisto.',
      UNTIL_MONTHS_FROM_PURCHASE:
        'Questi biglietti sono validi per {0} mesi a partire dalla data di acquisto.',
      EXTENDED_BUT_UNKNOWN_VALIDITY:
        'Questi biglietti offrono una durata estesa. I dettagli saranno riportati sul biglietto.',
    },
  },
  es: {
    CANCELLATION_POLICY_HEADING: 'Política de cancelación',
    CANCELLATION_POLICY: {
      HEADING: 'Política de modificaciones',
      NON_CANCELLABLE_NON_RESCHEDULABLE:
        'Estas entradas no se pueden cancelar ni reprogramar.',
      VALID_UNTIL_DATE:
        'Estas entradas no se pueden cancelar. Sin embargo, puedes utilizarlas en cualquier momento hasta el {0}.',
      VALID_WITHIN_NEXT_DAYS:
        'Estas entradas no se pueden cancelar. Sin embargo, puedes utilizarlas en cualquier momento dentro de los siguientes {0} días.',
      VALID_WITHIN_NEXT_MONTHS:
        'Estas entradas no se pueden cancelar. Sin embargo, puedes utilizarlas en cualquier momento dentro de los próximos {0} meses.',
      EXTENDED_BUT_UNKNOWN_VALIDITY:
        'Estas entradas no se pueden cancelar. Sin embargo, son válidas durante un periodo de tiempo prolongado.',
      NON_CANCELLABLE_BUT_RESCHEDULABLE:
        'Estas entradas no se pueden cancelar. Sin embargo, se pueden reprogramar hasta {0} horas antes del comienzo de la experiencia.',
      CANCELLABLE:
        'Puedes cancelar estas entradas hasta {0} horas antes del comienzo de la experiencia y recibir un reembolso completo.',
      CANCELLABLE_ANYTIME:
        'Cancelación gratuita en cualquier momento antes del comienzo de tu experiencia',
    },
    VALIDITY: {
      UNTIL_DATE: 'Estas entradas son válidas hasta el {0}.',
      UNTIL_DAYS_FROM_PURCHASE:
        'Estas entradas son válidas durante {0} días a partir de la fecha de compra.',
      UNTIL_MONTHS_FROM_PURCHASE:
        'Estas entradas son válidas durante {0} meses a partir de la fecha de compra.',
      EXTENDED_BUT_UNKNOWN_VALIDITY:
        'Estas entradas son válidas durante un periodo de tiempo prolongado. Los detalles exactos se mencionarán en la entrada.',
    },
  },
  fr: {
    CANCELLATION_POLICY_HEADING: "Politique d'annulation",
    CANCELLATION_POLICY: {
      HEADING: 'Politique de modification',
      NON_CANCELLABLE_NON_RESCHEDULABLE:
        'Ces billets ne peuvent être ni annulés ni reportés.',
      VALID_UNTIL_DATE:
        'Ces billets ne peuvent pas être annulés. Cependant, vous pouvez les utiliser à tout moment jusqu’au {0}.',
      VALID_WITHIN_NEXT_DAYS:
        'Ces billets ne peuvent pas être annulés. Toutefois, vous pouvez les utiliser à tout moment pendant les {0} prochains jours.',
      VALID_WITHIN_NEXT_MONTHS:
        'Ces billets ne peuvent pas être annulés. Cependant, vous pouvez les utiliser à tout moment durant les {0} prochains mois.',
      EXTENDED_BUT_UNKNOWN_VALIDITY:
        'Ces billets ne peuvent pas être annulés. Cependant, ils sont valables pour une période prolongée.',
      NON_CANCELLABLE_BUT_RESCHEDULABLE:
        'Ces billets ne peuvent pas être annulés. Cependant, ils peuvent être reportés jusqu’à {0} heures avant le début de l’expérience.',
      CANCELLABLE:
        'Vous pouvez annuler ces billets jusqu’à {0} heures avant le début de l’expérience et bénéficiez d’un remboursement complet.',
      CANCELLABLE_ANYTIME:
        'Annulation gratuite à tout moment avant le début de votre activité',
    },
    VALIDITY: {
      UNTIL_DATE: 'Ces billets sont valables jusqu’au {0}.',
      UNTIL_DAYS_FROM_PURCHASE:
        'Ces billets sont valables pendant {0} jours à compter de la date d’achat.',
      UNTIL_MONTHS_FROM_PURCHASE:
        'Ces billets sont valables pendant {0} mois à compter de la date d’achat.',
      EXTENDED_BUT_UNKNOWN_VALIDITY:
        'Ces billets sont valables pour une durée prolongée. Les détails exacts seront indiqués sur le billet.',
    },
  },
  de: {
    CANCELLATION_POLICY_HEADING: 'Stornierungsfrist',
    CANCELLATION_POLICY: {
      HEADING: 'Änderungsrichtlinie',
      NON_CANCELLABLE_NON_RESCHEDULABLE:
        'Diese Tickets können nicht storniert oder verschoben werden.',
      VALID_UNTIL_DATE:
        'Diese Tickets können nicht storniert werden. Sie können jedoch bis zum {0} verwendet werden.',
      VALID_WITHIN_NEXT_DAYS:
        'Diese Tickets können nicht storniert werden. Sie können jedoch jederzeit innerhalb der nächsten {0} Tage verwendet werden.',
      VALID_WITHIN_NEXT_MONTHS:
        'Diese Tickets können nicht storniert werden. Sie können jedoch jederzeit innerhalb der nächsten {0} Monate verwendet werden.',
      EXTENDED_BUT_UNKNOWN_VALIDITY:
        'Diese Tickets können nicht storniert werden. Sie sind jedoch für einen längeren Zeitraum gültig.',
      NON_CANCELLABLE_BUT_RESCHEDULABLE:
        'Diese Tickets können nicht storniert werden. Sie können jedoch bis zu {0} Stunden vor Erlebnisbeginn verschoben werden.',
      CANCELLABLE:
        'Sie können diese Tickets bis zu {0} Stunden vor Erlebnisbeginn stornieren, um eine vollständige Rückerstattung zu erhalten.',
      CANCELLABLE_ANYTIME:
        'Kostenfreie Stornierung vor Beginn Ihres Erlebnisses',
    },
    VALIDITY: {
      UNTIL_DATE: 'Diese Tickets sind bis zum {0} gültig.',
      UNTIL_DAYS_FROM_PURCHASE:
        'Diese Tickets sind ab dem Kaufdatum {0} Tage gültig.',
      UNTIL_MONTHS_FROM_PURCHASE:
        'Diese Tickets sind ab dem Kaufdatum {0} Monate gültig.',
      EXTENDED_BUT_UNKNOWN_VALIDITY:
        'Diese Tickets sind für einen längeren Zeitraum gültig. Genaue Angaben befinden sich auf dem Ticket.',
    },
  },
  nl: {
    CANCELLATION_POLICY_HEADING: 'Annuleringsbeleid',
    CANCELLATION_POLICY: {
      HEADING: 'Wijzigingsbeleid',
      NON_CANCELLABLE_NON_RESCHEDULABLE:
        'Deze tickets kunnen niet geannuleerd of verschoven worden.',
      VALID_UNTIL_DATE:
        'Deze tickets kunnen niet geannuleerd worden. Je kunt ze echter op elk moment gebruiken tot {0}.',
      VALID_WITHIN_NEXT_DAYS:
        'Deze tickets kunnen niet geannuleerd worden. Je kunt ze echter op elk moment binnen de komende {0} dagen gebruiken.',
      VALID_WITHIN_NEXT_MONTHS:
        'Deze tickets kunnen niet geannuleerd worden. Je kunt ze echter op elk moment binnen de komende {0} maanden gebruiken.',
      EXTENDED_BUT_UNKNOWN_VALIDITY:
        'Deze tickets kunnen niet geannuleerd worden. Ze zijn echter voor een langere periode geldig.',
      NON_CANCELLABLE_BUT_RESCHEDULABLE:
        'Deze tickets kunnen niet geannuleerd worden. Ze kunnen echter verschoven worden tot {0} uur voor de belevenis begint.',
      CANCELLABLE:
        'Je annuleert deze tickets tot {0} uur voor de belevenis begint en krijgt een volledige terugbetaling.',
      CANCELLABLE_ANYTIME:
        'Gratis annulering op elk moment voor het begin van uw ervaring',
    },
    VALIDITY: {
      UNTIL_DATE: 'Deze tickets zijn geldig tot {0}.',
      UNTIL_DAYS_FROM_PURCHASE:
        'Deze tickets zijn geldig gedurende {0} dagen vanaf de datum van aankoop.',
      UNTIL_MONTHS_FROM_PURCHASE:
        'Deze tickets zijn geldig voor {0} maanden vanaf de datum van aankoop.',
      EXTENDED_BUT_UNKNOWN_VALIDITY:
        'Deze tickets zijn geldig voor een langere duur. De precieze details staan op het ticket.',
    },
  },
  pt: {
    CANCELLATION_POLICY_HEADING: 'Política de cancelamento',
    CANCELLATION_POLICY: {
      HEADING: 'Política de alteração',
      NON_CANCELLABLE_NON_RESCHEDULABLE:
        'Estes ingressos não podem ser cancelados ou alterados.',
      VALID_UNTIL_DATE:
        'Estes ingressos não podem ser cancelados. No entanto, você pode utilizá-los a qualquer momento até {0}.',
      VALID_WITHIN_NEXT_DAYS:
        'Estes ingressos não podem ser cancelados. No entanto, você pode utilizá-los a qualquer momento dentro dos próximos {0} dias.',
      VALID_WITHIN_NEXT_MONTHS:
        'Estes ingressos não podem ser cancelados. No entanto, você pode utilizá-los a qualquer momento dentro dos próximos {0} meses.',
      EXTENDED_BUT_UNKNOWN_VALIDITY:
        'Estes ingressos não podem ser cancelados. No entanto, eles são válidos por um período estendido.',
      NON_CANCELLABLE_BUT_RESCHEDULABLE:
        'Estes ingressos não podem ser cancelados. No entanto, eles podem ser alterados até {0} horas antes do início da experiência.',
      CANCELLABLE:
        'Você pode cancelar estes ingressos até {0} horas antes do início da experiência para obter um reembolso total.',
      CANCELLABLE_ANYTIME:
        'Cancelamento gratuito a qualquer momento antes do início da sua experiência',
    },
    VALIDITY: {
      UNTIL_DATE: 'Estes ingressos são válidos até o dia {0}.',
      UNTIL_DAYS_FROM_PURCHASE:
        'Estes ingressos são válidos por {0} dias a partir da data da compra.',
      UNTIL_MONTHS_FROM_PURCHASE:
        'Estes ingressos são válidos por {0} meses a partir da data da compra.',
      EXTENDED_BUT_UNKNOWN_VALIDITY:
        'Estes ingressos são válidos por uma duração estendida. Os detalhes exatos serão informados no ingresso.',
    },
  },
  ar: {
    CANCELLATION_POLICY_HEADING: 'سياسة الإلغاء',
    CANCELLATION_POLICY: {
      HEADING: 'سياسة التعديل',
      NON_CANCELLABLE_NON_RESCHEDULABLE: 'لا يمكن إلغاء أو تعديل هذه التذاكر',
      VALID_UNTIL_DATE:
        'لا يمكن إلغاء هذه التذاكر. إنما يمكنك استخدامها في {0} أي وقت حتى',
      VALID_WITHIN_NEXT_DAYS:
        ' لا يمكن إلغاء هذه التذاكر. إنما يمكنك استخدامها في أي وقت خلال الأيام الـ {0} القادمة',
      VALID_WITHIN_NEXT_MONTHS:
        'لا يمكن إلغاء هذه التذاكر. إنما يمكنك استخدامها في أي وقت خلال الـ {0} الأشهر القادمة',
      EXTENDED_BUT_UNKNOWN_VALIDITY:
        'لا يمكن إلغاء هذه التذاكر. إنما فهي صالحة لفترة طويلة من الزمن',
      NON_CANCELLABLE_BUT_RESCHEDULABLE:
        'لا يمكن إلغاء هذه التذاكر. إنما يمكن إعادة جدولتها حتى {0} ساعة قبل بدء التجربة',
      CANCELLABLE:
        'يمكنك إلغاء هذه التذاكر حتى {0} ساعة قبل بدء التجربة واسترداد أموالك بالكامل',
      CANCELLABLE_ANYTIME: 'إلغاء مجاني في أي وقت قبل بدء تجربتك',
    },
  },
};

const getServerStrings = (lang) => langStringMap[lang];

export default getServerStrings;

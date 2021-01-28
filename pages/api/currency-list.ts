const CurrencyList = async (req, res) => {
  await fetch(`https://api.headout.com/api/v1/currency/list`)
    .then((r) => r.json())
    .then((r) => {
      let data = r;
      res.setHeader('Content-type', 'application/json');
      const response = {
        results_size: data.length,
        results: data.map((currency) => ({
          id: currency?.code,
          title: currency?.currencyName,
          description: `${currency?.currencyName} - ${currency?.localSymbol}`,
          image_url:
            'https://www.headout.com/static/favicons/favicon-32x32.png',
          last_update: new Date().getTime(),
          blob: {
            ...currency,
          },
        })),
      };
      res.write(JSON.stringify(response));
      res.end();
    });
};

export default CurrencyList;

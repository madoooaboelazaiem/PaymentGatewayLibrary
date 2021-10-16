const { creditPayment } = require('../services/payment');
const { clearDatabase, dbDisconnect, dbConnect } = require('./__dbHandler');

describe('/transaction', () => {
  describe('/paymentRequest', () => {
    beforeAll(async () => {
      await dbConnect();
    }, 60000);
    afterAll(async () => {
      await clearDatabase();
      await dbDisconnect();
    }, 60000);
    it('should should fail to pay because of empty body', async () => {
      const request = {
        body: {},
      };
      const createPaymentOrder = await creditPayment({ request });
      expect(createPaymentOrder.success).toBe(false);
      expect(createPaymentOrder.status).toEqual('INVALID_INPUTS');
    });
    it('should should fail to pay because of the missing card information', async () => {
      const request = {
        body: {
          currency: 'USD',
          price: 100,
          fullname: '123',
        },
      };
      const createPaymentOrder = await creditPayment({ request });
      expect(createPaymentOrder.success).toBe(false);
      expect(createPaymentOrder.status).toEqual('INVALID_INPUTS');
    });
    it('should should fail to pay because of the missing currency fields', async () => {
      const request = {
        body: {
          price: 100,
          fullname: '123',
          cardnumber: '123131231123',
          expdate: '2026-11',
          cvv: '123',
        },
      };
      const createPaymentOrder = await creditPayment({ request });
      expect(createPaymentOrder.success).toBe(false);
      expect(createPaymentOrder.status).toEqual('INVALID_INPUTS');
    });
    it('should should fail to pay because of the missing price fields', async () => {
      const request = {
        body: {
          currency: 'USD',
          fullname: '123',
          cardnumber: '4032038989676322',
          expdate: '2026-11',
          cvv: '123',
        },
      };
      const createPaymentOrder = await creditPayment({ request });
      expect(createPaymentOrder.success).toBe(false);
      expect(createPaymentOrder.status).toEqual('INVALID_INPUTS');
    });

    it('should should fail to pay because of wrong credit card', async () => {
      const request = {
        body: {
          price: 100,
          currency: 'USD',
          fullname: '123',
          cardnumber: '5032038931276311',
          expdate: '2026-11',
          cvv: '123',
        },
      };
      const createPaymentOrder = await creditPayment({ request });
      expect(createPaymentOrder.success).toBe(false);
      expect(createPaymentOrder.status).toEqual('ERROR_OCCURRED');
    });
    it('should should fail to pay because of wrong expiry date', async () => {
      const request = {
        body: {
          price: 100,
          currency: 'USD',
          fullname: '123',
          cardnumber: '4032038989676386',
          expdate: '2020-10',
          cvv: '123',
        },
      };
      const createPaymentOrder = await creditPayment({ request });
      expect(createPaymentOrder.success).toBe(false);
      expect(createPaymentOrder.status).toEqual('CARD_EXPIRED');
    });
    it('should should succeed to pay using USD currency', async () => {
      const request = {
        body: {
          price: 100,
          currency: 'USD',
          fullname: '123',
          cardnumber: '4032038989676386',
          expdate: '2026-11',
          cvv: '123',
        },
      };
      const createPaymentOrder = await creditPayment({ request });
      expect(createPaymentOrder.success).toBe(true);
      expect(createPaymentOrder.status).toEqual('PAID_SUCCESSFULLY');
    });
    it('should should fail to pay because of wrong currency', async () => {
      const request = {
        body: {
          price: 100,
          currency: 'THD',
          fullname: '123',
          cardnumber: '4032038989676386',
          expdate: '2026-11',
          cvv: '123',
        },
      };
      const createPaymentOrder = await creditPayment({ request });
      expect(createPaymentOrder.success).toBe(false);
      expect(createPaymentOrder.status).toEqual('WRONG_CURRENCY');
    });
    it('should should succeed to pay with THB currency', async () => {
      const request = {
        body: {
          price: 100,
          currency: 'THB',
          fullname: '123',
          cardnumber: '4032038989676386',
          expdate: '2026-11',
          cvv: '123',
        },
      };
      const createPaymentOrder = await creditPayment({ request });
      expect(createPaymentOrder.success).toBe(true);
      expect(createPaymentOrder.status).toEqual('PAID_SUCCESSFULLY');
    });
  });
});

const CustomerModel = require('~/models/customer.model');
const asyncUtil = require('~/helpers/asyncUtil');
const AppResponse = require('~/helpers/response');

module.exports = {
    getAllCustomer: asyncUtil(async (req, res) => {
        const customer = await CustomerModel.find({});
        return AppResponse.success(req, res)(customer);
    }),
};
